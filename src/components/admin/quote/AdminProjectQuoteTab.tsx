import React from 'react';
import { useProjectQuote } from '../../../hooks/useProjectQuote';
import { QuoteHeader } from './QuoteHeader';
import { QuoteItemsTable } from './QuoteItemsTable';
import { QuotePricingModes } from './QuotePricingModes';
import { QuoteActionsBar } from './QuoteActionsBar';
import { QuoteAcceptedAlerts } from './QuoteAcceptedAlerts';

export const AdminProjectQuoteTab: React.FC = () => {
  const {
    quote,
    itemsSubtotal,
    updateField,
    switchCurrency,
    addItem,
    updateItem,
    removeItem,
    updateInitialPlusMonthly,
    updateOnlyMonthly,
    syncInitialWithSubtotal,
    resetToTemplate,
    getClientShareableUrl,
    generateWhatsAppMessage
  } = useProjectQuote();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-message-soft">
      {/* 0. Alertas de Notificaciones de Cotizaciones Aceptadas */}
      <QuoteAcceptedAlerts />

      {/* 1. Header Ejecutivo con Logo GeoSoft, Nombre del Proyecto y Selector de Moneda (USD / CRC) */}
      <QuoteHeader
        quote={quote}
        updateField={updateField}
        onSwitchCurrency={switchCurrency}
      />

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

      {/* 4. Barra de Acciones (Generar Link, WhatsApp, Copiar, PDF, Términos) */}
      <QuoteActionsBar
        quote={quote}
        onUpdateNotes={notes => updateField('notes', notes)}
        onReset={resetToTemplate}
        getWhatsAppEncoded={generateWhatsAppMessage}
        getClientShareUrl={getClientShareableUrl}
      />
    </div>
  );
};
