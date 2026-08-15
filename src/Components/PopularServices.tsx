import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Award,
  Check,
  Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import cleaningImg from "../assets/popular/pro-cleaning.png";
import plumbingImg from "../assets/card-plumber.png";
import electricImg from "../assets/popular/pro-electrician.png";
import acImg from "../assets/card-ac.png";
import Wsalon from "../assets/popular/pro-wsalon.png";
import applianceImg from "../assets/popular/pro-applience.png";
import tutorImg from "../assets/popular/pro-tutor.jpg";

interface ServiceDetail {
  id: string;
  title: string;
  category: "Repairs" | "Cleaning" | "Personal Care" | "Appliances" | "Specialized";
  searchKey: string;
  rating: number;
  reviews: string;
  bookings: string;
  startingPrice: string;
  originalPrice: string;
  discount: string;
  highlightBadge: string;
  img: string;
  glowColor: string;
  badgeTheme: string;
  shortDesc: string;
  features: string[];
  customerReview: {
    name: string;
    comment: string;
    location: string;
    avatar: string;
  };
}

const servicesData: ServiceDetail[] = [
  {
    id: "ac-repair",
    title: "AC Repair & Jet Clean",
    category: "Repairs",
    searchKey: "AC Repair",
    rating: 4.9,
    reviews: "3.8k+",
    bookings: "165K+",
    startingPrice: "₹299",
    originalPrice: "₹499",
    discount: "40% OFF",
    highlightBadge: "🔥 TOP REQUESTED",
    img: acImg,
    glowColor: "from-blue-600/20 via-sky-500/20 to-indigo-600/20",
    badgeTheme: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    shortDesc: "Complete cooling inspection, high-pressure jet wash & gas refill guarantee.",
    features: [
      "Deep indoor & outdoor jet pump wash",
      "Gas leak detection & compressor diagnostic",
      "30-Day post-service satisfaction warranty",
      "Certified AC technician with genuine parts",
    ],
    customerReview: {
      name: "Rohit Verma",
      comment: "Arrived in 20 minutes! Cleaned both split units without any mess. Cooling is now ice cold.",
      location: "Sector 48 • 2 days ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "cleaning",
    title: "Deep Home Cleaning",
    category: "Cleaning",
    searchKey: "Cleaning",
    rating: 4.9,
    reviews: "5.2k+",
    bookings: "450K+",
    startingPrice: "₹499",
    originalPrice: "₹799",
    discount: "35% OFF",
    highlightBadge: "⭐ BESTSELLER",
    img: cleaningImg,
    glowColor: "from-emerald-600/20 via-teal-500/20 to-cyan-600/20",
    badgeTheme: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    shortDesc: "Hospital-grade sanitization and intense cleaning for kitchens, bathrooms & living spaces.",
    features: [
      "Industrial vacuuming & floor single-disc buffing",
      "Kitchen degreasing, chimney & cabinet scrub",
      "Bathroom descaling, tile cleaning & sanitization",
      "100% eco-friendly & pet-safe cleaning agents",
    ],
    customerReview: {
      name: "Ananya Sharma",
      comment: "My home looks and smells brand new! The 3-person team was courteous and super thorough.",
      location: "Downtown • Yesterday",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "electrician",
    title: "Expert Electrician",
    category: "Repairs",
    searchKey: "Electrician",
    rating: 4.8,
    reviews: "3.1k+",
    bookings: "280K+",
    startingPrice: "₹149",
    originalPrice: "₹249",
    discount: "40% OFF",
    highlightBadge: "⚡ 30-MIN ARRIVAL",
    img: electricImg,
    glowColor: "from-amber-600/20 via-orange-500/20 to-yellow-600/20",
    badgeTheme: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    shortDesc: "Fast diagnosis and resolution for power faults, wiring, fans, and appliance circuits.",
    features: [
      "Switchboard, MCB & fuse box repair",
      "Ceiling fan, chandelier & LED light mounting",
      "Short-circuit & voltage fluctuation resolution",
      "Govt-licensed & background-verified electrician",
    ],
    customerReview: {
      name: "Vikas Mehra",
      comment: "Fixed my main tripped breaker in 15 mins. Transparent pricing and no extra hidden fees.",
      location: "Oakridge Estate • 3 days ago",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "plumbing",
    title: "Plumbing & Leak Fix",
    category: "Repairs",
    searchKey: "Plumber",
    rating: 4.8,
    reviews: "3.6k+",
    bookings: "325K+",
    startingPrice: "₹199",
    originalPrice: "₹299",
    discount: "30% OFF",
    highlightBadge: "🛡️ 100% FIX GUARANTEE",
    img: plumbingImg,
    glowColor: "from-cyan-600/20 via-blue-500/20 to-indigo-600/20",
    badgeTheme: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    shortDesc: "Emergency resolution for leaky taps, blocked drainage, pipe bursts, and sanitary fits.",
    features: [
      "Zero-damage leak detection & pipeline mending",
      "Drain blockage & toilet clog power clearance",
      "Water heater / geyser connection & tap fits",
      "High-durability OEM washers & sealant parts",
    ],
    customerReview: {
      name: "Suresh Pillai",
      comment: "Prompt late-night service for a burst pipe under the sink. Saved our wooden flooring!",
      location: "West End • 4 days ago",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "wsalon",
    title: "Women's Salon & Spa",
    category: "Personal Care",
    searchKey: "women",
    rating: 4.9,
    reviews: "2.4k+",
    bookings: "140K+",
    startingPrice: "₹399",
    originalPrice: "₹699",
    discount: "45% OFF",
    highlightBadge: "✨ LUXURY AT HOME",
    img: Wsalon,
    glowColor: "from-pink-600/20 via-rose-500/20 to-purple-600/20",
    badgeTheme: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/30",
    shortDesc: "Premium salon pampering with hygienic single-use kits and branded cosmetics.",
    features: [
      "Fruit & gold glow facials with massage",
      "Painless chocolate roll-on waxing & cleanup",
      "Mani-pedi spa with cuticle nourishing therapy",
      "100% sealed, single-use mono-dose kits",
    ],
    customerReview: {
      name: "Pooja Malhotra",
      comment: "Super hygienic setup with disposable sheets and gloves. Beautician was exceptionally skilled.",
      location: "Cyber City • 5 days ago",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "appliance",
    title: "Appliance Care & Repair",
    category: "Appliances",
    searchKey: "appliances",
    rating: 4.8,
    reviews: "2.9k+",
    bookings: "200K+",
    startingPrice: "₹249",
    originalPrice: "₹399",
    discount: "35% OFF",
    highlightBadge: "🔧 OEM PARTS",
    img: applianceImg,
    glowColor: "from-indigo-600/20 via-purple-500/20 to-blue-600/20",
    badgeTheme: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    shortDesc: "Certified brand technicians for washing machines, refrigerators, microwaves & RO units.",
    features: [
      "Motor, PCB & compressor in-depth diagnosis",
      "Genuine branded replacement components",
      "90-Day warranty on all replaced spare parts",
      "Doorstep test run before final handover",
    ],
    customerReview: {
      name: "Karan Johar",
      comment: "Fixed my front-load washing machine drum noise right in front of me. Very reasonable rate.",
      location: "Skyline Towers • 1 week ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
  },
  {
    id: "tutor",
    title: "1-on-1 Home Tutor",
    category: "Specialized",
    searchKey: "tutor",
    rating: 4.9,
    reviews: "2.1k+",
    bookings: "95K+",
    startingPrice: "₹349",
    originalPrice: "₹599",
    discount: "40% OFF",
    highlightBadge: "📚 TOP EDUCATORS",
    img: tutorImg,
    glowColor: "from-purple-600/20 via-indigo-500/20 to-sky-600/20",
    badgeTheme: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    shortDesc: "Certified tutors for K-12 school curriculum, maths, science & entrance exam guidance.",
    features: [
      "1-on-1 personalized concept learning",
      "CBSE, ICSE & State board certified teachers",
      "Weekly mock tests & progress reports",
      "Free 1-hour trial class before booking",
    ],
    customerReview: {
      name: "Deepika Sen",
      comment: "Our son's math grades improved from C to A! The tutor is patient, punctual and encouraging.",
      location: "Park Avenue • 3 days ago",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    },
  },
];

const smoothEase = [0.16, 1, 0.3, 1] as const;

export default function PopularServices() {
  const [selectedService, setSelectedService] = useState<ServiceDetail>(servicesData[0]);
  const navigate = useNavigate();

  const handleBookNow = (service: ServiceDetail) => {
    navigate("/service", { state: { search: service.searchKey } });
  };

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-gradient-to-b from-slate-50 via-white to-slate-100/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/8 dark:bg-blue-600/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-indigo-500/8 dark:bg-indigo-600/12 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10 text-left">
          <div className="max-w-2xl">
            {/* Top Micro Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-400/30 backdrop-blur-md mb-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-400"></span>
              </span>
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Trending & Most Requested
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2]">
              Explore Popular{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400">
                Home Services
              </span>
            </h2>

            {/* Subtitle */}
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Click any service to view live technician coverage, package inclusions, and verified customer reviews.
            </p>
          </div>

          {/* Header Action Button */}
          <div className="shrink-0">
            <button
              onClick={() => navigate("/service")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all duration-200 cursor-pointer group"
            >
              <span>View All 24+ Services</span>
              <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ================= SPLIT SHOWCASE SPOTLIGHT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* LEFT: INTERACTIVE SERVICE SELECTOR LIST (5 cols, seamless fit without scrollbar) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-1.5 h-full">
            {servicesData.map((service) => {
              const isSelected = selectedService.id === service.id;
              return (
                <motion.div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  whileHover={{ scale: 1.008, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  className={`py-1.5 px-2 sm:py-2 sm:px-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 text-left relative overflow-hidden ${
                    isSelected
                      ? "bg-white dark:bg-slate-800/95 border-blue-500 shadow-[0_4px_16px_rgba(37,99,235,0.12)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] ring-1.5 ring-blue-500/25"
                      : "bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800/80 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
                  }`}
                >
                  {/* Left Active Accent Bar */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeAccentBar"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"
                    />
                  )}

                  <div className="flex items-center gap-2 min-w-0 pl-0.5">
                    {/* 3D Mini Thumbnail */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border overflow-hidden transition-all ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800"
                          : "bg-slate-50 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60"
                      }`}
                    >
                      <img
                        src={service.img}
                        alt={service.title}
                        className="w-6 h-6 object-contain drop-shadow-2xs"
                      />
                    </div>

                    {/* Text Details */}
                    <div className="min-w-0">
                      <h4
                        className={`text-xs sm:text-[13px] font-bold truncate leading-tight transition-colors ${
                          isSelected
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {service.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                          Starts{" "}
                          <strong className="text-slate-900 dark:text-white font-bold">
                            {service.startingPrice}
                          </strong>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <div className="flex items-center gap-0.5 text-[10.5px] text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Status Pill & Arrow */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`hidden sm:inline-block text-[8.5px] font-bold px-1.5 py-0.5 rounded-full border ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {service.discount}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400 translate-x-0.5"
                          : "text-slate-400"
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: STICKY 3D SPOTLIGHT PREVIEW CARD (7 cols, matching height) */}
          <div className="lg:col-span-7 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedService.id}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className="relative h-full rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_16px_45px_rgba(0,0,0,0.07)] dark:shadow-[0_20px_55px_rgba(0,0,0,0.55)] p-5 sm:p-6 text-left overflow-hidden flex flex-col justify-between"
              >
                {/* Dynamic Ambient Background Glow */}
                <div
                  className={`absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br ${selectedService.glowColor} rounded-full blur-3xl pointer-events-none opacity-80`}
                />

                {/* Card Header & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${selectedService.badgeTheme}`}
                    >
                      {selectedService.highlightBadge}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      ⚡ 30m Arrival
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {selectedService.rating}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      ({selectedService.reviews})
                    </span>
                  </div>
                </div>

                {/* Hero Showcase: Title, 3D Image & Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center relative z-10 my-1">
                  {/* Left details */}
                  <div className="sm:col-span-8">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {selectedService.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {selectedService.shortDesc}
                    </p>

                    {/* Pricing Block */}
                    <div className="mt-2.5 flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {selectedService.startingPrice}
                      </span>
                      <span className="text-xs line-through text-slate-400 font-medium">
                        {selectedService.originalPrice}
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {selectedService.discount}
                      </span>
                    </div>
                  </div>

                  {/* Right 3D Visual Podium */}
                  <div className="sm:col-span-4 flex justify-center">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50/50 dark:from-slate-800 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 p-2.5 flex items-center justify-center shadow-md"
                    >
                      <img
                        src={selectedService.img}
                        alt={selectedService.title}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-lg"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Key Inclusions / Features */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {selectedService.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-200">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compact Customer Review */}
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2.5 relative z-10">
                  <img
                    src={selectedService.customerReview.avatar}
                    alt={selectedService.customerReview.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
                  />
                  <div className="text-[11px] min-w-0">
                    <p className="text-slate-700 dark:text-slate-200 italic truncate">
                      "{selectedService.customerReview.comment}"
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      — {selectedService.customerReview.name} ({selectedService.customerReview.location})
                    </span>
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="flex items-center gap-2.5 relative z-10 pt-1">
                  <button
                    type="button"
                    onClick={() => handleBookNow(selectedService)}
                    className="grow py-2.5 sm:py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 hover:shadow-blue-600/45 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
                  >
                    <span>Book {selectedService.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/service")}
                    className="py-2.5 sm:py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all duration-200 cursor-pointer shrink-0"
                  >
                    All Services
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ================= BOTTOM VALUE TRUST STRIP ================= */}
        <div className="mt-12 sm:mt-16 p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                100% Verified Pros
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Strict background & skill check
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                30-Min Arrival
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Instant doorstep service guarantee
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Upfront Pricing
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Zero hidden charges or surprises
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                7-Day Re-service
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                100% satisfaction or free fix
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
