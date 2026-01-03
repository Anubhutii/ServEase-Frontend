import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Image imports
import cleaning from "../assets/carwash.jpg";
import plumber from "../assets/plumbing.jpg";
import cooking from "../assets/cook.jpg";
import electrician from "../assets/Electric.jpg";

import icleaning from "../assets/icons/cleaning-icon.png";
import ikitchen from "../assets/icons/kitchen-icon.png";
import ilaundry from "../assets/icons/laundry-icon.png";
import icarpanter from "../assets/icons/carpanter-icon.png";
import iplumber from "../assets/icons/plumber-icon.png";
import ielectrician from "../assets/icons/electric-icon.png";
import imen from "../assets/icons/men-icon.png";
import iwomen from "../assets/icons/women-icon.png";
import icallus from "../assets/icons/call_us-icon.png";

// Constants
const ICON_CYCLE_INTERVAL = 1500;
const ANIMATION_DURATION = 0.6;
const ANIMATION_DELAY_STEP = 0.1;
const HOVER_SCALE = 1.05;
const SCALE_TRANSITION = { duration: 0.3, ease: "easeInOut" as const };

const icons = [
  icleaning,
  ikitchen,
  ilaundry,
  icarpanter,
  iplumber,
  ielectrician,
  imen,
  iwomen,
  icallus,
];

const services = [
  ["Home Cleaning", icleaning],
  ["Kitchen Cleaning", ikitchen],
  ["Laundry", ilaundry],
  ["Carpenter", icarpanter],
  ["Plumber", iplumber],
  ["Electrician", ielectrician],
  ["Men's Salon", imen],
  ["Women's Salon", iwomen],
] as const;

const images = [
  { src: cleaning, alt: "Cleaning Service", className: "h-36 sm:h-44 md:h-80 md:mt-4" },
  { src: plumber, alt: "Plumbing Service", className: "h-36 sm:h-44 md:h-70 md:mt-14" },
  { src: cooking, alt: "Cooking Service", className: "h-32 sm:h-40 md:h-65" },
  { src: electrician, alt: "Electrician Service", className: "h-36 sm:h-44 md:h-full md:mt-2" },
] as const;

// Animation configurations
const leftContentAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: ANIMATION_DURATION, ease: "easeOut" as const },
};

const rightContentAnimation = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: ANIMATION_DURATION, delay: 0.3, ease: "easeOut" as const },
};

const heroTextAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATION, delay: 0.2 },
};

const categorySectionAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATION, delay: 0.4 },
};

const getImageAnimation = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  whileHover: { scale: HOVER_SCALE },
  transition: {
    duration: 0.5,
    delay,
    scale: SCALE_TRANSITION,
  },
});

const getServiceCardAnimation = (index: number) => ({
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, delay: 0.5 + index * ANIMATION_DELAY_STEP },
});

// Shared class names
const serviceCardClass = "group bg-gray-50 rounded-lg p-3 flex flex-col items-center text-center cursor-pointer transition hover:shadow";
const imageBaseClass = "rounded-md object-cover w-full cursor-pointer";

const Home = () => {
  const [activeIcon, setActiveIcon] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % icons.length);
    }, ICON_CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center md:min-h-[90vh] p-6 md:px-32 gap-6 md:gap-12">
      {/* LEFT CONTENT */}
      <motion.div {...leftContentAnimation} className="flex flex-col justify-start max-w-xl md:pt-10 md:pl-12">
        {/* Hero Text */}
        <motion.div {...heroTextAnimation}>
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
            On-demand services <br />
            for your home
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Cleaning, plumbing, cooking & more — trusted locals at work.
          </p>
          <p className="mt-2 text-base text-gray-500">
            From your area to your doorstep — reliable home services.
          </p>
        </motion.div>

        {/* Category Section */}
        <motion.div {...categorySectionAnimation} className="mt-8 max-w-3xl border border-gray-200 rounded-lg p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What are you looking for?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Insta Help Card */}
            <div className={serviceCardClass}>
              <img
                src={icons[activeIcon]}
                className="w-10 h-10 mb-1 transition-transform duration-300 group-hover:scale-110"
                alt="Insta Help"
              />
              <p className="relative text-xs font-medium">
                Insta Help
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
              </p>
            </div>

            {/* Service Cards */}
            {services.map(([title, icon], i) => (
              <motion.div
                key={i}
                {...getServiceCardAnimation(i)}
                className={serviceCardClass}
              >
                <img
                  src={icon}
                  className="w-10 h-10 mb-1 transition-transform duration-300 group-hover:scale-110"
                  alt={title}
                />
                <p className="relative text-xs font-medium">
                  {title}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* RIGHT IMAGE COLLAGE */}
      <motion.div {...rightContentAnimation} className="hidden md:grid md:w-120 lg:w-140 grid-cols-2 gap-3 md:gap-4 mr-3 mx-auto">
        {images.map((image, i) => (
          <motion.img
            key={i}
            {...getImageAnimation(0.5 + i * 0.1)}
            src={image.src}
            alt={image.alt}
            className={`${imageBaseClass} ${image.className}`}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default Home;
