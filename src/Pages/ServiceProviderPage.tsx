import React, { useRef, useState, useEffect } from "react";
import { Button, Input, Collapse } from "antd";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Clock,
  MapPin,
  IndianRupee,
  LocateFixed,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import chef from "../assets/card-chef.png";
import cleaning from "../assets/card-cleaning.png";
import salon from "../assets/card-salon.png";
import laundry from "../assets/card-laundry.png";
import plumber from "../assets/card-plumber.png";
import ac from "../assets/card-ac.png";

import Footer from "../Components/Footer";
import ServiceProviderForm from "../Components/ServiceProviderForm";
import { useTheme } from "../Context/ThemeContext";

const serviceCards = [
  {
    category: "plumber",
    title: "Plumbing Specialist",
    subtitle: "Pipe leakage, tap repairs & bathroom installations",
    earning: "₹1,200 - ₹2,500 / day",
    tag: "High Demand",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50/70 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40",
    image: plumber,
  },
  {
    category: "electrician",
    title: "Electrician Expert",
    subtitle: "Wiring, switchboards, fans, MCB & inverter repairs",
    earning: "₹1,500 - ₹3,000 / day",
    tag: "Top Earner",
    color: "from-amber-500 to-yellow-500",
    bg: "bg-amber-50/70 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40",
    image: ac,
  },
  {
    category: "maid",
    title: "Home Deep Cleaning",
    subtitle: "Full house cleaning, kitchen, sofa & bathroom scrubbing",
    earning: "₹1,000 - ₹2,200 / day",
    tag: "Steady Jobs",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40",
    image: cleaning,
  },
  {
    category: "salon_women",
    title: "Salon & Beauty Pro",
    subtitle: "Hair styling, waxing, facial & bridal makeup at home",
    earning: "₹2,000 - ₹4,500 / day",
    tag: "High Margin",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50/70 dark:bg-pink-950/30 border-pink-100 dark:border-pink-900/40",
    image: salon,
  },
  {
    category: "cook",
    title: "Home Chef & Cook",
    subtitle: "Daily meals, party preparation & dietary catering",
    earning: "₹1,200 - ₹2,800 / day",
    tag: "Repeat Clients",
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-50/70 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/40",
    image: chef,
  },
  {
    category: "carpenter",
    title: "Master Carpenter",
    subtitle: "Furniture repair, locks, custom shelving & woodwork",
    earning: "₹1,400 - ₹2,800 / day",
    tag: "Popular",
    color: "from-purple-500 to-indigo-500",
    bg: "bg-purple-50/70 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/40",
    image: laundry,
  },
];

const faqs = [
  {
    key: "1",
    label: "Is there any registration fee to join ServEase as a partner?",
    children:
      "No! Registration on ServEase is 100% free. We don't charge any upfront setup fees or subscription charges. You can start receiving customer job leads right away.",
  },
  {
    key: "2",
    label: "How and when do I get paid for completed jobs?",
    children:
      "You receive payments directly from the customer via cash or UPI immediately upon completing the service. For direct platform bookings, payments are securely credited to your registered bank account.",
  },
  {
    key: "3",
    label: "Can I choose my own working hours and service locations?",
    children:
      "Yes! You are your own boss. You can set your availability status, select your operating radius (e.g., within 5-10 km of your area), and accept or decline requests based on your schedule.",
  },
  {
    key: "4",
    label: "What documents do I need to get verified?",
    children:
      "You only need a government-issued ID proof (Aadhaar Card, PAN Card, or Driving License) and a clear profile photo. Verification is completed quickly so you can start taking jobs.",
  },
  {
    key: "5",
    label: "How does the customer bidding and direct booking system work?",
    children:
      "Customers post jobs with their problem details and budget range. You can view all nearby open requests and submit your price quote and estimated timeline, or customers can book you directly based on your visiting fee.",
  },
];

const ServiceProviderPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [detectingLoc, setDetectingLoc] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const updateButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 10);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scrollNext = () => {
    containerRef.current?.scrollBy({
      left: 360,
      behavior: "smooth",
    });
  };

  const scrollPrev = () => {
    containerRef.current?.scrollBy({
      left: -360,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem("userLocation");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.city) setLocationInput(parsed.city);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.suburb ||
            data.address?.county ||
            "Current City";
          setLocationInput(city);
          localStorage.setItem(
            "userLocation",
            JSON.stringify({ lat, lon, city })
          );
        } catch {
          setLocationInput("Local Area");
        } finally {
          setDetectingLoc(false);
        }
      },
      () => setDetectingLoc(false)
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-800"}`}>

      {/* ================= HERO BANNER SECTION ================= */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 border-b dark:border-slate-800/80 bg-gradient-to-b from-blue-50/60 via-white to-transparent dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join India&apos;s Fastest Growing Home Services Network</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Turn Your Expertise Into <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Steady Daily Income
                </span>
              </h1>

              <p className={`text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Connect directly with nearby customers who need your skills. Set your own visiting fees, receive verified local leads, and get paid immediately.
              </p>

              {/* Quick Location & Join Action */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0 pt-2">
                <div className="relative flex-1">
                  <Input
                    size="large"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter your service city/area..."
                    prefix={<MapPin className="w-4 h-4 text-slate-400 mr-1" />}
                    suffix={
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                        title="Auto-detect GPS location"
                      >
                        <LocateFixed className={`w-3.5 h-3.5 ${detectingLoc ? "animate-spin" : ""}`} />
                        <span className="hidden sm:inline">GPS</span>
                      </button>
                    }
                    className="h-12 rounded-xl text-sm font-medium"
                  />
                </div>

                <Button
                  type="primary"
                  size="large"
                  onClick={() => setOpenForm(true)}
                  className="h-12 px-8 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 border-none text-base"
                >
                  Join Us Now &rarr;
                </Button>
              </div>

              {/* Key Highlights Micro-Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero Registration Fee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Local Leads Only (No long travel)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Direct Customer Payments</span>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl relative backdrop-blur-xl ${isDark ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200"}`}>
                
                {/* Floating Badge */}
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                  ★ Fast Approval
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-xl">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-snug">
                      Partner Onboarding
                    </h3>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Takes less than 2 minutes to complete
                    </p>
                  </div>
                </div>

                {/* Stepper overview */}
                <div className="space-y-3.5 mb-6">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-100/60 dark:border-slate-700/60">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Create Your Skills Profile
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Select your profession (Plumbing, Electrical, Cleaning, AC, Salon, etc.)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-slate-800/60 border border-emerald-100/60 dark:border-slate-700/60">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Set Your Visiting Fee &amp; Area
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Define your base charges and preferred operating radius
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100/60 dark:border-slate-700/60">
                    <span className="w-6 h-6 rounded-lg bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Accept Leads &amp; Start Earning
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Submit price quotes or take direct customer bookings
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  block
                  type="primary"
                  size="large"
                  onClick={() => setOpenForm(true)}
                  className="rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-md"
                >
                  Start Registration &rarr;
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SERVICE TRADES & EARNING CAROUSEL ================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Top Categories
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Popular Service Professions
            </h2>
            <p className={`text-sm sm:text-base mt-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Click on your trade to get started with tailored customer leads in your city.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={scrollPrev}
              disabled={!canPrev}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                canPrev
                  ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 shadow-sm"
                  : "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400"
              }`}
              title="Previous services"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canNext}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                canNext
                  ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-200 shadow-sm"
                  : "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400"
              }`}
              title="Next services"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Cards Container */}
        <div
          ref={containerRef}
          onScroll={updateButtons}
          className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-4 pt-1"
        >
          {serviceCards.map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -5 }}
              onClick={() => setOpenForm(true)}
              className={`min-w-[280px] sm:min-w-[340px] md:min-w-[360px] p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-xl ${card.bg}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs border border-white/40 dark:border-slate-700">
                    {card.tag}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {card.earning}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {card.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 mt-4 border-t border-black/5 dark:border-white/5">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                  Join as {card.title.split(" ")[0]} &rarr;
                </span>
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHY SERVEASE IS BEST FOR PARTNERS ================= */}
      <section className={`py-16 sm:py-20 border-y dark:border-slate-800 transition-colors ${isDark ? "bg-slate-900/50" : "bg-slate-50/70"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Partner Advantages
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Why 15,000+ Professionals Trust ServEase
            </h2>
            <p className={`text-sm sm:text-base mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Built to help independent technicians, contractors, and service workers grow their customer base with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MapPin,
                title: "Hyper-Local Leads",
                desc: "Get requests from customers within a 5-10 km radius of your home. No wasted commute.",
                color: "text-rose-500 bg-rose-500/10",
              },
              {
                icon: IndianRupee,
                title: "You Choose Your Rates",
                desc: "Set your own visiting fee and submit custom price bids directly to customers.",
                color: "text-emerald-500 bg-emerald-500/10",
              },
              {
                icon: Clock,
                title: "Flexible Working Hours",
                desc: "Work full-time or part-time. Toggle your availability on/off whenever you want.",
                color: "text-purple-500 bg-purple-500/10",
              },
              {
                icon: ShieldCheck,
                title: "Verified Customers Only",
                desc: "Deal only with real, phone-verified customers in your neighborhood.",
                color: "text-blue-500 bg-blue-500/10",
              },
            ].map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg ${
                    isDark
                      ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${perk.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-1.5">
                    {perk.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {perk.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= ESTIMATED MONTHLY EARNINGS ================= */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
            Income Potential
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            How Much Can You Earn Each Month?
          </h2>
          <p className={`text-sm sm:text-base mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Earnings based on active service partners completing 2 to 4 service bookings daily.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { profession: "❄️ AC & Appliance Tech", monthly: "₹35,000 - ₹65,000", perJob: "₹500 - ₹1,500 / job" },
            { profession: "🔧 Master Plumber", monthly: "₹30,000 - ₹55,000", perJob: "₹300 - ₹1,200 / job" },
            { profession: "⚡ Certified Electrician", monthly: "₹32,000 - ₹58,000", perJob: "₹300 - ₹1,000 / job" },
            { profession: "🧹 Deep Cleaning Pro", monthly: "₹28,000 - ₹50,000", perJob: "₹800 - ₹2,500 / job" },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-5 sm:p-6 rounded-3xl border text-center transition-all duration-300 hover:shadow-md ${
                isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <h4 className="font-bold text-sm sm:text-base mb-2">
                {item.profession}
              </h4>
              <p className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                {item.monthly}
              </p>
              <span className="text-[11px] font-semibold text-slate-400 block">
                avg. {item.perJob}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className={`py-16 sm:py-20 border-t dark:border-slate-800 ${isDark ? "bg-slate-900/30" : "bg-slate-50/50"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <Collapse
            items={faqs}
            defaultActiveKey={["1"]}
            bordered={false}
            className={`rounded-2xl overflow-hidden shadow-xs border ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          />
        </div>
      </section>

      {/* ================= BOTTOM CTA BANNER ================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              Ready to Expand Your Service Business?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Register now in 2 minutes. Start receiving nearby customer requests today.
            </p>
          </div>

          <Button
            size="large"
            onClick={() => setOpenForm(true)}
            className="h-14 px-8 rounded-2xl font-black bg-white text-blue-600 hover:bg-blue-50 border-none shadow-xl text-base shrink-0"
          >
            Become a Partner Now &rarr;
          </Button>
        </div>
      </section>

      {/* POPUP REGISTRATION MODAL */}
      <ServiceProviderForm
        onOpen={openForm}
        onClose={() => setOpenForm(false)}
      />

      <Footer />
    </div>
  );
};

export default ServiceProviderPage;
