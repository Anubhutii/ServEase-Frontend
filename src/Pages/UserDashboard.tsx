import React, { useEffect, useState, useMemo } from 'react';
import {
  Tag,
  Button,
  message,
  Popconfirm,
  Modal,
  Input,
} from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  MessageSquare,
  MapPin,
  Phone,
  RotateCw,
  Trash2,
  Plus,
  Send,
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Scissors,
  Check,
  User as UserIcon,
  ChevronRight,
  ShieldCheck,
  X,
  Compass,
  Star,
  CreditCard,
  Banknote,
  QrCode,
  CheckCheck,
} from 'lucide-react';
import axios from '../Services/axios';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import UserChatbox from '../Components/UserChatbox';
import { usePostJob } from '../Components/PostJobModal';

const { TextArea } = Input;

const getCategoryIcon = (category: string = "") => {
  const cat = category.toLowerCase();
  if (cat.includes("plumb")) return <Wrench className="w-3.5 h-3.5 text-blue-500" />;
  if (cat.includes("electr")) return <Zap className="w-3.5 h-3.5 text-amber-500" />;
  if (cat.includes("carpent")) return <Hammer className="w-3.5 h-3.5 text-purple-500" />;
  if (cat.includes("clean") || cat.includes("maid")) return <Sparkles className="w-3.5 h-3.5 text-emerald-500" />;
  if (cat.includes("salon") || cat.includes("hair")) return <Scissors className="w-3.5 h-3.5 text-pink-500" />;
  return <Wrench className="w-3.5 h-3.5 text-blue-500" />;
};

const quickCategories = [
  { label: "Plumber", icon: "🔧", category: "plumber" },
  { label: "Electrician", icon: "⚡", category: "electrician" },
  { label: "Carpenter", icon: "🪚", category: "carpenter" },
  { label: "Cleaner / Maid", icon: "🧹", category: "maid" },
  { label: "Salon & Beauty", icon: "💇", category: "salon" },
  { label: "Cook / Chef", icon: "👨‍🍳", category: "cook" },
];

const feedbackTagOptions = [
  "⚡ Punctual & Quick",
  "🧹 Clean & Neat Work",
  "🤝 Polite & Professional",
  "🔧 Expert Quality",
  "💰 Fair & Transparent",
  "⭐ Highly Recommended",
];

const ratingLabels: Record<number, string> = {
  1: "Poor experience",
  2: "Fair service",
  3: "Good job",
  4: "Very satisfied",
  5: "Excellent & exceptional!",
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { openPostJob } = usePostJob();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'jobs' | 'history'>('bookings');
  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Review & Completion Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(["⚡ Punctual & Quick", "🔧 Expert Quality"]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('cash');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const [data, setData] = useState({
    activeBookings: [] as any[],
    history: [] as any[],
    jobs: [] as any[],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = user?.id || user?._id;

      const [activeRes, historyRes, jobsRes] = await Promise.all([
        axios.get(`/api/dashboard/user/active-bookings/${userId}`),
        axios.get(`/api/dashboard/user/orders/${userId}`),
        axios.get(`/api/dashboard/user/jobs/${userId}`),
      ]);

      const allHistory = historyRes.data.orders || [];
      const completedHistory = allHistory.filter(
        (o: any) => o.status === 'completed' || o.status === 'cancelled' || o.status === 'declined'
      );

      setData({
        activeBookings: activeRes.data.bookings || [],
        history: completedHistory.length > 0 ? completedHistory : allHistory,
        jobs: jobsRes.data.jobs || [],
      });
    } catch (error) {
      console.error("User dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();

    const handleJobPosted = () => {
      if (user) fetchData();
    };

    window.addEventListener('job_posted', handleJobPosted);
    return () => {
      window.removeEventListener('job_posted', handleJobPosted);
    };
  }, [user]);

  const handleDeleteJob = async (jobId: string) => {
    setActionLoadingId(jobId);
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      message.success('Request deleted successfully');
      fetchData();
    } catch (error: any) {
      console.error("Delete job error:", error);
      message.error(error.response?.data?.message || 'Failed to delete request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setActionLoadingId(bookingId);
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      message.success('Booking cancelled successfully');
      fetchData();
    } catch (error: any) {
      console.error("Cancel booking error:", error);
      message.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyPhone = (phone: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    message.success("Provider phone copied!");
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  // Open Review & Completion Modal
  const handleOpenReviewModal = (booking: any) => {
    setSelectedBookingForReview(booking);
    setRatingValue(booking.rating || 5);
    setReviewComment(booking.review || '');
    setSelectedTags(booking.review_tags && booking.review_tags.length > 0 ? booking.review_tags : ["⚡ Punctual & Quick", "🔧 Expert Quality"]);
    setPaymentMethod(booking.payment_method || 'cash');
    setReviewModalOpen(true);
  };

  // Submit Completion, Payment & Review
  const handleSubmitReviewAndCompletion = async () => {
    if (!selectedBookingForReview) return;
    setSubmittingReview(true);

    try {
      // 1. If booking is active, mark complete & paid
      if (selectedBookingForReview.status !== 'completed') {
        await axios.put(`/api/bookings/${selectedBookingForReview._id}/complete-and-pay`, {
          paymentMethod,
          paymentStatus: 'paid',
        });
      }

      // 2. Submit Rating & Review
      await axios.post(`/api/bookings/${selectedBookingForReview._id}/review`, {
        rating: ratingValue,
        review: reviewComment,
        reviewTags: selectedTags,
      });

      message.success("🎉 Service completed & feedback submitted! Thank you!");
      setReviewModalOpen(false);
      setSelectedBookingForReview(null);
      fetchData();
    } catch (error: any) {
      console.error("Review submission error:", error);
      message.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const cleanDescription = (details: string) => {
    if (!details) return "Standard service booking";
    const descMarker = " - Description: ";
    if (details.includes(descMarker)) {
      return details.split(descMarker)[1] || details;
    }
    return details;
  };

  // Analytics
  const totalSpent = useMemo(() => {
    return data.history
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + (Number(o.final_price) || 0), 0);
  }, [data.history]);

  const totalBidsReceived = useMemo(() => {
    return data.jobs.reduce((sum, j) => sum + (Number(j.bidCount) || 0), 0);
  }, [data.jobs]);

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-200 ${isDark ? "bg-slate-950 text-slate-100" : "bg-[#f8fafc] text-slate-900"}`}>
      
      {/* ================= COMPACT TOP HEADER ================= */}
      <div className={`border-b sticky top-0 z-20 backdrop-blur-md transition-colors ${isDark ? "bg-slate-950/85 border-slate-800/80" : "bg-white/85 border-slate-200/80"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          {/* User Profile info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-bold tracking-tight leading-tight m-0">
                  Welcome, {user?.name ? user.name.split(" ")[0] : "Customer"} 👋
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>ServEase Member</span>
                </span>
              </div>
              <p className={`text-[11px] m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Manage your home service bookings, rate providers &amp; track orders
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => openPostJob()}
              className="rounded-xl font-bold text-xs h-9 px-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none shadow-md shadow-indigo-500/25 flex items-center gap-1 text-white"
            >
              <span className="hidden sm:inline">Post Request</span>
              <span className="sm:hidden">Post</span>
            </Button>

            <Button
              size="small"
              icon={<RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
              onClick={fetchData}
              className="rounded-xl text-xs font-semibold h-9 px-3"
            >
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 space-y-6">

        {/* ================= COMPACT STATS STRIP ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className={`p-3.5 rounded-2xl border transition-all ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Active Bookings</span>
              <Clock className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-black flex items-center gap-1.5">
              <span>{data.activeBookings.length}</span>
              {data.activeBookings.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border transition-all ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Posted Requests</span>
              <Send className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-xl font-black flex items-center gap-1.5">
              <span>{data.jobs.length}</span>
              {totalBidsReceived > 0 && (
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  {totalBidsReceived} bids
                </span>
              )}
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border transition-all ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl font-black">
              {data.history.filter((h) => h.status === 'completed').length}
            </div>
          </div>

          <div className={`p-3.5 rounded-2xl border transition-all ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Total Spent</span>
              <IndianRupee className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              ₹{Number(totalSpent).toLocaleString('en-IN')}
            </div>
          </div>

        </div>

        {/* ================= QUICK SERVICE DISPATCH SHORTCUTS ================= */}
        <div className={`p-3.5 rounded-2xl border ${isDark ? "bg-slate-900/40 border-slate-800" : "bg-gradient-to-r from-blue-50/60 to-purple-50/60 border-blue-100/80 shadow-2xs"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold">Quick Need? Book a local pro in 1-click:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
              {quickCategories.map((c) => (
                <button
                  key={c.category}
                  type="button"
                  onClick={() => openPostJob()}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    isDark
                      ? "bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700"
                      : "bg-white hover:bg-blue-600 hover:text-white text-slate-700 border border-slate-200 shadow-2xs"
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= MAIN NAVIGATION TABS ================= */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl border border-slate-300/40 dark:border-slate-800 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Bookings</span>
            {data.activeBookings.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-blue-600 text-white">
                {data.activeBookings.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'jobs'
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>My Posted Requests</span>
            {data.jobs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-purple-600 text-white">
                {data.jobs.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>History &amp; Reviews</span>
          </button>
        </div>

        {/* ================= TAB 1: ACTIVE BOOKINGS ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {data.activeBookings.map((item: any) => {
              const isInProgress = item.status === 'in_progress';
              const isPending = item.status === 'pending';
              const phoneNum = item.provider?.phone || item.phone || "";
              const addressText = item.address || item.job?.location?.address || "";
              const serviceTitle = item.job?.title || "Direct Service Booking";
              const category = item.job?.category || item.provider?.category || "Service";
              const isCopied = copiedPhoneId === item._id;

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isPending
                      ? isDark
                        ? "bg-amber-950/20 border-amber-500/40"
                        : "bg-amber-50/40 border-amber-200 shadow-2xs"
                      : isInProgress
                      ? isDark
                        ? "bg-blue-950/20 border-blue-500/40"
                        : "bg-blue-50/40 border-blue-200 shadow-2xs"
                      : isDark
                      ? "bg-slate-900/80 border-slate-800"
                      : "bg-white border-slate-200/90 shadow-2xs"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    
                    {/* Left Info Block */}
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
                          {item.status?.replace('_', ' ')}
                        </Tag>

                        <span className="text-[11px] text-slate-400">
                          #{item._id?.slice(-5).toUpperCase()}
                        </span>
                      </div>

                      {/* Provider info & Phone */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                          <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                          <span>Partner: {item.provider?.firstName ? `${item.provider.firstName} ${item.provider.lastName || ""}` : (item.provider?.name || "Assigned Partner")}</span>
                        </div>

                        {phoneNum && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <a href={`tel:${phoneNum}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                              {phoneNum}
                            </a>
                            <button
                              type="button"
                              onClick={(e) => handleCopyPhone(phoneNum, item._id, e)}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 cursor-pointer"
                              title="Copy Phone"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Phone className="w-3 h-3" />}
                            </button>
                          </div>
                        )}

                        {addressText && (
                          <div className="flex items-center gap-1 min-w-0 max-w-xs truncate">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span className="truncate">{addressText}</span>
                          </div>
                        )}
                      </div>

                      {/* Work detail */}
                      <p className={`text-xs italic line-clamp-1 m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        &ldquo;{cleanDescription(item.service_details || item.job?.description)}&rdquo;
                      </p>

                    </div>

                    {/* Right Price & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 dark:border-slate-800 shrink-0">
                      
                      <div className="text-left md:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                          Price
                        </span>
                        <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                          ₹{item.final_price || 0}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        
                        {/* Complete & Rate Button (Vibrant Emerald CTA) */}
                        <Button
                          size="small"
                          type="primary"
                          icon={<Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />}
                          onClick={() => handleOpenReviewModal(item)}
                          className="rounded-lg font-bold text-xs h-8 px-3 bg-emerald-600 hover:bg-emerald-700 border-none text-white shadow-xs flex items-center gap-1"
                        >
                          <span>Complete &amp; Pay</span>
                        </Button>

                        {/* Chat Button */}
                        <Button
                          size="small"
                          icon={<MessageSquare className="w-3.5 h-3.5 text-blue-500" />}
                          onClick={() => setActiveChatBookingId(item._id)}
                          className="rounded-lg font-bold text-xs h-8 px-2.5"
                        >
                          Chat
                        </Button>

                        {/* Cancel Button */}
                        <Popconfirm
                          title="Cancel this booking?"
                          description="Are you sure you want to cancel?"
                          onConfirm={() => handleCancelBooking(item._id)}
                          okText="Yes, Cancel"
                          cancelText="Keep"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            size="small"
                            danger
                            loading={actionLoadingId === item._id}
                            className="rounded-lg font-bold text-xs h-8 px-2.5"
                          >
                            Cancel
                          </Button>
                        </Popconfirm>
                      </div>

                    </div>

                  </div>
                </motion.div>
              );
            })}

            {data.activeBookings.length === 0 && (
              <div className={`text-center py-12 px-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto mb-2.5 text-xl">
                  🧹
                </div>
                <h4 className="text-sm font-bold mb-1">No Active Bookings Right Now</h4>
                <p className={`text-xs max-w-xs mx-auto mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Need a home service? Post a request to receive competitive bids from verified partners.
                </p>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => openPostJob()}
                  className="rounded-lg font-bold bg-blue-600 h-8 px-4"
                >
                  Post a Service Request &rarr;
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: MY POSTED REQUESTS ================= */}
        {activeTab === 'jobs' && (
          <div className="space-y-3">
            {data.jobs.map((job: any) => (
              <motion.div
                key={job._id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border transition-all ${
                  isDark ? "bg-slate-900/80 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm sm:text-base m-0 truncate">
                        {job.title}
                      </h4>
                      <Tag className="rounded-md font-bold text-[10px] uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none">
                        {job.category}
                      </Tag>
                      <Tag color={job.status === 'open' ? 'green' : 'default'} className="rounded-md text-[10px] font-bold uppercase">
                        {job.status}
                      </Tag>
                    </div>

                    <p className={`text-xs line-clamp-1 m-0 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 pt-0.5">
                      <span>Budget: ₹{job.budget_range?.min || 0} - ₹{job.budget_range?.max || 0}</span>
                      <span>•</span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</span>
                      <span>•</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {job.bidCount || 0} Provider Bids Received
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => navigate(`/jobs/${job._id}/bids`)}
                      className="rounded-lg font-bold text-xs bg-indigo-600 hover:bg-indigo-700 h-8 px-3 flex items-center gap-1 text-white border-none shadow-xs"
                    >
                      <span>Review Bids ({job.bidCount || 0})</span>
                      <ChevronRight className="w-3 h-3" />
                    </Button>

                    <Popconfirm
                      title="Delete this request?"
                      description="All associated bids will also be removed."
                      onConfirm={() => handleDeleteJob(job._id)}
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        size="small"
                        danger
                        loading={actionLoadingId === job._id}
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                        className="rounded-lg h-8 px-2.5"
                      />
                    </Popconfirm>
                  </div>

                </div>
              </motion.div>
            ))}

            {data.jobs.length === 0 && (
              <div className={`text-center py-12 px-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <p className="text-xs font-bold text-slate-500 mb-3">You have not posted any custom job requests yet.</p>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => openPostJob()}
                  className="rounded-lg font-bold bg-blue-600 h-8 px-4"
                >
                  Post Your First Request
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: ORDER HISTORY & REVIEWS ================= */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {data.history.map((item: any, index: number) => {
              const hasReview = item.rating && item.rating > 0;
              const providerName = item.provider?.firstName
                ? `${item.provider.firstName} ${item.provider.lastName || ""}`
                : (item.provider?.name || "Partner");

              return (
                <div
                  key={item._id || index}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isDark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/80 shadow-2xs"
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm m-0 truncate">
                        {item.job?.title || "Service Completed"}
                      </h4>
                      <Tag color="green" className="rounded-md text-[10px] font-bold uppercase">
                        {item.status}
                      </Tag>
                      {item.payment_status === 'paid' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCheck className="w-3 h-3" />
                          <span>Paid ({item.payment_method || 'cash'})</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 m-0 truncate">
                      Delivered on {new Date(item.completion_date || item.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })} • Provider: <span className="font-semibold text-slate-700 dark:text-slate-300">{providerName}</span>
                    </p>

                    {/* Review Snippet if given */}
                    {hasReview ? (
                      <div className={`p-2 rounded-xl text-xs flex items-center gap-2 ${isDark ? "bg-slate-800/60" : "bg-amber-50/50 border border-amber-100/60"}`}>
                        <div className="flex items-center text-amber-500 shrink-0">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[11px] italic text-slate-600 dark:text-slate-300 line-clamp-1">
                          &ldquo;{item.review || "Great service, highly satisfied!"}&rdquo;
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic m-0">
                        No review submitted yet.
                      </p>
                    )}
                  </div>

                  {/* Price & Review Action */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 dark:border-slate-800 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                        Amount
                      </span>
                      <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                        ₹{item.final_price || 0}
                      </span>
                    </div>

                    <Button
                      size="small"
                      icon={<Star className={`w-3.5 h-3.5 ${hasReview ? "fill-amber-400 text-amber-400" : ""}`} />}
                      onClick={() => handleOpenReviewModal(item)}
                      className={`rounded-lg font-bold text-xs h-8 px-3 flex items-center gap-1 ${
                        hasReview
                          ? "border-slate-300 dark:border-slate-700"
                          : "bg-amber-500 hover:bg-amber-600 text-white border-none shadow-xs"
                      }`}
                    >
                      <span>{hasReview ? "Edit Review" : "Leave Review ⭐"}</span>
                    </Button>
                  </div>
                </div>
              );
            })}

            {data.history.length === 0 && (
              <div className={`text-center py-10 px-4 rounded-2xl border ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/80"}`}>
                <p className="text-xs font-bold text-slate-500 m-0">No past completed orders yet.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ================= WORK COMPLETION, PAYMENT & RATING MODAL ================= */}
      <Modal
        open={reviewModalOpen}
        onCancel={() => setReviewModalOpen(false)}
        footer={null}
        centered
        width={480}
        styles={{
          body: { padding: '24px' },
        }}
        className={isDark ? "dark-modal" : ""}
      >
        {selectedBookingForReview && (
          <div className="space-y-5">
            
            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2 shadow-xs">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <h3 className="text-lg font-extrabold m-0">
                {selectedBookingForReview.status !== 'completed' ? "Complete Service & Rate Partner" : "Rate & Review Service"}
              </h3>
              <p className="text-xs text-slate-400 m-0">
                Booking: <span className="font-semibold text-slate-600 dark:text-slate-300">{selectedBookingForReview.job?.title || "Home Service"}</span> (₹{selectedBookingForReview.final_price})
              </p>
            </div>

            {/* Payment Method Selector (if booking is not already marked completed) */}
            {selectedBookingForReview.status !== 'completed' && (
              <div className={`p-3.5 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200/80"}`}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  1. Confirm Payment Method Done:
                </span>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : isDark
                        ? "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Cash on Service</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-xl border font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : isDark
                        ? "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI / QR Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : isDark
                        ? "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card / Online</span>
                  </button>
                </div>
              </div>
            )}

            {/* Star Rating Selector */}
            <div className="text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {selectedBookingForReview.status !== 'completed' ? "2. How was the service quality?" : "Overall Service Rating:"}
              </span>

              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || ratingValue) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRatingValue(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-extrabold text-amber-500">
                {ratingLabels[hoverRating || ratingValue]}
              </div>
            </div>

            {/* Quick Feedback Tags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 block">
                What went well? (Select tags)
              </span>

              <div className="flex flex-wrap gap-1.5">
                {feedbackTagOptions.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-500 text-white shadow-2xs"
                          : isDark
                          ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review Comment Box */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 block">
                Write a brief review (Optional):
              </span>
              <TextArea
                rows={3}
                placeholder="Describe your experience with the partner's service..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="rounded-xl text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="primary"
                size="large"
                loading={submittingReview}
                onClick={handleSubmitReviewAndCompletion}
                className="w-full rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 border-none shadow-md shadow-emerald-500/25 text-white h-11"
              >
                {selectedBookingForReview.status !== 'completed'
                  ? "✓ Confirm Payment & Submit Review"
                  : "Submit Review"}
              </Button>
            </div>

          </div>
        )}
      </Modal>

      {/* ================= FLOATING USER CHAT DRAWER ================= */}
      <AnimatePresence>
        {activeChatBookingId && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 z-50 w-full max-w-sm"
          >
            <div className={`rounded-2xl border shadow-2xl overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="p-2.5 border-b dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-bold text-xs">Chat with Service Provider</span>
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
                <UserChatbox
                  bookingId={activeChatBookingId}
                  onClose={() => setActiveChatBookingId(null)}
                  isPage={false}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserDashboard;
