import React, { useState } from "react";
import MiddleImg from "../assets/SPimg.png";
import { HiMenu } from "react-icons/hi";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import packages from "../Data/providers.json";
import { useCart } from "../Context/CartContext";

interface Props {
  onOpenFilters?: () => void;
}

const services = [
  { title: "AC Repair & Servicing", rating: "4.7", bookings: "1,200+", price: "₹299" },
  { title: "Electrician Services", rating: "4.6", bookings: "980+", price: "₹199" },
  { title: "Home Cleaning", rating: "4.8", bookings: "2,300+", price: "₹399" },
  { title: "Plumbing Services", rating: "4.5", bookings: "870+", price: "₹149" },
  { title: "Carpenter Services", rating: "4.4", bookings: "640+", price: "₹249" },
];

const PackageCard = ({ data }: any) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(data);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    // 👇 yeh pura card ab relative hai
    <div className="relative bg-white border border-gray-100 p-5 rounded-2xl hover:shadow-md transition">

      {/* 📱 Mobile me top-right corner pe % OFF */}
      <div className="absolute top-3 right-3 md:hidden bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow">
        {data.discount} OFF
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6">

        {/* LEFT */}
        <div className="flex-1 space-y-3 flex flex-col">
          <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
            {data.tag}
          </span>

          <h2 className="text-lg md:text-2xl font-bold">{data.title}</h2>

          <p className="text-sm text-gray-500">
            ⭐ {data.rating} ({data.reviews} reviews)
          </p>

          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">₹{data.price}</span>
            <span className="line-through text-gray-400">₹{data.originalPrice}</span>
            <span className="text-gray-500">• {data.duration}</span>
          </div>

          <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
            {data.services.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          {/* 💻 Desktop pe Add button LEFT me */}
          <div className="hidden md:block pt-2">
            <button
              onClick={handleAdd}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  added
                    ? "bg-green-600 text-white scale-95"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }`}
            >
              {added ? "Added ✓" : "Add"}
            </button>
          </div>
        </div>

        {/* RIGHT BOX */}
        <div className="w-full md:w-36 h-fit self-start bg-linear-to-br from-green-50 to-white border border-green-100 rounded-xl flex flex-col items-center gap-2 p-3">

          {/* 💻 Desktop pe discount yahin dikhe */}
          <div className="hidden md:block text-green-600 font-bold text-md text-center">
            {data.discount}
            <div className="text-xs text-gray-500">OFF</div>
          </div>

          {/* 📱 Mobile pe Add button yahin dikhe */}
          <button
            onClick={handleAdd}
            className={`md:hidden w-full px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300
              ${
                added
                  ? "bg-green-600 text-white scale-95"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              }`}
          >
            {added ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};



const SPMainContent: React.FC<Props> = ({ onOpenFilters }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openCartPreview, setOpenCartPreview] = useState(false);

  const { cart, total } = useCart();
  const navigate = useNavigate();

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar px-1">


      {/* HERO */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <img src={MiddleImg} alt="Service" className="w-full h-52 sm:h-64 md:h-80 object-cover" />
      </div>

      {/* FILTER + CART ICON (MOBILE) */}
      <div className="lg:hidden flex justify-end gap-3 items-center">

        <button
          onClick={() => setOpenCartPreview(true)}
          className="relative p-2 bg-white border rounded-lg shadow"
        >
          <ShoppingCart size={20} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow"
        >
          <HiMenu size={18} />
          Filters
        </button>
      </div>

      {/* HEADER */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h1 className="text-xl md:text-2xl font-semibold">{services[currentIndex].title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          ⭐ {services[currentIndex].rating} · {services[currentIndex].bookings} bookings
        </p>
        <p className="text-lg font-semibold mt-1">
          Starting {services[currentIndex].price}
        </p>
      </div>

      {/* PACKAGES */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-lg md:text-xl font-bold mb-3">Super saver packages</h2>

        <div className="space-y-4">
          {packages.map((item) => (
            <PackageCard key={item.id} data={item} />
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          No payment required until service completion
        </p>
      </div>

      {/* CART POPUP */}
      <div
        className={`fixed inset-0 z-50 transition ${
          openCartPreview ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {openCartPreview && (
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenCartPreview(false)}
          />
        )}

        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[60vh] overflow-y-auto transition-transform duration-300 ${
            openCartPreview ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Your Cart</h3>
            <button onClick={() => setOpenCartPreview(false)}>✕</button>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Cart is empty</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-2 text-sm">
                  <span>{item.title}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <button
              onClick={() => navigate("/cart")}
              className="w-full mt-5 bg-purple-600 text-white py-3 rounded-xl font-semibold"
            >
              View Cart • ₹{total}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SPMainContent;
