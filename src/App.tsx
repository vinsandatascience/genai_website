import React, { useState, useEffect } from 'react';
import {
  CustomCakeConfiguration,
  SignatureCake,
  BakeryOrder,
  OrderStatus,
} from './types/bakery';
import { SAMPLE_ORDERS, INITIAL_CUSTOM_CONFIG } from './data/bakeryData';
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { CustomCakeBuilder } from './components/CustomCakeBuilder';
import { SignatureCakesSection } from './components/SignatureCakesSection';
import { OrderTrackerSection } from './components/OrderTrackerSection';
import { FlavorAllergenGuide } from './components/FlavorAllergenGuide';
import { BakeryStorySection } from './components/BakeryStorySection';
import { BakeryFooter } from './components/BakeryFooter';
import { OrderCheckoutModal } from './components/OrderCheckoutModal';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  // Orders list initialized from localStorage or sample mock orders
  const [orders, setOrders] = useState<BakeryOrder[]>(() => {
    try {
      const saved = localStorage.getItem('wildflour_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed reading saved orders from localStorage', e);
    }
    return SAMPLE_ORDERS;
  });

  // Active configuration for custom cake builder
  const [customConfig, setCustomConfig] = useState<CustomCakeConfiguration>(INITIAL_CUSTOM_CONFIG);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutConfig, setCheckoutConfig] = useState<CustomCakeConfiguration>(INITIAL_CUSTOM_CONFIG);
  const [isKitchenMode, setIsKitchenMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wildflour_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed storing orders to localStorage', e);
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleStartCustomizer = () => {
    const el = document.getElementById('custom-builder');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreSignatures = () => {
    const el = document.getElementById('signature-cakes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenTracker = () => {
    const el = document.getElementById('order-tracker');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProceedToOrder = (config: CustomCakeConfiguration) => {
    setCheckoutConfig(config);
    setCheckoutModalOpen(true);
  };

  const handleOrderCreated = (newOrder: BakeryOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order #${newOrder.orderNumber} successfully received and scheduled!`);
  };

  const handleCustomizeSignature = (config: CustomCakeConfiguration) => {
    setCustomConfig(config);
    handleStartCustomizer();
    showToast('Loaded signature recipe into Customizer for personal modifications.');
  };

  const handleDirectOrderSignature = (cake: SignatureCake) => {
    const config: CustomCakeConfiguration = {
      ...INITIAL_CUSTOM_CONFIG,
      ...cake.defaultConfig,
      estimatedPrice: cake.priceFrom,
    } as CustomCakeConfiguration;

    setCheckoutConfig(config);
    setCheckoutModalOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, note: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedHistory = [
            ...order.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              note,
            },
          ];
          return {
            ...order,
            status: newStatus,
            statusHistory: updatedHistory,
          };
        }
        return order;
      })
    );
    showToast(`Order status updated to: ${newStatus.replace('_', ' ')}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg border border-stone-700 flex items-center gap-3 text-xs max-w-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <HeaderNav
        onOpenCustomizer={handleStartCustomizer}
        onOpenTracker={handleOpenTracker}
        isKitchenMode={isKitchenMode}
        onToggleKitchenMode={() => setIsKitchenMode(!isKitchenMode)}
        ordersCount={orders.length}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <HeroSection
          onStartCustomizer={handleStartCustomizer}
          onExploreSignatures={handleExploreSignatures}
        />

        {/* Custom Cake Builder Studio */}
        <CustomCakeBuilder
          initialConfig={customConfig}
          onProceedToOrder={handleProceedToOrder}
        />

        {/* Signature Cakes Catalog */}
        <SignatureCakesSection
          onCustomizeCake={handleCustomizeSignature}
          onDirectOrderCake={handleDirectOrderSignature}
        />

        {/* Real-time Order Tracking & Kitchen Display */}
        <OrderTrackerSection
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          isKitchenMode={isKitchenMode}
          onToggleKitchenMode={() => setIsKitchenMode(!isKitchenMode)}
        />

        {/* Flavor Library & Allergen Matrix */}
        <FlavorAllergenGuide />

        {/* Our Kitchen Story & Craftsmanship */}
        <BakeryStorySection />
      </main>

      {/* Order Scheduling & Checkout Modal */}
      <OrderCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        config={checkoutConfig}
        onOrderCreated={handleOrderCreated}
      />

      {/* Quiet Footer */}
      <BakeryFooter />
    </div>
  );
}
