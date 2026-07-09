import React, { useMemo, useState } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input, message } from "antd";
import { Trash2 } from "lucide-react";
import axios from "../Services/axios";

const { TextArea } = Input;

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getUpcomingDays = (numDays = 7) => {
  const upcoming = [];
  const today = new Date();

  for (let i = 0; i < numDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    let label = '';

    if (i === 0) {
      label = 'Today';
    } else if (i === 1) {
      label = 'Tomorrow';
    } else {
      const dayName = daysOfWeek[date.getDay()];
      const dayNum = date.getDate();
      const monthName = monthNames[date.getMonth()];
      label = `${dayName}, ${dayNum} ${monthName}`;
    }

    const value = date.toISOString().split('T')[0];
    upcoming.push({ value, label });
  }
  return upcoming;
};

const SPRightSidebar: React.FC = () => {
  const { cart, decreaseQty, updateBookingDay, updateDescription, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const upcomingDays = useMemo(() => getUpcomingDays(7), []);

  const handleRequest = async () => {
    if (!isLoggedIn || !user) {
      message.error("Please login to proceed with booking");
      return;
    }

    if (!cart.every((item: any) => item.bookingDay)) {
      message.error("Please select booking days for all items");
      return;
    }

    setLoading(true);
    try {
      await Promise.all(cart.map((item: any) =>
        axios.post('/api/bookings/direct', {
          user: user?.id || user?._id,
          provider: item.id,
          service_details: `${item.title} - Description: ${item.description || "N/A"}`,
          final_price: item.price,
          completion_date: new Date(item.bookingDay).toISOString()
        })
      ));
      message.success("Booking requests sent successfully to the providers!");
      clearCart();
      navigate('/user-dashboard');
    } catch (error) {
      console.error("Booking error:", error);
      message.error("Failed to send booking requests");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full space-y-4 transition-colors duration-500">

      {/* 1. ACCOUNT SECTION */}
      {!isLoggedIn && (
        <div className="bg-white dark:bg-[#131720] rounded-[16px] border border-gray-100 dark:border-slate-800 shadow-sm p-4 md:p-5 space-y-3">
          <div>
            <h3 className="font-bold text-[16px] text-slate-800 dark:text-white">Account</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400">Login to continue your booking</p>
          </div>
          <button onClick={() => navigate("/")} className="w-full bg-[#4640ff] hover:bg-[#3135c7] text-white py-3 rounded-[12px] font-semibold transition shadow-md">
            Login / Sign up
          </button>
        </div>
      )}

      
      {/* POST A JOB CTA */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/post-job")}
          className="px-5 py-2.5 w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition-all active:scale-95"
        >
          Post a Job
        </button>
      </div>

      {/* 2. YOUR SERVICES */}
      <div className="bg-white dark:bg-[#131720] rounded-[16px] border border-gray-100 dark:border-slate-800 shadow-sm p-4 md:p-5">
        <h3 className="font-bold text-[16px] text-slate-800 dark:text-white mb-4">Your services</h3>

        {cart.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 dark:bg-slate-800/40 rounded-xl">
            <p className="text-[14px] text-gray-500 dark:text-gray-400">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 bg-gray-50 dark:bg-[#1a202c] p-3 rounded-xl border border-gray-100 dark:border-slate-800/60">
                <div className="flex justify-between items-center">
                  <div className="flex-1 pr-3">
                    <p className="text-[14px] font-bold leading-tight text-slate-800 dark:text-gray-100 mb-1">
                      {item.title}
                    </p>
                    <p className="text-[13px] text-[#4a90e2] font-semibold">₹{item.price}</p>
                  </div>

                  <div>
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      title="Remove provider from cart"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Individual Day Selector */}
                <div className="mt-2">
                  <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 mb-2">Select Day</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {upcomingDays.map((day) => {
                      const isSelected = item.bookingDay === day.value;
                      return (
                        <button
                          key={day.value}
                          onClick={() => updateBookingDay(item.id, day.value)}
                          className={`flex-shrink-0 px-3 py-1.5 rounded-[10px] text-[13px] font-medium transition-colors whitespace-nowrap border
                            ${isSelected
                              ? 'bg-[#4640ff] text-white border-[#4640ff]'
                              : 'bg-white dark:bg-[#1b2230] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-[#4640ff] dark:hover:border-[#4640ff]'}
                          `}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Individual Description Area */}
                <div className="mt-1">
                  <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 mt-1">Reason / Description</p>
                  <TextArea
                    value={item.description || ""}
                    onChange={(e) => updateDescription(item.id, e.target.value)}
                    placeholder="Describe your requirement (e.g., AC not cooling, kitchen deep cleaning, wiring issue)"
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    maxLength={250}
                    className="!rounded-[10px] !text-[13px] dark:!bg-[#1b2230] dark:!border-slate-700 dark:!text-gray-300 dark:placeholder:!text-gray-500 hover:!border-[#4640ff] focus:!border-[#4640ff]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* 5. REQUEST SUMMARY */}
      <div className="bg-white dark:bg-[#131720] rounded-[16px] border border-gray-100 dark:border-slate-800 shadow-sm p-4 md:p-5">
        <button
          onClick={handleRequest}
          disabled={cart.length === 0 || !cart.every((item: any) => item.bookingDay) || loading}
          className={`w-full py-3 md:py-3.5 rounded-[12px] font-bold text-[15px] transition shadow-md mb-4
            ${(cart.length > 0 && cart.every((item: any) => item.bookingDay))
              ? 'bg-[#4640ff] hover:bg-[#3135c7] text-white cursor-pointer'
              : 'bg-gray-200 dark:bg-[#1e2533] text-gray-400 dark:text-slate-500 cursor-not-allowed'
            }`}
        >
          {loading ? "Processing..." : (cart.length > 0 && !cart.every((item: any) => item.bookingDay) ? 'Select Booking Days' : 'Request Now')}
        </button>      </div>
    </div>
  );
};

export default SPRightSidebar;
