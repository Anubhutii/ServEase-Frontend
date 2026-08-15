import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

type ServiceItem = {
  name: string;
  img: string;
  isNew?: boolean;
};

type ServiceCategory = {
  id: string;
  title: string;
  items: ServiceItem[];
};

/* ================= IMAGES ================= */

// HOME APPLIANCES
import AC from "../assets/ViewAll/AC.png";
import WM from "../assets/ViewAll/washing-machine.png";
import TV from "../assets/ViewAll/TV.png";
import Laptop from "../assets/ViewAll/Laptop.png";
import WP from "../assets/ViewAll/Ro.png";

// CLEANING
import Bathroom from "../assets/ViewAll/Bathroom.jpg";
import Kitchen from "../assets/ViewAll/kitchen.jpg";
import Appliance from "../assets/ViewAll/Appliance.png";
import LivingRoom from "../assets/ViewAll/living-room.jpg";
import FullHome from "../assets/ViewAll/Home.jpg";

// REPAIR
import electrician from "../assets/ViewAll/electrician.jpg";
import plumber from "../assets/ViewAll/plumber.jpg";
import carpenter from "../assets/ViewAll/carpenter.jpg";
import switches from "../assets/ViewAll/switch.jpg";
import fan from "../assets/ViewAll/fan.jpg";
import tap from "../assets/ViewAll/tap.jpg";
import washbasin from "../assets/ViewAll/washwasin.jpg";
import door from "../assets/ViewAll/door-hing.jpg";
import furniture from "../assets/ViewAll/furniture.jpg";

// WOMEN SALON
import facial from "../assets/ViewAll/facial.jpg";
import waxing from "../assets/ViewAll/Waxing.jpg";
import mani from "../assets/ViewAll/mani-pedi.jpg";
import eyebrows from "../assets/ViewAll/eyebrows.jpg";
import nailart from "../assets/ViewAll/nailart.jpg";

// MEN SALON
import haircut from "../assets/ViewAll/haircut.jpg";
import beard from "../assets/ViewAll/beard.jpg";
import massage from "../assets/ViewAll/head-massage.jpg";

/* ================= DATA ================= */

const homeAppliances: ServiceItem[] = [
  { name: "AC", img: AC },
  { name: "Washing Machine", img: WM },
  { name: "Television", img: TV },
  { name: "Laptop", img: Laptop },
  { name: "Water Purifier Repair", img: WP },
];

const cleaningServices: ServiceItem[] = [
  { name: "Bathroom Cleaning", img: Bathroom },
  { name: "Kitchen Cleaning", img: Kitchen },
  { name: "Home Appliance", img: Appliance },
  { name: "Living & Bedroom Cleaning", img: LivingRoom, isNew: true },
  { name: "Full Home / Move-in Cleaning", img: FullHome },
];

const electricianPlumberCarpenter: ServiceItem[] = [
  { name: "Electrician", img: electrician },
  { name: "Plumber", img: plumber },
  { name: "Carpenter", img: carpenter },
  { name: "Switch & Socket Repair", img: switches },
  { name: "Fan Installation & Repair", img: fan },
  { name: "Tap & Leakage Repair", img: tap },
  { name: "Wash Basin Installation", img: washbasin },
  { name: "Door & Hinge Repair", img: door },
  { name: "Furniture Assembly", img: furniture, isNew: true },
];

const womenSalonServices: ServiceItem[] = [
  { name: "Waxing", img: waxing },
  { name: "Facial & Cleanup", img: facial },
  { name: "Threading & Eyebrows", img: eyebrows },
  { name: "Manicure & Pedicure", img: mani },
  { name: "Nail Art", img: nailart },
];

const menSalonServices: ServiceItem[] = [
  { name: "Haircut", img: haircut },
  { name: "Beard Trim & Styling", img: beard },
  { name: "Head Massage", img: massage, isNew: true },
];

/* ================= CATEGORIES ================= */

const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: "appliances", title: "Home Appliances", items: homeAppliances },
  { id: "cleaning", title: "Cleaning", items: cleaningServices },
  {
    id: "repairs",
    title: "Electrician, Plumber & Carpenter",
    items: electricianPlumberCarpenter,
  },
  {
    id: "women-salon",
    title: "Women's Salon at Home",
    items: womenSalonServices,
  },
  {
    id: "men-salon",
    title: "Men's Salon at Home",
    items: menSalonServices,
  },
];

/* ================= COMPONENT ================= */

const ViewAllServices: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(
    SERVICE_CATEGORIES[0]
  );
  const navigate = useNavigate();

  return (
    <div className="px-4 py-4 max-w-7xl mx-auto transition-colors duration-500">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 text-slate-800 dark:text-white">
        All Services
      </h1>

      {/* ================= MOBILE CATEGORY TABS ================= */}
      {/* ================= MOBILE CATEGORY SCROLLER ================= */}
      <div className="md:hidden relative mb-4">
        {/* LEFT FADE */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />

        {/* RIGHT FADE */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />

        <div
          className="
      flex gap-3 overflow-x-auto
      px-1 pb-2
      scroll-smooth
      snap-x snap-mandatory
      no-scrollbar
    "
        >
          {SERVICE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category)}
              className={`
          snap-start
          whitespace-nowrap
          px-5 py-2.5
          rounded-full
          text-sm font-medium
          transition-all duration-300
          ${activeCategory.id === category.id
                  ? "bg-blue-500 dark:bg-blue-600 text-white shadow-md scale-[1.02]"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700"
                }
        `}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>


      <div className="flex flex-col md:flex-row gap-8">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="w-60 shrink-0 sticky top-24 hidden md:block">
          {SERVICE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category)}
              className={`w-full text-left px-4 py-2.5 rounded-lg mb-1 transition-all duration-200
                ${activeCategory.id === category.id
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold border-l-4 border-blue-600 shadow-sm"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-400"
                }`}
            >
              {category.title}
            </button>
          ))}
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold mb-1 text-slate-800 dark:text-white">
            {activeCategory.title}
          </h2>

          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
            Verified professionals • Transparent pricing • Same-day service
          </p>

          {/* GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {activeCategory.items.map((item) => {
              const serviceSlug = item.name
                .toLowerCase()
                .replace(/&/g, "and")
                .replace(/\s+/g, "-");

              return (
                <div
                  key={item.name}
                  onClick={() => navigate(`/service/${serviceSlug}`)}
                  className="
                    relative cursor-pointer group
                    rounded-2xl
                    border border-gray-200 dark:border-slate-800
                    p-3 md:p-4
                    bg-white dark:bg-slate-900/80
                    hover:bg-gray-50 dark:hover:bg-slate-800
                    hover:shadow-xl dark:hover:shadow-slate-900/50 hover:-translate-y-1
                    hover:border-blue-300 dark:hover:border-blue-500/50
                    transition-all duration-300
                  "
                >
                  {item.isNew && (
                    <span className="absolute top-2 right-2 text-[10px] bg-pink-600 text-white px-2 py-0.5 rounded-full font-bold z-10">
                      NEW
                    </span>
                  )}

                  <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-28 w-full object-cover dark:brightness-90
                          transition-transform duration-300
                          group-hover:scale-[1.05]"
                    />
                  </div>


                  <h4 className="mt-2 md:mt-3 text-xs md:text-sm font-bold text-center text-slate-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.name}
                  </h4>

                  <p className="hidden md:block text-[11px] text-gray-400 dark:text-gray-500 text-center mt-1">
                    Trusted professionals
                  </p>

                  <p className="hidden md:block text-xs text-blue-600 dark:text-blue-400 text-center mt-2 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0 duration-300">
                    View details →
                  </p>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};


export default ViewAllServices;
