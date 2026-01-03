import { useState } from "react";
import { Modal, Button, AutoComplete, Typography, Space, Spin, message } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

type Props = {
  open: boolean;
  onClose: () => void;
  onSelectLocation: (city: string) => void;
};

const popularCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
];

const LocationPopup = ({ open, onClose, onSelectLocation }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      message.error("Geolocation not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            {
              headers: {
                Accept: "application/json",
                "User-Agent": "ServEaseApp/1.0 (dev@servease.com)",
              },
            }
          );

          if (!res.ok) throw new Error("OSM error");

          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.district ||
            "Your Location";

          message.success(`Location detected: ${city}`);
          onSelectLocation(city);
          onClose();
        } catch (err) {
          message.error("Location service temporarily unavailable. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          message.error("Location permission denied. Please enable location access.");
        } else if (err.code === 2) {
          message.error("Location unavailable. Please try again.");
        } else if (err.code === 3) {
          message.error("Request timeout. Please try again.");
        } else {
          message.error("Failed to get your location. Please try again.");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value) {
      const filtered = popularCities
        .filter((city) =>
          city.toLowerCase().includes(value.toLowerCase())
        )
        .map((city) => ({ value: city, label: city }));
      setOptions(filtered);
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (value: string) => {
    onSelectLocation(value);
    setSearchValue("");
    setOptions([]);
    onClose();
  };

  const handleCityClick = (city: string) => {
    onSelectLocation(city);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      title={
        <Title level={4} className="!mb-0">
          Select your location
        </Title>
      }
    >
      <Space direction="vertical" size="large" className="w-full">
        {/* USE CURRENT LOCATION */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="primary"
            size="large"
            block
            icon={<FaLocationDot />}
            onClick={detectLocation}
            loading={loading}
            className="!h-14 !rounded-lg !bg-gradient-to-r !from-blue-500 !to-purple-500 !border-none"
          >
            {loading ? "Detecting location..." : "Use current location"}
          </Button>
        </motion.div>

        <div className="text-center">
          <Text type="secondary">— OR —</Text>
        </div>

        {/* SEARCH INPUT */}
        <div>
          <Text strong className="block mb-2">
            Search for your city
          </Text>
          <AutoComplete
            value={searchValue}
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
            placeholder="Type to search city or area"
            size="large"
            className="w-full"
            notFoundContent={
              searchValue ? (
                <Text type="secondary">No cities found</Text>
              ) : (
                <Text type="secondary">Start typing to search</Text>
              )
            }
          />
        </div>

        {/* POPULAR CITIES */}
        <div>
          <Text strong className="block mb-3">
            Popular Cities
          </Text>
          <div className="grid grid-cols-2 gap-2">
            {popularCities.map((city) => (
              <motion.div
                key={city}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="default"
                  block
                  icon={<EnvironmentOutlined />}
                  onClick={() => handleCityClick(city)}
                  className="!h-10 !rounded-lg !flex !items-center !justify-center"
                >
                  {city}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Space>
    </Modal>
  );
};

export default LocationPopup;
