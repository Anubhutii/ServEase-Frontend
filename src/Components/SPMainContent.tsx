import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Star,
  ShieldCheck,
  Clock,
  Briefcase,
  Languages,
  Eye,
  Check,
  PlusCircle,
  LayoutGrid,
  List,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Modal } from "antd";

import { useCart } from "../Context/CartContext";
import { usePostJob } from "./PostJobModal";

interface Props {
  onOpenFilters?: () => void;
  filters: {
    category: string;
    service: string;
    search: string;
    maxBudget?: number;
    minRating?: number;
    [key: string]: any;
  };
}

/* ================= COMPACT PROVIDER CARD (HORIZONTAL / SLIM) ================= */

interface ProviderCardProps {
  data: any;
  viewMode: "compact" | "grid";
  onOpenDetails: (provider: any) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ data, viewMode, onOpenDetails }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cartItem = {
      id: data._id,
      title: `${data.firstName || "Pro"} ${data.lastName || ""} - ${data.category || "Service"}`,
      price: data.fee || 299,
      quantity: 1,
      image: data.profilePhoto || "",
    };
    addToCart(cartItem);
    navigate("/cart");
  };

  const profileImage = data.profilePhoto
    ? `http://localhost:5000/api/provider/file/${data.profilePhoto}`
    : "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop";

  const formattedCategory = (data.category || "Specialist").replace(/_/g, " ");

  // 1. SLIM HORIZONTAL VIEW (Compact)
  if (viewMode === "compact") {
    return (
      <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-3.5 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-3.5 items-center justify-between">
        
        {/* LEFT: THUMBNAIL + BASIC INFO */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 w-full sm:w-auto flex-1">
          {/* Avatar Thumbnail */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200/60 dark:border-slate-700">
            <img
              src={profileImage}
              alt={`${data.firstName} ${data.lastName}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop";
              }}
            />
            <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 backdrop-blur-xs text-[9px] text-amber-300 font-bold flex items-center justify-center gap-0.5 py-0.5">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span>{data.rating ? Number(data.rating).toFixed(1) : "4.8"}</span>
            </div>
          </div>

          {/* Core Info */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug truncate">
                {data.firstName} {data.lastName}
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 uppercase tracking-wider">
                {formattedCategory}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Available Today
              </span>
            </div>

            {/* Micro Metadata Strip */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Briefcase size={12} className="text-slate-400" />
                <span>{data.experience || 3}+ Yrs Exp</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate">
                <Languages size={12} className="text-slate-400" />
                <span className="truncate">
                  {data.languages && data.languages.length > 0
                    ? data.languages.slice(0, 2).join(", ")
                    : "Eng, Hindi"}
                </span>
              </span>
              <span>•</span>
              <span className="hidden lg:inline-flex items-center gap-1">
                <Clock size={12} className="text-slate-400" />
                <span>10 AM–8 PM</span>
              </span>
            </div>

            {/* Quick Skills Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {data.services && data.services.length > 0 ? (
                <>
                  {data.services.slice(0, 2).map((srv: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded capitalize"
                    >
                      {srv.replace(/_/g, " ")}
                    </span>
                  ))}
                  {data.services.length > 2 && (
                    <span className="text-[10px] text-slate-400">
                      +{data.services.length - 2} more
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-slate-400 italic">General Maintenance</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: PRICING & DIRECT BOOKING ACTION */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0 gap-2 sm:gap-1.5 sm:pl-3 sm:border-l dark:border-slate-800">
          <div className="text-left sm:text-right">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block leading-none">
              Visiting Fee
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              ₹{data.fee || 299}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenDetails(data)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              title="Details"
            >
              <Eye size={14} />
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white active:scale-95 cursor-pointer"
            >
              <span>Book Now</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

      </div>
    );
  }

  // 2. COMPACT GRID VIEW
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3">
      
      {/* CARD TOP: AVATAR + TITLE */}
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200/60 dark:border-slate-700">
          <img
            src={profileImage}
            alt={`${data.firstName} ${data.lastName}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate">
              {formattedCategory}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{data.rating ? Number(data.rating).toFixed(1) : "4.8"}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
            {data.firstName} {data.lastName}
          </h3>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            <span>{data.experience || 3}+ Yrs Exp</span>
            <span>•</span>
            <span className="truncate">
              {data.languages && data.languages.length > 0 ? data.languages[0] : "English"}
            </span>
          </div>
        </div>
      </div>

      {/* SERVICES PILLS */}
      <div className="flex flex-wrap gap-1">
        {data.services && data.services.length > 0 ? (
          data.services.slice(0, 2).map((s: string, idx: number) => (
            <span
              key={idx}
              className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded capitalize"
            >
              {s.replace(/_/g, " ")}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-slate-400 italic">General Maintenance</span>
        )}
      </div>

      {/* CARD BOTTOM: PRICE & DIRECT BOOK */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">
            Fee
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            ₹{data.fee || 299}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenDetails(data)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:border-blue-500 transition"
            title="Details"
          >
            <Eye size={14} />
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white active:scale-95 cursor-pointer"
          >
            <span>Book</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

    </div>
  );
};

/* ================= MAIN CONTENT ================= */

const SPMainContent: React.FC<Props> = ({ onOpenFilters, filters }) => {
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [viewMode, setViewMode] = useState<"compact" | "grid">("compact");

  const { addToCart } = useCart();
  const { openPostJob } = usePostJob();
  const navigate = useNavigate();

  // REACT QUERY FETCH PROVIDERS
  const { data: searchData, isLoading, isError, refetch } = useQuery({
    queryKey: ["providers-search", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      const storedLoc = localStorage.getItem("userLocation");

      if (storedLoc) {
        try {
          const loc = JSON.parse(storedLoc);
          if (loc.lat && loc.lng) {
            params.lat = loc.lat;
            params.lng = loc.lng;
            params.radius = "30";
          }
        } catch (e) {}
      }

      if (filters.category) params.category = filters.category;
      if (filters.service && !filters.search) params.search = filters.service;
      if (filters.search) params.search = filters.search;

      const res = await axios.get("http://localhost:5000/api/provider/search", { params });
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const rawProviders: any[] = searchData?.providers || [];

  // CLIENT-SIDE FILTER & SORT
  const filteredAndSortedProviders = useMemo(() => {
    let list = [...rawProviders];

    // Filter by max budget
    if (filters.maxBudget && filters.maxBudget < 15000) {
      list = list.filter((p) => (p.fee || 299) <= filters.maxBudget!);
    }

    // Filter by rating
    if (filters.minRating && filters.minRating > 0) {
      list = list.filter((p) => (p.rating || 4.5) >= filters.minRating!);
    }

    // Sort
    if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "price_asc") {
      list.sort((a, b) => (a.fee || 299) - (b.fee || 299));
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => (b.fee || 299) - (a.fee || 299));
    } else if (sortBy === "experience") {
      list.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    }

    return list;
  }, [rawProviders, filters.maxBudget, filters.minRating, sortBy]);

  const hasActiveFilters =
    Boolean(filters.category) ||
    Boolean(filters.service) ||
    Boolean(filters.search) ||
    Boolean(filters.minRating && filters.minRating > 0) ||
    Boolean(filters.maxBudget && filters.maxBudget < 15000);

  return (
    <div className="space-y-4 transition-colors duration-300">
      
      {/* STREAMLINED TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        
        {/* HEADER & MOBILE CONTROLS */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Verified Professionals
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
              {isLoading ? "..." : filteredAndSortedProviders.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* VIEW MODE TOGGLE */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode("compact")}
                className={`p-1.5 rounded-md transition ${
                  viewMode === "compact"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                title="Compact List View"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenFilters}
              className="lg:hidden flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg"
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* ACTIVE FILTERS & SORT ROW */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          <div className="flex flex-wrap items-center gap-1.5">
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 capitalize">
                {filters.category}
              </span>
            )}
            {filters.service && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                {filters.service}
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                "{filters.search}"
              </span>
            )}
            {!hasActiveFilters && (
              <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                Showing all available experts
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="experience">Experience</option>
            </select>
          </div>
        </div>

      </div>

      {/* COMPACT LIST / GRID FEED */}
      <div>
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 animate-pulse flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-1/2 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
                <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-red-200 dark:border-red-900/30 space-y-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Unable to load service providers
            </h3>
            <button
              onClick={() => refetch()}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : filteredAndSortedProviders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 mx-auto flex items-center justify-center">
              <Search size={22} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No specialists matched your criteria
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your filter parameters or post a custom job for free.
            </p>
            <button
              type="button"
              onClick={() => openPostJob()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
            >
              <PlusCircle size={14} />
              <span>Post a Job Free</span>
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "compact"
                ? "space-y-2.5"
                : "grid grid-cols-1 md:grid-cols-2 gap-3"
            }
          >
            {filteredAndSortedProviders.map((provider) => (
              <ProviderCard
                key={provider._id}
                data={provider}
                viewMode={viewMode}
                onOpenDetails={(p) => setSelectedProvider(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= DETAILED MODAL ================= */}
      {selectedProvider && (
        <Modal
          title={null}
          open={Boolean(selectedProvider)}
          onCancel={() => setSelectedProvider(null)}
          footer={null}
          centered
          width={580}
          styles={{ body: { padding: 0 } }}
          className="custom-details-modal overflow-hidden rounded-2xl"
        >
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 space-y-4">
            
            {/* MODAL HEADER */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                <img
                  src={
                    selectedProvider.profilePhoto
                      ? `http://localhost:5000/api/provider/file/${selectedProvider.profilePhoto}`
                      : "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop"
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                    {selectedProvider.firstName} {selectedProvider.lastName}
                  </h2>
                  <ShieldCheck size={16} className="text-emerald-500" />
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold capitalize mt-0.5">
                  {selectedProvider.category?.replace(/_/g, " ")} Specialist
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>{selectedProvider.rating ? Number(selectedProvider.rating).toFixed(1) : "4.8"}</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    ({selectedProvider.totalReviews || 48} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Exp</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {selectedProvider.experience || 3}+ Yrs
                </p>
              </div>
              <div className="border-x border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Visiting Fee</span>
                <p className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  ₹{selectedProvider.fee || 299}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Languages</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5 truncate px-1">
                  {selectedProvider.languages?.join(", ") || "Eng, Hindi"}
                </p>
              </div>
            </div>

            {/* ABOUT */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                About Professional
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg">
                {selectedProvider.bio ||
                  "Dedicated and verified specialist offering reliable in-home service, prompt arrival, and guaranteed customer satisfaction."}
              </p>
            </div>

            {/* SERVICES */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Offered Skills & Services
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProvider.services && selectedProvider.services.length > 0 ? (
                  selectedProvider.services.map((s: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold capitalize"
                    >
                      <Check size={12} className="text-blue-500" />
                      <span>{s.replace(/_/g, " ")}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">General Maintenance</span>
                )}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Visiting Fee</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  ₹{selectedProvider.fee || 299}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const item = {
                    id: selectedProvider._id,
                    title: `${selectedProvider.firstName} ${selectedProvider.lastName} - ${selectedProvider.category}`,
                    price: selectedProvider.fee || 299,
                    quantity: 1,
                    image: selectedProvider.profilePhoto || "",
                  };
                  addToCart(item);
                  setSelectedProvider(null);
                  navigate("/cart");
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold shadow transition-all bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book This Specialist</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};

export default SPMainContent;
