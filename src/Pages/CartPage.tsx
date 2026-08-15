import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { message } from "antd";
import {
  ShoppingBag,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Minus,
  Lock,
  Sun,
  Sunset,
  Moon,
  BadgeCheck,
} from "lucide-react";
import axios from "../Services/axios";

/* ================= TYPES & CONSTANTS ================= */

interface SlotItem {
  id: string;
  time: string;
  period: "morning" | "afternoon" | "evening";
}

const TIME_SLOTS: SlotItem[] = [
  { id: "slot-1", time: "09:00 AM – 11:00 AM", period: "morning" },
  { id: "slot-2", time: "11:00 AM – 01:00 PM", period: "morning" },
  { id: "slot-3", time: "02:00 PM – 04:00 PM", period: "afternoon" },
  { id: "slot-4", time: "04:00 PM – 06:00 PM", period: "afternoon" },
  { id: "slot-5", time: "06:00 PM – 08:00 PM", period: "evening" },
];

const PROMO_CODES: Record<string, { discount: number; type: "flat" | "percent"; title: string }> = {
  FIRST50: { discount: 50, type: "flat", title: "FIRST50 (-₹50)" },
  SERVEASE10: { discount: 10, type: "percent", title: "SERVEASE10 (-10%)" },
  SUPERCARE: { discount: 75, type: "flat", title: "SUPERCARE (-₹75)" },
};

const CartPage: React.FC = () => {
  const { cart, increaseQty, decreaseQty, total, clearCart, updateDescription } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Scheduling State
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("slot-1");
  const [loading, setLoading] = useState<boolean>(false);

  // Customer Contact State
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [address, setAddress] = useState<string>(user?.address || "");
  const [addressTag, setAddressTag] = useState<"Home" | "Work" | "Other">("Home");

  // Coupon State
  const [couponInput, setCouponInput] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Auto-fill from localStorage if available
  useEffect(() => {
    if (!address) {
      const storedLoc = localStorage.getItem("userLocation");
      if (storedLoc) {
        try {
          const loc = JSON.parse(storedLoc);
          if (loc.address) setAddress(loc.address);
        } catch (e) {}
      }
    }
    if (!phone && user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  // Generate 6 upcoming days with compact metadata
  const daysOptions = React.useMemo(() => {
    const list = [];
    const today = new Date();
    const daysArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isToday = i === 0;
      const isTomorrow = i === 1;
      const label = isToday ? "Today" : isTomorrow ? "Tmrw" : daysArr[d.getDay()];
      const dateNum = d.getDate();
      const monthStr = monthsArr[d.getMonth()];
      const iso = d.toISOString().split("T")[0];
      list.push({ label, dateNum, monthStr, iso });
    }
    return list;
  }, []);

  // Coupon Logic
  const applyCoupon = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (PROMO_CODES[upper]) {
      const promo = PROMO_CODES[upper];
      let discount = 0;
      if (promo.type === "flat") {
        discount = promo.discount;
      } else {
        discount = Math.round((total * promo.discount) / 100);
      }
      setDiscountAmount(discount);
      setAppliedCoupon(upper);
      setCouponInput(upper);
      message.success(`Applied ${upper}! Saved ₹${discount}`);
    } else {
      message.error("Invalid promo code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput("");
    message.info("Coupon removed");
  };

  const governmentTaxes = 9;
  const grandTotal = Math.max(0, total + governmentTaxes - discountAmount);
  const hasItems = cart.length > 0;

  // Booking Execution
  const handleConfirmBooking = async () => {
    if (!isLoggedIn || !user) {
      message.error("Please login to proceed with your booking");
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      message.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      message.error("Please enter your delivery/service address");
      return;
    }

    const selectedDayObj = daysOptions[selectedDayIdx];
    const selectedSlotObj = TIME_SLOTS.find((s) => s.id === selectedSlotId);
    const completionDate = new Date(selectedDayObj.iso).toISOString();

    setLoading(true);
    try {
      await Promise.all(
        cart.map((item) =>
          axios.post("/api/bookings/direct", {
            user: user?.id || user?._id,
            provider: item.id,
            service_details: `${item.description || "General maintenance inspection."} [${selectedDayObj.label}, ${selectedSlotObj?.time || "Morning"}]`,
            final_price: item.price * item.quantity + (governmentTaxes - discountAmount) / cart.length,
            completion_date: completionDate,
            phone,
            address: `[${addressTag}] ${address}`,
          })
        )
      );

      message.success("Booking placed successfully! Specialists notified.");
      clearCart();
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Booking error:", error);
      message.error("Failed to place booking. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300 py-4 sm:py-6 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* COMPACT TOP HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Link
              to="/service"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs transition"
              title="Back"
            >
              <ArrowLeft size={15} />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 leading-tight">
                <span>Service Checkout</span>
                {hasItems && (
                  <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                    {cart.length} {cart.length === 1 ? "Item" : "Items"}
                  </span>
                )}
              </h1>
            </div>
          </div>

          <Link
            to="/service"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>+ Add More</span>
          </Link>
        </div>

        {/* EMPTY STATE */}
        {!hasItems ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 mx-auto flex items-center justify-center">
              <ShoppingBag size={26} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Your cart is empty
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore verified home specialists for plumbing, repairs & cleaning.
              </p>
            </div>
            <button
              onClick={() => navigate("/service")}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition active:scale-95 inline-flex items-center gap-1.5"
            >
              <span>Browse Services</span>
              <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          /* COMPACT 2-COLUMN GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            
            {/* LEFT CONTAINER: SERVICES, DATE & COUPONS (7 COLS) */}
            <div className="lg:col-span-7 space-y-3.5">
              
              {/* 1. SELECTED SERVICES (COMPACT LIST) */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Selected Services ({cart.length})
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-rose-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                            <img
                              src={
                                item.image
                                  ? `http://localhost:5000/api/provider/file/${item.image}`
                                  : "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop"
                              }
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200&auto=format&fit=crop";
                              }}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {item.title}
                              </h3>
                              <BadgeCheck size={13} className="text-blue-500 flex-shrink-0" />
                            </div>
                            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                              ₹{item.price}{" "}
                              <span className="text-[10px] font-normal text-slate-400">/visit fee</span>
                            </span>
                          </div>
                        </div>

                        {/* QUANTITY CONTROLS */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
                            <button
                              onClick={() => decreaseQty(item.id)}
                              className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-rose-500 transition"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-4 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQty(item.id)}
                              className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-blue-600 transition"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* INLINE NOTE */}
                      <input
                        type="text"
                        value={item.description || ""}
                        onChange={(e) => updateDescription(item.id, e.target.value)}
                        placeholder="Add issue note (e.g., Switch spark, AC leaking)..."
                        className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. COMPACT SCHEDULING (DATE & TIME) */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs space-y-3">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                  <Calendar size={14} className="text-blue-500" />
                  <span>Choose Service Schedule</span>
                </div>

                {/* DATE PILLS */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    1. Select Date
                  </span>
                  <div className="grid grid-cols-6 gap-1">
                    {daysOptions.map((day, idx) => {
                      const isSelected = selectedDayIdx === idx;
                      return (
                        <button
                          key={day.iso}
                          type="button"
                          onClick={() => setSelectedDayIdx(idx)}
                          className={`p-1.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                          }`}
                        >
                          <span className={`text-[9px] uppercase leading-none ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                            {day.label}
                          </span>
                          <span className="text-xs font-black mt-0.5">{day.dateNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TIME WINDOW BUTTONS */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock size={11} />
                    <span>2. Arrival Window</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedSlotId === slot.id;
                      const SlotIcon = slot.period === "morning" ? Sun : slot.period === "afternoon" ? Sunset : Moon;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-500 font-bold"
                              : "bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                          }`}
                        >
                          <SlotIcon size={12} className={isSelected ? "text-blue-600" : "text-slate-400"} />
                          <span className="text-[11px] font-semibold truncate">{slot.time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. COMPACT COUPONS */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Tag size={13} className="text-emerald-500" />
                    <span>Coupons & Offers</span>
                  </div>
                  {appliedCoupon && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                      {appliedCoupon} Active (-₹{discountAmount})
                    </span>
                  )}
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Promo code (e.g. FIRST50)"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-200"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => applyCoupon(couponInput)}
                      className="px-3.5 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold rounded-xl"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {/* PRESET CHIPS */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {Object.entries(PROMO_CODES).map(([code, details]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => applyCoupon(code)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition ${
                        appliedCoupon === code
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-500"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                      }`}
                    >
                      {details.title}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT CONTAINER: DESTINATION & INVOICE (5 COLS - STICKY) */}
            <div className="lg:col-span-5 space-y-3.5 sticky top-20">
              
              {/* ADDRESS CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-500" />
                    <span>Service Address & Contact</span>
                  </div>

                  <div className="flex gap-1">
                    {(["Home", "Work", "Other"] as const).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setAddressTag(tag)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          addressTag === tag
                            ? "bg-blue-600 text-white border-blue-600 font-bold"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Phone size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full pl-7 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Flat No, Landmark & Area..."
                    rows={2}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* PAYMENT SUMMARY RECEIPT */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                  <span>Payment Invoice</span>
                  <span className="text-[10px] text-emerald-500">Pay After Visit</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Base Inspection</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{total}</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Platform & Escrow</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Taxes & Fee</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{governmentTaxes}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Savings ({appliedCoupon})</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Payable</span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                {/* PRIMARY CONFIRM BUTTON */}
                <button
                  type="button"
                  disabled={!hasItems || loading}
                  onClick={handleConfirmBooking}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow flex items-center justify-center gap-1.5 ${
                    hasItems && !loading
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95 cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <span>Placing Booking Request...</span>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>Confirm & Book Visit • ₹{grandTotal}</span>
                    </>
                  )}
                </button>

                {/* 1-LINE TRUST STRIP */}
                <div className="pt-1 flex items-center justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={11} className="text-emerald-500" />
                    <span>Verified Pros</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-blue-500" />
                    <span>Free Rescheduling</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-500" />
                    <span>30-Day Guarantee</span>
                  </span>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;
