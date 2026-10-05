import React, { useState } from 'react';
import { CustomCakeConfiguration, BakeryOrder } from '../types/bakery';
import { calculateCakePrice } from '../utils/pricing';
import { X, Calendar, Clock, MapPin, Truck, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

interface OrderCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CustomCakeConfiguration;
  onOrderCreated: (order: BakeryOrder) => void;
}

export const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  isOpen,
  onClose,
  config,
  onOrderCreated,
}) => {
  const breakdown = calculateCakePrice(config);

  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  
  // Calculate earliest possible date (minimum 48 hours from today)
  const getMinDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [fulfillmentDate, setFulfillmentDate] = useState<string>(getMinDateString());
  const [fulfillmentTimeSlot, setFulfillmentTimeSlot] = useState<string>('11:00 AM – 1:00 PM');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<BakeryOrder | null>(null);

  if (!isOpen) return null;

  const deliveryFee = fulfillmentType === 'delivery' ? 25 : 0;
  const grandTotal = breakdown.subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !fulfillmentDate) {
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `WF-${randomSuffix}`;

    const newOrder: BakeryOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      fulfillmentType,
      fulfillmentDate,
      fulfillmentTimeSlot,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress:
        fulfillmentType === 'delivery'
          ? {
              street,
              city,
              zipCode,
            }
          : undefined,
      customCake: { ...config, estimatedPrice: breakdown.subtotal },
      orderNotes,
      subtotal: breakdown.subtotal,
      deliveryFee,
      total: grandTotal,
      status: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          note: 'Order submitted via online custom cake studio',
        },
      ],
    };

    onOrderCreated(newOrder);
    setConfirmedOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-2xl w-full my-8 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold text-stone-900">
              {confirmedOrder ? 'Order Confirmation' : 'Schedule Pickup & Order'}
            </span>
            <span className="text-stone-300">/</span>
            <span className="text-xs text-stone-500 font-medium">
              Wildflour Bakery
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Custom Cake Order Confirmed!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Thank you, <span className="font-semibold">{confirmedOrder.customerName}</span>. Your bespoke order has been sent to our head pastry chef.
              </p>
              <div className="inline-block bg-stone-100 px-3 py-1.5 rounded-md font-mono text-sm font-semibold text-stone-800">
                Order #{confirmedOrder.orderNumber}
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="bg-[#FAF8F5] rounded-xl p-5 border border-stone-200/80 text-xs text-stone-700 space-y-3">
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="font-semibold text-stone-900">Fulfillment</span>
                <span>
                  {confirmedOrder.fulfillmentType === 'pickup'
                    ? 'In-Store Pickup at Bakery'
                    : 'Local Courier Delivery'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Slot:</span>
                <span className="font-medium text-stone-900">
                  {confirmedOrder.fulfillmentDate} ({confirmedOrder.fulfillmentTimeSlot})
                </span>
              </div>
              {confirmedOrder.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="text-right">
                    {confirmedOrder.deliveryAddress.street}, {confirmedOrder.deliveryAddress.city} {confirmedOrder.deliveryAddress.zipCode}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">Cake Structure:</span>
                <span className="font-medium">{confirmedOrder.customCake.tierSize.replace('_', ' ')} ({confirmedOrder.customCake.shape})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Flavor:</span>
                <span>{breakdown.sponge.name} with {breakdown.filling.name}</span>
              </div>
              {confirmedOrder.customCake.inscription.text && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Inscription:</span>
                  <span className="italic">"{confirmedOrder.customCake.inscription.text}"</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between font-serif text-sm font-bold text-stone-900">
                <span>Total Amount Paid</span>
                <span className="tabular-nums">${confirmedOrder.total}</span>
              </div>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span>
                A receipt and preparation instructions have been routed to <strong>{confirmedOrder.customerEmail}</strong>. You can follow live decorating status anytime using your Order Number.
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-stone-900 text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-stone-800"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Order Scheduling Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Fulfillment Type Toggle */}
            <div>
              <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                Fulfillment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    fulfillmentType === 'pickup'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-stone-900">
                      In-Store Bakery Pickup
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Free · 412 Artisan Way, Riverdale
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    fulfillmentType === 'delivery'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <Truck className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-stone-900">
                      White-Glove Delivery
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      +$25 · Temperature controlled
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Date and Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-1.5">
                  Requested Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={getMinDateString()}
                    value={fulfillmentDate}
                    onChange={(e) => setFulfillmentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
                  />
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Minimum 48 hr notice required
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider mb-1.5">
                  Time Window
                </label>
                <select
                  value={fulfillmentTimeSlot}
                  onChange={(e) => setFulfillmentTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800 bg-white"
                >
                  <option value="10:00 AM – 12:00 PM">Morning (10:00 AM – 12:00 PM)</option>
                  <option value="12:00 PM – 2:00 PM">Midday (12:00 PM – 2:00 PM)</option>
                  <option value="2:00 PM – 5:00 PM">Afternoon (2:00 PM – 5:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <label className="block text-xs uppercase font-bold text-stone-500 tracking-wider">
                Customer Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
                />
              </div>

              {fulfillmentType === 'delivery' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Street Address *"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Postal Code *"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
                  />
                </div>
              )}

              <div>
                <input
                  type="text"
                  placeholder="Special pickup/transport instructions (optional)"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-hidden focus:border-stone-800"
                />
              </div>
            </div>

            {/* Total Price Bar */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-stone-500">
                  Custom Cake: <span className="tabular-nums font-semibold">${breakdown.subtotal}</span>
                  {deliveryFee > 0 && <span> + Delivery: ${deliveryFee}</span>}
                </div>
                <div className="font-serif text-xl font-bold text-stone-900 tabular-nums">
                  Total: ${grandTotal}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 text-white px-6 py-2.5 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
                >
                  Confirm & Place Order
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
