import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import {
  Mail,
  Phone,
  ShieldCheck,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
  Heart,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import { usePostJob } from "./PostJobModal";

const Footer: React.FC = () => {
  const { openPostJob } = usePostJob();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handleServiceClick = (category: string) => {
    navigate("/service", { state: { search: category } });
  };

  return (
    <footer className="relative bg-slate-900 text-slate-300 pt-8 sm:pt-10 pb-6 overflow-hidden border-t border-slate-800 transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* ================= COMPACT PRE-FOOTER CTA CARD ================= */}
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 py-5 px-6 sm:py-6 sm:px-8 shadow-xl shadow-blue-600/15 mb-8 sm:mb-10 overflow-hidden text-left">
          {/* Decorative subtle glows */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white backdrop-blur-md text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3" /> 30-Min Doorstep Guarantee
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
                Ready for hassle-free home maintenance?
              </h3>
              <p className="mt-1 text-xs text-blue-100/90 leading-relaxed">
                Book verified professionals in 60 seconds with upfront transparent pricing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => navigate("/service")}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center gap-1.5"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigate("/become-provider")}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold backdrop-blur-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
              >
                Join as Partner
              </button>
            </div>
          </div>
        </div>

        {/* ================= MAIN COMPACT FOOTER GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-8 border-b border-slate-800/90 text-left">
          {/* BRAND COLUMN (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div
                className="flex items-center cursor-pointer mb-3"
                onClick={() => navigate("/")}
              >
                <img
                  src={logo}
                  alt="ServEase Logo"
                  className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pr-3 line-clamp-3">
                ServEase connects homeowners with verified technicians for quick, safe, and transparent home repairs and personal lifestyle services.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-semibold text-slate-300">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  100% Verified
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-semibold text-slate-300">
                  <Zap className="w-3 h-3 text-amber-400" />
                  30-Min Arrival
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-semibold text-slate-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  4.9★ Rated
                </span>
              </div>
            </div>

            {/* Direct Contact */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-300">
              <a
                href="mailto:support@servease.com"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@servease.com</span>
              </a>

              <a
                href="tel:1800123456"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>1800-123-456 (Toll Free 24/7)</span>
              </a>
            </div>
          </div>

          {/* POPULAR SERVICES (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Popular Services
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {[
                { name: "AC Repair & Jet Foam Wash", query: "AC Repair" },
                { name: "Deep Home Cleaning", query: "Cleaning" },
                { name: "Electrician & Wiring Repair", query: "Electrician" },
                { name: "Plumbing & Leak Fixes", query: "Plumber" },
                { name: "Women's Salon & Spa", query: "women" },
                { name: "Appliance Care & Repair", query: "appliances" },
                { name: "1-on-1 Home Tutor", query: "tutor" },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleServiceClick(item.query)}
                    className="hover:text-blue-400 transition-colors text-left flex items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors" />
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY & QUICK LINKS (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Company
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/service" className="hover:text-blue-400 transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <button onClick={() => openPostJob()} className="hover:text-blue-400 transition-colors text-left cursor-pointer">
                  Post a Request
                </button>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-400 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/become-provider" className="hover:text-blue-400 transition-colors">
                  Join as Partner
                </Link>
              </li>
              <li>
                <Link to="/user-dashboard" className="hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER & SOCIALS (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Stay Connected
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2.5">
              Subscribe for exclusive coupons and seasonal maintenance tips.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-1.5">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-3 pr-20 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>

              {subscribed && (
                <motion.div
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Subscribed! Check your inbox soon.</span>
                </motion.div>
              )}
            </form>

            {/* Social Icons */}
            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                {[
                  { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
                  { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
                  { icon: <FaXTwitter />, href: "https://twitter.com", label: "Twitter" },
                  { icon: <FaLinkedinIn />, href: "https://linkedin.com", label: "LinkedIn" },
                  { icon: <FaYoutube />, href: "https://youtube.com", label: "YouTube" },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="w-7 h-7 rounded-lg bg-slate-800/90 hover:bg-blue-600 border border-slate-700/70 hover:border-blue-500 text-slate-400 hover:text-white flex items-center justify-center text-[11px] transition-all duration-200"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM COPYRIGHT BAR ================= */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} ServEase Inc.</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" /> for homes
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              256-Bit SSL
            </span>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;