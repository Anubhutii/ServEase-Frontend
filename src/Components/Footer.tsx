import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpen(open === key ? null : key);
  };

  const LinkItem = ({ label, path }: { label: string; path?: string }) => (
    <li
      onClick={() => path && navigate(path)}
      className="cursor-pointer hover:text-blue-600 transition"
    >
      {label}
    </li>
  );

  const Section = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => (
    <div>
      <button
        onClick={() => toggle(sectionKey)}
        className="w-full flex justify-between items-center md:pointer-events-none"
      >
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        <HiChevronDown
          className={`md:hidden dark:text-gray-400 transition ${open === sectionKey ? "rotate-180" : ""
            }`}
        />
      </button>

      <ul
        className={`mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400 ${open === sectionKey ? "block" : "hidden"
          } md:block`}
      >
        {children}
      </ul>
    </div>
  );

  return (
    <footer className="bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* 👇 ALMOST FULL WIDTH */}
      <div className="w-full px-4 md:px-6 lg:px-8">
        {/* CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-md shadow-lg dark:shadow-slate-900/50 p-6 md:p-8 border border-transparent dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* BRAND */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                ServEase
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Reliable home services by verified local professionals.
                Simple booking. Transparent pricing.
              </p>

              {/* SOCIAL */}
              <div className="flex gap-3 mt-4 text-gray-500 dark:text-gray-400">
                <FaFacebookF className="hover:text-blue-600 cursor-pointer transition-colors" />
                <FaInstagram className="hover:text-pink-500 cursor-pointer transition-colors" />
                <FaTwitter className="hover:text-blue-400 cursor-pointer transition-colors" />
                <FaYoutube className="hover:text-red-500 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* QUICK LINKS */}
            <Section title="Quick Links" sectionKey="quick">
              <LinkItem label="All Services" path="/services" />
              <LinkItem label="Electrician" path="/service/electrician" />
              <LinkItem label="Plumber" path="/service/plumber" />
              <LinkItem label="Carpenter" path="/service/carpenter" />
              <LinkItem label="Cleaning" path="/service/cleaning" />
              <LinkItem label="Salon at Home" path="/service/salon" />
            </Section>

            {/* CUSTOMER SERVICE */}
            <Section title="Customer Service" sectionKey="support">
              <LinkItem label="Contact Us" />
              <LinkItem label="FAQs" />
            </Section>

            {/* COMPANY */}
            <Section title="Company" sectionKey="company">
              <LinkItem
                label="Become a Provider"
                path="/become-provider"
              />
            </Section>

            {/* NEWSLETTER */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Stay Connected
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Subscribe for updates & offers
              </p>

              <div className="flex items-center border dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-3 py-2 text-sm outline-none bg-transparent dark:text-white"
                />
                <button className="bg-blue-500 text-white px-3 py-2 hover:bg-blue-600 transition-colors">
                  →
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                support@servease.com
              </p>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="border-t dark:border-slate-800 mt-8 pt-4 text-center text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} ServEase · Privacy Policy · Terms of
            Service
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
