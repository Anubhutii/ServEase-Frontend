import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  LogIn,
  PlusCircle,
  Zap,
} from "lucide-react";
import { usePostJob } from "./PostJobModal";

const SPRightSidebar: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { openPostJob } = usePostJob();

  return (
    <aside className="w-full space-y-4 transition-all duration-300">
      
      {/* 1. HERO POST-A-JOB BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 p-4 text-white shadow-sm">
        <div className="relative z-10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-blue-50 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-300 animate-spin-slow" />
              <span>Custom Quote</span>
            </span>
          </div>

          <div>
            <h3 className="text-sm font-extrabold tracking-tight leading-tight">
              Post a Task & Receive Bids
            </h3>
            <p className="text-[11px] text-blue-100/90 mt-0.5 leading-relaxed">
              Describe your repair or maintenance needs & let nearby specialists place offers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openPostJob()}
            className="w-full py-2.5 px-3.5 bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Post a Job Free</span>
          </button>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </div>

      {/* 2. GUEST LOGIN CARD (IF LOGGED OUT) */}
      {!isLoggedIn && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <LogIn size={14} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                Guest Visitor
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Log in to auto-fill address & track bookings
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition shadow-2xs"
          >
            Login / Sign Up
          </button>
        </div>
      )}

      {/* 3. HOW SERVEASE WORKS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
            <Zap size={13} />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            How It Works
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </span>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                Select a Specialist
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Browse ratings, experience & upfront consultation fees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </span>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                Schedule Arrival Window
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Pick a convenient day & 2-hour arrival slot on checkout.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </span>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                Pay After Service
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect completed work before releasing payment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SERVEASE QUALITY & SAFETY ASSURANCES */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Quality Guarantees
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
            <span className="text-[11px] font-semibold">100% Background Verified Pros</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Clock size={14} className="text-blue-500 flex-shrink-0" />
            <span className="text-[11px] font-semibold">Free Rescheduling Up to 2 hrs</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Sparkles size={14} className="text-amber-500 flex-shrink-0" />
            <span className="text-[11px] font-semibold">30-Day Workmanship Warranty</span>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default SPRightSidebar;
