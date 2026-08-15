import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShieldCheck,
  Zap,
  Search,
  ArrowRight,
  Sparkles,
  Award,
  X,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import herobg from "../assets/hero-bg.png";
import heroimg from "../assets/hero-img1.png";
import heroMobile from "../assets/HeroMobile.png";
import { useTheme } from "../Context/ThemeContext.tsx";
import LottieBackground from "./LottieBackground";

import cleaningIcon from "../assets/icons/cleaning-icon.png";
import electricIcon from "../assets/icons/electric-icon.png";
import plumberIcon from "../assets/icons/plumber-icon.png";
import menIcon from "../assets/icons/men-icon.png";
import womenIcon from "../assets/icons/women-icon.png";
import kitchenIcon from "../assets/icons/kitchen-icon.png";
import laundryIcon from "../assets/icons/laundry-icon.png";
import carpenterIcon from "../assets/icons/carpanter-icon.png";
import callIcon from "../assets/icons/Call_us-icon.png";

const liveBookings = [
  {
    name: "Rahul M.",
    service: "AC Deep Clean",
    location: "Nearby",
    time: "Just now",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    name: "Priya S.",
    service: "Full Home Cleaning",
    location: "Downtown",
    time: "2m ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  },
  {
    name: "Amit K.",
    service: "Switchboard Fix",
    location: "Sector 4",
    time: "3m ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    name: "Sneha R.",
    service: "Kitchen Plumbing",
    location: "West End",
    time: "5m ago",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
  },
];

const customerAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
];

const coreGuarantees = [
  {
    title: "100% Verified Pros",
    sub: "Background checked",
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    title: "30-Min Arrival",
    sub: "Doorstep guarantee",
    icon: <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />,
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    title: "Money-Back Shield",
    sub: "Pay after satisfaction",
    icon: <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
];

const mobileServices = [
  { label: "Insta Help", icon: callIcon, badge: "FAST", category: "appliances" },
  { label: "Women's Salon", icon: womenIcon, category: "women" },
  { label: "Men's Care", icon: menIcon, category: "men" },
  { label: "Cleaning", icon: cleaningIcon, badge: "POPULAR", category: "cleaning" },
  { label: "Electrician", icon: electricIcon, category: "electrician" },
  { label: "Plumber", icon: plumberIcon, category: "plumber" },
  { label: "Kitchen Care", icon: kitchenIcon, category: "kitchen" },
  { label: "Laundry", icon: laundryIcon, category: "laundry" },
  { label: "Carpenter", icon: carpenterIcon, category: "carpenter" },
];

const quickSearchTags = [
  { name: "AC Repair", icon: "❄️" },
  { name: "Deep Cleaning", icon: "🧹" },
  { name: "Plumber", icon: "🔧" },
  { name: "Electrician", icon: "⚡" },
  { name: "Sofa Cleaning", icon: "🛋️" },
  { name: "Salon at Home", icon: "💇‍♀️" },
];

// Smooth Apple-style cubic bezier ease curve
const smoothEase = [0.16, 1, 0.3, 1] as const;

export default function HeroSearchSection() {
  const [liveIndex, setLiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveIndex((prev) => (prev + 1) % liveBookings.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      if (searchQuery.trim()) {
        navigate("/service", { state: { search: searchQuery.trim() } });
      } else {
        navigate("/service");
      }
    }, 200);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setIsSearching(true);
    setTimeout(() => {
      navigate("/service", { state: { search: tag } });
    }, 320);
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery(category);
    setIsSearching(true);
    setTimeout(() => {
      navigate("/service", { state: { search: category } });
    }, 320);
  };

  const currentLive = liveBookings[liveIndex];

  return (
    <section
      className={`relative min-h-[92vh] overflow-hidden flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 lg:py-16 transition-colors duration-500 will-change-auto ${
        theme === "light"
          ? "bg-no-repeat bg-cover bg-center"
          : "bg-slate-950/95"
      }`}
      style={theme === "light" ? { backgroundImage: `url(${herobg})` } : {}}
    >
      {/* ---------- BACKGROUND ACCENTS & EFFECTS ---------- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {theme === "dark" && <LottieBackground />}

        {/* Ambient colored glowing orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[120px] transform-gpu" />
        <div className="absolute top-1/2 right-[-150px] lg:right-[-80px] -translate-y-1/2 w-[450px] h-[450px] lg:w-[650px] lg:h-[650px] bg-indigo-500/15 dark:bg-indigo-600/25 rounded-full blur-[140px] hidden md:block transform-gpu" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-sky-400/10 dark:bg-sky-500/15 rounded-full blur-[100px] transform-gpu" />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(0,0,0,0))]" />

        {/* Mobile gradient overlay for seamless readability */}
        <div
          className={`absolute inset-0 md:hidden ${
            theme === "light"
              ? "bg-gradient-to-b from-white/75 via-blue-50/85 to-white/95"
              : "bg-gradient-to-b from-slate-950/85 via-slate-900/90 to-slate-950/95"
          }`}
        />
      </div>

      {/* ---------- MAIN CONTAINER ---------- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8 xl:gap-12">
        {/* ================= LEFT CONTENT COLUMN ================= */}
        <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* TOP PILL BADGE */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-400/30 backdrop-blur-md mb-5"
          >
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 dark:bg-blue-400"></span>
            </span>
            <span className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Over 50,000+ Happy Households Served
            </span>
          </motion.div>

          {/* MAIN HEADLINE */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: smoothEase, delay: 0.08 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-[40px] font-extrabold tracking-tight leading-[1.2] text-slate-900 dark:text-white"
          >
            Find & Book Trusted <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400">
              Home Service
            </span>{" "}
            Experts Near You
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: smoothEase, delay: 0.16 }}
            className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
          >
            Verified electricians, plumbers, house cleaners, and technicians
            ready to help at your doorstep in under 30 minutes.
          </motion.p>

          {/* ================= SMART CAPSULE SEARCH & BOOKING BAR ================= */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: smoothEase, delay: 0.24 }}
            className="mt-7 w-full max-w-xl relative"
          >
            <form
              onSubmit={handleSearchSubmit}
              className={`relative p-1.5 sm:p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border transition-all duration-300 flex flex-col sm:flex-row items-center gap-2 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)] ${
                isSearching
                  ? "border-blue-500 ring-4 ring-blue-500/15 dark:ring-blue-500/25 shadow-blue-500/10"
                  : "border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus-within:ring-4 focus-within:ring-blue-500/15 focus-within:border-blue-500"
              }`}
            >
              {/* Main Service Input Segment */}
              <div className="flex items-center gap-2.5 w-full px-2.5 py-1">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="flex flex-col grow min-w-0 text-left">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    Service
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search AC repair, cleaning, plumber..."
                    className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none truncate"
                  />
                </div>

                {/* Clear Input Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Submit CTA Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shrink-0"
              >
                <span>Find Experts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* QUICK FILTER TAGS */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
                🔥 Popular:
              </span>
              {quickSearchTags.map((tag) => {
                const isActive = searchQuery === tag.name;
                return (
                  <button
                    key={tag.name}
                    type="button"
                    onClick={() => handleTagClick(tag.name)}
                    className={`text-xs px-3 py-1.5 rounded-full border backdrop-blur-sm transition-all duration-250 ease-out cursor-pointer flex items-center gap-1.5 font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/35 scale-105"
                        : "bg-white/80 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400/50 hover:scale-[1.03]"
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ================= SOCIAL PROOF STRIP (DESKTOP) ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: smoothEase, delay: 0.32 }}
            className="mt-8 hidden md:flex flex-col gap-4 w-full max-w-xl text-left"
          >
            {/* Top Proof Bar: Avatars + Rating + Live Booking Ticker */}
            <div className="p-3.5 rounded-2xl bg-white/75 dark:bg-slate-800/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center justify-between gap-4">
              {/* Customer Avatar Stack */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex -space-x-2.5 overflow-hidden">
                  {customerAvatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Customer"
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      4.9
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                    50k+ Happy Customers
                  </p>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="h-9 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

              {/* Realtime Booking Activity Ticker */}
              <div className="overflow-hidden relative h-9 flex items-center grow">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={liveIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: smoothEase }}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleTagClick(currentLive.service)}
                  >
                    <span className="flex h-2 w-2 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <div className="text-xs leading-tight">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        <span className="text-blue-600 dark:text-blue-400">{currentLive.name}</span> booked {currentLive.service}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {currentLive.location} • {currentLive.time}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* 3 Core Guarantees Pill Badges */}
            <div className="grid grid-cols-3 gap-2.5">
              {coreGuarantees.map((item, idx) => (
                <div
                  key={idx}
                  className="group p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all duration-300 flex items-center gap-2.5 cursor-default"
                >
                  <div className={`p-1.5 rounded-lg border shrink-0 ${item.bg}`}>
                    {item.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ================= MOBILE EXCLUSIVE SECTION ================= */}
          {/* MOBILE HERO IMAGE */}
          <div className="relative mt-7 flex justify-center md:hidden w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/15 rounded-full blur-2xl transform scale-90" />
              <img
                src={heroimg}
                alt="Home services illustration"
                className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] object-contain drop-shadow-xl [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
              />
            </div>
          </div>

          {/* MOBILE SOCIAL PROOF STRIP */}
          <div className="mt-6 md:hidden w-full max-w-sm flex flex-col gap-3">
            {/* Mobile Avatars & Live Ticker */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  {customerAvatars.slice(0, 3).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Customer"
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  4.9 <span className="text-[10px] text-slate-500 font-normal">(50k+)</span>
                </div>
              </div>

              {/* Mobile Live Booking Ticker */}
              <div className="overflow-hidden relative h-7 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={liveIndex}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="truncate max-w-[130px]">{currentLive.name} booked {currentLive.service}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile 3 Quick Guarantee Badges */}
            <div className="grid grid-cols-3 gap-1.5">
              {coreGuarantees.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 flex flex-col items-center text-center gap-1"
                >
                  <div className={`p-1 rounded-md border ${item.bg}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MOBILE 3x3 CATEGORY GRID */}
          <div className="mt-6 md:hidden w-full max-w-sm">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Explore Services
              </h2>
              <button
                onClick={() => navigate("/service")}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 shadow-lg">
              <div className="grid grid-cols-3 gap-2">
                {mobileServices.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleCategoryClick(item.category || item.label)}
                    className="relative flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-slate-700/80 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm">
                        {item.badge}
                      </span>
                    )}
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-7 h-7 object-contain mb-1.5"
                    />
                    <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PHONE MOCKUP COLUMN (DESKTOP) ================= */}
        <div className="lg:col-span-5 relative hidden md:flex items-center justify-center">
          {/* Ambient Glows around the phone */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-600/30 to-indigo-500/30 rounded-full blur-[80px] -z-10 transform-gpu" />

          {/* INTERACTIVE PHONE FRAME */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
            whileHover={{ rotateY: -5, rotateX: 3, scale: 1.015 }}
            className="relative z-10 perspective-1000 transform-gpu"
          >
            {/* Realistic iPhone Bezel Frame */}
            <div className="relative w-[260px] h-[520px] lg:w-[290px] lg:h-[570px] rounded-[44px] lg:rounded-[48px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-[10px] lg:p-[12px] shadow-[0_25px_70px_rgba(37,99,235,0.22)] dark:shadow-[0_30px_90px_rgba(0,0,0,0.7)] border-[3px] border-slate-700/80">
              {/* Outer Edge Metallic Accent */}
              <div className="absolute inset-0 rounded-[44px] lg:rounded-[48px] border border-white/20 pointer-events-none" />

              {/* Dynamic Island / Top Camera Bar */}
              <div className="absolute top-4 lg:top-5 left-1/2 -translate-x-1/2 w-24 lg:w-28 h-5 lg:h-6 bg-black rounded-full z-30 flex items-center justify-end px-2.5 gap-1.5 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600/60" />
              </div>

              {/* Inner Screen Content with HeroMobile Background */}
              <div
                className="w-full h-full rounded-[34px] lg:rounded-[38px] overflow-hidden relative"
                style={{
                  backgroundImage: `url(${heroMobile})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Subtle glass reflection gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* ================= FLOATING GLASS BADGES ================= */}

          {/* TOP RIGHT: Live Booking Notification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, ease: smoothEase, delay: 0.35 }}
            className="absolute -top-4 right-0 lg:-right-4 z-20"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 lg:p-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/80 dark:border-slate-700/80 shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigate("/service")}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Live Booking
                  </p>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  AC Deep Clean Booked
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  2 mins ago in your area
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* LEFT CENTER: Verified Pro Guarantee */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, ease: smoothEase, delay: 0.45 }}
            className="absolute top-1/3 -left-8 lg:-left-12 z-20"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 lg:p-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/80 dark:border-slate-700/80 shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    100% Verified Pros
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    ID & Skill Certified
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* BOTTOM RIGHT: Customer Satisfaction Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: smoothEase, delay: 0.55 }}
            className="absolute -bottom-6 right-2 lg:-right-2 z-20"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 lg:p-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/80 dark:border-slate-700/80 shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
                <Star className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    4.9 / 5.0 Rating
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  From 15,000+ Reviews
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* FLOATING SERVICE CHIPS */}
          {[
            {
              label: "🧹 Deep Cleaning",
              className: "left-2 -top-6 lg:left-0 lg:-top-8",
              delay: 0.25,
              category: "cleaning",
            },
            {
              label: "⚡ Electrician",
              className: "left-4 bottom-16 lg:-left-2 lg:bottom-20",
              delay: 0.4,
              category: "electrician",
            },
            {
              label: "🔧 Expert Plumber",
              className: "right-4 top-40 lg:right-2 lg:top-44",
              delay: 0.55,
              category: "plumber",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: smoothEase, delay: item.delay }}
              className={`absolute ${item.className} z-20`}
            >
              <motion.button
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 4 + i * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                onClick={() => handleTagClick(item.category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-md hover:scale-110 active:scale-95 ${
                  theme === "light"
                    ? "bg-white/90 border-blue-100 text-slate-800 shadow-blue-500/10 hover:shadow-blue-500/25"
                    : "bg-slate-900/90 border-slate-700 text-blue-300 shadow-black/40 hover:border-blue-500/50"
                }`}
              >
                {item.label}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
