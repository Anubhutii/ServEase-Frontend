import React, { useState, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Modal } from "antd";

import { useCart } from "../Context/CartContext";

interface Props {
  onOpenFilters?: () => void;
  filters: { category: string; service: string; search: string };
}

const services = [
  { title: "AC Repair & Servicing", rating: "4.7", bookings: "1,200+", price: "₹299" },
  { title: "Electrician Services", rating: "4.6", bookings: "980+", price: "₹199" },
  { title: "Home Cleaning", rating: "4.8", bookings: "2,300+", price: "₹399" },
  { title: "Plumbing Services", rating: "4.5", bookings: "870+", price: "₹149" },
  { title: "Carpenter Services", rating: "4.4", bookings: "640+", price: "₹249" },
];

import { IoLocationOutline, IoTimeOutline, IoBookmarkOutline, IoBriefcaseOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";

const ProviderCard = ({ data }: any) => {
  const { cart, addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAlreadyInCart = cart.some((item: any) => item.id === data._id);

  const handleAdd = () => {
    const cartItem = {
      id: data._id,
      title: `${data.firstName} ${data.lastName} - ${data.category}`,
      price: data.fee,
      quantity: 1,
      image: "",
    };
    addToCart(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  const profileImage = data.profilePhoto
    ? `http://localhost:5000/api/provider/file/${data.profilePhoto}`
    : "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-4 rounded-[24px] hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 shadow flex flex-col w-full h-full relative">

      {/* Top Image Box */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] rounded-[16px] overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
        <img
          src={profileImage}
          alt="Provider Work"
          className="w-full h-full object-cover dark:brightness-90"
        />
        {/* Bookmark Icon */}
        <button className="absolute top-4 right-4 text-white hover:text-orange-400 transition-colors">
          <IoBookmarkOutline size={26} />
        </button>
      </div>

      {/* Info Content Container to fill space */}
      <div className="flex flex-col flex-1 px-1">

        {/* Title & Rating */}
        <div className="flex justify-between items-start mb-1 gap-2">
          <h2 className="text-[20px] font-semibold text-slate-800 dark:text-white leading-tight">
            {data.firstName} {data.lastName} <span className="text-gray-500 dark:text-gray-400 font-normal text-[16px]">({data.category})</span>
          </h2>
          <div className="flex items-center gap-1 text-[14px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 shadow-sm px-2 py-0.5 rounded-full whitespace-nowrap border border-gray-100 dark:border-slate-700">
            <span className="text-yellow-500">⭐</span> {data.rating || "0.0"}
          </div>
        </div>

        {/* Services List */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">Services:</h4>
          <div className="flex flex-wrap gap-2">
            {data.services && data.services.length > 0 ? (
              <>
                {data.services.slice(0, 3).map((srv: string, i: number) => (
                  <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg text-[13px] font-bold capitalize">
                    {srv.replace(/_/g, " ")}
                  </span>
                ))}
                {data.services.length > 3 && (
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg text-[13px] font-bold">
                    +{data.services.length - 3}
                  </span>
                )}
              </>
            ) : (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg text-[13px] font-bold capitalize">
                General Maintenance
              </span>
            )}
          </div>
        </div>

        {/* 3 Icon Rows */}
        <div className="space-y-3 mb-6 flex-1">
          {/* Experience */}
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <IoBriefcaseOutline size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-[15px] font-medium">{data.experience || 0} Years Experience</span>
          </div>
          {/* Languages */}
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <IoChatbubbleEllipsesOutline size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-[15px] font-medium">
              {data.languages && data.languages.length > 0 ? data.languages.join(", ") : "English, Hindi"}
            </span>
          </div>
          {/* Time */}
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <IoTimeOutline size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-[15px] font-medium">10:00 AM – 8:00 PM</span>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex flex-col mt-auto pt-4 relative gap-3 border-t dark:border-slate-800">

          <div className="flex flex-col">
            <span className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mb-1">Start from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-bold text-slate-800 dark:text-white">{data.fee}</span>
              <span className="text-[15px] font-bold text-slate-800 dark:text-white">₹<span className="text-gray-500 dark:text-gray-400 font-normal text-[13px]">/Visit</span></span>
            </div>
          </div>

          <div className="flex gap-2 md:gap-3 w-full mt-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 py-2.5 rounded-[12px] text-[14px] lg:text-[15px] font-bold transition-all duration-300 border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
            >
              View Details
            </button>
            <button
              onClick={handleAdd}
              disabled={isAlreadyInCart}
              className={`flex-1 py-2.5 rounded-[12px] text-[14px] lg:text-[15px] font-bold transition-all duration-300 shadow hover:shadow-lg
                ${isAlreadyInCart || added
                  ? "bg-emerald-500 text-white cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-600 text-white active:scale-95"
                }`}
            >
              {isAlreadyInCart ? "Added ✓" : added ? "Added ✓" : "Booking Now"}
            </button>
          </div>
        </div>

      </div>

      {/* Details Modal */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={600}
        styles={{ body: { padding: 0 } }}
        className="rounded-2xl overflow-hidden custom-details-modal"
      >
        <style>{`
          .custom-details-modal .ant-modal-close {
            background-color: #ffffff !important;
            color: #64748b !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1) !important;
            border-radius: 50% !important;
            transition: all 0.3s ease !important;
            right: 28px !important;
            top: 20px !important;
            z-index: 100 !important;
          }
          .dark .custom-details-modal .ant-modal-close {
             background-color: #1e293b !important;
             color: #94a3b8 !important;
             box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5) !important;
             border: 1px solid #334155 !important;
          }
          .custom-details-modal .ant-modal-close:hover {
            background-color: #3b82f6 !important;
            color: #ffffff !important;
          }
          /* Ensure scrollbar has space and doesn't get covered */
          .custom-details-modal .custom-scrollbar {
             padding-right: 12px !important;
          }
        `}</style>
        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="flex gap-4 items-start mb-6">
            <img
              src={profileImage}
              alt="Provider Work"
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shadow-sm dark:brightness-90"
            />
            <div>
              <h2 className="text-[24px] font-bold text-slate-800 dark:text-white leading-tight">
                {data.firstName} {data.lastName}
              </h2>
              <div className="text-[16px] text-gray-500 dark:text-gray-400 font-medium capitalize mt-1 mb-2">
                {data.category}
              </div>
              <div className="inline-flex items-center gap-1 text-[14px] font-semibold text-slate-700 dark:text-slate-200 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/30">
                <span className="text-yellow-500">⭐</span> {data.rating || "0.0"} <span className="text-gray-500 dark:text-gray-400 text-[12px] ml-1">({data.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Services */}
            <div>
              <h3 className="text-[17px] font-bold text-slate-800 dark:text-white mb-2">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {data.services && data.services.length > 0 ? (
                  data.services.map((srv: string, i: number) => (
                    <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg text-[14px] font-semibold capitalize">
                      {srv.replace(/_/g, " ")}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 italic text-[14px]">General Maintenance</span>
                )}
              </div>
            </div>

            {/* Bio / Description */}
            <div>
              <h3 className="text-[17px] font-bold text-slate-800 dark:text-white mb-2">About Provider</h3>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                {data.bio || "This professional is dedicated to providing high-quality service and making sure your exact needs are met. Experienced and verified."}
              </p>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <div>
                <span className="block text-[13px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Visiting Fee</span>
                <span className="text-[18px] font-bold text-slate-800 dark:text-white">₹{data.fee}</span>
              </div>
              <div>
                <span className="block text-[13px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Availability</span>
                <span className="text-[15px] font-bold text-slate-800 dark:text-white">10:00 AM – 8:00 PM</span>
              </div>
              <div className="col-span-2">
                <span className="block text-[13px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Service Area Range</span>
                <div className="flex items-center gap-2">
                  <IoLocationOutline size={18} className="text-cyan-600 dark:text-cyan-400" />
                  <span className="text-[15px] font-bold text-slate-800 dark:text-slate-200">
                    Available within 5-10 km of {data.address ? (data.address.split(',').length > 1 ? data.address.split(',')[data.address.split(',').length - 2].trim() : data.address) : "Local Area"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <button
              onClick={() => {
                if (!isAlreadyInCart) {
                  handleAdd();
                }
                setIsModalOpen(false); // Close modal when returning
              }}
              disabled={isAlreadyInCart}
              className={`w-full py-4 rounded-xl text-[16px] font-bold transition-all shadow-md mt-4
                ${isAlreadyInCart || added
                  ? "bg-emerald-500 text-white cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-600 text-white"
                }`}
            >
              {isAlreadyInCart ? "Added to Cart ✓" : added ? "Added to Cart ✓" : "Book This Provider"}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};


const SPMainContent: React.FC<Props> = ({ onOpenFilters, filters }) => {
  const [openCartPreview, setOpenCartPreview] = useState(false);

  const { cart, total } = useCart();
  const navigate = useNavigate();

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // React Query fetching providers dynamically
  const { data: searchData, isLoading, isError } = useQuery({
    queryKey: ['providers-search', filters],
    queryFn: async () => {
      // Extract User Location implicitly
      const params: Record<string, string> = {};
      const storedLoc = localStorage.getItem("userLocation");

      if (storedLoc) {
        try {
          const loc = JSON.parse(storedLoc);
          if (loc.lat && loc.lon) {
            params.lat = loc.lat;
            params.lng = loc.lon;
            params.radius = "20"; // Limit search to 20km locally
          }
        } catch (e) { }
      }

      if (filters.category) params.category = filters.category;
      if (filters.service && !filters.search) params.search = filters.service;
      if (filters.search) params.search = filters.search;

      const res = await axios.get("http://localhost:5000/api/provider/search", { params });
      return res.data;
    }
  });

  const providersList = searchData?.providers || [];

  return (
    <div className="space-y-5 px-1 pb-10 transition-colors duration-500">

      {/* FILTER + CART ICON (MOBILE) */}
      <div className="lg:hidden flex justify-end gap-3 items-center">
        <button
          onClick={() => setOpenCartPreview(true)}
          className="relative p-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow dark:text-white"
        >
          <ShoppingCart size={20} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center">
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

      {/* PACKAGES / PROVIDERS LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-800">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-800 dark:text-white">Available Professionals Near You</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-h-[70vh] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">Loading verified professionals...</div>
          ) : isError ? (
            <div className="py-10 text-center text-red-500">Failed to load professionals.</div>
          ) : providersList.length === 0 ? (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">No professionals found in your area yet.</div>
          ) : (
            providersList.map((provider: any) => (
              <ProviderCard key={provider._id} data={provider} />
            ))
          )}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
          Secure platform • Verified Backgrounds • Safe Payments
        </p>
      </div>

      {/* CART POPUP */}
      <div
        className={`fixed inset-0 z-50 transition ${openCartPreview ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {openCartPreview && (
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenCartPreview(false)}
          />
        )}

        <div
          className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto transition-transform duration-300 ${openCartPreview ? "translate-y-0" : "translate-y-full"
            }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Your Bookings</h3>
            <button onClick={() => setOpenCartPreview(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">✕</button>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">Your cart is empty.</p>
          ) : (
            <div className="space-y-4 pt-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b dark:border-slate-800 pb-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Base Fee: ₹{item.price}</p>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">x{item.quantity}</span>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <button
              onClick={() => navigate("/cart")}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 transition text-white py-3.5 rounded-xl font-semibold shadow-md"
            >
              Continue to Booking • ₹{total}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SPMainContent;
