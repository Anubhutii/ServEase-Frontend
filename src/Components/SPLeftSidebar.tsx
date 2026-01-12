import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

/* ================= CATEGORY DATA ================= */

type ServiceItem = {
  name: string;
  isNew?: boolean;
};

type Category = {
  id: string;
  title: string;
  services: ServiceItem[];
};

const SERVICE_CATEGORIES: Category[] = [
  {
    id: "electrician",
    title: "Electrician",
    services: [
      { name: "Fan Installation & Repair" },
      { name: "Switch & Socket Repair" },
      { name: "Light & Wiring Fix", isNew: true },
      { name: "MCB & Fuse Repair" },
    ],
  },
  {
    id: "plumber",
    title: "Plumber",
    services: [
      { name: "Tap & Leakage Repair" },
      { name: "Wash Basin Installation", isNew: true },
      { name: "Bathroom Fittings Repair" },
      { name: "Blocked Drain Cleaning" },
    ],
  },
  {
    id: "carpenter",
    title: "Carpenter",
    services: [
      { name: "Door & Hinge Repair" },
      { name: "Furniture Assembly", isNew: true },
      { name: "Curtain Rod Installation" },
      { name: "Minor Wood Repair" },
    ],
  },
  {
    id: "appliances",
    title: "Home Appliances",
    services: [
      { name: "AC Repair" },
      { name: "Washing Machine Repair" },
      { name: "RO / Water Purifier Repair" },
      { name: "Refrigerator Repair", isNew: true },
    ],
  },
  {
    id: "cleaning",
    title: "Cleaning",
    services: [
      { name: "Bathroom Cleaning" },
      { name: "Kitchen Cleaning" },
      { name: "Full Home Cleaning" },
    ],
  },
  {
    id: "women-salon",
    title: "Women's Salon",
    services: [
      { name: "Waxing" },
      { name: "Facial & Cleanup" },
      { name: "Manicure & Pedicure", isNew: true },
    ],
  },
  {
    id: "men-salon",
    title: "Men's Salon",
    services: [
      { name: "Haircut" },
      { name: "Beard Trim" },
      { name: "Head Massage", isNew: true },
    ],
  },
];

/* ================= COMPONENT ================= */

const SPLeftSidebar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [budget, setBudget] = useState<number>(100);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-5">

      {/* TAGLINE */}
      <div>
        <p className="text-xl font-medium text-slate-900">
          Find the right service
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Choose category, then service
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <FiSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search services..."
          className="
            w-full pl-9 pr-3 py-2 text-sm
            rounded-lg border border-slate-200
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      </div>

      {/* CATEGORIES */}
      <div className="space-y-2">
        {SERVICE_CATEGORIES.map((category) => {
          const isOpen = activeCategory === category.id;

          return (
            <div
              key={category.id}
              className="border border-slate-200 rounded-lg overflow-hidden"
            >
              {/* MAIN CATEGORY */}
              <button
                onClick={() =>
                  setActiveCategory(isOpen ? null : category.id)
                }
                className="
                  w-full flex justify-between items-center
                  px-4 py-3 text-sm font-medium
                  text-slate-800 hover:bg-slate-50
                "
              >
                {category.title}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* SUB-CATEGORIES */}
              {isOpen && (
                <div className="bg-slate-50 px-4 py-2 space-y-1">
                  {category.services.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => setSelectedService(service.name)}
                      className={`
                        flex items-center justify-between
                        w-full text-left text-sm
                        px-3 py-1.5 rounded-md transition
                        ${
                          selectedService === service.name
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "text-slate-700 hover:bg-white"
                        }
                      `}
                    >
                      <span>{service.name}</span>

                      {service.isNew && (
                        <span className="text-[10px] bg-pink-600 text-white px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* VIEW ALL */}
      <Link
        to="/services"
        className="text-xs font-medium text-blue-600 hover:underline block text-right"
      >
        View All →
      </Link>

      {/* BUDGET */}
      <div>
        <h4 className="font-medium mb-2">Budget Range</h4>

        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>₹100</span>
          <span className="font-semibold text-slate-900">
            ₹{budget}
            {budget >= 5000 && "+"}
          </span>
        </div>

        <input
          type="range"
          min={100}
          max={15000}
          step={100}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />

        <p className="text-xs text-slate-500 mt-1">
          Adjust to match your budget
        </p>
      </div>

    </div>
  );
};

export default SPLeftSidebar;
