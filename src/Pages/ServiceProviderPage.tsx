import { useRef, useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import chef from "../assets/card-chef.png";
import cleaning from "../assets/card-cleaning.png";
import salon from "../assets/card-salon.png";
import laundry from "../assets/card-laundry.png";
import plumber from "../assets/card-plumber.png";
import ac from "../assets/card-ac.png";

import bg from "../assets/services-banner.png";
import { Button, Input } from "antd";

import Footer from '../Components/Footer'

import ServiceProviderForm from "../Components/ServiceProviderForm";

const cards = [
  {
    bg: "bg-[#E8F1FF]",
    title: "From your kitchen to trusted homes",
    subtitle: "Your food creates smiles. We create opportunities.",
    btn: "Join as Chef",
    image: chef,
  },
  {
    bg: "bg-[#F3E8FF]",
    title: "Serve your neighborhood",
    subtitle: "Turn your expertise into steady local income",
    btn: "Get started",
    image: salon,
  },
  {
    bg: "bg-[#FFF3D6]",
    title: "Every clean space brings peace",
    subtitle: "Turn cleaning skills into steady local income",
    btn: "Join now",
    image: cleaning,
  },
  {
    bg: "bg-[#E6FAF0]",
    title: "Kapdon ka khayal, bilkul ghar jaisa",
    subtitle: "Safe, clean and trusted laundry services",
    btn: "Join now",
    image: laundry,
  },
  {
    bg: "bg-[#FFE8E8]",
    title: "Problems fixed. Peace restored.",
    subtitle: "Trusted local plumbing services for every home",
    btn: "Join as Plumber",
    image: plumber,
  },
  {
    bg: "bg-[#E8F7FF]",
    title: "Comfort fixed. Connections secured.",
    subtitle: "Expert AC, RO & Wi-Fi installation and repair",
    btn: "Join as Tech Expert",
    image: ac,
  },
];

const ServiceProviderCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const updateButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  const scrollNext = () => {
    containerRef.current?.scrollBy({
      left: containerRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollPrev = () => {
    containerRef.current?.scrollBy({
      left: -containerRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <div className="md:relative w-full flex justify-center md:justify-end md:h-[50vh] overflow-hidden">
        
        {/* LEFT CONTENT */}
        <div className="z-10 md:absolute left-0 p-3 md:pl-5">
          <div className="text-3xl sm:pt-10 sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight text-center md:text-left md:pl-14 md:pt-5">
            Become a Service Provider
          </div>

          {/* <p className="mt-4 text-base lg:pt-2 sm:text-lg text-slate-600 max-w-xl text-center md:text-left md:pl-16">
            Earn money providing local services in your area and grow your income
            with flexible work opportunities.
          </p> */}
          <p className="mt-5 text-base lg:pt-2 sm:text-lg text-slate-600 max-w-xl text-center md:text-left md:pl-16">
            Offer local services, earn on your terms, and connect with customers nearby. Flexible schedules, steady opportunities, and real income growth—all in your area.
          </p>

          <div className="mt-3 flex flex-col lg:pt-5 sm:flex-row gap-3 max-w-xl md:pl-16">
            <Input placeholder="📍 Enter your location..." />
            <Button
              type="primary"
              size="large"
              onClick={() => setOpenForm(true)}
            >
              Join Us
            </Button>
          </div>
        </div>

        {/* CENTER UX — REGISTRATION PREVIEW */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl px-6 py-5 w-[280px]">
            <p className="text-sm font-semibold text-slate-900 mb-3">
              Registration takes only a few steps
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                ✔ Location
              </div>
              <div className="text-slate-500">→ Select Service</div>
              <div className="text-slate-500">→ Upload Documents</div>
              <div className="text-slate-500">→ Start Accepting Jobs</div>
            </div>

            <div className="mt-4 pt-3 border-t text-xs text-slate-600 flex justify-between">
              <span>🕒 Flexible</span>
              <span>💸 Earn per Job</span>
              <span>🧾 Easy KYC</span>
            </div>
          </div>
        </div>

        {/* IMAGE */}
        <img src={bg} alt="" className="hidden md:block h-full object-cover" />

        {/* BLEND OVERLAY */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <div className="absolute inset-0 bg-linear-to-r from-white via-white/90 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/5 to-transparent" />
        </div>
      </div>

      {/* SERVICE CARDS */}
      <div className="relative w-full px-4">
        <button
          onClick={scrollPrev}
          disabled={!canPrev}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-3 z-10"
        >
          <FaArrowLeft />
        </button>

        <button
          onClick={scrollNext}
          disabled={!canNext}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-3 z-10"
        >
          <FaArrowRight />
        </button>

        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className={`min-w-[90%] sm:min-w-[60%] md:min-w-[50%] lg:min-w-[30%] rounded-2xl ${card.bg} flex justify-between items-end`}
            >
              <div className="p-8 max-w-[65%]">
                <h3 className="font-semibold text-slate-900">{card.title}</h3>
                <p className="text-sm text-slate-700 mt-1">
                  {card.subtitle}
                </p>
                {/* <button className="mt-3 bg-white px-4 py-2 rounded-lg shadow">
                  {card.btn}
                </button> */}
              </div>
              <img src={card.image} className="w-36 h-36 object-cover" />
            </div>
          ))}
        </div>
      </div>

      <ServiceProviderForm
        onOpen={openForm}
        onClose={() => setOpenForm(false)}
      />

      {/* WHY JOIN SERVEASE */}
<section className="w-full py-12 mt-10 relative overflow-hidden">
  {/* background gradient */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-emerald-50" />

  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-8">
      Why Join ServEase?
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          icon: "🧑‍💼",
          title: "Local Customers Only",
          desc: "Nearby jobs, no long travel",
          gradient: "from-blue-200/40 to-blue-100/10",
        },
        {
          icon: "💸",
          title: "Jitna Kaam, Utni Kamai",
          desc: "No fixed salary, earn per service",
          gradient: "from-emerald-200/40 to-emerald-100/10",
        },
        {
          icon: "⏰",
          title: "Work on Your Schedule",
          desc: "Accept or reject jobs anytime",
          gradient: "from-purple-200/40 to-purple-100/10",
        },
        {
          icon: "🛡️",
          title: "Safe & Verified Leads",
          desc: "Real customers only",
          gradient: "from-amber-200/40 to-amber-100/10",
        },
      ].map((item) => (
        <div
          key={item.title}
          className="
            group
            relative
            rounded-2xl
            p-6
            backdrop-blur-xl
            bg-white/50
            border border-white/40
            shadow-lg
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-xl
          "
        >
          {/* gradient overlay */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition`}
          />

          <div className="relative">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-slate-900">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* EARNINGS PREVIEW */}
<section className="w-full py-10">
  <div className="max-w-5xl mx-auto px-4">
    <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 mb-6">
      How Much Can You Earn?
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {[
        { service: "🧹 Cleaning", earning: "₹800–1.5k / day*" },
        { service: "🔧 Plumbing", earning: "₹1.2k–2k / day*" },
        { service: "❄️ AC Repair", earning: "₹1.5k+ / day*" },
        { service: "👨‍🍳 Chef", earning: "₹1k+ / day*" },
      ].map((item) => (
        <div
          key={item.service}
          className="
            bg-white
            rounded-xl
            border border-slate-200
            px-3 py-4
            text-center
            hover:shadow-sm
            transition
          "
        >
          <p className="text-sm font-medium text-slate-900">
            {item.service}
          </p>
          <p className="text-xs font-semibold text-green-600 mt-1">
            {item.earning}
          </p>
        </div>
      ))}
    </div>

    <p className="text-[11px] text-center text-slate-500 mt-3">
      *Earnings depend on number of services completed
    </p>
  </div>
      </section>
      
      <Footer />

    </div>
  );
};

export default ServiceProviderCards;
