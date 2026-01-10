// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { sendOrderNotificationEmail } from '../services/emailService';

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    phoneNumber: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'EASYPAYSA'>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Empty cart redirect
  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrderPlacement = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.fullName || !customerInfo.address || !customerInfo.city || !customerInfo.phoneNumber) {
      setMessage({ type: 'error', text: 'Please fill in all shipping details.' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const initialStatus = paymentMethod === 'COD' ? 'Pending Confirmation' : 'Pending Payment';
      const orderNumber = Math.floor(Math.random() * 90000) + 10000;

      const orderData = {
        orderNumber,
        customer: customerInfo,
        paymentMethod,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        totalAmount: Number(cartTotal),
        status: initialStatus,
        placedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);

      // Send email notification (non-blocking - order still completes if email fails)
      sendOrderNotificationEmail({
        orderNumber,
        customerName: customerInfo.fullName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phoneNumber,
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city,
        paymentMethod,
        totalAmount: Number(cartTotal),
        items: orderData.items.map(item => ({
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price
        }))
      });

      clearCart();

      navigate(`/confirmation/${paymentMethod}`, {
        state: {
          total: cartTotal,
          orderNumber,
          customerPhone: customerInfo.phoneNumber,
          customerName: customerInfo.fullName
        }
      });

    } catch (error: any) {
      console.error('Error placing order:', error);
      setMessage({ type: 'error', text: `Order failed. ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  const inputStyle = "w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all";
  const labelStyle = "block text-gray-400 text-sm mb-1 font-medium ml-1";

  return (
    <div className="py-12 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-white mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto px-4">

        {/* Shipping Form */}
        <div className="lg:w-2/3 bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700 order-2 lg:order-1">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Truck className="mr-3 text-yellow-500" size={24} /> Shipping Details
          </h2>

          {message && (
            <div className={`p-4 mb-6 rounded-lg text-center text-sm font-bold ${message.type === 'error' ? 'bg-red-900/50 text-red-200 border border-red-500/50' : 'bg-green-900 text-green-300'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleOrderPlacement} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelStyle} htmlFor="fullName">Full Name *</label>
                <input type="text" id="fullName" name="fullName" value={customerInfo.fullName} onChange={handleInputChange} className={inputStyle} required placeholder="e.g. Ahmed Khan" />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle} htmlFor="email">Email (Optional - for order updates)</label>
                <input type="email" id="email" name="email" value={customerInfo.email} onChange={handleInputChange} className={inputStyle} placeholder="your@email.com" />
              </div>
              <div className="md:col-span-2">
                <label className={labelStyle} htmlFor="address">Full Address *</label>
                <textarea id="address" name="address" value={customerInfo.address} onChange={handleInputChange} className={`${inputStyle} h-24 resize-none`} required placeholder="House #, Street, Area..." />
              </div>
              <div>
                <label className={labelStyle} htmlFor="city">City *</label>
                <input type="text" id="city" name="city" value={customerInfo.city} onChange={handleInputChange} className={inputStyle} required placeholder="e.g. Lahore" />
              </div>
              <div>
                <label className={labelStyle} htmlFor="phoneNumber">Phone Number (WhatsApp) *</label>
                <input type="tel" id="phoneNumber" name="phoneNumber" value={customerInfo.phoneNumber} onChange={handleInputChange} className={inputStyle} required placeholder="0300-1234567" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mt-8 mb-4 flex items-center border-t border-gray-700 pt-6">
              <CreditCard className="mr-3 text-yellow-500" size={24} /> Payment Method
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-center p-4 rounded-lg cursor-pointer border transition-all ${paymentMethod === 'COD' ? 'bg-gray-700 border-yellow-500 ring-1 ring-yellow-500' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'}`} htmlFor="paymentStart">
                <input type="radio" id="paymentStart" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-5 h-5 text-yellow-500 focus:ring-yellow-500" />
                <span className="ml-3 text-white font-medium">Cash On Delivery</span>
              </label>

              <label className={`flex items-center p-4 rounded-lg cursor-pointer border transition-all ${paymentMethod === 'EASYPAYSA' ? 'bg-gray-700 border-yellow-500 ring-1 ring-yellow-500' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'}`} htmlFor="paymentEasypaisa">
                <input type="radio" id="paymentEasypaisa" name="paymentMethod" value="EASYPAYSA" checked={paymentMethod === 'EASYPAYSA'} onChange={() => setPaymentMethod('EASYPAYSA')} className="w-5 h-5 text-yellow-500 focus:ring-yellow-500" />
                <span className="ml-3 text-white font-medium">Bank / Easypaisa</span>
              </label>
            </div>

            <button type="submit" disabled={isProcessing} className={`mt-8 w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all ${isProcessing ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400 text-gray-900 hover:scale-[1.01]'}`}>
              <ShoppingBag className="inline mr-2 mb-1" size={20} />
              {isProcessing ? 'Processing...' : `Place Order • Rs. ${cartTotal.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3 flex-shrink-0 order-1 lg:order-2">
          <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-3">Order Summary</h2>
            <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <span className="text-gray-300 w-2/3">{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                  <span className="text-white font-medium">Rs. {(Number(item.price) * (item.quantity || 1)).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-4">
              <span className="text-white text-lg font-bold">Total</span>
              <span className="text-yellow-500 text-2xl font-bold">Rs. {cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;