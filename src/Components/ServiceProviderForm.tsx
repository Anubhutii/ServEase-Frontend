import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import {
  Modal,
  Button,
  Input,
  Select,
  Upload,
  Form,
  message,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const steps = [
  { title: "Personal Profile" },
  { title: "Skills & Expertise" },
  { title: "Logistics" },
  { title: "Verification" },
];

const serviceCategories: Record<string, string[]> = {
  plumber: ["Tap Repair", "Leak Fixing", "Pipe Installation", "Bathroom Plumbing", "Drain Cleaning", "Water Tank Installation", "Motor Pump Repair"],
  carpenter: ["Furniture Repair", "Door Installation", "Window Repair", "Bed Assembly", "Wardrobe Repair", "Kitchen Cabinet Installation", "Table Repair", "Chair Repair"],
  electrician: ["Fan Installation", "Light Installation", "Switch Board Repair", "Wiring Repair", "AC Power Connection", "Doorbell Installation", "Inverter Wiring", "MCB Repair", "Power Socket Installation"],
  salon_women: ["Haircut", "Hair Coloring", "Hair Spa", "Hair Straightening", "Hair Smoothening", "Hair Styling", "Facial", "Threading", "Waxing", "Manicure", "Pedicure", "Bridal Makeup", "Party Makeup"],
  salon_men: ["Haircut", "Beard Trim", "Hair Styling", "Hair Coloring", "Head Massage", "Beard Styling", "Shaving"],
  cook: ["Home Cook", "Party Cook", "North Indian Cooking", "South Indian Cooking", "Chinese Cooking", "Tiffin Preparation", "Diet Food Cooking", "Vegetarian Cooking"],
  maid: ["Full Time Maid", "Part Time Maid", "House Cleaning Maid", "Utensil Washing", "Clothes Washing", "Baby Care", "Elder Care", "Cooking Maid", "Housekeeping"],
  tutor: ["Math Tutor", "Science Tutor", "English Tutor", "Computer Tutor", "Home Tutor", "Online Tutor", "Exam Preparation", "Coding Tutor", "Language Tutor", "Music Tutor"],
};

const ServiceProviderForm = ({
  onOpen,
  onClose,
}: {
  onOpen: boolean;
  onClose: () => void;
}) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const { login } = useAuth();

  const selectedCategory = Form.useWatch("category", form);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/provider/create-provider", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: (data) => {
      message.success("Application submitted successfully!");
      if (data.user) login(data.user);
      form.resetFields();
      setStep(0);
      onClose();
    },
    onError: (error) => {
      console.error("Backend Error:", error);
      message.error("Failed to submit application. Please try again.");
    },
  });

  const next = async () => {
    try {
      await form.validateFields();
      setStep((prev) => prev + 1);
      document.querySelector(".custom-scrollbar")?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch { }
  };

  const prev = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const allValues = form.getFieldsValue(true);
      const formData = new FormData();

      Object.keys(allValues).forEach((key) => {
        const value = allValues[key];
        if (value === undefined || value === null) return;

        if (key === "profilePhoto" || key === "idProofFront" || key === "idProofBack") {
          if (Array.isArray(value) && value.length > 0 && value[0].originFileObj) {
            formData.append(key, value[0].originFileObj);
          }
        } else if (Array.isArray(value)) {
          // services, languages logic 
          value.forEach((item) => formData.append(key, item));
        } else if (key === "terms") {
          formData.append(key, String(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // Capture automatic location correctly (Default fallback: Mumbai)
      let lat = 19.0760;
      let lng = 72.8777;

      const storedLocString = localStorage.getItem("userLocation");
      if (storedLocString) {
        try {
          const loc = JSON.parse(storedLocString);
          if (loc.lat && loc.lon) {
            lat = Number(loc.lat);
            lng = Number(loc.lon);
          }
        } catch (e) {
          console.error("Error parsing location", e);
        }
      }

      // GeoJSON standard format
      const locationJSON = {
        type: "Point",
        coordinates: [lng, lat]
      };

      formData.append("location", JSON.stringify(locationJSON));

      mutate(formData);
    } catch { }
  };

  return (
    <>
      <style>{`
        .custom-close-modal .ant-modal-close {
          background-color: #ffffff !important;
          color: #64748b !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1) !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .dark .custom-close-modal .ant-modal-close {
          background-color: #1e293b !important;
          color: #94a3b8 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5) !important;
          border: 1px solid #334155 !important;
        }
        .custom-close-modal .ant-modal-close:hover {
          background-color: #3b82f6 !important;
          color: #ffffff !important;
        }
      `}</style>
      <Modal
        className="custom-close-modal"
        open={onOpen}
        onCancel={onClose}
        footer={null}
        centered
        width={1100}
        destroyOnClose
      >
        <div className="rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500">
          <div className="flex h-[750px] md:h-[700px]">
            {/* LEFT PANEL */}
            <div className="hidden md:flex w-[35%] relative overflow-hidden bg-gradient-to-br from-blue-800 via-cyan-600 to-indigo-700 text-white p-10 flex-col justify-between">
              <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl -top-20 -left-20" />
              <div className="absolute w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl bottom-0 right-0" />

              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-3 tracking-tight">Servease</h2>
                <p className="text-blue-100 text-sm leading-relaxed max-w-[260px]">
                  Join our trusted network of professionals and start receiving service requests from customers near you.
                </p>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md">✔</div>
                  <div>
                    <p className="text-sm font-semibold">Verified Professionals</p>
                    <p className="text-xs text-blue-100">Build trust with verified identity</p>
                  </div>

                </div>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-md">📍</div>
                  <div>
                    <p className="text-sm font-semibold">
                      Local Customers
                    </p>
                    <p className="text-xs text-blue-100">
                      Receive jobs from nearby areas
                    </p>
                  </div>

                </div>


                {/* CARD 3 */}
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">

                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-md">
                    💳
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Secure Payments
                    </p>
                    <p className="text-xs text-blue-100">
                      Fast and safe transactions
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-wrap gap-3 mt-6">

                <span className="px-3 py-1 text-xs rounded-full bg-white/15 backdrop-blur border border-white/20">
                  Aadhaar Verified
                </span>

                <span className="px-3 py-1 text-xs rounded-full bg-white/15 backdrop-blur border border-white/20">
                  Fast Approval
                </span>

                <span className="px-3 py-1 text-xs rounded-full bg-white/15 backdrop-blur border border-white/20">
                  Local Jobs
                </span>

                <span className="px-3 py-1 text-xs rounded-full bg-white/15 backdrop-blur border border-white/20">
                  Flexible Working
                </span>

                <span className="px-3 py-1 text-xs rounded-full bg-white/15 backdrop-blur border border-white/20">
                  Trusted Platform
                </span>



              </div>
            </div>

            {/* RIGHT FORM AREA */}
            <div className="w-full md:flex-1 bg-white dark:bg-slate-900 p-10 flex flex-col transition-colors duration-500">

              {/* HEADER */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Service Provider Registration</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Complete the steps to create your provider account</p>
              </div>

              {/* PROGRESS BAR */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>Profile</span>
                  <span>Skills</span>
                  <span>Logistics</span>
                  <span>Verification</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${(step + 1) * 25}%` }}
                  />
                </div>
              </div>

              {/* FORM AREA */}
              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar dark:custom-scrollbar-dark">
                <Form layout="vertical" form={form} className="dark:text-white">

                  {/* STEP 1: Personal Profile */}
                  {step === 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Form.Item label={<span className="dark:text-gray-300">First Name</span>} name="firstName" rules={[{ required: true, message: "Please enter your first name" }]}>
                          <Input size="large" placeholder="First Name" />
                        </Form.Item>
                        <Form.Item label={<span className="dark:text-gray-300">Last Name</span>} name="lastName" rules={[{ required: true, message: "Please enter your last name" }]}>
                          <Input size="large" placeholder="Last Name" />
                        </Form.Item>
                      </div>

                      <Form.Item label={<span className="dark:text-gray-300">Upload Profile Picture</span>} name="profilePhoto" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList} rules={[{ required: true, message: "Please upload your profile picture" }]}>
                        <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                          <Button icon={<UploadOutlined />} size="large" className="dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700">Select Profile Photo</Button>
                        </Upload>
                      </Form.Item>

                      <div className="grid grid-cols-2 gap-4">
                        <Form.Item label={<span className="dark:text-gray-300">Mobile Number</span>} name="phone" rules={[{ required: true, message: "Enter mobile number" }, { pattern: /^[6-9]\d{9}$/, message: "Valid 10 digit number" }]}>
                          <Input size="large" placeholder="Enter mobile number" maxLength={10} inputMode="numeric" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                        </Form.Item>

                        <Form.Item label={<span className="dark:text-gray-300">Secondary Phone</span>} name="secondaryPhone" rules={[{ pattern: /^[6-9]\d{9}$/, message: "Valid 10 digit number" }]}>
                          <Input size="large" placeholder="Optional alternative" maxLength={10} inputMode="numeric" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                        </Form.Item>
                      </div>

                      <Form.Item label={<span className="dark:text-gray-300">Gender</span>} name="gender" rules={[{ required: true, message: "Please select gender" }]}>
                        <Select size="large" placeholder="Select Gender">
                          <Option value="male">Male</Option>
                          <Option value="female">Female</Option>
                          <Option value="other">Other</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  )}

                  {/* STEP 2: Skills & Expertise */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <Form.Item label={<span className="dark:text-gray-300">Primary Category</span>} name="category" rules={[{ required: true, message: "Please select a category" }]}>
                        <Select
                          size="large"
                          placeholder="Select category"
                          onChange={() => form.setFieldsValue({ services: [] })}
                        >
                          <Option value="electrician">Electrician</Option>
                          <Option value="plumber">Plumber</Option>
                          <Option value="carpenter">Carpenter</Option>
                          <Option value="maid">Maid / Cleaner</Option>
                          <Option value="salon_women">Salon (Women)</Option>
                          <Option value="salon_men">Men's Salon</Option>
                          <Option value="cook">Cook</Option>
                          <Option value="tutor">Tutor</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item label={<span className="dark:text-gray-300">Services Offered</span>} name="services" rules={[{ required: true, message: "Please select at least one service" }]}>
                        <Select
                          size="large"
                          mode="multiple"
                          placeholder="Select services"
                          disabled={!selectedCategory}
                        >
                          {selectedCategory && serviceCategories[selectedCategory]?.map((service) => (
                            <Option key={service} value={service.toLowerCase().replace(/ /g, "_")}>
                              {service}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item label={<span className="dark:text-gray-300">Years of Experience</span>} name="experience" rules={[{ required: true, message: "Please select your experience" }]}>
                        <Select size="large" placeholder="Select experience">
                          <Option value="1">1 Year</Option>
                          <Option value="3">3 Years</Option>
                          <Option value="5">5+ Years</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item label={<span className="dark:text-gray-300">Work Description (Bio)</span>} name="bio" rules={[{ required: true, message: "Please write about your work" }, { min: 20, message: "Bio must be at least 20 characters" }]}>
                        <TextArea rows={4} placeholder="Describe your services and experience" />
                      </Form.Item>
                    </div>
                  )}

                  {/* STEP 3: Logistics */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <Form.Item label={<span className="dark:text-gray-300">Typical Visiting/Base Fee (₹)</span>} name="fee" rules={[{ required: true, message: "Please enter your starting fee" }]}>
                        <Input size="large" placeholder="Enter amount" maxLength={5} inputMode="numeric" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
                      </Form.Item>

                      <Form.Item label={<span className="dark:text-gray-300">Languages Known</span>} name="languages" rules={[{ required: true, message: "Please select at least one language" }]}>
                        <Select size="large" mode="multiple" placeholder="Select languages you speak">
                          <Option value="english">English</Option>
                          <Option value="hindi">Hindi</Option>
                          <Option value="marathi">Marathi</Option>
                          <Option value="gujarati">Gujarati</Option>
                        </Select>
                      </Form.Item>

                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3 transition-colors">
                        <div className="mt-1">📍</div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-gray-200">Automatic Location Tracking</p>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Your exact coordinates will be securely attached to your profile to match you with nearby customers automatically.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Verification */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <Form.Item label={<span className="dark:text-gray-300">Identity Proof Type</span>} name="idType" rules={[{ required: true, message: "Please select an ID type" }]}>
                        <Select size="large" placeholder="Select document type">
                          <Option value="aadhaar">Aadhaar Card</Option>
                          <Option value="pan">PAN Card</Option>
                          <Option value="driving_license">Driving License</Option>
                        </Select>
                      </Form.Item>

                      <div className="grid grid-cols-2 gap-4">
                        <Form.Item label={<span className="dark:text-gray-300">Upload ID (Front)</span>} name="idProofFront" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList} rules={[{ required: true, message: "Upload front side" }]}>
                          <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                            <Button icon={<UploadOutlined />} size="large" className="dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700">Front Side</Button>
                          </Upload>
                        </Form.Item>

                        <Form.Item label={<span className="dark:text-gray-300">Upload ID (Back)</span>} name="idProofBack" valuePropName="fileList" getValueFromEvent={(e) => e?.fileList} rules={[{ required: true, message: "Upload back side" }]}>
                          <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                            <Button icon={<UploadOutlined />} size="large" className="dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700">Back Side</Button>
                          </Upload>
                        </Form.Item>
                      </div>

                      <Form.Item label={<span className="dark:text-gray-300">Current Residential Address</span>} name="address" rules={[{ required: true, message: "Please provide full address" }, { min: 10, message: "Address should be detailed" }]}>
                        <TextArea rows={3} placeholder="Enter complete address block" />
                      </Form.Item>

                      <Form.Item label={<span className="dark:text-gray-300">Emergency Contact Name / Phone</span>} name="emergency" rules={[{ required: true, message: "Please provide emergency contact details" }]}>
                        <Input size="large" placeholder="E.g. Ramesh - 9876543210" />
                      </Form.Item>

                      <Form.Item name="terms" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error("Accept terms")) }]}>
                        <Checkbox className="dark:text-gray-300">I agree to the Terms & Conditions and understand my background will be verified.</Checkbox>
                      </Form.Item>
                    </div>
                  )}

                  {/* BUTTONS */}
                  <div className="flex justify-between mt-10">
                    {step > 0 && (
                      <Button size="large" onClick={prev} className="dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700">Previous</Button>
                    )}

                    {step < steps.length - 1 && (
                      <Button type="primary" size="large" onClick={next}>Next</Button>
                    )}

                    {step === steps.length - 1 && (
                      <Button type="primary" size="large" onClick={handleSubmit} loading={isPending}>
                        Submit Application
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ServiceProviderForm;