// components/HeroBanner.tsx
import { motion } from "framer-motion";
import HeroCanvas from "./HeroCanvas";
import type { FC } from "react";

const HeroBanner: FC = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center min-h-[90vh] px-6 md:px-24 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      
      {/* LEFT CONTENT */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-xl"
      >
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
          Find Nearby Home <br /> Service Providers
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Book trusted professionals for cleaning, plumbing, repairs & more —
          right at your doorstep.
        </p>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex bg-white rounded-full shadow-md overflow-hidden max-w-lg"
        >
          <input
            type="text"
            placeholder="Search services..."
            className="flex-1 px-5 py-3 text-sm outline-none"
          />
          <button
            type="button"
            className="px-6 bg-blue-600 text-white font-medium"
          >
            Search
          </button>
        </motion.div>

        {/* TRUST STATS */}
        <div className="mt-4 flex flex-wrap gap-4 md:gap-6 text-sm text-gray-600">
  <span className="flex items-center gap-1.5">
    <span className="text-amber-500">⭐</span>
    <span className="font-medium">4.5 avg rating</span>
  </span>
  <span className="flex items-center gap-1.5">
    <span className="text-green-500">✓</span>
    <span className="font-medium">Verified professionals</span>
  </span>
  <span className="flex items-center gap-1.5">
    <span className="text-blue-500">👥</span>
    <span className="font-medium">2,500+ providers</span>
  </span>
</div>
      </motion.div>

      {/* RIGHT 3D CANVAS */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative w-full md:w-1/2 h-[420px] md:h-[520px]"
      >
        <HeroCanvas />
      </motion.div>

    </section>
  );
};

export default HeroBanner;
