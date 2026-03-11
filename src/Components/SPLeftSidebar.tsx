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
      { name: "Fan Installation" },
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

interface SPLeftSidebarProps {
  filters: { category: string; service: string; search: string };
  setFilters: React.Dispatch<React.SetStateAction<{ category: string; service: string; search: string }>>;
}

const SPLeftSidebar: React.FC<SPLeftSidebarProps> = ({ filters, setFilters }) => {
  const [budget, setBudget] = useState<number>(100);

  const handleCategoryClick = (categoryId: string) => {
    if (filters.category === categoryId) {
      setFilters({ ...filters, category: "", service: "" });
    } else {
      setFilters({ ...filters, category: categoryId, service: "" });
    }
  };

  const handleServiceClick = (serviceName: string) => {
    if (filters.service === serviceName) {
      setFilters({ ...filters, service: "", search: "" });
    } else {
      setFilters({ ...filters, service: serviceName, search: serviceName });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ category: "", service: "", search: "" });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-5 transition-colors duration-500 border border-transparent dark:border-slate-800">

      {/* TAGLINE & CLEAR */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xl font-medium text-slate-900 dark:text-white">
            Find the right service
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Choose category, then service
          </p>
        </div>
        {(filters.category || filters.service || filters.search) && (
          <button
            onClick={clearFilters}
            className="text-[11px] font-bold tracking-wide text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-2 py-1 flex items-center justify-center rounded-md"
          >
            Clear
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="relative">
        <FiSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search services..."
          className="
            w-full pl-9 pr-3 py-2 text-sm
            rounded-lg border border-slate-200 dark:border-slate-700
            bg-white dark:bg-slate-800
            text-slate-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors
          "
        />
      </div>

      {/* CATEGORIES */}
      <div className="space-y-2">
        {SERVICE_CATEGORIES.map((category) => {
          const isOpen = filters.category === category.id;

          return (
            <div
              key={category.id}
              className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-colors"
            >
              {/* MAIN CATEGORY */}
              <button
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  w-full flex justify-between items-center
                  px-4 py-3 text-sm font-medium transition-colors
                  ${isOpen
                    ? "text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800/50"
                    : "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }
                `}
              >
                {category.title}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* SUB-CATEGORIES */}
              {isOpen && (
                <div className="bg-slate-50 dark:bg-slate-800/30 px-4 py-2 space-y-1 transition-colors">
                  {category.services.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => handleServiceClick(service.name)}
                      className={`
                        flex items-center justify-between
                        w-full text-left text-sm
                        px-3 py-1.5 rounded-md transition-all
                        ${filters.service === service.name
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-bold"
                          : "text-slate-700 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                        }
                      `}
                    >
                      <span>{service.name}</span>

                      {service.isNew && (
                        <span className="text-[10px] bg-pink-600 text-white px-2 py-0.5 rounded-full font-bold">
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
        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline block text-right transition-colors"
      >
        View All →
      </Link>

      {/* BUDGET */}
      <div>
        <h4 className="font-bold mb-2 text-slate-800 dark:text-white">Budget Range</h4>

        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
          <span>₹100</span>
          <span className="font-bold text-slate-900 dark:text-white">
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

        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 italic">
          Adjust to match your budget
        </p>
      </div>

    </div>
  );
};

export default SPLeftSidebar;
