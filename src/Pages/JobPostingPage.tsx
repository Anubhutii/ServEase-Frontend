import React, { useEffect, useState } from "react";
import { message, Popconfirm, Spin } from "antd";
import {
  Sparkles,
  PlusCircle,
  Clock,
  MapPin,
  Trash2,
  CheckCircle2,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Check,
  X,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../Services/axios";
import { useAuth } from "../Context/AuthContext";
import { usePostJob } from "../Components/PostJobModal";

interface BidType {
  _id: string;
  job: string;
  proposed_price: number;
  estimated_timeline: string;
  proposal_description: string;
  status: "pending" | "accepted" | "rejected" | "under_negotiation";
  createdAt: string;
  provider?: {
    _id: string;
    firstName: string;
    lastName: string;
    category?: string;
    profilePhoto?: string;
    rating?: number;
    totalReviews?: number;
    experience?: number;
    phone?: string;
    languages?: string[];
  };
}

interface JobType {
  _id: string;
  title: string;
  category: string;
  description: string;
  budget_range: { min: number; max: number };
  deadline: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  phone?: string;
  location?: { address?: string };
}

const JobPostingPage: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { openPostJob } = usePostJob();

  const [loading, setLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [bidsMap, setBidsMap] = useState<Record<string, BidType[]>>({});
  const [loadingBidsId, setLoadingBidsId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // 5-second glow state for Post a Job button
  const [isGlowing, setIsGlowing] = useState<boolean>(true);

  useEffect(() => {
    setIsGlowing(true);
    const timer = setTimeout(() => {
      setIsGlowing(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [location.pathname, location.key]);

  const fetchUserJobs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userId = user.id || user._id;
      const res = await axios.get(`/api/dashboard/user/jobs/${userId}`);
      const list: JobType[] = res.data.jobs || [];
      setJobs(list);

      // Auto expand first job if available
      if (list.length > 0 && !expandedJobId) {
        setExpandedJobId(list[0]._id);
        fetchBidsForJob(list[0]._id);
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBidsForJob = async (jobId: string) => {
    setLoadingBidsId(jobId);
    try {
      const res = await axios.get(`/api/bids/job/${jobId}`);
      const bids: BidType[] = res.data.bids || [];
      setBidsMap((prev) => ({ ...prev, [jobId]: bids }));
    } catch (error) {
      console.error("Fetch bids error:", error);
    } finally {
      setLoadingBidsId(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserJobs();
    } else {
      setLoading(false);
    }

    const handleJobPosted = () => {
      fetchUserJobs();
    };

    window.addEventListener("job_posted", handleJobPosted);
    return () => {
      window.removeEventListener("job_posted", handleJobPosted);
    };
  }, [user]);

  const toggleExpandJob = (jobId: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
      if (!bidsMap[jobId]) {
        fetchBidsForJob(jobId);
      }
    }
  };

  // 1. ACCEPT BID
  const handleAcceptBid = async (bid: BidType, jobId: string) => {
    setActionLoadingId(bid._id);
    try {
      await axios.put(`/api/bids/${bid._id}`, { status: "accepted" });
      message.success(`🎉 Bid from ${bid.provider?.firstName || "Provider"} accepted successfully!`);
      fetchBidsForJob(jobId);
      fetchUserJobs();
    } catch (error: any) {
      console.error("Accept bid error:", error);
      message.error(error.response?.data?.message || "Failed to accept bid");
    } finally {
      setActionLoadingId(null);
    }
  };

  // 2. REJECT BID (ALLOWS RE-BID)
  const handleRejectBid = async (bid: BidType, jobId: string) => {
    setActionLoadingId(bid._id);
    try {
      await axios.put(`/api/bids/${bid._id}`, { status: "rejected" });
      message.info("Bid rejected. The provider has been notified and may submit a revised re-bid.");
      fetchBidsForJob(jobId);
    } catch (error: any) {
      console.error("Reject bid error:", error);
      message.error(error.response?.data?.message || "Failed to reject bid");
    } finally {
      setActionLoadingId(null);
    }
  };

  // 3. NEGOTIATE / CHAT
  const handleNegotiate = async (bid: BidType) => {
    setActionLoadingId(bid._id);
    try {
      const res = await axios.post(`/api/negotiations/initiate`, { bidId: bid._id });
      if (res.data?.negotiation?._id) {
        navigate(`/negotiation/${res.data.negotiation._id}`);
      } else {
        navigate("/negotiation");
      }
    } catch (error: any) {
      console.error("Negotiate error:", error);
      message.error("Failed to start negotiation. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // DELETE JOB
  const handleDeleteJob = async (jobId: string) => {
    setActionLoadingId(jobId);
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      message.success("Job request deleted successfully");
      fetchUserJobs();
    } catch (error: any) {
      console.error("Delete job error:", error);
      message.error(error.response?.data?.message || "Failed to delete job");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-500 py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-5">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-2xs">
                <Sparkles size={18} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Posted Jobs & Contractor Bids
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review offers from certified professionals, compare quotes, and hire specialists.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/history"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-500 transition shadow-2xs"
            >
              View History
            </Link>

            <button
              type="button"
              onClick={() => openPostJob()}
              className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-500 flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                isGlowing
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 ring-4 ring-blue-400/90 shadow-xl shadow-blue-500/60 scale-105 animate-pulse"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
              }`}
            >
              <PlusCircle size={15} />
              <span>Post a Job</span>
            </button>
          </div>
        </div>

        {/* ================= GUEST NOT LOGGED IN ================= */}
        {!isLoggedIn && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 mx-auto flex items-center justify-center">
              <Users size={22} />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Log in to view your posted jobs
            </h2>
            <p className="text-xs text-slate-400">
              Please sign in to track contractor proposals, accept quotes, and negotiate.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow transition"
            >
              Login / Register
            </button>
          </div>
        )}

        {/* ================= LOADING STATE ================= */}
        {isLoggedIn && loading && (
          <div className="py-16 text-center space-y-2">
            <Spin size="large" />
            <p className="text-xs text-slate-400">Loading your posted jobs...</p>
          </div>
        )}

        {/* ================= EMPTY JOBS STATE ================= */}
        {isLoggedIn && !loading && jobs.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 mx-auto flex items-center justify-center">
              <Briefcase size={28} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                No Job Requests Posted Yet
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Have a custom repair, renovation, or specific requirement? Post a job to receive competitive bids from verified providers in minutes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openPostJob()}
              className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-md transition-all duration-500 inline-flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                isGlowing
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 ring-4 ring-blue-400/90 shadow-xl shadow-blue-500/60 scale-105 animate-pulse"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
              }`}
            >
              <PlusCircle size={15} />
              <span>Post a Job</span>
            </button>
          </div>
        )}

        {/* ================= JOBS LIST WITH EMBEDDED BIDS ================= */}
        {isLoggedIn && !loading && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => {
              const isExpanded = expandedJobId === job._id;
              const currentBids = bidsMap[job._id] || [];
              const activeBids = currentBids.filter((b) => b.status !== "rejected");
              const rejectedBids = currentBids.filter((b) => b.status === "rejected");
              const acceptedBid = currentBids.find((b) => b.status === "accepted");

              return (
                <div
                  key={job._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden transition-all duration-200"
                >
                  {/* JOB HEADER CARD */}
                  <div
                    onClick={() => toggleExpandJob(job._id)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 uppercase tracking-wider">
                          {job.category}
                        </span>

                        {acceptedBid ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            <span>Awarded to {acceptedBid.provider?.firstName || "Specialist"}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/50">
                            Active • Accepting Bids
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
                        {job.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {job.description || "No description provided."}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          Budget: ₹{job.budget_range?.min} – ₹{job.budget_range?.max}
                        </span>
                        {job.location?.address && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 truncate max-w-[200px]">
                              <MapPin size={11} className="text-slate-400" />
                              <span className="truncate">{job.location.address}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: BIDS BADGE & CONTROLS */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                        <Users size={13} />
                        <span>{activeBids.length} {activeBids.length === 1 ? "Bid" : "Bids"}</span>
                      </div>

                      <Popconfirm
                        title="Delete this job request?"
                        description="All bids associated with this job will be cancelled."
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          handleDeleteJob(job._id);
                        }}
                        onCancel={(e) => e?.stopPropagation()}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                          title="Delete Request"
                        >
                          <Trash2 size={15} />
                        </button>
                      </Popconfirm>

                      <div className="p-1 rounded-lg text-slate-400">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* ================= EXPANDED BIDS CONTAINER ================= */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5">
                      
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <TrendingUp size={13} className="text-blue-500" />
                          <span>Provider Proposals for this Job</span>
                        </h4>

                        <button
                          onClick={() => fetchBidsForJob(job._id)}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Refresh Bids
                        </button>
                      </div>

                      {loadingBidsId === job._id ? (
                        <div className="py-6 text-center space-y-1">
                          <Spin size="small" />
                          <p className="text-xs text-slate-400">Checking for new provider bids...</p>
                        </div>
                      ) : activeBids.length === 0 ? (
                        <div className="py-6 text-center space-y-1.5 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-4">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            No active bids yet
                          </p>
                          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                            We have broadcast this job to nearby verified {job.category} specialists. You'll receive offers shortly.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {activeBids.map((bid) => {
                            const isAccepted = bid.status === "accepted";
                            const providerPhoto = bid.provider?.profilePhoto
                              ? `http://localhost:5000/api/provider/file/${bid.provider.profilePhoto}`
                              : "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=crop";

                            return (
                              <div
                                key={bid._id}
                                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                  isAccepted
                                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/50 shadow-sm"
                                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-400"
                                }`}
                              >
                                {/* LEFT: PROVIDER CARD DETAILS */}
                                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                  {/* Avatar Thumbnail */}
                                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                    <img
                                      src={providerPhoto}
                                      alt="Provider"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300&auto=format&fit=crop";
                                      }}
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-amber-300 font-bold flex items-center justify-center gap-0.5 py-0.5">
                                      <Star size={9} className="fill-amber-400 text-amber-400" />
                                      <span>{bid.provider?.rating ? Number(bid.provider.rating).toFixed(1) : "4.8"}</span>
                                    </div>
                                  </div>

                                  {/* Info */}
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        {bid.provider?.firstName} {bid.provider?.lastName}
                                      </h4>
                                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/40">
                                        {bid.provider?.category || job.category}
                                      </span>
                                      {isAccepted && (
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.2 rounded-full">
                                          ACCEPTED BID ✓
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                      <span>{bid.provider?.experience || 3}+ Yrs Exp</span>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Clock size={11} className="text-slate-400" />
                                        <span>Timeline: {bid.estimated_timeline || "1-2 Days"}</span>
                                      </span>
                                    </div>

                                    {/* Proposal Description */}
                                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mt-1 leading-relaxed">
                                      {bid.proposal_description || "Professional service inspection & repair guarantee."}
                                    </p>
                                  </div>
                                </div>

                                {/* RIGHT: PRICING & 3 ACTIONS */}
                                <div className="flex flex-col md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0 md:pl-4 md:border-l dark:border-slate-800">
                                  <div className="text-left md:text-right">
                                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block leading-none">
                                      Proposed Bid
                                    </span>
                                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                                      ₹{bid.proposed_price}
                                    </span>
                                  </div>

                                  {/* 3 ACTION CHOICES: ACCEPT / REJECT (RE-BID) / NEGOTIATE */}
                                  {!acceptedBid && (
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {/* CHOICE 1: ACCEPT */}
                                      <button
                                        type="button"
                                        disabled={actionLoadingId === bid._id}
                                        onClick={() => handleAcceptBid(bid, job._id)}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1 active:scale-95 cursor-pointer"
                                      >
                                        <Check size={13} className="stroke-[3]" />
                                        <span>Accept</span>
                                      </button>

                                      {/* CHOICE 2: NEGOTIATE / CHAT */}
                                      <button
                                        type="button"
                                        disabled={actionLoadingId === bid._id}
                                        onClick={() => handleNegotiate(bid)}
                                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800/40 transition flex items-center gap-1 cursor-pointer"
                                      >
                                        <MessageSquare size={13} />
                                        <span>Negotiate</span>
                                      </button>

                                      {/* CHOICE 3: REJECT (ALLOWS RE-BID) */}
                                      <Popconfirm
                                        title="Reject this proposal?"
                                        description="The bid will be removed and provider will be allowed to re-bid."
                                        onConfirm={() => handleRejectBid(bid, job._id)}
                                        okText="Reject"
                                        cancelText="Cancel"
                                        okButtonProps={{ danger: true }}
                                      >
                                        <button
                                          type="button"
                                          disabled={actionLoadingId === bid._id}
                                          className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                          title="Reject bid (allows contractor to submit a new re-bid)"
                                        >
                                          <X size={13} />
                                          <span>Reject</span>
                                        </button>
                                      </Popconfirm>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* SHOW REJECTED BIDS IF ANY */}
                      {rejectedBids.length > 0 && (
                        <div className="pt-2 text-xs text-slate-400">
                          <span>{rejectedBids.length} bid(s) were rejected (providers can submit revised re-bids).</span>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default JobPostingPage;
