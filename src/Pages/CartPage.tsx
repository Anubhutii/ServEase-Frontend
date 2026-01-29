import { useState } from "react";
import { useCart } from "../Context/CartContext";

const CartPage = () => {
  const { cart, increaseQty, decreaseQty, total } = useCart();

  const [slot, setSlot] = useState("");

  const tax = 9;
  const finalAmount = total + tax;

  const hasItems = cart.length > 0;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">

        {/* ACCOUNT */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-lg">Account</h3>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue your booking
          </p>

          <button className="mt-4 w-full bg-linear-to-r from-[#1890ff] to-indigo-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
            Login / Sign up
          </button>
        </div>

        {/* CART ITEMS */}
        {/* CART ITEMS (Single Card) */}
<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
  <h4 className="font-semibold mb-4">Your services</h4>

  {cart.length === 0 ? (
    <p className="text-center text-gray-500">Your cart is empty 🛒</p>
  ) : (
    <div className="space-y-4">
      {cart.map((item, index) => (
        <div
          key={item.id}
          className={`flex justify-between items-center ${
            index !== cart.length - 1 ? "border-b pb-4" : ""
          }`}
        >
          {/* Left */}
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-500">₹{item.price}</p>
          </div>

          {/* Quantity Control */}
          <div className="flex items-center gap-4 border border-gray-200 rounded-xl px-4 py-2">
            <button
              onClick={() => decreaseQty(item.id)}
              className="text-lg"
            >
              −
            </button>

            <span className="font-medium">{item.quantity}</span>

            <button
              onClick={() => increaseQty(item.id)}
              className="text-lg"
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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-semibold">Choose time slot</h4>

          <select
            value={slot}
            disabled={!hasItems}
            onChange={(e) => setSlot(e.target.value)}
            className="w-full border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b0d3f4] disabled:bg-gray-100 disabled:text-gray-400"
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

          {!hasItems && (
            <p className="text-xs text-gray-400">
              Add items to enable slot selection
            </p>
          )}
        </div>

        {/* COUPONS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold">Coupons & Offers</h4>
          <p className="text-sm text-gray-500 mt-1">
            Login to view available offers
          </p>
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm h-fit space-y-5">

        <h3 className="text-lg font-semibold">Payment summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Item total</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between">
            <span>Taxes & Fee</span>
            <span>₹{tax}</span>
          </div>

          <hr />

          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>₹{finalAmount}</span>
          </div>
        </div>

        {slot && (
          <div className="flex justify-between text-sm">
            <span>Scheduled time</span>
            <span className="font-medium">{slot}</span>
          </div>
        )}

        <button
          disabled={!hasItems}
          className="w-full bg-linear-to-r from-[#1890ff] to-[#0162c3] text-white py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
        >
          Book Now
        </button>

        <p className="text-xs text-center text-gray-500">
          You won’t be charged until service is completed
        </p>
      </div>
    </div>
  );
};

export default CartPage;
