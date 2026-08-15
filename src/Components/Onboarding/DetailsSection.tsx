import React from "react";
import { Form, Input, Select, InputNumber } from "antd";

const { Option } = Select;

interface DetailsSectionProps {
  detectingLocation?: boolean;
  onDetectLocation?: () => void;
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({
  detectingLocation,
  onDetectLocation,
}) => {
  return (
    <div className="bg-white dark:bg-[#161926] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] transition-all">
      {/* Card Header */}
      <div className="flex items-start gap-4 pb-6 mb-8 border-b border-slate-100 dark:border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/40">
          01
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Your Details
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Tell us about yourself
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Form Fields */}
      <div className="space-y-6">
        {/* Row 1: Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              First Name <span className="text-rose-500">*</span>
            </label>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Please enter your first name" }]}
              className="mb-0"
            >
              <Input
                placeholder="Anubhuti"
                className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm font-medium text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition"
              />
            </Form.Item>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Please enter your last name" }]}
              className="mb-0"
            >
              <Input
                placeholder="Singh"
                className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm font-medium text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition"
              />
            </Form.Item>
          </div>
        </div>

        {/* Row 2: WhatsApp Number & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              WhatsApp Mobile Number <span className="text-rose-500">*</span>
            </label>
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Please enter your mobile number" },
                {
                  pattern: /^[6-9]\d{9}$/,
                  message: "Please enter a valid 10-digit Indian number",
                },
              ]}
              className="mb-0"
            >
              <div className="flex items-center">
                <span className="h-12 px-3.5 bg-slate-50 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center select-none">
                  +91
                </span>
                <Input
                  placeholder="9876543210"
                  maxLength={10}
                  className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-r-xl rounded-l-none px-4 text-sm font-medium text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition"
                />
              </div>
            </Form.Item>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Gender <span className="text-rose-500">*</span>
            </label>
            <Form.Item
              name="gender"
              rules={[{ required: true, message: "Please select gender" }]}
              className="mb-0"
            >
              <Select
                placeholder="Select Gender"
                className="w-full h-12 custom-onboarding-select"
                popupClassName="rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg"
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* Row 3: Experience & Visiting Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Experience <span className="text-rose-500">*</span>
            </label>
            <Form.Item
              name="experience"
              rules={[{ required: true, message: "Please select experience level" }]}
              className="mb-0"
            >
              <Select
                placeholder="Select Experience"
                className="w-full h-12 custom-onboarding-select"
                popupClassName="rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg"
              >
                <Option value="1">1 Year (Beginner)</Option>
                <Option value="3">2 - 4 Years (Experienced)</Option>
                <Option value="5">5+ Years (Master Expert)</Option>
              </Select>
            </Form.Item>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Visiting Fee (₹) <span className="text-rose-500">*</span>
            </label>
            <Form.Item
              name="fee"
              rules={[{ required: true, message: "Please enter your base visiting fee" }]}
              className="mb-0"
            >
              <InputNumber
                prefix={<span className="text-slate-400 font-bold mr-1">₹</span>}
                min={50}
                max={10000}
                placeholder="299"
                className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white flex items-center"
              />
            </Form.Item>
          </div>
        </div>

        {/* Row 4: Service Locality / Address */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Service Locality / City <span className="text-rose-500">*</span>
            </label>
            {onDetectLocation && (
              <button
                type="button"
                onClick={onDetectLocation}
                disabled={detectingLocation}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {detectingLocation ? "Detecting location..." : "Auto-detect via GPS"}
              </button>
            )}
          </div>
          <Form.Item
            name="address"
            rules={[{ required: true, message: "Please enter your service locality or city" }]}
            className="mb-0"
          >
            <Input
              placeholder="e.g. Andheri West, Mumbai / Sector 62, Noida"
              className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm font-medium text-slate-900 dark:text-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950/50 transition"
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
