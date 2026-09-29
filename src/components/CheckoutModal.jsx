import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Wallet, 
  Banknote, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Bike 
} from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    cart, 
    grandTotal, 
    orderType, 
    deliveryZone, 
    setDeliveryZone, 
    placeOrder 
  } = useCart();

  const { isCheckoutOpen, setIsCheckoutOpen, setIsOrderTrackerOpen } = useApp();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [upiId, setUpiId] = useState('');
  const [tableNumber, setTableNumber] = useState('Table 4 (Majlis Section)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCheckoutOpen) return null;

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please provide your name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number');
      return;
    }
    if (orderType === 'delivery' && (!street.trim() || !houseNo.trim())) {
      setErrorMsg('Please provide your street address & house/flat number');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const customerDetails = {
        name,
        phone,
        address: orderType === 'delivery' ? `${houseNo}, ${street}, Landmark: ${landmark || 'None'}` : 'Counter Pickup',
        deliveryZone: orderType === 'delivery' ? deliveryZone : 'Banjaraa Premises',
        tableNumber: orderType === 'dinein' ? tableNumber : null
      };

      placeOrder(customerDetails, paymentMethod);
      setIsSubmitting(false);
      setIsCheckoutOpen(false);
      setIsOrderTrackerOpen(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel border border-amber-500/40 rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative bg-[#0b0e17] my-auto">
        
        {/* Modal Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div>
            <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Secure Dawat Checkout</span>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">Complete Your Order</h3>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePlaceOrderSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Contact Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Mobile Phone (10 digits)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Address or Table (Conditioned by Order Type) */}
          {orderType === 'delivery' ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Bhubaneswar Delivery Destination</span>
              </h4>

              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Select Delivery Zone / Area:</label>
                <select
                  value={deliveryZone}
                  onChange={(e) => setDeliveryZone(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  {RESTAURANT_INFO.deliveryZones.map((z, idx) => (
                    <option key={idx} value={z.area}>
                      {z.area} ({z.time}) {z.fee === 0 ? '• Free Delivery' : `• ₹${z.fee}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="House / Flat / Plot No."
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Street / Colony / Society"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Nearby Landmark (e.g. Near Big Bazaar, KIIT, Tankapani Road...)"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
          ) : orderType === 'dinein' ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Dine-In Table Confirmation</span>
              </h4>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Table / Majlis Booth Number"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[11px] text-stone-400">Our stewards will serve your freshly prepared feast directly to your table.</p>
            </div>
          ) : (
            <div className="p-3 bg-stone-900/60 border border-stone-800 rounded-xl text-xs text-stone-400">
              📍 <span className="font-semibold text-white">Pickup Location:</span> Plot No. 1051/2758, Meherpalli, Cuttack-Puri Bypass, Bhubaneswar. Estimated ready time: 20-25 mins.
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Payment Method</span>
            </h4>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'upi' 
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' 
                    : 'bg-stone-900 border-stone-800 text-stone-400'
                }`}
              >
                <Wallet className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span className="text-xs block">UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'card' 
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' 
                    : 'bg-stone-900 border-stone-800 text-stone-400'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span className="text-xs block">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'cod' 
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' 
                    : 'bg-stone-900 border-stone-800 text-stone-400'
                }`}
              >
                <Banknote className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span className="text-xs block">Cash</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="p-3 bg-stone-900/80 border border-stone-800 rounded-xl space-y-2">
                <span className="text-[11px] text-stone-400 block">Instant UPI Payment ID:</span>
                <input
                  type="text"
                  placeholder="yourname@okhdfcbank / yourname@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Supports Google Pay, PhonePe, Paytm, and all UPI apps</span>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Pinned Submit Button Footer */}
          <div className="shrink-0 p-3.5 sm:p-4 border-t border-stone-800 bg-stone-950/95">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Order & Pay ₹{grandTotal}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
