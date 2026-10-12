import React, { useState, useEffect } from 'react';

interface StructuredBotMessageProps {
  text: string;
  isLatest?: boolean;
  onLineRendered?: () => void;
}

export const StructuredBotMessage: React.FC<StructuredBotMessageProps> = ({
  text,
  isLatest = true,
  onLineRendered
}) => {
  // Función para procesar negritas (**texto**) y precios ($XXX)
  const renderInlineFormatted = (rawText: string) => {
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

  // Dividir el mensaje en bloques por saltos de línea
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

  // Animación lenta y fluida del primer renglón hacia abajo
  const [visibleCount, setVisibleCount] = useState<number>(() => isLatest ? 1 : blocks.length);
  const [currentText, setCurrentText] = useState(text);

  // Si cambia el texto del mensaje, reiniciar la secuencia progresiva
  if (currentText !== text) {
    setCurrentText(text);
    setVisibleCount(isLatest ? 1 : blocks.length);
  }

  useEffect(() => {
    if (!isLatest) {
      setVisibleCount(blocks.length);
      return;
    }

    if (visibleCount < blocks.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
        if (onLineRendered) onLineRendered();
      }, 340); // 340ms: cadencia lenta, fluida y elegante entre renglones

      return () => clearTimeout(timer);
    }
  }, [visibleCount, blocks.length, isLatest, onLineRendered]);

  return (
    <div
      onClick={() => setVisibleCount(blocks.length)}
      className="space-y-2.5 text-xs leading-relaxed text-gray-200 cursor-pointer"
      title="Toca para mostrar todo de inmediato"
    >
      {blocks.slice(0, visibleCount).map((block, i) => {
        if (block.type === 'bullet') {
          return (
            <div
              key={i}
              className="flex items-start gap-2.5 pl-1.5 py-0.5 animate-line-flow"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9F8B5] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(169,248,181,0.9)]" />
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
              className="pt-2 border-t border-white/10 text-white font-medium flex items-center gap-1.5 text-[11.5px] text-[#A9F8B5] animate-line-flow"
            >
              <span>{renderInlineFormatted(block.text)}</span>
            </div>
          );
        }

        return (
          <p
            key={i}
            className="animate-line-flow text-gray-200 leading-relaxed"
          >
            {renderInlineFormatted(block.text)}
          </p>
        );
      })}
    </div>
  );
};
