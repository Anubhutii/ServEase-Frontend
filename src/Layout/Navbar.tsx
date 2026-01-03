import React, { useState, useEffect } from "react";
import { Button, Input, Drawer, Space, Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch, FaBars } from "react-icons/fa";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

import LoginPopup from "../Components/LoginPopup";
import LocationPopup from "../Components/LocationPopup";
import { useAuth } from "../Context/AuthContext";

const { Search } = Input;

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [searchValue, setSearchValue] = useState("");

  const nav = useNavigate();
  const location = useLocation();

  // ✅ Auth state
  const { isLoggedIn, logout } = useAuth();

  // AUTO-CLOSE MOBILE MENU ON ROUTE CHANGE
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const onSearch = (value: string) => {
    console.log("Search:", value);
  };

  // Profile dropdown menu
  const profileMenu: MenuProps["items"] = [
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
        className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-16 bg-white border-b border-gray-200 shadow-sm h-16 backdrop-blur-sm bg-white/95"
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
            className="h-10 md:h-14 w-auto"
          />
        </motion.div>

        {/* CENTER: Location + Search (Desktop only) */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl mx-8">
          <Button
            type="default"
            icon={<FaLocationDot />}
            onClick={() => setShowLocation(true)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <span className="hidden lg:inline">{selectedLocation}</span>
            <span className="lg:hidden">Location</span>
          </Button>

          <Search
            placeholder="Search services..."
            allowClear
            enterButton={<FaSearch />}
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={onSearch}
            className="flex-1"
          />
        </div>

        {/* RIGHT: Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <Button
              type="default"
              onClick={() => setShowLogin(true)}
              size="large"
            >
              Login
            </Button>
          ) : (
            <Dropdown menu={{ items: profileMenu }} placement="bottomRight">
              <Avatar
                size="large"
                icon={<UserOutlined />}
                className="cursor-pointer"
              />
            </Dropdown>
          )}

          <Button
            type="primary"
            size="large"
            onClick={() => nav("/become-provider")}
          >
            Become Provider
          </Button>
        </div>

        {/* MOBILE: Menu Icon */}
        <div className="md:hidden">
          <Button
            type="text"
            icon={<FaBars size={20} />}
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
          <Button
            block
            type="default"
            icon={<FaLocationDot />}
            onClick={() => {
              setShowLocation(true);
              setMenuOpen(false);
            }}
            size="large"
          >
            {selectedLocation}
          </Button>

          <Search
            placeholder="Search services..."
            allowClear
            onSearch={onSearch}
            className="w-full"
          />

          {!isLoggedIn ? (
            <Button
              block
              type="default"
              onClick={() => {
                setShowLogin(true);
                setMenuOpen(false);
              }}
              size="large"
            >
              Login
            </Button>
          ) : (
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
              nav("/become-provider");
              setMenuOpen(false);
            }}
            size="large"
          >
            Become Provider
          </Button>
        </Space>
      </Drawer>
    </>
  );
};

export default Navbar;
