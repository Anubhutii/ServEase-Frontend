import { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "../Services/axios";

const CartPage = () => {
  const { cart, increaseQty, decreaseQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [slot, setSlot] = useState("");
  const [loading, setLoading] = useState(false);

  const tax = 9;
  const finalAmount = total + tax;

  const hasItems = cart.length > 0;

  const handleBooking = async () => {
    if (!user) {
      message.error("Please login to proceed with booking");
      // Could also redirect to login here
      return;
    }
    if (!slot) {
      message.error("Please select a time slot");
      return;
    }

    setLoading(true);
    try {
      // The backend supports one provider per direct booking. 
      // Loop over cart items and create a booking for each.
      await Promise.all(cart.map(item =>
        axios.post('/api/bookings/direct', {
          user: user?.id || user?._id,
          provider: item.id,
          service_details: `${item.title} (Qty: ${item.quantity}, Slot: ${slot})`,
          final_price: (item.price * item.quantity) + (tax / cart.length), // distribute tax
          completion_date: new Date().toISOString() // Assuming 'today' for simplification
        })
      ));
      message.success("Booking request sent successfully to the providers!");
      clearCart();
      navigate('/user-dashboard');
    } catch (error) {
      console.error("Booking error:", error);
      message.error("Failed to create booking request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 transition-colors duration-500">

      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">

        {/* ACCOUNT */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors font-sans">
          <h3 className="font-bold text-xl text-slate-800 dark:text-white">Account</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Login to continue your booking
          </p>

          <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-blue-500/20 active:scale-[0.98]">
            Login / Sign up
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
          <h4 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Your services</h4>

          {cart.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-5xl block mb-4">🛒</span>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-center ${index !== cart.length - 1 ? "border-b dark:border-slate-800 pb-5" : ""
                    }`}
                >
                  {/* Left */}
                  <div className="flex-1 pr-4">
                    <p className="font-bold text-slate-800 dark:text-gray-100 text-base">{item.title}</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">₹{item.price}</p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-4 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 bg-gray-50 dark:bg-slate-800 shadow-sm">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="text-xl font-bold text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      −
                    </button>

                    <span className="font-bold text-slate-800 dark:text-white min-w-[1.5rem] text-center">{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="text-xl font-bold text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* SLOT SELECTION */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
          <h4 className="font-bold text-lg text-slate-800 dark:text-white">Choose time slot</h4>

          <div className="relative">
            <select
              value={slot}
              disabled={!hasItems}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full appearance-none border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:bg-gray-100 dark:disabled:bg-slate-800/50 disabled:text-gray-400 transition-all font-medium cursor-pointer"
            >
              <option value="">Select a time</option>
              <option>9:00 AM - 10:00 AM</option>
              <option>10:00 AM - 11:00 AM</option>
              <option>11:00 AM - 12:00 PM</option>
              <option>12:00 PM - 1:00 PM</option>
              <option>1:00 PM - 2:00 PM</option>
              <option>2:00 PM - 3:00 PM</option>
              <option>3:00 PM - 4:00 PM</option>
              <option>4:00 PM - 5:00 PM</option>
              <option>5:00 PM - 6:00 PM</option>
              <option>6:00 PM - 7:00 PM</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>

          {!hasItems && (
            <p className="text-xs text-amber-600 dark:text-amber-500 font-bold flex items-center gap-1">
              <span className="text-sm">⚠️</span> Add items to enable slot selection
            </p>
          )}
        </div>

        {/* COUPONS */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors group cursor-pointer hover:border-blue-300 dark:hover:border-blue-800/50">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">Coupons & Offers</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Login to view available offers
              </p>
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-8 shadow-xl h-fit space-y-6 transition-colors sticky top-24">

        <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b dark:border-slate-800 pb-4">Payment summary</h3>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span className="font-medium">Item total</span>
            <span className="font-bold text-slate-800 dark:text-gray-100">₹{total}</span>
          </div>

          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span className="font-medium">Taxes & Fee</span>
            <span className="font-bold text-slate-800 dark:text-gray-100">₹{tax}</span>
          </div>

          <div className="pt-2">
            <div className="flex justify-between font-black text-xl text-slate-900 dark:text-white">
              <span>Total</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>
        </div>

        {slot && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-500 dark:text-blue-400">Scheduled Time</span>
              <span className="font-bold text-blue-800 dark:text-blue-200">{slot}</span>
            </div>
            <span className="text-blue-400">⏰</span>
          </div>
        )}

        <button
          disabled={!hasItems || loading}
          onClick={handleBooking}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-black text-lg hover:opacity-95 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-40 disabled:shadow-none active:scale-95 flex justify-center items-center gap-2"
        >
          {loading ? "Processing..." : "Book Now"}
        </button>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg flex items-center justify-center gap-2">
          <span className="text-emerald-500">🛡️</span>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold italic">
            Safe payments • Quality Assured
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
