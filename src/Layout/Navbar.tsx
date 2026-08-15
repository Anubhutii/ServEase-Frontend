import React, { useState, useEffect } from "react";
import {
  getCachedLocation,
  detectLocationInBackground,
  setCachedLocation,
} from "../Services/locationManager";
import { Button, Drawer, Space, Avatar, Dropdown, Badge } from "antd";
import type { MenuProps } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { FiMoon, FiSun } from "react-icons/fi";
import {
  UserOutlined,
  LogoutOutlined,
  SwapOutlined,
  DashboardOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  Sparkles,
  ShoppingBag,
  Briefcase,
  PlusCircle,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

import LoginPopup from "../Components/LoginPopup";
import LocationPopup from "../Components/LocationPopup";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { useRole } from "../Context/RoleContext";
import { useCart } from "../Context/CartContext";
import NotificationCenter from "../Components/NotificationCenter";

const ThemeToggle = ({
  theme,
  onClick,
  className,
}: {
  theme: string;
  onClick: () => void;
  className?: string;
}) => {
  const isDark = theme === "dark";

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center w-14 h-7 rounded-full cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-slate-700 dark:to-slate-800 shadow-inner transition-colors duration-300 ${
        className || ""
      }`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="absolute w-full flex justify-between px-2 pointer-events-none top-1/2 -translate-y-1/2">
        <FiMoon className="text-white/80" size={12} strokeWidth={2.5} />
        <FiSun className="text-white/90" size={12} strokeWidth={2.5} />
      </div>

      <div
        className={`absolute w-5 h-5 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center transition-all duration-300 shadow-md top-1 ${
          isDark ? "left-1" : "left-[calc(100%-24px)]"
        }`}
      >
        {isDark ? (
          <FiMoon className="text-indigo-400" size={12} strokeWidth={2.5} />
        ) : (
          <FiSun className="text-amber-500" size={12} strokeWidth={2.5} />
        )}
      </div>
    </div>
  );
};

const CustomLocationButton = ({
  location,
  onClick,
  theme,
  isMobile,
}: {
  location: string | null;
  onClick: () => void;
  theme: string;
  isMobile?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center transition-all duration-200 cursor-pointer hover:border-blue-500/50 gap-2 whitespace-nowrap
        ${
          isMobile
            ? "h-9 rounded-xl pl-2 pr-3"
            : "h-10 rounded-xl pl-2.5 pr-3.5 border border-slate-200/80 dark:border-slate-800"
        }
        ${
          theme === "dark"
            ? "bg-slate-800/90 hover:bg-slate-800"
            : "bg-slate-50 hover:bg-slate-100 shadow-2xs"
        }
      `}
    >
      <div
        className={`flex flex-shrink-0 items-center justify-center 
        ${
          isMobile
            ? "w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400"
            : "w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400"
        }
      `}
      >
        <FaLocationDot size={isMobile ? 12 : 13} />
      </div>
      <div className="flex flex-col text-left">
        {!isMobile && (
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 leading-none">
            Location
          </span>
        )}
        <span
          className={`font-bold truncate max-w-[110px] leading-tight ${
            isMobile ? "text-xs" : "text-xs"
          } ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
        >
          {location || (isMobile ? "Location" : "Select City")}
        </span>
      </div>
      <ChevronDown className="w-3 h-3 text-slate-400" />
    </div>
  );
};

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  // Fast synchronous location initialization from cache (0ms latency)
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    return getCachedLocation()?.city || "";
  });

  const nav = useNavigate();
  const location = useLocation();

  // Cart Context
  const cartContext = useCart();
  const cartItemCount = cartContext?.cart?.length || 0;

  // Non-blocking background location detection (idle task)
  useEffect(() => {
    detectLocationInBackground();

    const handleLocationUpdated = (e: any) => {
      if (e.detail?.city) {
        setSelectedLocation(e.detail.city);
      }
    };

    window.addEventListener("location_updated", handleLocationUpdated);
    return () => {
      window.removeEventListener("location_updated", handleLocationUpdated);
    };
  }, []);

  // Auth, Theme & Role states
  const { isLoggedIn, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { activeRole, availableRoles, switchRole } = useRole();

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const profileMenu: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div className="px-2 py-1.5">
          <p className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {user?.name || "Customer"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user?.email}
          </p>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    ...(activeRole !== "provider"
      ? [
          {
            key: "history",
            label: "History & Activity",
            icon: <DashboardOutlined />,
            onClick: () => nav("/history"),
          },
          {
            key: "post-job",
            label: "Posted Jobs & Bids",
            icon: <FileTextOutlined />,
            onClick: () => nav("/post-job"),
          },
        ]
      : [
          {
            key: "provider-dashboard",
            label: "Provider Dashboard",
            icon: <DashboardOutlined />,
            onClick: () => nav("/provider-dashboard"),
          },
        ]),
    ...(availableRoles.includes("provider")
      ? [
          {
            key: "switch-role",
            label:
              activeRole === "provider"
                ? "Switch to User Mode"
                : "Switch to Provider Mode",
            icon: <SwapOutlined />,
            onClick: () => {
              const next = activeRole === "provider" ? "user" : "provider";
              switchRole(next);
              nav(next === "provider" ? "/provider-dashboard" : "/user-dashboard");
            },
          },
        ]
      : []),
    ...(!availableRoles.includes("provider")
      ? [
          {
            key: "become-provider",
            label: "Join as a Professional",
            icon: <Briefcase className="w-3.5 h-3.5" />,
            onClick: () => nav("/become-provider"),
          },
        ]
      : []),
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 border-b h-16 sm:h-18 backdrop-blur-xl transition-colors duration-300 ${
          theme === "dark"
            ? "bg-slate-950/85 border-slate-800/80 text-white"
            : "bg-white/85 border-slate-200/80 text-slate-900"
        }`}
      >
        {/* ================= LEFT: LOGO & LOCATION ================= */}
        <div className="flex items-center gap-4 sm:gap-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center cursor-pointer shrink-0"
            onClick={() => nav("/")}
          >
            <img
              src={logo}
              alt="ServEase Logo"
              className={`h-9 sm:h-11 w-auto object-contain ${
                theme === "dark" ? "brightness-0 invert" : ""
              }`}
            />
          </motion.div>

          {/* Location Selector (Desktop only, user mode) */}
          {activeRole !== "provider" && (
            <div className="hidden lg:flex items-center">
              <CustomLocationButton
                location={selectedLocation}
                onClick={() => setShowLocation(true)}
                theme={theme}
              />
            </div>
          )}
        </div>

        {/* ================= CENTER: USEFUL NAVIGATION LINKS ================= */}
        {activeRole !== "provider" && (
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                location.pathname === "/"
                  ? "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              Home
            </Link>

            <Link
              to="/service"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                location.pathname === "/service" || location.pathname === "/all-services"
                  ? "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Services</span>
            </Link>

            <Link
              to="/post-job"
              state={{ highlight: true }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                location.pathname === "/post-job"
                  ? "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
              <span>Post Request</span>
            </Link>
          </div>
        )}

        {/* ================= RIGHT: UTILITY & USER ACTIONS ================= */}
        <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onClick={toggleTheme} />

          {/* Cart / Bookings Button */}
          {activeRole !== "provider" && (
            <button
              onClick={() => nav("/cart")}
              className="relative p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-all duration-200 cursor-pointer"
              title="View Cart & Bookings"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}

          {/* User Auth state */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all duration-200 cursor-pointer"
              >
                Login
              </button>

              <button
                onClick={() => nav("/become-provider")}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/25 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Become Provider</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <NotificationCenter />
              <Dropdown menu={{ items: profileMenu }} placement="bottomRight" arrow>
                <div className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border border-slate-200/60 dark:border-slate-800 transition-colors">
                  <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold"
                  />
                  <div className="flex flex-col text-left max-w-[90px]">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                      {user?.name || "Account"}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {activeRole}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </Dropdown>
            </div>
          )}
        </div>

        {/* ================= MOBILE HEADER ================= */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Location button */}
          {activeRole !== "provider" && (
            <CustomLocationButton
              location={selectedLocation}
              onClick={() => setShowLocation(true)}
              theme={theme}
              isMobile
            />
          )}

          {/* Cart shortcut */}
          {activeRole !== "provider" && (
            <button
              onClick={() => nav("/cart")}
              className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile Login / User Profile */}
          {!isLoggedIn ? (
            <Button
              type="default"
              size="small"
              onClick={() => setShowLogin(true)}
              className="font-bold text-xs"
            >
              Login
            </Button>
          ) : (
            <div className="flex items-center gap-1.5">
              <NotificationCenter />
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="cursor-pointer bg-blue-600 text-white"
                onClick={() => nav(activeRole === "provider" ? "/provider-dashboard" : "/history")}
              />
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          <Button
            type="text"
            icon={<FaBars size={18} />}
            onClick={() => setMenuOpen(true)}
          />
        </div>

        {/* POPUPS */}
        <LoginPopup show={showLogin} onClose={() => setShowLogin(false)} />
        <LocationPopup
          open={showLocation}
          onClose={() => setShowLocation(false)}
          onSelectLocation={(city: string) => {
            setSelectedLocation(city);
            const currentStored = getCachedLocation() || {};
            if (currentStored.city !== city) {
              setCachedLocation({ ...currentStored, city });
            }
            setShowLocation(false);
          }}
        />
      </motion.nav>

      {/* ================= MOBILE DRAWER ================= */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="ServEase Logo"
              className={`h-7 w-auto ${theme === "dark" ? "brightness-0 invert" : ""}`}
            />
          </div>
        }
        placement="right"
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        size={280}
      >
        <Space direction="vertical" size="middle" className="w-full">
          {/* Theme switcher */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <span className="text-slate-700 dark:text-slate-300 font-semibold text-xs">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <ThemeToggle
              theme={theme}
              onClick={() => {
                toggleTheme();
              }}
            />
          </div>

          {/* Main Links */}
          <div className="flex flex-col gap-1 text-left">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              Home
            </Link>

            <Link
              to="/service"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>All Services</span>
            </Link>

            <Link
              to="/post-job"
              state={{ highlight: true }}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 text-left w-full"
            >
              <PlusCircle className="w-4 h-4 text-indigo-500" />
              <span>Post a Request</span>
            </Link>

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                <span>My Cart & Bookings</span>
              </div>
              {cartItemCount > 0 && (
                <Badge count={cartItemCount} className="ml-auto" />
              )}
            </Link>
          </div>

          {/* Provider / Dashboard Action */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Button
                  block
                  type="primary"
                  onClick={() => {
                    nav(
                      activeRole === "provider"
                        ? "/provider-dashboard"
                        : "/history"
                    );
                    setMenuOpen(false);
                  }}
                  size="large"
                >
                  View Activity & History
                </Button>

                {availableRoles.includes("provider") && (
                  <Button
                    block
                    icon={<SwapOutlined />}
                    onClick={() => {
                      const next = activeRole === "provider" ? "user" : "provider";
                      switchRole(next);
                      nav(next === "provider" ? "/provider-dashboard" : "/user-dashboard");
                      setMenuOpen(false);
                    }}
                  >
                    Switch to {activeRole === "provider" ? "User" : "Provider"}
                  </Button>
                )}

                <Button
                  block
                  danger
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  block
                  type="primary"
                  onClick={() => {
                    nav("/become-provider");
                    setMenuOpen(false);
                  }}
                  size="large"
                >
                  Become a Provider
                </Button>
                <Button
                  block
                  onClick={() => {
                    setShowLogin(true);
                    setMenuOpen(false);
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </Space>
      </Drawer>
    </>
  );
};

export default Navbar;