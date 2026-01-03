import { useRef, useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import chef from "../assets/card-chef.png";
import cleaning from "../assets/card-cleaning.png";
import salon from "../assets/card-salon.png";
import laundry from "../assets/card-laundry.png";
import plumber from "../assets/card-plumber.png";
import ac from "../assets/card-ac.png";

const cards = [
  {
    bg: "bg-[#E8F1FF]",
    title: "Local work, steady income",
    subtitle: "Serve nearby homes",
    btn: "Explore",
    image: chef,
  },
  {
    bg: "bg-[#F3E8FF]",
    title: "Instant help",
    subtitle: "When customers need you",
    btn: "Join now",
    image: salon,
  },
  {
    bg: "bg-[#FFF3D6]",
    title: "Grow your skills",
    subtitle: "Build trust locally",
    btn: "Get started",
    image: cleaning,
  },
  {
    bg: "bg-[#E6FAF0]",
    title: "Flexible work",
    subtitle: "Your time, your choice",
    btn: "Start earning",
    image: laundry,
  },
  {
    bg: "bg-[#FFE8E8]",
    title: "Be your own boss",
    subtitle: "Work on your terms",
    btn: "Sign up today",
    image: plumber,
  },
  {
    bg: "bg-[#E8F7FF]",
    title: "More jobs, more income",
    subtitle: "Reach more customers",
    btn: "Join Us",
    image: ac,
  },
];

const ServiceProviderCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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
    <div className="relative w-full px-4 sm:px-8 py-8">
      {/* LEFT ARROW (hidden on mobile) */}
      <button
        onClick={scrollPrev}
        disabled={!canPrev}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-3 disabled:opacity-30 z-10"
      >
        <FaArrowLeft />
      </button>

      {/* RIGHT ARROW (hidden on mobile) */}
      <button
        onClick={scrollNext}
        disabled={!canNext}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-3 disabled:opacity-30 z-10"
      >
        <FaArrowRight />
      </button>

      {/* CARDS */}
      <div
        ref={containerRef}
        className="
          flex gap-4 sm:gap-6
          overflow-x-auto scroll-smooth
          scrollbar-hide
        "
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className={`
              min-h-40
              sm:min-h-48
              min-w-[90%]
              sm:min-w-[60%]
              md:min-w-[50%]
              lg:min-w-[30%]
              rounded-2xl ${card.bg}
              flex justify-between items-end
            `}
          >
            {/* LEFT CONTENT */}
            <div className="p-4 max-w-[65%] flex flex-col justify-between h-full">
              <div className="flex flex-col">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-700">
                {card.subtitle}
              </p>
              </div>
              
              <button className="mt-4 px-4 py-2 bg-white rounded-lg text-sm font-medium shadow w-fit">
                {card.btn}
              </button>
            </div>

            {/* IMAGE */}
            <img
              src={card.image}
              alt="card visual"
             className="w-36 h-36 object-cover rounded-br-2xl mask-[linear-gradient(to_left,black_70%,transparent_100%)] "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceProviderCards;
