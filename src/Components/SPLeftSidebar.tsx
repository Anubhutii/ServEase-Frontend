import React, { useState } from "react";
import {
  Search,
  X,
  Zap,
  Droplets,
  Hammer,
  Tv,
  Sparkles,
  Scissors,
  UserCheck,
  SlidersHorizontal,
  RotateCcw,
  Star,
  Check,
  ArrowRight,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ================= CATEGORY DEFINITIONS ================= */

type ServiceItem = {
  name: string;
  isNew?: boolean;
  isPopular?: boolean;
};

type Category = {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  badgeBg: string;
  services: ServiceItem[];
};

const SERVICE_CATEGORIES: Category[] = [
  {
    id: "electrician",
    title: "Electrician",
    icon: Zap,
    color: "text-amber-500",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    services: [
      { name: "Fan Installation" },
      { name: "Switch & Socket Repair", isPopular: true },
      { name: "Light & Wiring Fix", isNew: true },
      { name: "MCB & Fuse Repair" },
    ],
  },
  {
    id: "plumber",
    title: "Plumber",
    icon: Droplets,
    color: "text-sky-500",
    badgeBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    services: [
      { name: "Tap & Leakage Repair", isPopular: true },
      { name: "Wash Basin Installation", isNew: true },
      { name: "Bathroom Fittings Repair" },
      { name: "Blocked Drain Cleaning" },
    ],
  },
  {
    id: "carpenter",
    title: "Carpenter",
    icon: Hammer,
    color: "text-orange-500",
    badgeBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    services: [
      { name: "Door & Hinge Repair" },
      { name: "Furniture Assembly", isNew: true },
      { name: "Curtain Rod Installation" },
      { name: "Minor Wood Repair" },
    ],
  },
  {
    id: "appliances",
    title: "Appliances",
    icon: Tv,
    color: "text-cyan-500",
    badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    services: [
      { name: "AC Repair", isPopular: true },
      { name: "Washing Machine Repair" },
      { name: "RO / Water Purifier Repair" },
      { name: "Refrigerator Repair", isNew: true },
    ],
  },
  {
    id: "cleaning",
    title: "Cleaning",
    icon: Sparkles,
    color: "text-emerald-500",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    services: [
      { name: "Bathroom Cleaning", isPopular: true },
      { name: "Kitchen Cleaning" },
      { name: "Full Home Cleaning", isNew: true },
    ],
  },
  {
    id: "women-salon",
    title: "Salon (Women)",
    icon: Scissors,
    color: "text-rose-500",
    badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    services: [
      { name: "Waxing" },
      { name: "Facial & Cleanup", isPopular: true },
      { name: "Manicure & Pedicure", isNew: true },
    ],
  },
  {
    id: "men-salon",
    title: "Salon (Men)",
    icon: UserCheck,
    color: "text-indigo-500",
    badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    services: [
      { name: "Haircut", isPopular: true },
      { name: "Beard Trim" },
      { name: "Head Massage", isNew: true },
    ],
  },
];

interface SPLeftSidebarProps {
  filters: { category: string; service: string; search: string; [key: string]: any };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const SPLeftSidebar: React.FC<SPLeftSidebarProps> = ({ filters, setFilters }) => {
  const [budget, setBudget] = useState<number>(filters.maxBudget || 15000);
  const [minRating, setMinRating] = useState<number>(filters.minRating || 0);

  const activeFiltersCount =
    (filters.category ? 1 : 0) +
    (filters.service ? 1 : 0) +
    (filters.search ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (budget < 15000 ? 1 : 0);

  const handleCategoryClick = (categoryId: string) => {
    if (filters.category === categoryId) {
      setFilters((prev: any) => ({ ...prev, category: "", service: "" }));
    } else {
      setFilters((prev: any) => ({ ...prev, category: categoryId, service: "" }));
    }
  };

  const handleServiceClick = (serviceName: string) => {
    if (filters.service === serviceName) {
      setFilters((prev: any) => ({ ...prev, service: "", search: "" }));
    } else {
      setFilters((prev: any) => ({ ...prev, service: serviceName, search: serviceName }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev: any) => ({ ...prev, search: e.target.value }));
  };

  const clearSearch = () => {
    setFilters((prev: any) => ({ ...prev, search: "" }));
  };

  const handleBudgetChange = (value: number) => {
    setBudget(value);
    setFilters((prev: any) => ({ ...prev, maxBudget: value }));
  };

  const handleRatingChange = (rating: number) => {
    const nextRating = minRating === rating ? 0 : rating;
    setMinRating(nextRating);
    setFilters((prev: any) => ({ ...prev, minRating: nextRating }));
  };

  const clearAllFilters = () => {
    setBudget(15000);
    setMinRating(0);
    setFilters({ category: "", service: "", search: "", maxBudget: 15000, minRating: 0 });
  };

  const activeCategoryObj = SERVICE_CATEGORIES.find((c) => c.id === filters.category);

  return (
    <aside className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 space-y-4">

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <SlidersHorizontal size={15} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-none">
              Filters
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">Refine search</span>
          </div>
        </div>

        {activeFiltersCount > 0 ? (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg transition active:scale-95 border border-rose-200/60 dark:border-rose-800/40"
          >
            <RotateCcw size={11} />
            <span>Reset ({activeFiltersCount})</span>
          </button>
        ) : (
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            All services
          </span>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
        />
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search by skill or service..."
          className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        {filters.search && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* CATEGORY SELECTOR CARDS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Categories
          </span>
          {filters.category && (
            <button
              onClick={() => setFilters((prev: any) => ({ ...prev, category: "", service: "" }))}
              className="text-[10px] font-semibold text-blue-500 hover:underline"
            >
              Show all
            </button>
          )}
        </div>

        {/* COMPACT CATEGORY PILL GRID */}
        <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-0.5 no-scrollbar">
          {SERVICE_CATEGORIES.map((category) => {
            const isSelected = filters.category === category.id;
            const CategoryIcon = category.icon;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.id)}
                className={`group relative flex items-center gap-2 p-2 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm font-bold scale-[1.01]"
                    : "bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-800 hover:border-blue-400 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0 transition-transform ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : `${category.badgeBg} ${category.color}`
                  }`}
                >
                  <CategoryIcon size={13} />
                </div>

                <span className="text-xs font-semibold truncate leading-tight flex-1">
                  {category.title}
                </span>

                {isSelected && (
                  <Check size={13} className="stroke-[3] flex-shrink-0 text-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SUB-SERVICES TAG CLOUD */}
      {activeCategoryObj && (
        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-700 dark:text-blue-300">
            <span className="flex items-center gap-1.5">
              <Layers size={13} />
              <span>{activeCategoryObj.title} Tasks</span>
            </span>
            {filters.service && (
              <button
                onClick={() => setFilters((prev: any) => ({ ...prev, service: "", search: "" }))}
                className="text-[10px] text-blue-500 hover:underline"
              >
                Clear task
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeCategoryObj.services.map((service) => {
              const isSelected = filters.service === service.name;

              return (
                <button
                  key={service.name}
                  type="button"
                  onClick={() => handleServiceClick(service.name)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400"
                  }`}
                >
                  <span>{service.name}</span>
                  {service.isNew && (
                    <span
                      className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase ${
                        isSelected ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      New
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* RATING FILTER & BUDGET ROW */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        
        {/* RATING ROW */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Min Rating
            </span>
            {minRating > 0 && (
              <button
                onClick={() => handleRatingChange(0)}
                className="text-[10px] text-blue-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[4.5, 4.0, 3.5].map((rating) => {
              const isSelected = minRating === rating;
              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                      : "bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400"
                  }`}
                >
                  <Star
                    size={11}
                    className={isSelected ? "fill-white text-white" : "fill-amber-400 text-amber-400"}
                  />
                  <span>{rating}+</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BUDGET ROW */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Max Visiting Fee
            </span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-800/40">
              {budget >= 15000 ? "Any (₹15k+)" : `₹${budget}`}
            </span>
          </div>

          <input
            type="range"
            min={100}
            max={15000}
            step={200}
            value={budget}
            onChange={(e) => handleBudgetChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="grid grid-cols-4 gap-1 text-[10px]">
            {[300, 600, 1200, 15000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleBudgetChange(val)}
                className={`py-1 rounded-lg border text-center font-semibold transition ${
                  budget === val
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                }`}
              >
                {val === 15000 ? "All" : `₹${val}`}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER LINK */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <Link
          to="/all-services"
          className="group flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1 transition"
        >
          <span>Explore Full Catalog</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </aside>
  );
};

export default SPLeftSidebar;
