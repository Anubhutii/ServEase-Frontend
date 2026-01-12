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
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <HiChevronDown
          className={`md:hidden transition ${
            open === sectionKey ? "rotate-180" : ""
          }`}
        />
      </button>

      <ul
        className={`mt-3 space-y-2 text-sm text-gray-600 ${
          open === sectionKey ? "block" : "hidden"
        } md:block`}
      >
        {children}
      </ul>
    </div>
  );

  return (
    <footer className="bg-white">
      {/* 👇 ALMOST FULL WIDTH */}
      <div className="w-full px-4 md:px-6 lg:px-8">
        {/* CARD */}
        <div className="bg-white rounded-md shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* BRAND */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                ServEase
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Reliable home services by verified local professionals.
                Simple booking. Transparent pricing.
              </p>

              {/* SOCIAL */}
              <div className="flex gap-3 mt-4 text-gray-500">
                <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
                <FaInstagram className="hover:text-pink-500 cursor-pointer" />
                <FaTwitter className="hover:text-blue-400 cursor-pointer" />
                <FaYoutube className="hover:text-red-500 cursor-pointer" />
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
              <h4 className="font-semibold text-gray-900 mb-3">
                Stay Connected
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Subscribe for updates & offers
              </p>

              <div className="flex items-center border rounded-lg overflow-hidden">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />
                <button className="bg-blue-500 text-white px-3 py-2 hover:bg-blue-600">
                  →
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                support@servease.com
              </p>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="border-t mt-8 pt-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} ServEase · Privacy Policy · Terms of
            Service
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
