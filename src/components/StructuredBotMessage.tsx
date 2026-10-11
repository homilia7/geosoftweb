import React from 'react';

interface StructuredBotMessageProps {
  text: string;
}

export const StructuredBotMessage: React.FC<StructuredBotMessageProps> = ({ text }) => {
  // Función para procesar negritas (**texto**) y precios ($XXX)
  const renderInlineFormatted = (rawText: string) => {
    // Dividir por negritas (**texto**)
    const parts = rawText.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return (
          <strong key={idx} className="font-bold text-white text-shadow-sm tracking-wide">
            {inner}
          </strong>
        );
      }

      // Resaltar precios y porcentajes clave si están presentes
      const priceRegex = /(\$\d[\d,]*(?:\s*(?:USD|usd))?|\d+%\s*(?:OFF|off|descuento)?)/g;
      const subParts = part.split(priceRegex);

      return (
        <span key={idx}>
          {subParts.map((sp, sIdx) => {
            if (priceRegex.test(sp)) {
              return (
                <span
                  key={sIdx}
                  className="font-semibold text-[#DFF494] px-1 py-0.5 rounded bg-white/5 border border-white/10 mx-0.5 font-mono text-[11px]"
                >
                  {sp}
                </span>
              );
            }
            return sp;
          })}
        </span>
      );
    });
  };

  // Dividir el mensaje en bloques por saltos de línea dobles o simples
  const rawLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Agrupar viñetas consecutivas y párrafos normales
  const blocks: Array<{ type: 'bullet' | 'paragraph' | 'action'; text: string }> = [];

  rawLines.forEach((line) => {
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\.\s/.test(line);
    const isQuestionOrAction = line.endsWith('?') || line.startsWith('¿') || line.includes('agendar') || line.includes('videollamada');

    if (isBullet) {
      const cleanLine = line.replace(/^[•\-*]\s*|^\d+\.\s*/, '');
      blocks.push({ type: 'bullet', text: cleanLine });
    } else if (isQuestionOrAction && blocks.length > 0) {
      blocks.push({ type: 'action', text: line });
    } else {
      blocks.push({ type: 'paragraph', text: line });
    }
  });

  return (
    <div className="space-y-2 text-xs leading-relaxed text-gray-200">
      {blocks.map((block, i) => {
        if (block.type === 'bullet') {
          return (
            <div
              key={i}
              style={{ animationDelay: `${i * 35}ms` }}
              className="flex items-start gap-2.5 pl-1.5 py-0.5 animate-in fade-in slide-in-from-bottom-1 duration-300 fill-mode-both"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] mt-1.5 shrink-0 shadow-[0_0_6px_rgba(169,248,181,0.8)]" />
              <div className="flex-1 text-gray-200 leading-normal">
                {renderInlineFormatted(block.text)}
              </div>
            </div>
          );
        }

        if (block.type === 'action') {
          return (
            <div
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              className="pt-1.5 border-t border-white/10 text-white font-medium flex items-center gap-1.5 text-[11.5px] text-[#A9F8B5] animate-in fade-in slide-in-from-bottom-1 duration-300 fill-mode-both"
            >
              <span>{renderInlineFormatted(block.text)}</span>
            </div>
          );
        }

        return (
          <p
            key={i}
            style={{ animationDelay: `${i * 30}ms` }}
            className="animate-in fade-in slide-in-from-bottom-1 duration-300 fill-mode-both"
          >
            {renderInlineFormatted(block.text)}
          </p>
        );
      })}
    </div>
  );
};
