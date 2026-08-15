import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  App,
} from "antd";
import {
  Sparkles,
  MapPin,
  Phone,
  LocateFixed,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "../Services/axios";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import LoginPopup from "./LoginPopup";

const { TextArea } = Input;
const { Option } = Select;

interface PostJobContextType {
  isPostJobOpen: boolean;
  openPostJob: (initialData?: { category?: string; title?: string }) => void;
  closePostJob: () => void;
}

const PostJobContext = createContext<PostJobContextType | undefined>(undefined);

export const usePostJob = () => {
  const context = useContext(PostJobContext);
  if (!context) {
    throw new Error("usePostJob must be used within a PostJobProvider");
  }
  return context;
};

// Normalize categories between post job and provider search
const normalizeCategory = (cat: string): string => {
  const map: Record<string, string> = {
    Plumber: "plumber",
    Electrician: "electrician",
    Carpenter: "carpenter",
    Cleaning: "cleaning",
    "AC Repair": "appliances",
    "Salon & Spa": "women-salon",
    "Appliance Repair": "appliances",
    Painting: "carpenter",
    Other: "",
  };
  return map[cat] !== undefined ? map[cat] : cat.toLowerCase();
};

export const PostJobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 19.076, lng: 72.8777 });

  // Live Matching Partners State
  const [selectedCategory, setSelectedCategory] = useState<string>("Plumber");
  const [matchingPartners, setMatchingPartners] = useState<any[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);

  const [form] = Form.useForm();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Fetch matching verified partners whenever category changes
  useEffect(() => {
    if (!isOpen) return;

    const fetchMatchingPartners = async () => {
      setLoadingPartners(true);
      try {
        const catKey = normalizeCategory(selectedCategory);
        const params: Record<string, string> = {};
        if (catKey) params.category = catKey;

        const storedLocString = localStorage.getItem("userLocation");
        if (storedLocString) {
          try {
            const loc = JSON.parse(storedLocString);
            if (loc.lat && loc.lon) {
              params.lat = loc.lat;
              params.lng = loc.lon;
              params.radius = "30";
            }
          } catch (e) {}
        }

        const res = await axios.get("http://localhost:5000/api/provider/search", { params });
        const list = res.data?.providers || [];
        setMatchingPartners(list);
      } catch (e) {
        setMatchingPartners([]);
      } finally {
        setLoadingPartners(false);
      }
    };

    fetchMatchingPartners();
  }, [selectedCategory, isOpen]);

  const openPostJob = (initialData?: { category?: string; title?: string }) => {
    const storedLocString = localStorage.getItem("userLocation");
    let initialAddress = "";
    if (storedLocString) {
      try {
        const loc = JSON.parse(storedLocString);
        if (loc.lat && loc.lon) {
          setCoordinates({ lat: Number(loc.lat), lng: Number(loc.lon) });
        }
        if (loc.city) {
          initialAddress = loc.city;
        }
      } catch (e) {
        console.error("Error parsing location", e);
      }
    }

    const initCat = initialData?.category || "Plumber";
    setSelectedCategory(initCat);

    form.setFieldsValue({
      category: initCat,
      title: initialData?.title || "",
      description: "",
      minBudget: 300,
      maxBudget: 1500,
      deadline: dayjs().add(2, "day"),
      address: initialAddress,
      phone: user?.phone || "",
    });

    setIsOpen(true);
  };

  const closePostJob = () => {
    setIsOpen(false);
    form.resetFields();
  };

  // Auto-detect current location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      message.warning("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordinates({ lat, lng });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          if (data?.display_name) {
            form.setFieldsValue({ address: data.display_name });
            message.success("Location detected!");
          } else {
            form.setFieldsValue({ address: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}` });
          }
        } catch {
          form.setFieldsValue({ address: `Near Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` });
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        message.error("Unable to fetch GPS location");
        setDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  const handleFormSubmit = async (values: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.warning("Please log in first to post a request");
      setShowLogin(true);
      return;
    }

    if (values.minBudget && values.maxBudget && Number(values.minBudget) > Number(values.maxBudget)) {
      message.error("Minimum budget cannot be greater than Maximum budget");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        category: values.category,
        location: {
          type: "Point",
          coordinates: [coordinates.lng || 0, coordinates.lat || 0],
          address: values.address,
        },
        budget_range: {
          min: Number(values.minBudget),
          max: Number(values.maxBudget),
        },
        deadline: values.deadline ? values.deadline.toISOString() : new Date().toISOString(),
        phone: values.phone,
      };

      await axios.post("/api/jobs", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalizedCat = normalizeCategory(values.category);

      message.success(`Request posted! Filter applied to show verified ${values.category} partners.`);
      closePostJob();

      // Dispatch global events to auto-refresh dashboards and filter services
      window.dispatchEvent(new CustomEvent("job_posted"));
      window.dispatchEvent(
        new CustomEvent("apply_job_filter", {
          detail: { category: normalizedCat, search: values.title },
        })
      );

      // Navigate to services page filtered to this category
      navigate("/service", {
        state: { category: normalizedCat, search: "" },
      });
    } catch (error: any) {
      console.error("Failed to post job:", error);
      const msg = error.response?.data?.message || error.message || "Failed to post request. Please try again.";
      if (
        msg.toLowerCase().includes("token") ||
        msg.toLowerCase().includes("authorized") ||
        error.response?.status === 401
      ) {
        message.error("Session expired. Please log in again.");
        setShowLogin(true);
      } else {
        message.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PostJobContext.Provider value={{ isPostJobOpen: isOpen, openPostJob, closePostJob }}>
      {children}

      <Modal
        open={isOpen}
        onCancel={closePostJob}
        footer={null}
        centered
        width={620}
        destroyOnClose
        className="custom-postjob-modal"
        title={
          <div className="flex items-center gap-2.5 pb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-base sm:text-lg font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Post a Service Request
              </h3>
              <p className={`text-xs font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Broadcast your requirement & connect with matching verified partners
              </p>
            </div>
          </div>
        }
      >
        <div className="pt-2 max-h-[75vh] overflow-y-auto pr-1 no-scrollbar">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{ category: "Plumber" }}
          >
            {/* Title & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Job Title</span>}
                  name="title"
                  rules={[{ required: true, message: "Please enter job title" }]}
                  className="mb-3"
                >
                  <Input
                    placeholder="e.g., Pipe leakage fix or wiring inspection"
                    size="large"
                    className="rounded-xl font-medium text-xs sm:text-sm"
                  />
                </Form.Item>
              </div>

              <div className="sm:col-span-5">
                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Category</span>}
                  name="category"
                  rules={[{ required: true, message: "Select category" }]}
                  className="mb-3"
                >
                  <Select
                    size="large"
                    className="rounded-xl font-medium"
                    onChange={(val) => setSelectedCategory(val)}
                  >
                    <Option value="Plumber">🔧 Plumber</Option>
                    <Option value="Electrician">⚡ Electrician</Option>
                    <Option value="Carpenter">🪚 Carpenter</Option>
                    <Option value="Cleaning">🧹 Cleaning</Option>
                    <Option value="AC Repair">❄️ AC Repair</Option>
                    <Option value="Salon & Spa">💇 Salon & Spa</Option>
                    <Option value="Painting">🎨 Painting</Option>
                    <Option value="Appliance Repair">🔌 Appliance</Option>
                    <Option value="Other">🛠️ Other</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* LIVE MATCHING PARTNERS FILTER PREVIEW SECTION */}
            <div className="mb-3.5 p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                  <Users size={14} />
                  <span>
                    {loadingPartners
                      ? "Finding matching partners..."
                      : `${matchingPartners.length} Verified ${selectedCategory} Partners Available`}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                  Live Match
                </span>
              </div>

              {loadingPartners ? (
                <div className="py-2 text-center text-xs text-slate-400">Scanning local professionals...</div>
              ) : matchingPartners.length === 0 ? (
                <div className="py-1 text-xs text-slate-500 dark:text-slate-400 italic">
                  No partners directly listed under this filter yet. Posting will broadcast to all network providers.
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {matchingPartners.slice(0, 4).map((partner) => (
                    <div
                      key={partner._id}
                      className="flex-shrink-0 flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs text-xs"
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                        <img
                          src={
                            partner.profilePhoto
                              ? `http://localhost:5000/api/provider/file/${partner.profilePhoto}`
                              : "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=150&auto=format&fit=crop"
                          }
                          alt={partner.firstName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-800 dark:text-white truncate max-w-[90px]">
                            {partner.firstName}
                          </span>
                          <ShieldCheck size={11} className="text-emerald-500 flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                          <Star size={9} className="fill-amber-400 text-amber-400" />
                          <span>{partner.rating ? Number(partner.rating).toFixed(1) : "4.8"}</span>
                          <span>•</span>
                          <span>₹{partner.fee || 299}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {matchingPartners.length > 4 && (
                    <div className="flex-shrink-0 flex items-center justify-center px-3 rounded-xl bg-blue-100/60 dark:bg-blue-900/40 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                      +{matchingPartners.length - 4} more
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <Form.Item
              label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Description & Requirements</span>}
              name="description"
              rules={[{ required: true, message: "Please describe what you need done" }]}
              className="mb-3"
            >
              <TextArea
                rows={2.5}
                placeholder="Describe the issue, work required, or any specific instructions..."
                className="rounded-xl font-medium text-xs sm:text-sm"
              />
            </Form.Item>

            {/* Budget & Deadline Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3">
              <div className="sm:col-span-6">
                <label className="block font-semibold text-xs text-slate-700 dark:text-slate-300 mb-1">
                  Budget Range (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Form.Item
                    name="minBudget"
                    rules={[{ required: true, message: "Required" }]}
                    className="mb-0"
                  >
                    <InputNumber
                      placeholder="Min"
                      prefix="₹"
                      size="large"
                      className="w-full rounded-xl"
                      min={50}
                    />
                  </Form.Item>
                  <Form.Item
                    name="maxBudget"
                    rules={[{ required: true, message: "Required" }]}
                    className="mb-0"
                  >
                    <InputNumber
                      placeholder="Max"
                      prefix="₹"
                      size="large"
                      className="w-full rounded-xl"
                      min={50}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="sm:col-span-6">
                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Expected Date</span>}
                  name="deadline"
                  rules={[{ required: true, message: "Please select a date" }]}
                  className="mb-0"
                >
                  <DatePicker
                    size="large"
                    className="w-full rounded-xl"
                    format="YYYY-MM-DD"
                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Address with Location Detect button */}
            <Form.Item
              label={
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Address / Location</span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={detectingLocation}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <LocateFixed className={`w-3 h-3 ${detectingLocation ? "animate-spin" : ""}`} />
                    {detectingLocation ? "Detecting..." : "Use My Location"}
                  </button>
                </div>
              }
              name="address"
              rules={[{ required: true, message: "Please provide an address" }]}
              className="mb-3"
            >
              <Input
                placeholder="Street, Flat/House No, Area, City"
                size="large"
                className="rounded-xl font-medium text-xs sm:text-sm"
                prefix={<MapPin className="w-4 h-4 text-slate-400 mr-1" />}
              />
            </Form.Item>

            {/* Mobile Number */}
            <Form.Item
              label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Mobile Phone Number</span>}
              name="phone"
              rules={[
                { required: true, message: "Please provide mobile number" },
                { pattern: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit number" },
              ]}
              className="mb-4"
            >
              <Input
                placeholder="10-digit phone number (e.g. 9876543210)"
                maxLength={10}
                size="large"
                className="rounded-xl font-medium text-xs sm:text-sm"
                prefix={<Phone className="w-4 h-4 text-slate-400 mr-1" />}
              />
            </Form.Item>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t dark:border-slate-800">
              <Button
                size="large"
                onClick={closePostJob}
                className="rounded-xl font-semibold px-4"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 px-5 border-none shadow-md shadow-blue-500/20"
              >
                Post Request & Filter Partners
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <LoginPopup show={showLogin} onClose={() => setShowLogin(false)} />
    </PostJobContext.Provider>
  );
};

export default PostJobProvider;
