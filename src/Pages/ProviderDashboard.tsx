import React, { useEffect, useState, useMemo } from 'react';
import {
  Tag,
  Button,
  message,
  Input,
  Select,
  Popconfirm,
  Progress,
} from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  MapPin,
  Phone,
  RotateCw,
  ShieldCheck,
  Send,
  Play,
  CheckCheck,
  Filter,
  X,
  Copy,
  Sparkles,
  User,
  Wrench,
  Zap,
  Hammer,
  Scissors,
  Check,
  ArrowUpRight,
  Calendar as CalendarIcon,
  TrendingUp,
  BarChart3,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
} from 'lucide-react';
import axios from '../Services/axios';
import ProviderChatbox from '../Components/ProviderChatbox';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import BidSubmissionModal from '../Components/BidSubmissionModal';

const { Option } = Select;

const getCategoryIcon = (category: string = "") => {
  const cat = category.toLowerCase();
  if (cat.includes("plumb")) return <Wrench className="w-3.5 h-3.5 text-blue-500" />;
  if (cat.includes("electr")) return <Zap className="w-3.5 h-3.5 text-amber-500" />;
  if (cat.includes("carpent")) return <Hammer className="w-3.5 h-3.5 text-purple-500" />;
  if (cat.includes("clean") || cat.includes("maid")) return <Sparkles className="w-3.5 h-3.5 text-emerald-500" />;
  if (cat.includes("salon") || cat.includes("hair")) return <Scissors className="w-3.5 h-3.5 text-pink-500" />;
  return <Wrench className="w-3.5 h-3.5 text-blue-500" />;
};

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'find_jobs' | 'bids' | 'history' | 'analytics'>('active');
  const [activeOrderFilter, setActiveOrderFilter] = useState<'all' | 'pending' | 'accepted' | 'in_progress'>('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Filters & Search
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Analytics Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [selectedDayTasks, setSelectedDayTasks] = useState<{ dateStr: string; tasks: any[] } | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'7' | '14' | '30'>('7');

  const [data, setData] = useState({
    activeOrders: [] as any[],
    history: [] as any[],
    bids: [] as any[],
    jobs: [] as any[],
    analytics: { totalEarnings: 0, completedJobs: 0 },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const providerId = user?.id || user?._id;

      const [activeRes, historyRes, bidsRes, jobsRes, analyticsRes] = await Promise.all([
        axios.get(`/api/dashboard/provider/active-orders/${providerId}`),
        axios.get(`/api/dashboard/provider/orders/${providerId}`),
        axios.get(`/api/dashboard/provider/bids/${providerId}`),
        axios.get(`/api/dashboard/provider/search-jobs`),
        axios.get(`/api/dashboard/provider/analytics/${providerId}`),
      ]);

      const allHistory = historyRes.data.orders || [];
      const completedHistory = allHistory.filter(
        (o: any) => o.status === 'completed' || o.status === 'cancelled' || o.status === 'declined'
      );

      setData({
        activeOrders: activeRes.data.orders || [],
        history: completedHistory.length > 0 ? completedHistory : allHistory,
        bids: bidsRes.data.bids || [],
        jobs: jobsRes.data.jobs || [],
        analytics: analyticsRes.data || { totalEarnings: 0, completedJobs: 0 },
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // Respond to Direct Booking (Accept / Decline)
  const handleRespondBooking = async (bookingId: string, action: 'accept' | 'decline') => {
    setActionLoadingId(bookingId);
    try {
      await axios.put(`/api/bookings/${bookingId}/respond`, { action });
      message.success(`Booking ${action === 'accept' ? 'accepted' : 'declined'} successfully`);
      fetchData();
    } catch (error: any) {
      console.error(`Error responding to booking:`, error);
      message.error(error.response?.data?.message || `Failed to ${action} booking`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Update Booking Status (Start Job / Mark Complete)
  const handleUpdateStatus = async (bookingId: string, status: string) => {
    setActionLoadingId(bookingId);
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status });
      message.success(`Job marked as ${status.replace('_', ' ')}!`);
      fetchData();
    } catch (error: any) {
      console.error("Status update error:", error);
      message.error(error.response?.data?.message || "Failed to update booking status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleNegotiateBooking = (order: any) => {
    if (order && order._id) {
      setActiveChatBookingId(order._id);
    } else {
      message.error("Invalid booking selected");
    }
  };

  const handleCopyPhone = (phone: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    message.success("Copied phone number");
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const cleanDescription = (details: string) => {
    if (!details) return "Standard service requested";
    const descMarker = " - Description: ";
    if (details.includes(descMarker)) {
      return details.split(descMarker)[1] || details;
    }
    return details;
  };

  // Filtered Active Orders
  const filteredActiveOrders = useMemo(() => {
    if (activeOrderFilter === 'all') return data.activeOrders;
    return data.activeOrders.filter((o) => {
      if (activeOrderFilter === 'pending') return o.status === 'pending';
      if (activeOrderFilter === 'accepted') return o.status === 'accepted' || o.status === 'confirmed';
      if (activeOrderFilter === 'in_progress') return o.status === 'in_progress';
      return true;
    });
  }, [data.activeOrders, activeOrderFilter]);

  // Filtered Open Jobs
  const filteredJobs = useMemo(() => {
    return data.jobs.filter((job) => {
      const matchesQuery =
        !jobSearchQuery ||
        job.title?.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        job.location?.address?.toLowerCase().includes(jobSearchQuery.toLowerCase());

      const matchesCat =
        selectedCategoryFilter === 'all' ||
        job.category?.toLowerCase() === selectedCategoryFilter.toLowerCase();

      return matchesQuery && matchesCat;
    });
  }, [data.jobs, jobSearchQuery, selectedCategoryFilter]);

  // ================= CALENDAR & ANALYTICS COMPUTATIONS =================
  const completedOrdersList = useMemo(() => {
    return data.history.filter((o) => o.status === 'completed');
  }, [data.history]);

  // Map of completed orders by date key (YYYY-MM-DD)
  const completedOrdersByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    completedOrdersList.forEach((order) => {
      const dateObj = new Date(order.completion_date || order.updatedAt || order.createdAt);
      if (!isNaN(dateObj.getTime())) {
        const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
        if (!map[key]) map[key] = [];
        map[key].push(order);
      }
    });
    return map;
  }, [completedOrdersList]);

  // Category distribution
  const categoryStats = useMemo(() => {
    const countMap: Record<string, { count: number; earnings: number }> = {};
    completedOrdersList.forEach((order) => {
      const cat = order.job?.category || "General Service";
      if (!countMap[cat]) countMap[cat] = { count: 0, earnings: 0 };
      countMap[cat].count += 1;
      countMap[cat].earnings += (Number(order.final_price) || 0);
    });

    const totalCount = completedOrdersList.length || 1;
    return Object.keys(countMap).map((cat) => ({
      category: cat,
      count: countMap[cat].count,
      earnings: countMap[cat].earnings,
      percentage: Math.round((countMap[cat].count / totalCount) * 100),
    }));
  }, [completedOrdersList]);

  // Chart data for last N days
  const chartData = useMemo(() => {
    const daysCount = Number(chartTimeframe);
    const result: { dateLabel: string; earnings: number; count: number }[] = [];
    const today = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayTasks = completedOrdersByDate[key] || [];
      const dayEarnings = dayTasks.reduce((sum, t) => sum + (Number(t.final_price) || 0), 0);

      result.push({
        dateLabel: d.toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }),
        earnings: dayEarnings,
        count: dayTasks.length,
      });
    }
    return result;
  }, [chartTimeframe, completedOrdersByDate]);

  const maxChartEarnings = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.earnings), 500);
    return max;
  }, [chartData]);

  // Calendar Grid Days Builder
  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 for Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { dayNumber: number | null; dateKey: string; isToday: boolean; tasks: any[] }[] = [];

    // Prefix empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateKey: '', isToday: false, tasks: [] });
    }

    const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const tasks = completedOrdersByDate[dateKey] || [];
      days.push({
        dayNumber: day,
        dateKey,
        isToday: dateKey === todayStr,
        tasks,
      });
    }

    return days;
  }, [currentCalendarDate, completedOrdersByDate]);

  const nextMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1));
  };

  const pendingRequestsCount = data.activeOrders.filter((o) => o.status === 'pending').length;

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-200 ${isDark ? "bg-slate-950 text-slate-100" : "bg-[#f8fafc] text-slate-900"}`}>
      
      {/* ================= COMPACT HEADER ================= */}
      <div className={`border-b sticky top-0 z-20 backdrop-blur-md transition-colors ${isDark ? "bg-slate-950/85 border-slate-800/80" : "bg-white/85 border-slate-200/80"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          {/* Left info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "P"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold tracking-tight leading-tight m-0">
                  {user?.name || "Partner Dashboard"}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
              <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Direct customer bookings, leads &amp; performance analytics
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available</span>
            </span>

            <Button
              size="small"
              icon={<RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
              onClick={fetchData}
              className="rounded-lg text-xs font-semibold h-8"
            >
              Refresh
            </Button>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 space-y-5">

        {/* ================= COMPACT STATS STRIP ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className={`p-3.5 rounded-2xl border transition-all ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Earnings</span>
              <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{Number(data.analytics.totalEarnings || 0).toLocaleString('en-IN')}
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border transition-all ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Active Orders</span>
              <Clock className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-black flex items-center gap-1.5">
              <span>{data.activeOrders.length}</span>
              {pendingRequestsCount > 0 && (
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {pendingRequestsCount} new
                </span>
              )}
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border transition-all ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Bids Sent</span>
              <Send className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-xl font-black">
              {data.bids.length}
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border transition-all ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-xl font-black">
              {data.analytics.completedJobs || completedOrdersList.length}
            </div>
          </div>

        </div>

        {/* ================= COMPACT NAVIGATION TABS ================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl border border-slate-300/40 dark:border-slate-800 overflow-x-auto scrollbar-hide">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'active'
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Direct Bookings</span>
              {data.activeOrders.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-blue-600 text-white">
                  {data.activeOrders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('find_jobs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'find_jobs'
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Open Leads</span>
              {data.jobs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {data.jobs.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bids')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'bids'
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>My Proposals</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'history'
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>History</span>
            </button>

            {/* ⭐ ANALYTICS & CALENDAR TAB */}
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'analytics'
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs"
                  : "text-purple-600 dark:text-purple-400 hover:text-purple-700 font-extrabold"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics &amp; Work Calendar 📊</span>
            </button>
          </div>

          {activeTab === 'active' && (
            <div className="flex items-center gap-1 text-[11px] font-semibold">
              {['all', 'pending', 'accepted', 'in_progress'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setActiveOrderFilter(st as any)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer capitalize ${
                    activeOrderFilter === st
                      ? "bg-blue-600 text-white font-bold"
                      : isDark
                      ? "text-slate-400 hover:bg-slate-800"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= TAB 1: SLEEK DIRECT CUSTOMER BOOKING ROWS ================= */}
        {activeTab === 'active' && (
          <div className="space-y-3">
            {filteredActiveOrders.map((order: any) => {
              const isPending = order.status === 'pending';
              const isAccepted = order.status === 'accepted' || order.status === 'confirmed';
              const isInProgress = order.status === 'in_progress';
              const phoneNum = order.phone || order.job?.phone || "";
              const addressText = order.address || order.job?.location?.address || "";
              const serviceTitle = order.job?.title || "Direct Customer Booking";
              const category = order.job?.category || "Service";
              const isCopied = copiedPhoneId === order._id;

              const mapsUrl = addressText
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`
                : "";

              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isPending
                      ? isDark
                        ? "bg-amber-950/20 border-amber-500/40 hover:border-amber-500/60"
                        : "bg-amber-50/40 border-amber-200 hover:border-amber-300"
                      : isInProgress
                      ? isDark
                        ? "bg-blue-950/20 border-blue-500/40 hover:border-blue-500/60"
                        : "bg-blue-50/40 border-blue-200 hover:border-blue-300"
                      : isDark
                      ? "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                      : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    
                    {/* Left Details Block */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="p-1 rounded-md bg-blue-500/10 border border-blue-500/20">
                          {getCategoryIcon(category)}
                        </span>
                        
                        <h4 className="font-bold text-sm sm:text-base m-0 truncate">
                          {serviceTitle}
                        </h4>

                        <Tag
                          color={isPending ? "gold" : isInProgress ? "blue" : "green"}
                          className="rounded-md font-bold text-[10px] uppercase px-1.5 py-0"
                        >
                          {order.status?.replace('_', ' ')}
                        </Tag>

                        <span className="text-[11px] text-slate-400">
                          #{order._id?.slice(-5).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.user?.name || "Customer"}</span>
                        </div>

                        {phoneNum && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <a href={`tel:${phoneNum}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                              {phoneNum}
                            </a>
                            <button
                              type="button"
                              onClick={(e) => handleCopyPhone(phoneNum, order._id, e)}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 cursor-pointer"
                              title="Copy Phone"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        )}

                        {addressText && (
                          <div className="flex items-center gap-1 min-w-0 max-w-xs truncate">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span className="truncate" title={addressText}>{addressText}</span>
                            {mapsUrl && (
                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                                title="Open in Maps"
                              >
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      <p className={`text-xs italic line-clamp-1 m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        &ldquo;{cleanDescription(order.service_details || order.job?.description)}&rdquo;
                      </p>

                    </div>

                    {/* Right Price & Actions Block */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 dark:border-slate-800 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                          Fee
                        </span>
                        <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                          ₹{order.final_price || 0}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Button
                          size="small"
                          icon={<MessageSquare className="w-3.5 h-3.5 text-blue-500" />}
                          onClick={() => handleNegotiateBooking(order)}
                          className="rounded-lg font-bold text-xs h-8 px-2.5"
                        >
                          Chat
                        </Button>

                        {isPending && (
                          <>
                            <Popconfirm
                              title="Decline Booking?"
                              onConfirm={() => handleRespondBooking(order._id, 'decline')}
                              okText="Decline"
                              cancelText="Back"
                            >
                              <Button
                                size="small"
                                danger
                                loading={actionLoadingId === order._id}
                                className="rounded-lg font-bold text-xs h-8 px-2.5"
                              >
                                Decline
                              </Button>
                            </Popconfirm>

                            <Button
                              size="small"
                              type="primary"
                              icon={<Check className="w-3.5 h-3.5" />}
                              onClick={() => handleRespondBooking(order._id, 'accept')}
                              loading={actionLoadingId === order._id}
                              className="rounded-lg font-bold text-xs h-8 px-3 bg-emerald-600 hover:bg-emerald-700 border-none text-white shadow-xs"
                            >
                              Accept
                            </Button>
                          </>
                        )}

                        {isAccepted && (
                          <Button
                            size="small"
                            type="primary"
                            icon={<Play className="w-3 h-3 fill-current" />}
                            onClick={() => handleUpdateStatus(order._id, 'in_progress')}
                            loading={actionLoadingId === order._id}
                            className="rounded-lg font-bold text-xs h-8 px-3 bg-blue-600 hover:bg-blue-700 border-none text-white shadow-xs"
                          >
                            Start Work
                          </Button>
                        )}

                        {isInProgress && (
                          <Popconfirm
                            title="Complete Service?"
                            description="Mark this booking as finished and collect payment?"
                            onConfirm={() => handleUpdateStatus(order._id, 'completed')}
                            okText="Yes, Complete"
                            cancelText="Not Yet"
                          >
                            <Button
                              size="small"
                              type="primary"
                              icon={<CheckCheck className="w-3.5 h-3.5" />}
                              loading={actionLoadingId === order._id}
                              className="rounded-lg font-bold text-xs h-8 px-3 bg-emerald-600 hover:bg-emerald-700 border-none text-white shadow-xs"
                            >
                              Complete
                            </Button>
                          </Popconfirm>
                        )}

                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}

            {filteredActiveOrders.length === 0 && (
              <div className={`text-center py-12 px-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto mb-2.5 text-xl">
                  📭
                </div>
                <h4 className="text-sm font-bold mb-1">No Active Orders Found</h4>
                <p className={`text-xs max-w-xs mx-auto mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  You don&apos;t have any orders matching this filter right now.
                </p>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => setActiveTab('find_jobs')}
                  className="rounded-lg font-bold bg-blue-600 h-8 px-4"
                >
                  Find Open Leads &rarr;
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: FIND OPEN LEADS ================= */}
        {activeTab === 'find_jobs' && (
          <div className="space-y-3">
            <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row gap-2.5 items-center justify-between ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
              <Input
                size="middle"
                placeholder="Search leads by keyword or location..."
                prefix={<Search className="w-3.5 h-3.5 text-slate-400 mr-1" />}
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                allowClear
                className="rounded-xl text-xs font-medium w-full sm:w-72"
              />

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <Select
                  size="middle"
                  value={selectedCategoryFilter}
                  onChange={(v) => setSelectedCategoryFilter(v)}
                  className="w-full sm:w-36 rounded-xl text-xs font-medium"
                >
                  <Option value="all">All Trades</Option>
                  <Option value="plumber">Plumbing</Option>
                  <Option value="electrician">Electrician</Option>
                  <Option value="carpenter">Carpenter</Option>
                  <Option value="maid">Cleaning</Option>
                  <Option value="salon">Salon</Option>
                  <Option value="cook">Chef / Cook</Option>
                  <Option value="tutor">Tutor</Option>
                </Select>
              </div>
            </div>

            {filteredJobs.map((job: any) => (
              <div
                key={job._id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? "bg-slate-900/70 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm m-0 truncate">{job.title}</h4>
                    <Tag className="rounded-md font-bold text-[10px] uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none">
                      {job.category}
                    </Tag>
                  </div>

                  <p className={`text-xs line-clamp-1 m-0 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {job.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span className="truncate max-w-xs">{job.location?.address || "Local Area"}</span>
                    </div>
                    <span>•</span>
                    <span>Budget: ₹{job.budget_range?.min || 0} - ₹{job.budget_range?.max || 0}</span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <Button
                    size="small"
                    type="primary"
                    icon={<Send className="w-3 h-3" />}
                    onClick={() => {
                      setSelectedJob(job);
                      setIsModalVisible(true);
                    }}
                    className="rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-700 h-8 px-3"
                  >
                    Send Quote
                  </Button>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className={`text-center py-10 px-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <p className="text-xs font-bold text-slate-500 m-0">No open leads matching your search criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: MY BIDS ================= */}
        {activeTab === 'bids' && (
          <div className="space-y-3">
            {data.bids.map((bid: any) => (
              <div
                key={bid._id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm m-0 truncate">{bid.job?.title || "Custom Proposal"}</h4>
                    <Tag
                      color={bid.status === 'accepted' ? 'green' : bid.status === 'rejected' ? 'red' : 'gold'}
                      className="rounded-md font-bold text-[10px] uppercase"
                    >
                      {bid.status}
                    </Tag>
                  </div>
                  <p className="text-xs text-slate-400 m-0">
                    Quote: <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{bid.proposed_price}</span> • Timeline: {bid.estimated_timeline || "Standard"}
                  </p>
                </div>

                <span className="text-[11px] text-slate-400 self-end sm:self-center">
                  {new Date(bid.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}

            {data.bids.length === 0 && (
              <div className={`text-center py-10 px-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <p className="text-xs font-bold text-slate-500 m-0">No proposals submitted yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {data.history.map((order: any) => (
              <div
                key={order._id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"
                }`}
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm m-0 truncate">{order.job?.title || "Customer Booking"}</h4>
                    <Tag color={order.status === 'completed' ? 'green' : 'default'} className="rounded-md text-[10px] font-bold uppercase">
                      {order.status}
                    </Tag>
                  </div>
                  <p className="text-[11px] text-slate-400 m-0 truncate">
                    Customer: {order.user?.name || "Customer"} • {new Date(order.completion_date || order.updatedAt || order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
                    ₹{order.final_price || 0}
                  </span>
                </div>
              </div>
            ))}

            {data.history.length === 0 && (
              <div className={`text-center py-10 px-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <p className="text-xs font-bold text-slate-500 m-0">No completed orders yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: 📊 ANALYTICS & WORK CALENDAR SUITE ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Top Performance Scorecard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
                  <span>Customer Rating</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-500">
                  {user?.rating || 4.9} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 m-0 font-medium">
                  Based on verified customer reviews
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
                  <span>Completion Rate</span>
                  <Award className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  98.4%
                </div>
                <p className="text-[10px] text-slate-400 mt-1 m-0 font-medium">
                  Top tier partner standard
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
                  <span>Avg. Ticket Size</span>
                  <IndianRupee className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  ₹{completedOrdersList.length > 0 ? Math.round(Number(data.analytics.totalEarnings || 0) / completedOrdersList.length) : 350}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 m-0 font-medium">
                  Per booking average
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
                  <span>Acceptance Speed</span>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                  &lt; 15 min
                </div>
                <p className="text-[10px] text-slate-400 mt-1 m-0 font-medium">
                  Fast response partner badge
                </p>
              </div>
            </div>

            {/* Main 2-Column Analytics: Left Graph + Right Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Revenue & Tasks Trend Chart */}
              <div className={`lg:col-span-2 p-5 rounded-3xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200/90 shadow-2xs"}`}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-base font-extrabold m-0 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Revenue &amp; Task Completion Velocity</span>
                    </h3>
                    <p className="text-xs text-slate-400 m-0 mt-0.5">
                      Visualizing daily earnings and completed jobs
                    </p>
                  </div>

                  {/* Timeframe selector */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                    {(['7', '14', '30'] as const).map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => setChartTimeframe(tf)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          chartTimeframe === tf
                            ? "bg-blue-600 text-white shadow-2xs"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {tf} Days
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Bar / Area Visualization */}
                <div className="space-y-4">
                  <div className="h-44 w-full flex items-end justify-between gap-2 pt-4 px-2">
                    {chartData.map((item, idx) => {
                      const heightPercent = maxChartEarnings > 0 ? Math.max((item.earnings / maxChartEarnings) * 100, 8) : 8;
                      const hasTasks = item.count > 0;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                          
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 pointer-events-none z-30 whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-[11px] shadow-lg border border-slate-700">
                            <span className="font-bold block">{item.dateLabel}</span>
                            <span className="text-emerald-400 font-extrabold">₹{item.earnings}</span> • {item.count} task{item.count !== 1 ? 's' : ''}
                          </div>

                          {/* Bar */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.02 }}
                            className={`w-full max-w-[28px] rounded-t-xl transition-all ${
                              hasTasks
                                ? "bg-gradient-to-t from-blue-600 via-indigo-600 to-emerald-400 shadow-md shadow-blue-500/20"
                                : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300"
                            }`}
                          />

                          {/* X-axis label */}
                          <span className="text-[10px] font-semibold text-slate-400 truncate max-w-full text-center">
                            {item.dateLabel.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t dark:border-slate-800 px-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Completed Tasks Generated Revenue</span>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Total Period: ₹{chartData.reduce((s, c) => s + c.earnings, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>

              {/* Right 1 Col: Category Distribution */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200/90 shadow-2xs"}`}>
                <div>
                  <h3 className="text-base font-extrabold m-0 flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Top Service Categories</span>
                  </h3>
                  <p className="text-xs text-slate-400 m-0 mb-4">
                    Earnings share by service skill
                  </p>

                  <div className="space-y-4">
                    {categoryStats.map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold capitalize">{item.category}</span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            ₹{item.earnings} ({item.percentage}%)
                          </span>
                        </div>
                        <Progress
                          percent={item.percentage}
                          showInfo={false}
                          strokeColor={{
                            '0%': '#3b82f6',
                            '100%': '#10b981',
                          }}
                          className="m-0"
                        />
                      </div>
                    ))}

                    {categoryStats.length === 0 && (
                      <div className="text-center py-6 text-xs text-slate-400">
                        <p className="m-0">Complete customer bookings to view category distribution.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 text-xs flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 text-[11px] leading-tight">
                    Adding more skills in profile increases booking leads by up to 2.5x.
                  </span>
                </div>
              </div>

            </div>

            {/* ================= WORK ACTIVITY CALENDAR ================= */}
            <div className={`p-5 sm:p-6 rounded-3xl border ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200/90 shadow-2xs"}`}>
              
              {/* Calendar Header Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold m-0 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Work Schedule &amp; Task Completion Calendar</span>
                  </h3>
                  <p className="text-xs text-slate-400 m-0 mt-0.5">
                    Days highlighted in green indicate completed jobs and revenue earned. Click any day to inspect tasks!
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <div className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {currentCalendarDate.toLocaleDateString("en-IN", { month: 'long', year: 'numeric' })}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="p-1.5 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="p-1.5 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Day Headers (Sun - Sat) */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[11px] font-extrabold uppercase text-slate-400 mb-2">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Calendar Days Matrix */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {calendarDays.map((cell, idx) => {
                  if (!cell.dayNumber) {
                    return (
                      <div
                        key={idx}
                        className="h-16 sm:h-20 rounded-2xl bg-transparent opacity-0 pointer-events-none"
                      />
                    );
                  }

                  const hasTasks = cell.tasks.length > 0;
                  const totalDayEarnings = cell.tasks.reduce((sum, t) => sum + (Number(t.final_price) || 0), 0);
                  const isSelected = selectedDayTasks?.dateStr === cell.dateKey;

                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        if (hasTasks) {
                          setSelectedDayTasks({ dateStr: cell.dateKey, tasks: cell.tasks });
                        } else {
                          setSelectedDayTasks(null);
                        }
                      }}
                      className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-blue-500 shadow-md"
                          : ""
                      } ${
                        hasTasks
                          ? isDark
                            ? "bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-500/80 shadow-xs"
                            : "bg-emerald-50/70 border-emerald-200 hover:border-emerald-400 shadow-xs"
                          : cell.isToday
                          ? isDark
                            ? "bg-blue-950/20 border-blue-500/40"
                            : "bg-blue-50/50 border-blue-200"
                          : isDark
                          ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                          : "bg-white border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      {/* Day Number Header */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${
                          cell.isToday
                            ? "w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]"
                            : hasTasks
                            ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                            : "text-slate-600 dark:text-slate-300"
                        }`}>
                          {cell.dayNumber}
                        </span>

                        {hasTasks && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </div>

                      {/* Tasks info badge */}
                      {hasTasks && (
                        <div className="space-y-0.5 text-left">
                          <span className="block text-[9px] sm:text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 truncate">
                            {cell.tasks.length} job{cell.tasks.length > 1 ? 's' : ''}
                          </span>
                          <span className="block text-[9px] sm:text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                            +₹{totalDayEarnings}
                          </span>
                        </div>
                      )}

                      {!hasTasks && cell.isToday && (
                        <span className="text-[9px] font-bold text-blue-500 text-left">
                          Today
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Day Task Inspection Drawer (Shows when clicking a date) */}
              <AnimatePresence>
                {selectedDayTasks && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`mt-6 p-5 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"}`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-sm font-bold m-0">
                          Completed Work on {new Date(selectedDayTasks.dateStr).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedDayTasks(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {selectedDayTasks.tasks.map((task: any) => (
                        <div
                          key={task._id}
                          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                            isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs">{task.job?.title || "Direct Service Booking"}</span>
                              <Tag color="green" className="text-[9px] rounded-md font-bold uppercase">
                                Completed
                              </Tag>
                            </div>
                            <p className="text-[11px] text-slate-400 m-0">
                              Customer: {task.user?.name || "Client"} • Area: {task.address || task.job?.location?.address || "Local"}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">Earned</span>
                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                              ₹{task.final_price || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        )}

      </div>

      {/* ================= FLOATING CHAT DRAWER ================= */}
      <AnimatePresence>
        {activeChatBookingId && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 z-50 w-full max-w-sm"
          >
            <div className={`rounded-2xl border shadow-2xl overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="p-2.5 border-b dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-bold text-xs">Customer Chat</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveChatBookingId(null)}
                  className="p-1 hover:bg-white/20 rounded-md cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-1 max-h-[420px] overflow-y-auto">
                <ProviderChatbox
                  bookingId={activeChatBookingId}
                  onClose={() => setActiveChatBookingId(null)}
                  isInline={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for Submitting Bids */}
      {selectedJob && (
        <BidSubmissionModal
          job={selectedJob}
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedJob(null);
          }}
          onSuccess={fetchData}
        />
      )}

    </div>
  );
};

export default ProviderDashboard;
