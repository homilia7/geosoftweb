import React from 'react';
import { useProjectQuote } from '../../../hooks/useProjectQuote';
import { QuoteHeader } from './QuoteHeader';
import { QuoteItemsTable } from './QuoteItemsTable';
import { QuotePricingModes } from './QuotePricingModes';
import { QuoteActionsBar } from './QuoteActionsBar';

export const AdminProjectQuoteTab: React.FC = () => {
  const {
    quote,
    itemsSubtotal,
    updateField,
    addItem,
    updateItem,
    removeItem,
    updateInitialPlusMonthly,
    updateOnlyMonthly,
    syncInitialWithSubtotal,
    resetToTemplate,
    generateWhatsAppMessage
  } = useProjectQuote();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-message-soft">
      {/* 1. Header Ejecutivo con Logo GeoSoft y Nombre del Proyecto */}
      <QuoteHeader quote={quote} updateField={updateField} />

      {/* 2. Tabla Interactiva de Ítems / Entregables */}
      <QuoteItemsTable
        items={quote.items}
        currencySymbol={quote.currencySymbol}
        itemsSubtotal={itemsSubtotal}
        onAddItem={addItem}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
      />

      {/* 3. Dos Modalidades de Pago (Inicial + Mensual vs Solo Mensual) */}
      <QuotePricingModes
        currencySymbol={quote.currencySymbol}
        itemsSubtotal={itemsSubtotal}
        modeInitial={quote.modeInitialPlusMonthly}
        modeMonthly={quote.modeOnlyMonthly}
        preferredMode={quote.preferredMode}
        onUpdateInitial={updateInitialPlusMonthly}
        onUpdateMonthly={updateOnlyMonthly}
        onSelectPreferred={mode => updateField('preferredMode', mode)}
        onSyncSubtotal={syncInitialWithSubtotal}
      />

      {/* 4. Barra de Acciones (WhatsApp, Copiar, Imprimir/PDF, Notas) */}
      <QuoteActionsBar
        quote={quote}
        onUpdateNotes={notes => updateField('notes', notes)}
        onReset={resetToTemplate}
        getWhatsAppEncoded={generateWhatsAppMessage}
      />
    </div>
  );
};
