import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "../Services/axios";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import LoginPopup from "./LoginPopup";
import {
  Modal,
  Button,
  Input,
  Select,
  Upload,
  Form,
  App,
  Checkbox,
  InputNumber,
} from "antd";
import {
  User,
  Briefcase,
  MapPin,
  ShieldCheck,
  UploadCloud,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  LocateFixed,
  Phone,
} from "lucide-react";

const { Option } = Select;

const serviceCategories: Record<string, string[]> = {
  plumber: [
    "Tap Repair",
    "Leak Fixing",
    "Pipe Installation",
    "Bathroom Plumbing",
    "Drain Cleaning",
    "Water Tank Installation",
    "Motor Pump Repair",
  ],
  electrician: [
    "Fan Installation",
    "Light Installation",
    "Switch Board Repair",
    "Wiring Repair",
    "AC Power Connection",
    "Doorbell Installation",
    "Inverter Wiring",
    "MCB Repair",
  ],
  carpenter: [
    "Furniture Repair",
    "Door Installation",
    "Window Repair",
    "Bed Assembly",
    "Wardrobe Repair",
    "Kitchen Cabinet Fitting",
    "Table & Chair Repair",
  ],
  maid: [
    "House Cleaning",
    "Full Time Maid",
    "Part Time Maid",
    "Utensil Washing",
    "Clothes Washing",
    "Cooking Maid",
    "Deep Cleaning",
  ],
  salon_women: [
    "Haircut & Styling",
    "Hair Spa & Coloring",
    "Facial & Threading",
    "Waxing",
    "Manicure & Pedicure",
    "Bridal & Party Makeup",
  ],
  salon_men: [
    "Haircut & Beard Styling",
    "Shaving & Beard Trim",
    "Hair Coloring",
    "Head Massage & Facial",
  ],
  cook: [
    "Home Cook (Daily)",
    "Party & Event Cook",
    "North Indian Cooking",
    "South Indian Cooking",
    "Tiffin Preparation",
  ],
  tutor: [
    "Maths & Science Tutor",
    "English & Language Tutor",
    "Computer & Coding Tutor",
    "Home Tutor (All Subjects)",
    "Exam Preparation",
  ],
};

const ServiceProviderForm = ({
  onOpen,
  onClose,
}: {
  onOpen: boolean;
  onClose: () => void;
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 19.076,
    lng: 72.8777,
  });

  const { user, login } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const selectedCategory = Form.useWatch("category", form);

  // Set pre-filled values
  useEffect(() => {
    if (onOpen) {
      const storedLocString = localStorage.getItem("userLocation");
      let initialAddress = "";
      if (storedLocString) {
        try {
          const loc = JSON.parse(storedLocString);
          if (loc.lat && (loc.lon || loc.lng)) {
            setCoordinates({
              lat: Number(loc.lat) || 19.076,
              lng: Number(loc.lon || loc.lng) || 72.8777,
            });
          }
          if (loc.city) {
            initialAddress = loc.city;
          }
        } catch (e) {
          console.error("Error reading stored location", e);
        }
      }

      form.setFieldsValue({
        firstName: user?.name ? user.name.split(" ")[0] : "",
        lastName: user?.name && user.name.split(" ").length > 1 ? user.name.split(" ").slice(1).join(" ") : "",
        phone: user?.phone || "",
        gender: "male",
        category: "plumber",
        services: ["Tap Repair", "Leak Fixing"],
        experience: "3",
        fee: 299,
        address: initialAddress,
        idType: "aadhaar",
        languages: ["english", "hindi"],
        bio: "Experienced service professional offering quality and reliable workmanship.",
        emergency: user?.phone || "9876543210",
        terms: true,
      });
      setCurrentStep(0);
    }
  }, [onOpen, user, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in first to apply.");
      }
      const response = await axios.post(`/api/provider/create-provider`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (data) => {
      message.success("🎉 Application submitted! Welcome to ServEase Professionals.");
      if (data.user) login(data.user);
      form.resetFields();
      setCurrentStep(0);
      onClose();
    },
    onError: (error: any) => {
      console.error("Backend Error:", error);
      const msg = error.response?.data?.message || error.message || "Failed to submit application. Please try again.";
      if (
        msg.toLowerCase().includes("token") ||
        msg.toLowerCase().includes("authorized") ||
        error.response?.status === 401
      ) {
        message.error("Session expired or not logged in. Please log in first.");
        setShowLogin(true);
      } else {
        message.error(msg);
      }
    },
  });

  // Handle GPS detection
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
            message.success("Current address detected!");
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
        message.error("Unable to get current location");
        setDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  const nextStep = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields([
          "firstName",
          "lastName",
          "phone",
          "gender",
          "category",
          "services",
          "experience",
          "fee",
        ]);
      }
      setCurrentStep((prev) => prev + 1);
    } catch {
      // Form highlights validation errors
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.warning("Please log in first to apply as a service provider.");
      setShowLogin(true);
      return;
    }

    try {
      await form.validateFields();
      const allValues = form.getFieldsValue(true);
      const formData = new FormData();

      // Required text & number fields
      formData.append("firstName", allValues.firstName || (user?.name ? user.name.split(" ")[0] : "Partner"));
      formData.append("lastName", allValues.lastName || (user?.name && user.name.split(" ").length > 1 ? user.name.split(" ").slice(1).join(" ") : "Pro"));
      formData.append("phone", allValues.phone || user?.phone || "9876543210");
      formData.append("gender", allValues.gender || "male");
      formData.append("category", allValues.category || "plumber");
      formData.append("experience", String(allValues.experience || 1));
      formData.append("fee", String(allValues.fee || 299));
      formData.append("address", allValues.address || "Local Area");
      formData.append("idType", allValues.idType || "aadhaar");
      formData.append("terms", "true");
      formData.append("bio", allValues.bio || `${allValues.category || "Service"} professional offering reliable home services.`);
      formData.append("emergency", allValues.emergency || allValues.phone || "9876543210");

      // Languages
      const langs = Array.isArray(allValues.languages) && allValues.languages.length > 0 ? allValues.languages : ["english", "hindi"];
      langs.forEach((l: string) => formData.append("languages", l));

      // Services
      const services = Array.isArray(allValues.services) && allValues.services.length > 0 ? allValues.services : (serviceCategories[allValues.category] || ["Standard Service"]);
      services.forEach((s: string) => formData.append("services", s));

      // Files
      if (Array.isArray(allValues.profilePhoto) && allValues.profilePhoto.length > 0 && allValues.profilePhoto[0].originFileObj) {
        formData.append("profilePhoto", allValues.profilePhoto[0].originFileObj);
      }
      if (Array.isArray(allValues.idProofFront) && allValues.idProofFront.length > 0 && allValues.idProofFront[0].originFileObj) {
        formData.append("idProofFront", allValues.idProofFront[0].originFileObj);
      }
      if (Array.isArray(allValues.idProofBack) && allValues.idProofBack.length > 0 && allValues.idProofBack[0].originFileObj) {
        formData.append("idProofBack", allValues.idProofBack[0].originFileObj);
      }

      // GeoJSON location Point format
      const safeLng = Number(coordinates.lng) || 72.8777;
      const safeLat = Number(coordinates.lat) || 19.076;
      const locationJSON = {
        type: "Point",
        coordinates: [safeLng, safeLat],
      };
      formData.append("location", JSON.stringify(locationJSON));

      mutate(formData);
    } catch (err) {
      console.error("Form validation / submission error:", err);
    }
  };

  return (
    <>
      <Modal
        open={onOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={620}
        destroyOnClose
        className="custom-provider-modal"
        title={
          <div className="flex items-center gap-3 pb-2 border-b dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Join as a Service Partner
              </h3>
              <p className={`text-xs font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Register in 2 easy steps and start receiving customer requests nearby
              </p>
            </div>
          </div>
        }
      >
        <div className="pt-4">
          {/* PROGRESS STEPPER */}
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === 0
                    ? "bg-blue-600 text-white ring-4 ring-blue-500/20 shadow"
                    : "bg-emerald-500 text-white"
                }`}
              >
                {currentStep > 0 ? "✓" : "1"}
              </div>
              <span className={`text-xs font-bold ${currentStep === 0 ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"}`}>
                Personal & Skills
              </span>
            </div>

            <div className="h-0.5 flex-1 mx-3 bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === 1
                    ? "bg-blue-600 text-white ring-4 ring-blue-500/20 shadow"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                }`}
              >
                2
              </div>
              <span className={`text-xs font-bold ${currentStep === 1 ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
                Location & KYC
              </span>
            </div>
          </div>

          <Form form={form} layout="vertical" preserve={true}>
            {/* ================= STEP 1: Personal & Skills ================= */}
            <div className={currentStep === 0 ? "space-y-3" : "hidden"}>
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">First Name</span>}
                  name="firstName"
                  rules={[{ required: true, message: "Enter first name" }]}
                  className="mb-2"
                >
                  <Input size="large" placeholder="e.g. Ramesh" className="rounded-xl font-medium text-sm" />
                </Form.Item>

                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Last Name</span>}
                  name="lastName"
                  rules={[{ required: true, message: "Enter last name" }]}
                  className="mb-2"
                >
                  <Input size="large" placeholder="e.g. Kumar" className="rounded-xl font-medium text-sm" />
                </Form.Item>
              </div>

              {/* Contact & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Mobile Number</span>}
                  name="phone"
                  rules={[
                    { required: true, message: "Enter mobile number" },
                    { pattern: /^[6-9]\d{9}$/, message: "Valid 10-digit number" },
                  ]}
                  className="mb-2"
                >
                  <Input
                    size="large"
                    placeholder="10-digit number"
                    maxLength={10}
                    className="rounded-xl font-medium text-sm"
                    prefix={<Phone className="w-4 h-4 text-slate-400 mr-1" />}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Gender</span>}
                  name="gender"
                  rules={[{ required: true, message: "Select gender" }]}
                  className="mb-2"
                >
                  <Select size="large" className="rounded-xl font-medium">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Service Category */}
              <Form.Item
                label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Primary Skill / Category</span>}
                name="category"
                rules={[{ required: true, message: "Please pick your profession" }]}
                className="mb-2"
              >
                <Select
                  size="large"
                  placeholder="Select primary profession"
                  className="rounded-xl font-medium"
                  onChange={(val) => {
                    const available = serviceCategories[val] || [];
                    form.setFieldsValue({
                      services: available.slice(0, 2),
                    });
                  }}
                >
                  <Option value="plumber">🔧 Plumber</Option>
                  <Option value="electrician">⚡ Electrician</Option>
                  <Option value="carpenter">🪚 Carpenter</Option>
                  <Option value="maid">🧹 Maid / Cleaner</Option>
                  <Option value="salon_women">💇 Salon (Women)</Option>
                  <Option value="salon_men">💈 Salon (Men)</Option>
                  <Option value="cook">👨‍🍳 Cook / Chef</Option>
                  <Option value="tutor">📚 Tutor / Teacher</Option>
                </Select>
              </Form.Item>

              {/* Specific Services Offered */}
              <Form.Item
                label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Services Offered</span>}
                name="services"
                rules={[{ required: true, message: "Select at least 1 service" }]}
                className="mb-2"
              >
                <Select
                  mode="multiple"
                  size="large"
                  placeholder="Select specific tasks you perform"
                  className="rounded-xl font-medium"
                  maxTagCount="responsive"
                >
                  {selectedCategory &&
                    serviceCategories[selectedCategory]?.map((srv) => (
                      <Option key={srv} value={srv}>
                        {srv}
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              {/* Experience & Fee */}
              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Experience</span>}
                  name="experience"
                  rules={[{ required: true, message: "Select experience" }]}
                  className="mb-0"
                >
                  <Select size="large" className="rounded-xl font-medium">
                    <Option value="1">1 Year</Option>
                    <Option value="3">2 - 4 Years</Option>
                    <Option value="5">5+ Years</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Visiting Fee (₹)</span>}
                  name="fee"
                  rules={[{ required: true, message: "Enter base fee" }]}
                  className="mb-0"
                >
                  <InputNumber
                    size="large"
                    prefix="₹"
                    min={50}
                    max={10000}
                    className="w-full rounded-xl"
                    placeholder="299"
                  />
                </Form.Item>
              </div>
            </div>

            {/* ================= STEP 2: Location & KYC Verification ================= */}
            <div className={currentStep === 1 ? "space-y-3" : "hidden"}>
              {/* Address with GPS auto-detect */}
              <Form.Item
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Operating City / Area Address</span>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <LocateFixed className={`w-3 h-3 ${detectingLocation ? "animate-spin" : ""}`} />
                      {detectingLocation ? "Detecting..." : "Use Current GPS"}
                    </button>
                  </div>
                }
                name="address"
                rules={[{ required: true, message: "Enter your service address" }]}
                className="mb-2"
              >
                <Input
                  size="large"
                  placeholder="e.g. Andheri West, Mumbai, Maharashtra"
                  className="rounded-xl font-medium text-sm"
                  prefix={<MapPin className="w-4 h-4 text-slate-400 mr-1" />}
                />
              </Form.Item>

              {/* ID Document Selection */}
              <Form.Item
                label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Identity Document Type</span>}
                name="idType"
                rules={[{ required: true, message: "Select document type" }]}
                className="mb-2"
              >
                <Select size="large" className="rounded-xl font-medium">
                  <Option value="aadhaar">Aadhaar Card</Option>
                  <Option value="pan">PAN Card</Option>
                  <Option value="driving_license">Driving License</Option>
                </Select>
              </Form.Item>

              {/* Simple Document Uploads */}
              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">ID Proof (Front)</span>}
                  name="idProofFront"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e?.fileList}
                  className="mb-2"
                >
                  <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                    <Button icon={<UploadCloud className="w-4 h-4" />} size="large" className="w-full rounded-xl text-xs font-semibold">
                      Upload Front
                    </Button>
                  </Upload>
                </Form.Item>

                <Form.Item
                  label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">ID Proof (Back)</span>}
                  name="idProofBack"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e?.fileList}
                  className="mb-2"
                >
                  <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                    <Button icon={<UploadCloud className="w-4 h-4" />} size="large" className="w-full rounded-xl text-xs font-semibold">
                      Upload Back
                    </Button>
                  </Upload>
                </Form.Item>
              </div>

              {/* Profile Photo (Optional) */}
              <Form.Item
                label={<span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Profile Photo (Optional)</span>}
                name="profilePhoto"
                valuePropName="fileList"
                getValueFromEvent={(e) => e?.fileList}
                className="mb-2"
              >
                <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                  <Button icon={<User className="w-4 h-4" />} size="large" className="w-full rounded-xl text-xs font-semibold">
                    Select Profile Photo
                  </Button>
                </Upload>
              </Form.Item>

              {/* Trust Badge */}
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                  Your identity documents are securely encrypted and verified. Verified partners get 4x more customer booking requests.
                </p>
              </div>

              {/* Terms Checkbox */}
              <Form.Item
                name="terms"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Please agree to partner terms")),
                  },
                ]}
                className="mb-0 pt-1"
              >
                <Checkbox className="text-xs text-slate-600 dark:text-slate-300">
                  I agree to ServEase Partner Terms &amp; verify the submitted details are correct.
                </Checkbox>
              </Form.Item>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="flex items-center justify-between pt-4 border-t dark:border-slate-800 mt-5">
              {currentStep > 0 ? (
                <Button
                  size="large"
                  onClick={prevStep}
                  icon={<ArrowLeft className="w-4 h-4" />}
                  className="rounded-xl font-semibold"
                >
                  Back
                </Button>
              ) : (
                <Button size="large" onClick={onClose} className="rounded-xl font-semibold">
                  Cancel
                </Button>
              )}

              {currentStep === 0 ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={nextStep}
                  className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 px-6 shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                  loading={isPending}
                  className="rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-95 px-7 border-none shadow-lg shadow-blue-500/25 text-white flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Partner Application</span>
                </Button>
              )}
            </div>
          </Form>
        </div>
      </Modal>

      <LoginPopup show={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default ServiceProviderForm;