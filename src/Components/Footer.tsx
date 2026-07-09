import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const LinkItem = ({ label, path }: { label: string; path?: string }) => (
    <li
      onClick={() => path && navigate(path)}
      className="cursor-pointer transition hover:text-blue-500 dark:hover:text-blue-400"
    >
      {label}
    </li>
  );

  return (
    <footer className="bg-gray-100 dark:bg-gradient-to-br dark:from-[#0f172a] dark:to-[#020617] text-gray-700 dark:text-gray-300 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">

          {/* LEFT */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
              Reliable Services, Right at Your Doorstep.
            </h2>
            <h5 className="text-base sm:text-sm md:text-sm font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
              Your Everyday Problems, Solved Instantly.
            </h5>

            <div className="space-y-1 md:space-y-2 text-[11px] sm:text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <MdEmail className="text-blue-500 dark:text-blue-400" />
                support@servease.com
              </div>
              <div className="flex items-center gap-2">
                <MdPhone className="text-blue-500 dark:text-blue-400" />
                1800-123-456
              </div>
            </div>
          </div>

          {/* COMPANY */}
          <div className="hidden sm:block">
            <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm">
              <LinkItem label="Features" />
              <LinkItem label="About Us" />
              <LinkItem label="Contact" />
              <LinkItem label="Pricing" />
            </ul>
          </div>

          {/* HELP */}
          <div className="hidden sm:block">
            <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Help
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm">
              <LinkItem label="FAQ" />
              <LinkItem label="Help Center" />
              <LinkItem label="Support" />
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="text-xs sm:text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Get In Touch
            </h4>

            <div className="flex w-72 border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden bg-white dark:bg-white/5 backdrop-blur-md">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-2 sm:px-3 py-1 text-[11px] sm:text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1 text-[11px] sm:text-sm transition">
                Subscribe
              </button>
            </div>

            {/* SOCIAL */}
            <div className="flex gap-3 mt-2 md:mt-3 text-gray-500 dark:text-gray-400 text-sm">
              <FaFacebookF className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition" />
              <FaInstagram className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition" />
              <FaYoutube className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition" />
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-300 dark:border-gray-800 my-4 md:my-5"></div>

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 gap-2">
          <p>© {new Date().getFullYear()} ServEase</p>

          <div className="flex gap-3 sm:gap-4">
            <span className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition">
              Privacy
            </span>
            <span className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;