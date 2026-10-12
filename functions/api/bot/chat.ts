interface Env {
  DB: any;
  GEMINI_API_KEY?: string;
}

const DEFAULT_GEMINI_KEY = '';

async function callGemini(
  systemPrompt: string, 
  history: Array<{ role: string; content: string }>, 
  apiKey: string, 
  maxTokens: number = 1800,
  preferredModel: string = 'gemini-2.0-flash'
) {
  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: maxTokens
    }
  };

  const allCandidates = [
    preferredModel,
    'gemini-3.5-flash',
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3-flash-preview',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ];
  const models = Array.from(new Set(allCandidates.filter(Boolean)));
  let lastError = null;

  for (const model of models) {
    const startTime = Date.now();
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data: any = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const latencyMs = Date.now() - startTime;
        const usage = data?.usageMetadata || null;

        if (text) {
          let parsed: any;
          try {
            parsed = JSON.parse(text);
          } catch (pe) {
            // If raw text has backticks or slightly malformed JSON
            const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(clean);
          }

          return {
            parsed,
            modelUsed: model,
            usage: {
              promptTokens: usage?.promptTokenCount || 0,
              candidatesTokens: usage?.candidatesTokenCount || 0,
              totalTokens: usage?.totalTokenCount || 0
            },
            latencyMs
          };
        }
      } else {
        const errText = await res.text();
        lastError = new Error(`Model ${model} returned ${res.status}: ${errText}`);
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to get response from Gemini models');
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: 'DB binding not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body: any = await context.request.json();
    const {
      conversationId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      visitorId = 'anon',
      message,
      userName = '',
      userContact = ''
    } = body;

    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ error: 'Mensaje requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = context.env.GEMINI_API_KEY || DEFAULT_GEMINI_KEY;

    // RAG 1: Obtener historial reciente de la conversación (Memoria del Chat)
    const { results: historyRows } = await context.env.DB.prepare(
      "SELECT role, content FROM bot_messages WHERE conversation_id = ? ORDER BY id ASC LIMIT 10"
    ).bind(conversationId).all();

    const conversationHistory: Array<{ role: string; content: string }> = (historyRows || []).map((r: any) => ({
      role: r.role === 'assistant' ? 'assistant' : 'user',
      content: r.content
    }));

    // Agregar el mensaje actual del usuario al historial
    conversationHistory.push({ role: 'user', content: message.trim() });

    // RAG 2: Obtener FAQs publicadas
    const { results: faqsRows } = await context.env.DB.prepare(
      "SELECT question, answer, category FROM bot_faqs WHERE is_published = 1 ORDER BY times_used DESC LIMIT 15"
    ).all();

    const faqsContext = (faqsRows || [])
      .map((f: any) => `[FAQ - ${f.category}]: P: ${f.question} -> R: ${f.answer}`)
      .join('\n');

    // RAG 3: Obtener Base de Conocimiento de GeoSoft
    const { results: knowRows } = await context.env.DB.prepare(
      "SELECT topic, content FROM bot_knowledge ORDER BY id ASC"
    ).all();

    const knowContext = (knowRows || [])
      .map((k: any) => `[CONOCIMIENTO - ${k.topic}]: ${k.content}`)
      .join('\n\n');

    // Obtener precios vigentes
    let pricingSummary = 'Planes: Web Landing $450, Web Dinámica $850, Plataforma IA $1400, SaaS $2500.';
    try {
      const priceRow = await context.env.DB.prepare("SELECT data FROM pricing WHERE id = 'default'").first();
      if (priceRow && priceRow.data) {
        const pData = JSON.parse(priceRow.data);
        if (pData.platforms) {
          pricingSummary = pData.platforms.map((p: any) => `${p.title}: $${p.basePrice} (${p.description})`).join(' | ');
          if (pData.discountActive) {
            pricingSummary += ` (¡OFERTA ACTIVA: ${pData.discountPercent}% OFF con el código '${pData.discountBanner}'!)`;
          }
        }
      }
    } catch (_) {}

    // Obtener modo de longitud configurado (corto, equilibrado o detallado)
    let lengthMode = 'equilibrado';
    try {
      const cfgRow = await context.env.DB.prepare("SELECT value FROM bot_config WHERE key = 'length_mode'").first();
      if (cfgRow && cfgRow.value) lengthMode = cfgRow.value;
    } catch (_) {}
    if (body.lengthMode && ['corto', 'equilibrado', 'detallado'].includes(body.lengthMode)) {
      lengthMode = body.lengthMode;
    }

    let lengthInstruction = '';
    let maxTokens = 1400;

    if (lengthMode === 'corto') {
      maxTokens = 800;
      lengthInstruction = `MODO DE LONGITUD ACTIVO: DIRECTO Y CORTO.
- Extensión máxima: 1 a 2 oraciones breves y directas al grano (aprox. 35 a 65 palabras).
- Cero rodeos, responde con la información clave de inmediato.
- Concluye con una pregunta rápida para continuar en su propia línea.`;
    } else if (lengthMode === 'detallado') {
      maxTokens = 2000;
      lengthInstruction = `MODO DE LONGITUD ACTIVO: DETALLADO Y CONSULTIVO.
- Extensión: Análisis profundo y estructurado (aprox. 180 a 280 palabras).
- Explica la solución de forma consultiva, desglosando la arquitectura, ventajas técnicas, garantías y detalles de inversión.
- Concluye con una propuesta sólida de próximos pasos o sesión de demostración.`;
    } else {
      maxTokens = 1400;
      lengthInstruction = `MODO DE LONGITUD ACTIVO: EQUILIBRADO Y PERSUASIVO (PREDETERMINADO / POR DEFECTO).
- Extensión: 1 a 2 párrafos concisos o 1 párrafo con 2-3 viñetas de alto valor (aprox. 80 a 140 palabras).
- Equilibrio ideal entre persuasión comercial, valor técnico y agilidad de lectura.
- Concluye invitando cordialmente a la videollamada o demostración de 15 minutos sin costo.`;
    }

    // Construir System Prompt con la personalidad y RAG
    const systemPrompt = `Eres el Asistente Virtual y Asesor Senior de Ventas de GeoSoft (geosoft.cr).
Eres cordial, altamente persuasivo, empático, negociador experto y maestro cerrador de ventas y citas.
Tu meta principal es brindar valor, resolver dudas con precisión y guiar al usuario a agendar una demostración o videollamada de 15 minutos sin costo con nuestro equipo de ingenieros.

${lengthInstruction}

ESTRUCTURA VISUAL OBLIGATORIA (PROHIBIDO EL TEXTO ACUMULADO):
- NUNCA generes una pared de texto denso o acumulado.
- Separa siempre los párrafos con DOBLE SALTO DE LÍNEA (\\n\\n) para generar un diseño visual limpio y respirable.
- Cuando menciones listas, servicios, precios, beneficios o pasos, utiliza OBLIGATORIAMENTE viñetas limpias con '• ' (o guión '-') en líneas individuales.
- Utiliza **negrita** para resaltar términos estratégicos, cifras y garantías (ejemplo: **$450 USD**, **100% tu propiedad**, **5 a 10 días**).
PROTOCOLO CONSULTIVO DE VENTAS OBLIGATORIO (ESTRICTO - CERO PRESIÓN INICIAL):
1. CORDIALIDAD Y SALUDO EMPÁTICO:
   - Sé siempre sumamente amable, educado, atento y profesional en todo momento.
2. ¡PROHIBIDO INTENTAR AGENDAR O PEDIR CITAS EN EL PRIMER O SEGUNDO MENSAJE!
   - NUNCA intentes forzar una cita desde el primer contacto. Intentar agendar sin antes conocer lo que el usuario busca se percibe como venta agresiva, desesperada y de alta presión.
   - En las primeras interacciones, tu única misión es conectar, escuchar y asesorar.
3. SECUENCIA CONSULTIVA EN 3 PASOS:
   - PASO 1 (DIAGNÓSTICO & ESCUCHA): Primero entiende a fondo la necesidad, problema, rubro o dolor real del usuario. Formula preguntas cordiales y abiertas para clarificar su objetivo.
   - PASO 2 (SOLUCIÓN & VALOR CONCRETO): Solo cuando el usuario haya compartido su necesidad, presenta de forma estructurada cómo GeoSoft resuelve ese problema específico (beneficios claros, tecnologías modernas, entrega en 5-10 días, propiedad absoluta del código y precios transparentes).
   - PASO 3 (AGENDAMIENTO NATURAL): Únicamente DESPUÉS de haber entregado valor y resuelto sus dudas clave, sugiere cordialmente coordinar una breve sesión estratégica o demo de 15 minutos sin costo ni compromiso.

REGLAS DE ACTUACIÓN:
1. RAG DE PREGUNTAS FRECUENTES (Consulta prioritaria):
${faqsContext}

2. RAG DE BASE DE CONOCIMIENTO Y PRECIOS EN VIVO:
Precios actuales: ${pricingSummary}
${knowContext}

3. MANEJO EXPERTO DE OBJECIONES:
Si el usuario pone objeciones (precio alto, falta de tiempo, desconfianza, comparaciones con servicios baratos de $100-$200, dudas técnicas):
- Valida empáticamente su perspectiva ("Entiendo perfectamente...", "Es muy común buscar la mejor relación costo-beneficio...").
- Muestra el diferencial indiscutible de GeoSoft: 100% de propiedad del código, cero caídas garantizadas, soporte post-lanzamiento, entrega en 5-10 días hábiles, pasarelas locales e internacionales seguras (SinpePay/Stripe), sin costos sorpresa.
- Convierte la objeción en una oportunidad y ofrece una sesión de demostración o una opción más accesible adaptada a su presupuesto.

4. CIERRE DE CITAS:
Cuando el usuario demuestre interés o acepte coordinar una videollamada o demo:
- Si ya tienes su nombre y WhatsApp/contacto, activa "should_book": true en el JSON con los datos recopilados.
- Si aún no tienes su contacto, invítalo amablemente a dejar su nombre, WhatsApp y fecha/hora preferida para apartar su espacio.

5. PREGUNTAS NO DISPONIBLES EN EL CONOCIMIENTO:
Si el usuario pregunta algo técnico o comercial muy específico que NO esté en las FAQs ni en el Conocimiento:
- Responde de manera constructiva y alternativa ("Con gusto podemos evaluar esa funcionalidad personalizada en tu proyecto...").
- Marca "is_unanswered": true y resume la pregunta y solución alternativa en el JSON.

RESPONDE OBLIGATORIAMENTE EN FORMATO JSON ESTRICTO CON ESTE ESQUEMA:
{
  "reply": "Texto de respuesta estructurado según el modo activo (${lengthMode}), con párrafos separados, viñetas si aplica y negritas estratégicas.",
  "intent": "pregunta" | "objecion" | "agendar" | "saludo" | "otro",
  "objection": {
    "detected": true | false,
    "type": "precio" | "tiempo" | "confianza" | "tecnologia" | "garantia" | "otro",
    "text": "resumen de la objeción",
    "solution": "solución o argumento brindado"
  },
  "is_unanswered": true | false,
  "alternative_solution": "resumen de solución alternativa si no estaba en la base de conocimiento",
  "appointment": {
    "should_book": true | false,
    "fullName": "nombre del cliente o vacío",
    "whatsapp": "whatsapp del cliente o vacío",
    "email": "email del cliente o vacío",
    "service": "servicio de interés o GeoSoft Consultoría",
    "date": "YYYY-MM-DD o vacío",
    "time": "HH:MM o vacío",
    "notes": "detalles relevantes"
  }
}`;

    // Obtener modelo preferido de bot_config
    let preferredModel = 'gemini-2.0-flash';
    try {
      const modelRow = await context.env.DB.prepare("SELECT value FROM bot_config WHERE key = 'selected_model'").first();
      if (modelRow && modelRow.value) preferredModel = modelRow.value;
    } catch (_) {}

    // Invocar Gemini AI
    const geminiResult = await callGemini(systemPrompt, conversationHistory, apiKey, maxTokens, preferredModel);
    const aiResponse = geminiResult.parsed;
    const modelUsed = geminiResult.modelUsed || preferredModel;
    const usage = geminiResult.usage || { promptTokens: 0, candidatesTokens: 0, totalTokens: 0 };
    const latencyMs = geminiResult.latencyMs || 0;

    const reply = aiResponse.reply || '¡Hola! Con mucho gusto te asesoro con tu proyecto web o solución de IA. ¿Qué tienes en mente?';
    const intent = aiResponse.intent || 'pregunta';
    const objection = aiResponse.objection || { detected: false };
    const isUnanswered = Boolean(aiResponse.is_unanswered);
    const appointmentData = aiResponse.appointment || { should_book: false };

    // Registrar métricas de consumo de tokens y llamadas en bot_api_logs
    const promptTokens = usage.promptTokens || Math.max(1, Math.round((systemPrompt.length + JSON.stringify(conversationHistory).length) / 3.8));
    const candidatesTokens = usage.candidatesTokens || Math.max(1, Math.round(reply.length / 3.8));
    const totalTokens = usage.totalTokens || (promptTokens + candidatesTokens);

    try {
      await context.env.DB.prepare(`
        INSERT INTO bot_api_logs (model, prompt_tokens, candidates_tokens, total_tokens, latency_ms, status)
        VALUES (?, ?, ?, ?, ?, 'success')
      `).bind(modelUsed, promptTokens, candidatesTokens, totalTokens, latencyMs).run();
    } catch (logErr) {
      console.error('Error logging to bot_api_logs:', logErr);
    }

    // 1. Guardar mensajes en bot_messages
    await context.env.DB.prepare(
      "INSERT INTO bot_messages (conversation_id, role, content, detected_intent) VALUES (?, 'user', ?, ?)"
    ).bind(conversationId, message.trim(), intent).run();

    await context.env.DB.prepare(
      "INSERT INTO bot_messages (conversation_id, role, content, detected_intent) VALUES (?, 'assistant', ?, ?)"
    ).bind(conversationId, reply, intent).run();

    // 2. Registrar o actualizar bot_conversations
    let appointmentClosed = 0;
    if (appointmentData.should_book && (appointmentData.fullName || appointmentData.whatsapp || userContact)) {
      appointmentClosed = 1;
    }

    await context.env.DB.prepare(`
      INSERT INTO bot_conversations (id, visitor_id, user_name, user_contact, questions_count, objections_count, appointment_closed, updated_at)
      VALUES (?, ?, ?, ?, 1, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        questions_count = questions_count + 1,
        objections_count = objections_count + excluded.objections_count,
        appointment_closed = CASE WHEN excluded.appointment_closed = 1 THEN 1 ELSE appointment_closed END,
        user_name = COALESCE(NULLIF(excluded.user_name, ''), user_name),
        user_contact = COALESCE(NULLIF(excluded.user_contact, ''), user_contact),
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      conversationId,
      visitorId,
      userName || appointmentData.fullName || '',
      userContact || appointmentData.whatsapp || '',
      objection.detected ? 1 : 0,
      appointmentClosed
    ).run();

    // 3. Registrar objeción si fue detectada
    if (objection.detected && objection.text) {
      await context.env.DB.prepare(
        "INSERT INTO bot_objections_log (conversation_id, objection_type, objection_text, solution_provided, status) VALUES (?, ?, ?, ?, 'resuelta')"
      ).bind(
        conversationId,
        objection.type || 'otro',
        objection.text,
        objection.solution || reply
      ).run();
    }

    // 4. Si fue pregunta sin respuesta en RAG/KB, registrar en bot_unanswered_questions
    if (isUnanswered) {
      await context.env.DB.prepare(
        "INSERT INTO bot_unanswered_questions (conversation_id, question, bot_alternative_response, status) VALUES (?, ?, ?, 'pendiente')"
      ).bind(
        conversationId,
        message.trim(),
        aiResponse.alternative_solution || reply
      ).run();
    }

    // 5. Si cerró cita, guardar en appointments con source = 'bot'
    let createdAppointmentId = null;
    if (appointmentClosed === 1) {
      createdAppointmentId = `bot-apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const aptDate = appointmentData.date || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
      const aptTime = appointmentData.time || '10:00';
      const aptName = appointmentData.fullName || userName || 'Cliente Interesado (Bot)';
      const aptContact = appointmentData.whatsapp || userContact || 'No especificado';
      const aptEmail = appointmentData.email || 'contacto@geosoft.cr';
      const aptNotes = `Agendada automáticamente por Bot de IA (Conversación ${conversationId}). Notas: ${appointmentData.notes || 'Interés comercial'}`;

      await context.env.DB.prepare(`
        INSERT INTO appointments (id, fullName, email, whatsapp, service, date, time, notes, status, source, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', 'bot', CURRENT_TIMESTAMP)
      `).bind(
        createdAppointmentId,
        aptName,
        aptEmail,
        aptContact,
        appointmentData.service || 'Demostración GeoSoft',
        aptDate,
        aptTime,
        aptNotes
      ).run();
    }

    return new Response(JSON.stringify({
      success: true,
      conversationId,
      reply,
      intent,
      objection: objection.detected ? objection : null,
      isUnanswered,
      appointmentBooked: appointmentClosed === 1,
      appointmentId: createdAppointmentId,
      modelUsed,
      tokensUsed: totalTokens
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (err: any) {
    console.error('Error in bot chat endpoint:', err);
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Error en el asistente de IA',
      reply: '¡Hola! Estoy experimentando una breve intermitencia de conexión, pero nuestro equipo humano está listo para atenderte en WhatsApp de inmediato.'
    }), {
      status: 200, // Return 200 with fallback message so client UI doesn't crash
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
