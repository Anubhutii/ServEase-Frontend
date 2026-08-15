import React, { useEffect, useState, useMemo } from "react";
import { Spin } from "antd";
import {
  History,
  ShoppingBag,
  Briefcase,
  Calendar,
  MapPin,
  Phone,
  ArrowRight,
  Search,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../Services/axios";
import { useAuth } from "../Context/AuthContext";

interface HistoryItem {
  type: "booking" | "job";
  id: string;
  title: string;
  category: string;
  date: string;
  status: string;
  price: number;
  providerName?: string;
  providerPhoto?: string;
  providerRating?: number;
  phone?: string;
  address?: string;
  description?: string;
  raw: any;
}

const HistoryPage: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [filterTab, setFilterTab] = useState<"all" | "bookings" | "jobs">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [bookings, setBookings] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userId = user.id || user._id;

      const [ordersRes, activeRes, jobsRes] = await Promise.all([
        axios.get(`/api/dashboard/user/orders/${userId}`).catch(() => ({ data: { orders: [] } })),
        axios.get(`/api/dashboard/user/active-bookings/${userId}`).catch(() => ({ data: { bookings: [] } })),
        axios.get(`/api/dashboard/user/jobs/${userId}`).catch(() => ({ data: { jobs: [] } })),
      ]);

      const allOrders = ordersRes.data?.orders || [];
      const activeBookings = activeRes.data?.bookings || [];
      const allBookingsMap: Record<string, any> = {};

      [...activeBookings, ...allOrders].forEach((b) => {
        if (b._id) allBookingsMap[b._id] = b;
      });

      setBookings(Object.values(allBookingsMap));
      setJobs(jobsRes.data?.jobs || []);
    } catch (error) {
      console.error("Fetch history error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Unified Chronological History List
  const unifiedHistory: HistoryItem[] = useMemo(() => {
    const list: HistoryItem[] = [];

    // Map Bookings
    bookings.forEach((b) => {
      const provider = b.provider || {};
      list.push({
        type: "booking",
        id: b._id,
        title: `${provider.firstName || "Verified"} ${provider.lastName || "Specialist"} - ${b.service_details?.split(" (Slot:")[0] || provider.category || "Service Visit"}`,
        category: provider.category || "General Service",
        date: b.completion_date || b.createdAt || new Date().toISOString(),
        status: b.status || "confirmed",
        price: b.final_price || b.fee || 299,
        providerName: `${provider.firstName || "Specialist"} ${provider.lastName || ""}`,
        providerPhoto: provider.profilePhoto,
        providerRating: provider.rating,
        phone: b.phone || provider.phone,
        address: b.address,
        description: b.service_details,
        raw: b,
      });
    });

    // Map Jobs
    jobs.forEach((j) => {
      list.push({
        type: "job",
        id: j._id,
        title: j.title,
        category: j.category || "Custom Job",
        date: j.createdAt || new Date().toISOString(),
        status: j.status || "open",
        price: j.budget_range?.max || j.budget_range?.min || 500,
        address: j.location?.address,
        description: j.description,
        raw: j,
      });
    });

    // Sort newest first
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return list;
  }, [bookings, jobs]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    let result = unifiedHistory;

    if (filterTab === "bookings") {
      result = result.filter((item) => item.type === "booking");
    } else if (filterTab === "jobs") {
      result = result.filter((item) => item.type === "job");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [unifiedHistory, filterTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-500 py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-5">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-2xs">
                <History size={18} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Activity & Booking History
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track all your past service visits, contractor proposals, and custom jobs.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/post-job"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <span>Manage Posted Jobs</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* ================= GUEST STATE ================= */}
        {!isLoggedIn && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 mx-auto flex items-center justify-center">
              <History size={22} />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Sign in to view your history
            </h2>
            <p className="text-xs text-slate-400">
              Log in to view your complete transaction history, scheduled bookings, and posted job requests.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow transition"
            >
              Login / Register
            </button>
          </div>
        )}

        {/* ================= CONTROLS & FILTER TABS ================= */}
        {isLoggedIn && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            
            {/* TABS */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filterTab === "all"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All ({unifiedHistory.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("bookings")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filterTab === "bookings"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Bookings ({bookings.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab("jobs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filterTab === "jobs"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Posted Jobs ({jobs.length})
              </button>
            </div>

            {/* SEARCH BOX */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full sm:w-60 pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* ================= LOADING ================= */}
        {isLoggedIn && loading && (
          <div className="py-16 text-center space-y-2">
            <Spin size="large" />
            <p className="text-xs text-slate-400">Loading history records...</p>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {isLoggedIn && !loading && filteredHistory.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 mx-auto flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                No activity found
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {searchQuery ? "No results match your search query." : "You haven't made any bookings or job requests yet."}
              </p>
            </div>
            <button
              onClick={() => navigate("/service")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition"
            >
              Browse Verified Services
            </button>
          </div>
        )}

        {/* ================= TIMELINE LIST ================= */}
        {isLoggedIn && !loading && filteredHistory.length > 0 && (
          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const isBooking = item.type === "booking";
              const dateFormatted = new Date(item.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-2xs hover:border-blue-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* LEFT: ICON & DETAILS */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Badge Icon / Avatar */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center">
                      {isBooking && item.providerPhoto ? (
                        <img
                          src={`http://localhost:5000/api/provider/file/${item.providerPhoto}`}
                          alt="Provider"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop";
                          }}
                        />
                      ) : isBooking ? (
                        <ShoppingBag size={20} className="text-blue-500" />
                      ) : (
                        <Briefcase size={20} className="text-indigo-500" />
                      )}
                    </div>

                    {/* Meta */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase tracking-wider ${
                            isBooking
                              ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/40"
                              : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40"
                          }`}
                        >
                          {isBooking ? "Direct Booking" : "Posted Job"}
                        </span>

                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                          {item.category}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                            item.status === "completed" || item.status === "accepted"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                              : item.status === "cancelled" || item.status === "declined"
                              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                              : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          <span>{dateFormatted}</span>
                        </span>
                        {item.address && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 truncate max-w-[200px]">
                              <MapPin size={12} className="text-slate-400" />
                              <span className="truncate">{item.address}</span>
                            </span>
                          </>
                        )}
                        {item.phone && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-slate-400" />
                              <span>{item.phone}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: PRICE & ACTION */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0 sm:pl-4 sm:border-l dark:border-slate-800">
                    <div className="text-left sm:text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">
                        {isBooking ? "Final Fee" : "Est. Budget"}
                      </span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        ₹{item.price}
                      </span>
                    </div>

                    {isBooking ? (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.status === "completed" ? "Service Delivered ✓" : "Visit Confirmed"}
                      </span>
                    ) : (
                      <Link
                        to="/post-job"
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-bold rounded-lg transition"
                      >
                        View Bids
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;
