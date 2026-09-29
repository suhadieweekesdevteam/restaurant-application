import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { 
  X, 
  Clock, 
  Bike, 
  Flame, 
  CheckCircle2, 
  Package, 
  PhoneCall, 
  Receipt, 
  Printer, 
  MapPin, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';

export const OrderTracker = () => {
  const { activeOrder, setActiveOrder } = useCart();
  const { isOrderTrackerOpen, setIsOrderTrackerOpen } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(1); // 0 to 3

  useEffect(() => {
    if (!activeOrder) return;
    // Simulate kitchen progress
    const timer1 = setTimeout(() => setCurrentStepIndex(1), 4000);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 15000);
    const timer3 = setTimeout(() => setCurrentStepIndex(3), 30000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [activeOrder]);

  if (!isOrderTrackerOpen || !activeOrder) return null;

  const steps = [
    { title: "Order Confirmed", desc: "Sent directly to Banjaraa kitchen display", icon: CheckCircle2 },
    { title: "Pit Steaming & Tandoor Active", desc: "Slow-braising in underground wood-fire pit", icon: Flame },
    { title: "Packed in Shahi Seal", desc: "Aroma preserved in insulated heat-retentive box", icon: Package },
    { 
      title: activeOrder.orderType === 'delivery' ? "Out for Delivery" : "Ready for Table", 
      desc: activeOrder.orderType === 'delivery' ? "Delivery valet on Cuttack-Puri Bypass route" : "Steward serving to your table", 
      icon: Bike 
    }
  ];

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel border border-amber-500/40 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative bg-[#0c0f18] my-auto">
        
        {/* Tracker Header */}
        <div className="shrink-0 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-4 py-3.5 sm:px-6 sm:py-4 border-b border-amber-500/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Live Dawat Tracker</span>
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white mt-1">
              Order #{activeOrder.id}
            </h3>
          </div>
          <button
            onClick={() => setIsOrderTrackerOpen(false)}
            className="p-1.5 sm:p-2 rounded-full bg-stone-900 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          
          {/* Estimated Time Card */}
          <div className="glass-panel-gold rounded-2xl p-5 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-stone-300">Estimated Feast Arrival:</span>
                <div className="text-2xl font-black font-cinzel text-amber-400">
                  {activeOrder.estimatedTime}
                </div>
              </div>
            </div>
            
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Kitchen Counter</span>
            </a>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-800">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPassed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Step Bullet */}
                  <div className={`absolute -left-6 sm:-left-8 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent 
                      ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/30 shadow-lg' 
                      : isPassed 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-stone-900 text-stone-600 border border-stone-800'
                  }`}>
                    {isPassed && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>

                  {/* Step Content */}
                  <div>
                    <h4 className={`text-sm font-bold ${isPassed ? 'text-white' : 'text-stone-500'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-stone-400 font-light mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Printable Invoice Summary */}
          <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Invoice Items Summary</span>
              </div>
              <button
                onClick={handlePrintReceipt}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
            </div>

            <div className="space-y-2 text-xs divide-y divide-stone-800/40">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex justify-between">
                  <span className="text-stone-300">
                    {item.quantity}x {item.name} {item.selectedPortion ? `(${item.selectedPortion.size})` : ''}
                  </span>
                  <span className="text-white font-semibold">₹{item.currentPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-bold text-amber-400 font-cinzel">
              <span>Grand Total Paid ({activeOrder.paymentMethod.toUpperCase()}):</span>
              <span>₹{activeOrder.grandTotal}</span>
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="text-xs text-stone-400 flex items-start gap-2 bg-stone-950 p-3 rounded-xl border border-stone-800">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Delivering to: </span>
              {activeOrder.customerDetails.address}, {activeOrder.deliveryZone}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
