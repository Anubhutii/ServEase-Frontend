import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { reverseGeocode } from "../Services/api";
import { Button, Input, Drawer, Space, Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { FiMoon, FiSun, FiSearch } from "react-icons/fi";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

import LoginPopup from "../Components/LoginPopup";
import LocationPopup from "../Components/LocationPopup";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { useRole } from "../Context/RoleContext";
import NotificationCenter from "../Components/NotificationCenter";

const ThemeToggle = ({ theme, onClick, className }: { theme: string, onClick: () => void, className?: string }) => {
  const isDark = theme === "dark";

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center w-16 h-8 rounded-full cursor-pointer bg-gradient-to-r from-[#ba5eed] to-[#517aff] shadow-inner ${className || ""}`}
    >
      <div className="absolute w-full flex justify-between px-[11px] pointer-events-none top-1/2 -translate-y-1/2">
        <FiMoon className="text-white" size={14} strokeWidth={3} />
        <FiSun className="text-white" size={14} strokeWidth={3} />
      </div>

      <div
        className={`absolute w-6 h-6 bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md top-1 ${isDark ? "left-1" : "left-[calc(100%-28px)]"
          }`}
      >
        {isDark ? (
          <FiMoon className="text-[#ba5eed]" size={14} strokeWidth={3} />
        ) : (
          <FiSun className="text-[#517aff]" size={14} strokeWidth={3} />
        )}
      </div>
    </div>
  );
};

const CustomSearchBar = ({ value, onChange, onSearch, theme }: { value: string, onChange: (v: string) => void, onSearch: (v: string) => void, theme: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = [
    "Plumber",
    "Cook",
    "Electrician",
    "House Cleaning",
    "Carpentry",
    "AC Repair"
  ];

  const showSuggestions = isHovered || isFocused;
  const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()));

  return (
    <div
      className="relative flex-1 max-w-xl w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative flex items-center w-full h-[46px] rounded-[16px] transition-all duration-300 z-50 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 border' : 'bg-[#fff] shadow-sm'}`}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(value)}
          placeholder="Search services..."
          className={`w-full h-full pl-5 pr-2 bg-transparent outline-none border-none font-medium text-[14px] rounded-l-[16px] ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
        />
        <div
          onClick={() => onSearch(value)}
          className={`flex flex-shrink-0 items-center justify-center w-[36px] h-[36px] mr-1.5 rounded-[12px] cursor-pointer hover:opacity-80 transition-opacity ${theme === 'dark' ? 'bg-slate-700' : 'bg-[#f4f4f4]'}`}
        >
          <FiSearch className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} size={16} strokeWidth={2.5} />
        </div>
      </div>

      {showSuggestions && (
        <div className={`absolute top-[calc(100%+8px)] left-0 w-full rounded-[16px] shadow-xl overflow-hidden z-40 transition-all duration-300 ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'}`}>
          <div className="py-2 max-h-[300px] overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(suggestion);
                    onSearch(suggestion);
                    setIsHovered(false);
                    setIsFocused(false);
                  }}
                  className={`flex items-center px-5 py-2 cursor-pointer font-medium text-[14px] transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-gray-400 hover:text-gray-200' : 'hover:bg-black/5 text-gray-500 hover:text-gray-800'}`}
                >
                  <FiSearch className={`mr-3 flex-shrink-0 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={14} strokeWidth={2.5} />
                  <span className="truncate">{suggestion}</span>
                </div>
              ))
            ) : (
              <div className={`px-5 py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                No services found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomLocationButton = ({ location, onClick, theme, isMobile }: { location: string | null, onClick: () => void, theme: string, isMobile?: boolean }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center transition-all duration-300 cursor-pointer hover:opacity-90 gap-2 whitespace-nowrap
        ${isMobile ? 'h-[36px] rounded-[12px] pl-2 pr-3' : 'h-[46px] rounded-[16px] pl-2.5 pr-4'}
        ${theme === 'dark' ? 'bg-slate-800 border-slate-700 border' : 'bg-white shadow-sm'}
      `}
    >
      <div className={`flex flex-shrink-0 items-center justify-center 
        ${isMobile ? 'w-[26px] h-[26px] rounded-[8px]' : 'w-[34px] h-[34px] rounded-[12px]'}
        ${theme === 'dark' ? 'bg-slate-700' : 'bg-[#f4f4f4]'}
      `}>
        <FaLocationDot className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} size={isMobile ? 12 : 14} />
      </div>
      {(!isMobile || location) && (
        <span className={`font-medium ${isMobile ? 'text-[13px]' : 'text-[14px]'} ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          {location || (isMobile ? '' : 'Select Location')}
        </span>
      )}
    </div>
  );
};

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  // Initialize selectedLocation from localStorage
  const getStoredLocation = () => {
    try {
      const stored = localStorage.getItem("userLocation");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null;
  };

  const storedLoc = getStoredLocation();
  const [selectedLocation, setSelectedLocation] = useState(storedLoc?.city || "");
  const [searchValue, setSearchValue] = useState("");

  const nav = useNavigate();
  const location = useLocation();

  // Automatic location detection logic
  useEffect(() => {
    if (!storedLoc && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await reverseGeocode(lat, lon);
            const loc = res.data?.location || {};
            const address = loc.address || {};
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              address.state_district ||
              "";

            const newLocation = { lat, lon, city };
            localStorage.setItem("userLocation", JSON.stringify(newLocation));
            setSelectedLocation(city);
          } catch (error) {
            console.error("Auto location failed", error);
          }
        },
        (err) => console.error("Geolocation error", err)
      );
    }
  }, []); // Run only once

  // React Query with exponential backoff for returning users
  const { data: qryLocationData } = useQuery({
    queryKey: ["userLocation", storedLoc?.lat, storedLoc?.lon],
    queryFn: async () => {
      if (!storedLoc?.lat || !storedLoc?.lon) return null;
      const res = await reverseGeocode(storedLoc.lat, storedLoc.lon);
      return res.data;
    },
    enabled: !!storedLoc?.lat && !!storedLoc?.lon,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  useEffect(() => {
    if (qryLocationData?.location) {
      const loc = qryLocationData.location;
      const address = loc.address || {};
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        address.state_district ||
        "";

      if (city && city !== selectedLocation) {
        setSelectedLocation(city);
        localStorage.setItem(
          "userLocation",
          JSON.stringify({ ...storedLoc, city })
        );
      }
    }
  }, [qryLocationData]);

  // ✅ Auth state
  const { isLoggedIn, logout, user } = useAuth();

  // ✅ Theme state
  const { theme, toggleTheme } = useTheme();

  // ✅ Role state
  const { activeRole, availableRoles, switchRole } = useRole();

  // AUTO-CLOSE MOBILE MENU ON ROUTE CHANGE
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const onSearch = (value: string) => {
    console.log("Search:", value);
  };

  const profileMenu: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div className="px-2 py-1">
          <p className="font-semibold text-gray-800 dark:text-gray-200">{user?.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "dashboard",
      label: "Dashboard",
      onClick: () => nav(activeRole === "provider" ? "/provider-dashboard" : "/user-dashboard"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-16 border-b shadow-sm h-16 backdrop-blur-md transition-colors duration-300 ${theme === "dark"
          ? "bg-slate-900/90 border-slate-800"
          : "bg-white/90 border-gray-200"
          }`}
      >
        {/* LEFT: Logo */}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center cursor-pointer"
          onClick={() => nav("/")}
        >
          <img
            src={logo}
            alt="ServEase Logo"
            className={`h-10 md:h-14 w-auto ${theme === "dark" ? "brightness-0 invert" : ""}`}
          />
        </motion.div>


        {/* CENTER: Location + Search (Desktop only) */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl mx-8">
          <CustomLocationButton
            location={selectedLocation}
            onClick={() => setShowLocation(true)}
            theme={theme}
          />

          <CustomSearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={onSearch}
            theme={theme}
          />
        </div>

        {/* RIGHT: Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle theme={theme} onClick={toggleTheme} className="mr-2" />
          {!isLoggedIn ? (
            <Button
              type="default"
              onClick={() => setShowLogin(true)}
              size="large"
            >
              Login
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <NotificationCenter />
              <Dropdown menu={{ items: profileMenu }} placement="bottomRight">
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  className="cursor-pointer"
                />
              </Dropdown>
            </div>
          )}

          {!isLoggedIn || !availableRoles.includes("provider") ? (
            <Button
              type="primary"
              size="large"
              onClick={() => nav("/become-provider")}
            >
              Become Provider
            </Button>
          ) : (
            <div className={`p-1 flex items-center rounded-lg border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
              <Button
                type={activeRole === "user" ? "primary" : "text"}
                size="middle"
                onClick={() => switchRole("user")}
                className={activeRole === "user" ? "" : (theme === 'dark' ? "text-gray-400" : "text-gray-500")}
              >
                User
              </Button>
              <Button
                type={activeRole === "provider" ? "primary" : "text"}
                size="middle"
                onClick={() => switchRole("provider")}
                className={activeRole === "provider" ? "" : (theme === 'dark' ? "text-gray-400" : "text-gray-500")}
              >
                Provider
              </Button>
            </div>
          )}

          {isLoggedIn && activeRole === "user" && (
            <Button type="primary" size="large" className="bg-gradient-to-r from-purple-500 to-indigo-500 border-none hover:opacity-90 transition-opacity" onClick={() => nav("/post-job")}>
              Post a Job
            </Button>
          )}
        </div>

        {/* MOBILE: Location | Login | Menu */}
        <div className="md:hidden flex items-center gap-2">
          {/* Location */}
          <CustomLocationButton
            location={selectedLocation}
            onClick={() => setShowLocation(true)}
            theme={theme}
            isMobile
          />

          {/* Login / Avatar */}
          {!isLoggedIn ? (
            <Button
              type="default"
              size="small"
              onClick={() => setShowLogin(true)}
            >
              Login
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <Avatar
                size="small"
                icon={<UserOutlined />}
                className="cursor-pointer"
              />
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onClick={toggleTheme} />

          {/* Menu */}
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
            const currentStored = getStoredLocation() || {};
            if (currentStored.city !== city) {
              localStorage.setItem("userLocation", JSON.stringify({ ...currentStored, city }));
            }
            setShowLocation(false);
          }}
        />
      </motion.nav>

      {/* MOBILE DRAWER */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMenuOpen(false)}
        open={menuOpen}
        width={280}
      >
        <Space direction="vertical" size="middle" className="w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
            <ThemeToggle
              theme={theme}
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
            />
          </div>

          {isLoggedIn && (
            <Button
              block
              danger
              icon={<LogoutOutlined />}
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              size="large"
            >
              Logout
            </Button>
          )}

          <Button
            block
            type="primary"
            onClick={() => {
              if (isLoggedIn && availableRoles.includes("provider")) {
                nav(activeRole === "provider" ? "/provider-dashboard" : "/user-dashboard");
              } else {
                nav("/become-provider");
              }
              setMenuOpen(false);
            }}
            size="large"
          >
            {(isLoggedIn && availableRoles.includes("provider")) ? "Dashboard" : "Become Provider"}
          </Button>
          {isLoggedIn && activeRole === "user" && (
            <Button
              block
              type="primary"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 border-none"
              onClick={() => {
                nav("/post-job");
                setMenuOpen(false);
              }}
              size="large"
            >
              Post a Job
            </Button>
          )}
        </Space>
      </Drawer>
    </>
  );
};

export default Navbar;