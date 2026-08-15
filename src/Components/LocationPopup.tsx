import { useState } from "react";
import { Modal, Button, AutoComplete, Typography, Space, App } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import { EnvironmentOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { reverseGeocode } from "../Services/api";
import { setCachedLocation } from "../Services/locationManager";

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
  const { message } = App.useApp();
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
          const res = await reverseGeocode(lat, lon);


          // Based on the format: { location: { address: { city, town, village... } } }
          const loc = res.data.location || {};
          const address = loc.address || {};

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state_district ||
            "Your Location";

          setCachedLocation({ lat, lon, city, address: loc.display_name || city });

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
    setCachedLocation({ city: value, address: value });
    onSelectLocation(value);
    setSearchValue("");
    setOptions([]);
    onClose();
  };

  const handleCityClick = (city: string) => {
    setCachedLocation({ city, address: city });
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
        <Title level={4} >
          Select Your Location
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
            className="!h-14 !rounded-lg !bg-blue-800 hover:!bg-blue-700 dark:!bg-blue-900 dark:hover:!bg-blue-800 !border-none !text-white !shadow-md transition-colors"
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
