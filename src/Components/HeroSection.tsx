import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star, Users } from "lucide-react";

import herobg from '../assets/hero-bg.png';
import heroimg from '../assets/hero-img1.png'
import heroMobile from "../assets/HeroMobile.png"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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


/* Floating animation */
const float: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const trustItems = [
  {
    title: "2,500+ Providers",
    desc: "Verified professionals from your local area",
    icon: <Users className="w-5 h-5 text-blue-600" />,
    bg: "bg-blue-100",
  },
  {
    title: "4.5★ Average Rating",
    desc: "Trusted by nearby customers",
    icon: <Star className="w-5 h-5 text-amber-600" />,
    bg: "bg-amber-100",
  },
  {
    title: "Local Experts",
    desc: "Services available in your neighborhood",
    icon: "📍",
    bg: "bg-emerald-100",
  },
  {
    title: "Quick & Easy",
    desc: "Book services in just a few taps",
    icon: "⚡",
    bg: "bg-purple-100",
  },
];

const mobileServices = [
  { label: "Insta Help", icon: callIcon, badge: "NEW" },
  { label: "Women's Salon", icon: womenIcon },
  { label: "Men's Care", icon: menIcon },

  { label: "Cleaning", icon: cleaningIcon },
  { label: "Electrician", icon: electricIcon },
  { label: "Plumber", icon: plumberIcon },

  { label: "Kitchen", icon: kitchenIcon },
  { label: "Laundry", icon: laundryIcon },
  { label: "Carpenter", icon: carpenterIcon },
];


export default function HeroSearchSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % trustItems.length);
    }, 4000); // 4 seconds per slide

    return () => clearInterval(interval);
  }, []);


  return (
    <section
      className={`relative min-h-[92vh] overflow-hidden flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 transition-colors duration-500 ${theme === 'light' ? 'bg-no-repeat bg-cover bg-center' : 'bg-slate-950/90'}`}
      style={theme === 'light' ? { backgroundImage: `url(${herobg})` } : {}}
    >
      {/* ---------- BACKGROUND EFFECTS ---------- */}
      <div className="pointer-events-none absolute inset-0">
        {theme === 'dark' && <LottieBackground />}

        {/* blue glow behind phone - hide on mobile */}
        <div className="absolute right-[-200px] lg:right-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[650px] lg:h-[650px] bg-blue-400/20 rounded-full blur-[100px] lg:blur-[140px] hidden md:block" />

        {/* subtle radial mist - hide on mobile */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_60%)] hidden md:block" />

        {/* Mobile gradient background */}
        <div className={`absolute inset-0 md:hidden ${theme === 'light' ? 'bg-gradient-to-b from-blue-50 via-white to-blue-50' : 'bg-gradient-to-b from-slate-900/60 to-slate-950/90'}`} />
      </div>

      {/* ---------- MAIN GRID ---------- */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center w-full max-w-7xl gap-8 md:gap-12 lg:gap-16">

        {/* ================= LEFT CONTENT (Center on mobile) ================= */}
        <div className="order-1 w-full text-center md:text-left lg:order-1 mt-8 lg:mt-0 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] md:leading-[1.05] text-slate-900 dark:text-white transition-colors">
            Find Nearby Home Service Providers
          </h1>

          <p className="mt-4 sm:mt-6 max-w-xl text-slate-600 dark:text-blue-100 text-lg md:text-xl mx-auto md:mx-0 transition-colors opacity-90">
            Book trusted professionals for cleaning, plumbing, repairs & more —
            right at your doorstep.
          </p>

          {/* BOOK SERVICE BUTTON */}
          <div className="mt-8 sm:mt-10 flex justify-center md:justify-start">
            <button onClick={() => navigate('/service')} className="px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              Book your service provider now
            </button>
          </div>

          {/* MOBILE HERO IMAGE */}
          <div className="relative mt-8 flex justify-center md:hidden">
            <img
              src={heroimg}
              alt="Home services illustration"
              className="
      w-full
      max-w-[320px]
      sm:max-w-[360px]
      object-contain
      drop-shadow-xl

      [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]
      [-webkit-mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]
    "
            />
          </div>

          {/* MOBILE TRUST SLIDER */}
          {/* MOBILE TRUST SLIDER */}
          <div className="mt-8 md:hidden overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >

              {trustItems.map((item, index) => (
                <div key={index} className="min-w-full px-2">
                  <div className="
          rounded-xl
          p-4
          border
          border-gray-200 dark:border-slate-700
          bg-transparent dark:bg-slate-800/80
          backdrop-blur-sm
        ">
                    <div className="flex gap-3 items-start">
                      <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-blue-200 leading-snug transition-colors">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          {/* DOTS */}
          <div className="mt-4 flex justify-center gap-2 md:hidden">
            {trustItems.map((_, i) => (
              <div
                key={i}
                className={`
        h-2 rounded-full transition-all duration-300
        ${activeIndex === i ? "w-4 bg-slate-800 dark:bg-white" : "w-2 bg-gray-300 dark:bg-slate-600"}
      `}
              />
            ))}
          </div>


          {/* DESKTOP TRUST GRID */}
          <div className="mt-8 hidden md:grid grid-cols-2 gap-4">
            {trustItems.map((item, index) => (
              <div
                key={index}
                className="
        rounded-2xl
        p-4
        bg-white/70 dark:bg-slate-800/60
        backdrop-blur-xl
        border border-white/40 dark:border-slate-700
        shadow-[0_10px_30px_rgba(0,0,0,0.12)]
      "
              >
                <div className="flex gap-3 items-start">
                  <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-blue-100 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE SERVICES – 3x3 GRID INSIDE ONE BORDER */}

          <div className="mt-5 md:hidden relative z-10 w-full max-w-sm mx-auto">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 text-center transition-colors shadow-sm">
              What are you looking for?
            </h3>

            {/* OUTER CARD */}
            {/* INNER SOFT BORDER */}
            <div className="rounded-xl border border-gray-300 dark:border-slate-700 p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-2.5">

                {mobileServices.map((item, i) => (
                  <div
                    key={i}
                    className="
              relative
              flex flex-col items-center justify-center
              gap-1.5
              py-3
              rounded-xl
              border border-gray-200 dark:border-slate-600
              bg-gray-50 dark:bg-slate-800
              text-center
              active:scale-95
              transition-colors
            "
                  >
                    {/* NEW badge */}
                    {item.badge && (
                      <span className="absolute top-1 right-1 text-[8px] px-1.5 py-[1px] rounded-full bg-pink-600 text-white font-semibold">
                        {item.badge}
                      </span>
                    )}

                    {/* ICON */}
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-8 h-8 object-contain"
                    />

                    {/* LABEL */}
                    <p className="text-[10px] font-medium text-slate-800 dark:text-white leading-tight">
                      {item.label}
                    </p>
                  </div>
                ))}

              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT PHONE ================= */}
        <div className="order-2 lg:order-2 relative flex justify-center hidden md:flex">

          {/* PHONE WRAPPER (hover depth) */}
          <motion.div
            whileHover={{ rotateY: -6, rotateX: 4 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="perspective-distant"
          >
            {/* PHONE BODY */}
            <div className="relative z-10 md:w-[240px] md:h-[500px] lg:w-[290px] lg:h-[530px] rounded-[40px] lg:rounded-[52px]
              bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#020617]
              border-[14px] border-[#020617]
              shadow-[0_20px_60px_rgba(59,130,246,0.25)] lg:shadow-[0_40px_120px_rgba(59,130,246,0.35)]
              overflow-hidden">

              {/* notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[26px] lg:w-[140px] lg:h-[26px] bg-[#020617] rounded-b-3xl" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[70px] h-[6px] lg:w-[80px] lg:h-[6px] bg-slate-700 rounded-full" />

              {/* screen */}
              <div className="h-full px-5 lg:px-6 pt-12 lg:pt-14 pb-6 lg:pb-8 space-y-4"
                style={{
                  backgroundImage: `url(${heroMobile})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}>

              </div>
            </div>
          </motion.div>

          {/* FLOATING TAGS - Desktop only */}
          {[
            { label: "🧹 Cleaning", className: "left-4 top-14 lg:left-15 lg:top-35", delay: 0, color: "blue" },
            { label: "⚡ Electrical", className: "left-6 top-56 lg:left-8 lg:top-70", delay: 0.5, color: "amber" },
            { label: "🔧 Plumbing", className: "right-6 top-22 lg:right-15 lg:top-10", delay: 0.8, color: "emerald" },
            { label: "❄️ AC Repair", className: "right-8 top-50 lg:right-12 lg:top-48", delay: 1.2, color: "indigo" },
            { label: "📅 Book Service", className: "right-4 top-76 lg:right-4 lg:top-80", delay: 1.6, color: "rose" },
          ].map((item, i) => {
            const colors: Record<string, string> = {
              blue: "text-blue-400 border-blue-500/30",
              amber: "text-amber-400 border-amber-500/30",
              emerald: "text-emerald-400 border-emerald-500/30",
              indigo: "text-indigo-400 border-indigo-500/30",
              rose: "text-rose-400 border-rose-500/30",
            };

            return (
              <motion.div
                key={i}
                variants={float}
                animate="animate"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.delay }}
                className={`absolute ${item.className}
                  z-20 px-4 py-3 lg:px-5 lg:py-3 rounded-full
                  text-sm lg:text-sm font-semibold 
                  backdrop-blur-xl
                  border-[1.5px] 
                  transition-all duration-300 cursor-pointer 
                  hidden md:block
                  ${theme === 'light'
                    ? 'bg-white/80 border-white text-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.3)]'
                    : `bg-slate-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${colors[item.color]}`}
                `}
              >
                <span className={`inline-block mr-1`}>{item.label.split(' ')[0]}</span>
                <span>{item.label.split(' ').slice(1).join(' ')}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

/* ---------- SMALL COMPONENT ---------- */
function AppCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-white font-medium text-base">{title}</p>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="h-2 bg-slate-700/50 rounded-full" />
    </div>
  );
}

