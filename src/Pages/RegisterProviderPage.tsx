import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { Form, App } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axios from "../Services/axios";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import LoginPopup from "../Components/LoginPopup";

import ProgressStepper from "../Components/Onboarding/ProgressStepper";
import DetailsSection from "../Components/Onboarding/DetailsSection";
import ServiceSelector, {
  defaultPlumbingServices,
} from "../Components/Onboarding/ServiceSelector";
import SecurityBanner from "../Components/Onboarding/SecurityBanner";
import ReviewStep from "../Components/Onboarding/ReviewStep";
import ActionBar from "../Components/Onboarding/ActionBar";
import Footer from "../Components/Footer";

export const RegisterProviderPage: React.FC = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [currentStep, setCurrentStep] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Tap Repair",
    "Leak Fixing",
  ]);

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 19.076,
    lng: 72.8777,
  });

  // Watch form fields to display in Step 2 Review
  const watchedFirstName = Form.useWatch("firstName", form);
  const watchedLastName = Form.useWatch("lastName", form);
  const watchedPhone = Form.useWatch("phone", form);
  const watchedGender = Form.useWatch("gender", form);
  const watchedExperience = Form.useWatch("experience", form);
  const watchedFee = Form.useWatch("fee", form);
  const watchedAddress = Form.useWatch("address", form);

  // Initialize initial form values
  useEffect(() => {
    window.scrollTo(0, 0);
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
        if (loc.city) initialAddress = loc.city;
      } catch (e) {
        console.error("Error reading location", e);
      }
    }

    form.setFieldsValue({
      firstName: user?.name ? user.name.split(" ")[0] : "Anubhuti",
      lastName:
        user?.name && user.name.split(" ").length > 1
          ? user.name.split(" ").slice(1).join(" ")
          : "Singh",
      phone: user?.phone || "9876543210",
      gender: "male",
      category: "plumber",
      experience: "3",
      fee: 299,
      address: initialAddress || "Andheri West, Mumbai",
      idType: "aadhaar",
      languages: ["english", "hindi"],
      bio: "Experienced service professional offering quality and reliable workmanship.",
      emergency: user?.phone || "9876543210",
      terms: true,
    });
  }, [user, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in first to apply.");
      }
      const response = await axios.post(
        `/api/provider/create-provider`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      message.success("🎉 Provider profile submitted! Welcome to ServEase Pro.");
      if (data.user) login(data.user);
      form.resetFields();
      navigate("/provider-dashboard");
    },
    onError: (error: any) => {
      console.error("Backend Error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit application. Please try again.";
      if (
        msg.toLowerCase().includes("token") ||
        msg.toLowerCase().includes("authorized") ||
        error.response?.status === 401
      ) {
        message.error("Please log in first to continue registration.");
        setShowLogin(true);
      } else {
        message.error(msg);
      }
    },
  });

  // GPS Auto-detection handler
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
            message.success("Location auto-detected!");
          } else {
            form.setFieldsValue({
              address: `Area near ${lat.toFixed(3)}, ${lng.toFixed(3)}`,
            });
          }
        } catch {
          form.setFieldsValue({
            address: `Area near ${lat.toFixed(3)}, ${lng.toFixed(3)}`,
          });
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        message.error("Unable to get current GPS location");
        setDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  const handleContinueToReview = async () => {
    try {
      await form.validateFields([
        "firstName",
        "lastName",
        "phone",
        "gender",
        "experience",
        "fee",
        "address",
      ]);

      if (selectedServices.length === 0) {
        message.warning("Please select at least 1 service you offer");
        return;
      }

      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      message.error("Please complete all required fields");
    }
  };

  const handleBackToEdit = () => {
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitForVerification = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.warning("Please log in first to submit your profile.");
      setShowLogin(true);
      return;
    }

    try {
      await form.validateFields();
      const allValues = form.getFieldsValue(true);
      const formData = new FormData();

      formData.append(
        "firstName",
        allValues.firstName || (user?.name ? user.name.split(" ")[0] : "Anubhuti")
      );
      formData.append(
        "lastName",
        allValues.lastName ||
          (user?.name && user.name.split(" ").length > 1
            ? user.name.split(" ").slice(1).join(" ")
            : "Singh")
      );
      formData.append("phone", allValues.phone || user?.phone || "9876543210");
      formData.append("gender", allValues.gender || "male");
      formData.append("category", allValues.category || "plumber");
      formData.append("experience", String(allValues.experience || 3));
      formData.append("fee", String(allValues.fee || 299));
      formData.append("address", allValues.address || "Andheri West, Mumbai");
      formData.append("idType", allValues.idType || "aadhaar");
      formData.append("terms", "true");
      formData.append(
        "bio",
        allValues.bio ||
          `Professional ${allValues.category || "plumber"} offering quality and reliable workmanship.`
      );
      formData.append(
        "emergency",
        allValues.emergency || allValues.phone || "9876543210"
      );

      const langs =
        Array.isArray(allValues.languages) && allValues.languages.length > 0
          ? allValues.languages
          : ["english", "hindi"];
      langs.forEach((l: string) => formData.append("languages", l));

      const services =
        selectedServices.length > 0 ? selectedServices : ["Tap Repair", "Leak Fixing"];
      services.forEach((s: string) => formData.append("services", s));

      const safeLng = Number(coordinates.lng) || 72.8777;
      const safeLat = Number(coordinates.lat) || 19.076;
      const locationJSON = {
        type: "Point",
        coordinates: [safeLng, safeLat],
      };
      formData.append("location", JSON.stringify(locationJSON));

      mutate(formData);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#0d0f17] text-slate-100" : "bg-[#f7f7fc] text-[#0f172a]"
      }`}
    >
      {/* ================= TOP HEADER (PRO LOGO + STEPPER + CLOSE) ================= */}
      <header className="w-full bg-white/95 dark:bg-[#161926]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          
          {/* Left: ServEase Pro Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 dark:text-white font-extrabold text-base sm:text-lg tracking-tight group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-indigo-600/20 group-hover:bg-indigo-700 transition">
              S
            </div>
            <div className="flex items-center gap-1.5">
              <span>ServEase</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800">
                PRO
              </span>
            </div>
          </Link>

          {/* Center: 2-Step Progress Indicator */}
          <div className="flex items-center justify-center">
            <ProgressStepper
              currentStep={currentStep}
              onStepClick={(step) => setCurrentStep(step)}
            />
          </div>

          {/* Right: Optional Close Button */}
          <Link
            to="/become-provider"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Exit Onboarding"
          >
            <X size={18} />
          </Link>
        </div>
      </header>

      {/* ================= MAIN CENTERED CONTENT CONTAINER ================= */}
      <main className="max-w-[840px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        
        {/* ================= MAIN HEADER TITLE (CENTERED) ================= */}
        {currentStep === 0 && (
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Let&apos;s build your provider profile
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
              Share your details and the services you provide to start receiving jobs.
            </p>
            {/* Small decorative horizontal purple accent */}
            <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto mt-3.5" />
          </div>
        )}

        {/* ================= STEP CONTENT FORM ================= */}
        <Form form={form} layout="vertical" preserve={true}>
          <AnimatePresence mode="wait">
            
            {/* ================= STEP 1: Details & Services ================= */}
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Section 01: Your Details Card */}
                <DetailsSection
                  detectingLocation={detectingLocation}
                  onDetectLocation={handleDetectLocation}
                />

                {/* Section 02: Services You Offer Card */}
                <ServiceSelector
                  selectedServices={selectedServices}
                  onChange={(services) => setSelectedServices(services)}
                  availableServices={defaultPlumbingServices}
                />

                {/* Security / Trust Message Banner */}
                <SecurityBanner />

                {/* Bottom Action Bar */}
                <ActionBar
                  currentStep={0}
                  onCancel={() => navigate("/become-provider")}
                  onContinue={handleContinueToReview}
                />
              </motion.div>
            )}

            {/* ================= STEP 2: Review & Verify ================= */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <ReviewStep
                  formData={{
                    firstName: watchedFirstName,
                    lastName: watchedLastName,
                    phone: watchedPhone,
                    gender: watchedGender,
                    experience: watchedExperience,
                    fee: watchedFee,
                    address: watchedAddress,
                    services: selectedServices,
                  }}
                  onEditSection={handleBackToEdit}
                />

                {/* Security / Trust Message Banner */}
                <SecurityBanner />

                {/* Bottom Action Bar */}
                <ActionBar
                  currentStep={1}
                  onBack={handleBackToEdit}
                  onContinue={handleSubmitForVerification}
                  isLoading={isPending}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Form>
      </main>

      <Footer />
      <LoginPopup show={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default RegisterProviderPage;
