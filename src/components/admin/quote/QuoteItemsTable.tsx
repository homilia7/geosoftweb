import React from 'react';
import { Plus, Trash2, Layers, CheckCircle2 } from 'lucide-react';
import { ProjectQuoteItem } from '../../../types/projectQuote';

interface QuoteItemsTableProps {
  items: ProjectQuoteItem[];
  currencySymbol: string;
  itemsSubtotal: number;
  onAddItem: (preset?: Partial<ProjectQuoteItem>) => void;
  onUpdateItem: (id: string, updates: Partial<ProjectQuoteItem>) => void;
  onRemoveItem: (id: string) => void;
}

export const QuoteItemsTable: React.FC<QuoteItemsTableProps> = ({
  items,
  currencySymbol,
  itemsSubtotal,
  onAddItem,
  onUpdateItem,
  onRemoveItem
}) => {
  const isCrc = currencySymbol === '₡';
  const priceStep = isCrc ? 5000 : 10;

  return (
    <div className="card-accent p-6 border-white/10 space-y-5">
      {/* Table Header / Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-sm">Ítems & Entregables del Proyecto</h3>
            <p className="text-[11px] text-gray-400">Detalla los módulos, desarrollos o servicios incluidos</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAddItem()}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black text-xs font-bold flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Agregar Ítem</span>
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const rowTotal = (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0);
          return (
            <div
              key={item.id}
              className="bg-black/40 border border-white/10 rounded-2xl p-4 transition-all hover:border-white/20 space-y-3"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 text-gray-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                {/* Item Name */}
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => onUpdateItem(item.id, { name: e.target.value })}
                    placeholder="Título del ítem o servicio"
                    className="w-full bg-transparent border-b border-white/10 focus:border-[#A9F8B5] text-white text-sm font-semibold outline-none pb-1"
                  />
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] text-gray-500 font-mono">Cant:</span>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => onUpdateItem(item.id, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                    className="w-16 bg-white/5 border border-white/10 focus:border-[#A9F8B5] rounded-lg px-2 py-1 text-xs text-white text-center font-mono outline-none"
                  />
                </div>

                {/* Unit Price */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] text-gray-500 font-mono">Precio Unit ({currencySymbol}):</span>
                  <input
                    type="number"
                    min={0}
                    step={priceStep}
                    value={item.unitPrice}
                    onChange={e => onUpdateItem(item.id, { unitPrice: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-28 bg-white/5 border border-white/10 focus:border-[#A9F8B5] rounded-lg px-2.5 py-1 text-xs text-white font-mono font-bold text-right outline-none"
                  />
                </div>

                {/* Row Total */}
                <div className="text-right shrink-0 min-w-[100px]">
                  <span className="text-xs font-mono font-bold text-[#A9F8B5]">
                    {currencySymbol}{rowTotal.toLocaleString()}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  disabled={items.length <= 1}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Eliminar este ítem"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Description Input */}
              <input
                type="text"
                value={item.description}
                onChange={e => onUpdateItem(item.id, { description: e.target.value })}
                placeholder="Descripción adicional, alcance o características incluidas..."
                className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-lg px-3 py-1.5 text-xs text-gray-400 placeholder:text-gray-600 outline-none"
              />
            </div>
          );
        })}
      </div>

      {/* Subtotal Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 bg-black/20 p-4 rounded-xl">
        <div className="text-xs text-gray-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Total de {items.length} entregables listados en la cotización</span>
        </div>
        <div className="text-right flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400 uppercase">Subtotal Ítems:</span>
          <span className="text-lg font-mono font-extrabold text-white">
            {currencySymbol}{itemsSubtotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
