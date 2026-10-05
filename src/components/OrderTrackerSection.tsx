import React, { useState } from 'react';
import { BakeryOrder, OrderStatus } from '../types/bakery';
import {
  Search,
  Clock,
  CheckCircle,
  ChefHat,
  Sparkles,
  AlertCircle,
  Truck,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface OrderTrackerSectionProps {
  orders: BakeryOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, note: string) => void;
  isKitchenMode: boolean;
  onToggleKitchenMode: () => void;
}

export const OrderTrackerSection: React.FC<OrderTrackerSectionProps> = ({
  orders,
  onUpdateOrderStatus,
  isKitchenMode,
  onToggleKitchenMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string>(orders[0]?.id || '');
  const [bakerNoteInput, setBakerNoteInput] = useState('');

  const activeOrder = orders.find(
    (o) =>
      o.id === activeOrderId ||
      o.orderNumber.toLowerCase() === searchQuery.trim().toLowerCase() ||
      o.customerEmail.toLowerCase() === searchQuery.trim().toLowerCase()
  ) || orders[0];

  const statusSteps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'received', label: 'Order Received', desc: 'Order logged & ingredients allocated' },
    { key: 'design_confirmed', label: 'Design Confirmed', desc: 'Pastry chef reviewed tier specifications' },
    { key: 'baking', label: 'Baking Sponges', desc: 'Slow-baked in stone hearth & chilled' },
    { key: 'decorating', label: 'Decorating & Detailing', desc: 'Piping, florals, and custom inscriptions' },
    { key: 'ready', label: 'Ready for Pickup', desc: 'Chilled in temperature-controlled display' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return 0;
      case 'design_confirmed':
        return 1;
      case 'baking':
        return 2;
      case 'decorating':
        return 3;
      case 'ready':
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    const note = bakerNoteInput.trim() || `Status updated to ${nextStatus.replace('_', ' ')}`;
    onUpdateOrderStatus(orderId, nextStatus, note);
    setBakerNoteInput('');
  };

  return (
    <section id="order-tracker" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-stone-200/80">
        <div>
          <span className="text-xs uppercase font-semibold tracking-widest text-amber-800">
            Real-Time Bakery Status
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1">
            Order Tracking & Kitchen Live Display
          </h2>
          <p className="text-stone-600 text-sm mt-2 max-w-xl">
            Check the live progress of your custom bake, from sponge preparation to delicate hand-piped detailing.
          </p>
        </div>

        {/* Kitchen Staff Mode Switch */}
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleKitchenMode}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              isKitchenMode
                ? 'bg-amber-900 border-amber-900 text-white shadow-xs'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>{isKitchenMode ? 'Staff Mode Active' : 'Switch to Staff Kitchen Portal'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Order Quick Pills */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Order # (e.g. WF-9412) or customer email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs text-stone-600">
          <span className="text-stone-400 shrink-0">Recent Orders:</span>
          {orders.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setActiveOrderId(o.id);
                setSearchQuery(o.orderNumber);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors shrink-0 ${
                activeOrder?.id === o.id
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              #{o.orderNumber}
            </button>
          ))}
        </div>
      </div>

      {activeOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Tracker Pipeline Column */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-8">
            {/* Top Order Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-stone-900">
                    Order #{activeOrder.orderNumber}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs text-stone-500">
                    Placed for {activeOrder.customerName}
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    Fulfillment Date: <strong>{activeOrder.fulfillmentDate}</strong> ({activeOrder.fulfillmentTimeSlot})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-md bg-stone-100 text-stone-800 uppercase tracking-wide">
                  {activeOrder.status.replace('_', ' ')}
                </span>
                <span className="font-serif text-lg font-bold text-stone-900 tabular-nums">
                  ${activeOrder.total}
                </span>
              </div>
            </div>

            {/* Visual 5-Step Timeline Tracker */}
            <div>
              <div className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-4">
                Production Timeline
              </div>
              <div className="relative">
                {/* Horizontal line for desktop */}
                <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-stone-200 -z-0" />
                <div
                  className="hidden sm:block absolute top-4 left-6 h-0.5 bg-stone-900 transition-all duration-500 -z-0"
                  style={{
                    width: `${(getStepIndex(activeOrder.status) / (statusSteps.length - 1)) * 90}%`,
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {statusSteps.map((step, idx) => {
                    const currentIndex = getStepIndex(activeOrder.status);
                    const isDone = idx < currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div key={step.key} className="flex sm:flex-col items-start gap-3 sm:gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isDone
                              ? 'bg-stone-900 text-white'
                              : isCurrent
                              ? 'bg-amber-800 text-white ring-4 ring-amber-100'
                              : 'bg-stone-100 text-stone-400 border border-stone-200'
                          }`}
                        >
                          {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-stone-900 leading-tight">
                            {step.label}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Status History Logs */}
            <div className="pt-6 border-t border-stone-100">
              <div className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-3">
                Baker Kitchen Log Notes
              </div>
              <div className="space-y-2.5">
                {activeOrder.statusHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-xs bg-[#FAF8F5] p-3 rounded-lg border border-stone-200/60"
                  >
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-800 uppercase text-[11px]">
                          {item.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-stone-600 mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KITCHEN MANAGER CONTROLS (When Kitchen Mode is Active) */}
            {isKitchenMode && (
              <div className="pt-6 border-t border-amber-200/70 bg-amber-50/40 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-amber-900" />
                    <span className="font-serif text-sm font-semibold text-amber-950">
                      Kitchen Station Controls
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-medium">
                    Advancing order #{activeOrder.orderNumber}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {statusSteps.map((step) => (
                    <button
                      key={step.key}
                      type="button"
                      onClick={() => handleStatusChange(activeOrder.id, step.key)}
                      disabled={activeOrder.status === step.key}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeOrder.status === step.key
                          ? 'bg-amber-900 text-white font-semibold'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      Mark as {step.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom baker note (e.g. Inscription piped in gold luster)..."
                    value={bakerNoteInput}
                    onChange={(e) => setBakerNoteInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (bakerNoteInput.trim()) {
                        onUpdateOrderStatus(activeOrder.id, activeOrder.status, bakerNoteInput.trim());
                        setBakerNoteInput('');
                      }
                    }}
                    className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
                  >
                    Post Log Note
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Cake Specifications & Baker Checklist */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
              <span className="font-serif text-base font-semibold text-stone-900">
                Pastry Chef Work Order
              </span>
              <span className="text-xs font-mono text-stone-500">#{activeOrder.orderNumber}</span>
            </div>

            {/* Allergen Flag */}
            {activeOrder.customCake.dietaryRequirements.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-700" />
                  <span>ALLERGEN NOTIFICATION</span>
                </div>
                <div className="font-medium">
                  {activeOrder.customCake.dietaryRequirements.join(' · ')}
                </div>
              </div>
            )}

            {/* Detailed Cake Blueprint List */}
            <div className="space-y-3 text-xs text-stone-700">
              <div className="pb-2 border-b border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  Cake Architecture
                </span>
                <span className="font-medium text-stone-900">
                  {activeOrder.customCake.tierSize.replace('_', ' ')} · Shape: {activeOrder.customCake.shape}
                </span>
              </div>

              <div className="pb-2 border-b border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  Sponge & Filling Recipe
                </span>
                <span className="font-medium text-stone-900">
                  {activeOrder.customCake.spongeFlavorId.replace('sponge_', '').replace('_', ' ')}
                </span>
                <span className="text-stone-500 block">
                  Layered with: {activeOrder.customCake.fillingFlavorId.replace('fill_', '').replace('_', ' ')}
                </span>
              </div>

              <div className="pb-2 border-b border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  Frosting & Palette
                </span>
                <span className="font-medium text-stone-900">
                  {activeOrder.customCake.frostingStyleId.replace('style_', '').replace('_', ' ')} · Tone: {activeOrder.customCake.frostingColorId.replace('color_', '').replace('_', ' ')}
                </span>
                {activeOrder.customCake.dripId !== 'drip_none' && (
                  <span className="text-stone-500 block">
                    Drip: {activeOrder.customCake.dripId.replace('drip_', '').replace('_', ' ')}
                  </span>
                )}
              </div>

              <div className="pb-2 border-b border-stone-100">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  Toppings Checklist
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {activeOrder.customCake.selectedToppingIds.map((tid) => (
                    <span
                      key={tid}
                      className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-[11px]"
                    >
                      {tid.replace('top_', '').replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {activeOrder.customCake.inscription.text && (
                <div className="pb-2 border-b border-stone-100">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">
                    Piped Inscription
                  </span>
                  <div className="font-serif text-sm font-semibold text-stone-900 italic mt-0.5">
                    "{activeOrder.customCake.inscription.text}"
                  </div>
                  <span className="text-[11px] text-stone-500">
                    Style: {activeOrder.customCake.inscription.style.replace('_', ' ')}
                  </span>
                </div>
              )}

              {activeOrder.orderNotes && (
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">
                    Customer Instructions
                  </span>
                  <p className="text-stone-600 italic mt-0.5">{activeOrder.orderNotes}</p>
                </div>
              )}
            </div>

            {/* Fulfillment Details Box */}
            <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-stone-200/70 text-xs space-y-1.5">
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                {activeOrder.fulfillmentType === 'pickup' ? (
                  <MapPin className="w-3.5 h-3.5 text-stone-700" />
                ) : (
                  <Truck className="w-3.5 h-3.5 text-stone-700" />
                )}
                <span>
                  {activeOrder.fulfillmentType === 'pickup'
                    ? 'Bakery Counter Pickup'
                    : 'Courier Delivery'}
                </span>
              </div>
              <div className="text-stone-600">
                {activeOrder.fulfillmentDate} at {activeOrder.fulfillmentTimeSlot}
              </div>
              <div className="text-stone-500 text-[11px]">
                Customer: {activeOrder.customerName} · {activeOrder.customerPhone}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
          No orders found matching "{searchQuery}".
        </div>
      )}
    </section>
  );
};
