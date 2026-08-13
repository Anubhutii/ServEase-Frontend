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
    <div className="flex flex-col bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* HERO */}
      <div className="md:relative w-full flex justify-center md:justify-end md:h-[50vh] overflow-hidden bg-white dark:bg-slate-900 transition-colors">

        {/* LEFT CONTENT */}
        <div className="z-10 md:absolute left-0 p-3 md:pl-5">
          <div className="text-3xl sm:pt-10 sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight text-center md:text-left md:pl-14 md:pt-5 transition-colors">
            Become a Service Provider
          </div>

          
          <p className="mt-5 text-base lg:pt-2 sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl text-center md:text-left md:pl-16 transition-colors">
            Offer local services, earn on your terms, and connect with customers nearby. Flexible schedules, steady opportunities, and real income growth—all in your area.
          </p>

          <div className="mt-3 flex flex-col lg:pt-5 sm:flex-row gap-3 max-w-xl md:pl-16">
            <Input placeholder="📍 Enter your location..." className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
            <Button
              type="primary"
              size="large"
              onClick={() => setOpenForm(true)}
              className="font-bold"
            >
              Join Us
            </Button>
          </div>
        </div>

        {/* CENTER UX — REGISTRATION PREVIEW */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl px-6 py-5 w-70 border border-white/20 dark:border-slate-700/50 transition-colors">
            <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Registration takes only a few steps
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
                ✔ Location
              </div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">→ Select Service</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">→ Upload Documents</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">→ Start Accepting Jobs</div>
            </div>

            <div className="mt-4 pt-3 border-t dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400 flex justify-between font-bold">
              <span>🕒 Flexible</span>
              <span>💸 Earn per Job</span>
              <span>🧾 Easy KYC</span>
            </div>
          </div>
        </div>

        {/* IMAGE */}
        <img src={bg} alt="" className="hidden md:block h-full object-cover dark:opacity-60 transition-opacity" />

        {/* BLEND OVERLAY */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-white/5 dark:via-slate-950/5 to-transparent" />
        </div>
      </div>

      {/* SERVICE CARDS */}
      <div className="relative w-full px-4 mt-8">
        <button
          onClick={scrollPrev}
          disabled={!canPrev}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-900 rounded-full p-4 z-10 dark:text-white disabled:opacity-30 border border-transparent dark:border-slate-700 transition-all hover:scale-110"
        >
          <FaArrowLeft />
        </button>

        <button
          onClick={scrollNext}
          disabled={!canNext}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-900 rounded-full p-4 z-10 dark:text-white disabled:opacity-30 border border-transparent dark:border-slate-700 transition-all hover:scale-110"
        >
          <FaArrowRight />
        </button>

        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide py-4"
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className={`min-w-[90%] sm:min-w-[60%] md:min-w-[50%] lg:min-w-[30%] rounded-[24px] ${card.bg} dark:bg-slate-900/40 dark:border dark:border-slate-800 flex justify-between items-end overflow-hidden group hover:shadow-xl transition-all duration-300`}
            >
              <div className="p-8 max-w-[65%]">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{card.title}</h3>
                <p className="text-sm text-slate-700 dark:text-slate-400 mt-2 font-medium">
                  {card.subtitle}
                </p>
              </div>
              <img src={card.image} className="w-40 h-40 object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>

      <ServiceProviderForm
        onOpen={openForm}
        onClose={() => setOpenForm(false)}
      />

      {/* WHY JOIN SERVEASE */}
      <section className="w-full py-16 mt-10 relative overflow-hidden transition-colors">
        {/* background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />

        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Why Join ServEase?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🧑‍💼",
                title: "Local Customers Only",
                desc: "Nearby jobs, no long travel",
                gradient: "from-blue-200/40 to-blue-100/10 dark:from-blue-600/20 dark:to-blue-600/5",
              },
              {
                icon: "💸",
                title: "Jitna Kaam, Utni Kamai",
                desc: "No fixed salary, earn per service",
                gradient: "from-emerald-200/40 to-emerald-100/10 dark:from-emerald-600/20 dark:to-emerald-600/5",
              },
              {
                icon: "⏰",
                title: "Work on Your Schedule",
                desc: "Accept or reject jobs anytime",
                gradient: "from-purple-200/40 to-purple-100/10 dark:from-purple-600/20 dark:to-purple-600/5",
              },
              {
                icon: "🛡️",
                title: "Safe & Verified Leads",
                desc: "Real customers only",
                gradient: "from-amber-200/40 to-amber-100/10 dark:from-amber-600/20 dark:to-amber-600/5",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="
            group
            relative
            rounded-[22px]
            p-8
            backdrop-blur-xl
            bg-white/50 dark:bg-slate-900/50
            border border-white/40 dark:border-slate-800/50
            shadow-xl dark:shadow-slate-950/50
            transition-all
            duration-300
            hover:-translate-y-2
          "
              >
                {/* gradient overlay */}
                <div
                  className={`absolute inset-0 rounded-[22px] bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition duration-500`}
                />

                <div className="relative z-10 text-center sm:text-left">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* EARNINGS PREVIEW */}
      <section className="w-full py-16 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">
            How Much Can You Earn?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { service: "🧹 Cleaning", earning: "₹800–1.5k / day*" },
              { service: "🔧 Plumbing", earning: "₹1.2k–2k / day*" },
              { service: "❄️ AC Repair", earning: "₹1.5k+ / day*" },
              { service: "👨‍🍳 Chef", earning: "₹1k+ / day*" },
            ].map((item) => (
              <div
                key={item.service}
                className="
            bg-white dark:bg-slate-900
            rounded-2xl
            border border-slate-200 dark:border-slate-800
            px-4 py-8
            text-center
            hover:shadow-xl dark:hover:shadow-slate-900/50
            hover:-translate-y-1
            transition-all
            duration-300
          "
              >
                <p className="text-base font-bold text-slate-900 dark:text-gray-200">
                  {item.service}
                </p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                  {item.earning}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-slate-500 dark:text-slate-500 mt-8 italic font-medium">
            *Earnings depend on number of services completed
          </p>
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default ServiceProviderCards;
