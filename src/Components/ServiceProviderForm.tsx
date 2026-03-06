import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Modal,
  Button,
  Input,
  Select,
  Upload,
  Form,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { Checkbox } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const steps = [
  { title: "Personal Profile" },
  { title: "Skills & Expertise" },
  { title: "Logistics & Pricing" },
  { title: "Verification & Trust" },
];

const ServiceProviderForm = ({
  onOpen,
  onClose,
}: {
  onOpen: boolean;
  onClose: () => void;
}) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      // 5. & 6. Send request using axios to specific URL, NOT manually setting Content-Type so Axios handles boundaries automatically
      const response = await axios.post("http://localhost:5000/api/provider/create-provider", formData);
      return response.data;
    },
    onSuccess: (data) => {
      // 8. On success: show success message, reset form, close modal
      message.success("Application submitted successfully!");
      form.resetFields();
      setStep(0);
      onClose();
    },
    onError: (error) => {
      // 9. On error: show error message, log backend error
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

  const handleSubmit = () => {
    form.submit();
  };

  const onFinish = () => {
    // 1. Collect all form values using Ant Design Form
    const allValues = form.getFieldsValue(true);

    // 2. Convert the form data to FormData before sending to backend
    const formData = new FormData();

    Object.keys(allValues).forEach((key) => {
      const value = allValues[key];
      if (value === undefined || value === null) return;

      // 3. Handle file uploads from AntD Upload component
      if (key === "profilePhoto" || key === "documents") {
        if (Array.isArray(value) && value.length > 0 && value[0].originFileObj) {
          formData.append(key, value[0].originFileObj);
        }
      }
      // 4. Append arrays properly in FormData
      else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      }
      else if (key === "radius" || key === "fee") {
        formData.append(key, String(Number(value)));
      }
      else {
        formData.append(key, String(value));
      }
    });

    // 7. Use React Query useMutation to submit the form
    mutate(formData);
  };

  return (
    <Modal
      open={onOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={1100}
      destroyOnClose
    >
      <div className="rounded-3xl overflow-hidden shadow-2xl">

        <div className="flex h-[700px]">

          {/* LEFT PANEL */}
          <div className="hidden md:flex w-[35%] relative overflow-hidden bg-gradient-to-br from-blue-800 via-cyan-600 to-indigo-700 text-white p-10 flex-col justify-between">

            {/* background glow shapes */}
            <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl -top-20 -left-20" />
            <div className="absolute w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl bottom-0 right-0" />

            {/* header */}
            <div className="relative z-10">

              <h2 className="text-4xl font-bold mb-3 tracking-tight">
                Servease
              </h2>

              <p className="text-blue-100 text-sm leading-relaxed max-w-[260px]">
                Join our trusted network of professionals and start receiving
                service requests from customers near you.
              </p>

            </div>


            {/* benefits */}
            <div className="relative z-10 space-y-4">

              {/* CARD 1 */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">

                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md">
                  ✔
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Verified Professionals
                  </p>
                  <p className="text-xs text-blue-100">
                    Build trust with verified identity
                  </p>
                </div>

              </div>


              {/* CARD 2 */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">

                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-md">
                  📍
                </div>

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


            {/* stats */}
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
          <div className="w-full md:flex-1 bg-white p-10 flex flex-col">

            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                Service Provider Registration
              </h2>

              <p className="text-gray-500 text-sm">
                Complete the steps to create your provider account
              </p>
            </div>

            {/* PROGRESS BAR */}
            <div className="mb-6">

              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Profile</span>
                <span>Skills</span>
                <span>Pricing</span>
                <span>Verification</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${(step + 1) * 25}%` }}
                />
              </div>

            </div>

            {/* FORM AREA */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">

              <Form layout="vertical" form={form} onFinish={onFinish}>

                {/* STEP 1 */}
                {/* STEP 1 */}
                {step === 0 && (
                  <div className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">

                      <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                          { required: true, message: "Please enter your first name" },
                          { min: 2, message: "First name must be at least 2 characters" }
                        ]}
                      >
                        <Input size="large" placeholder="First Name" />
                      </Form.Item>

                      <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                          { required: true, message: "Please enter your last name" },
                          { min: 2, message: "Last name must be at least 2 characters" }
                        ]}
                      >
                        <Input size="large" placeholder="Last Name" />
                      </Form.Item>

                    </div>

                    <Form.Item
                      label="Upload Profile Picture"
                      name="profilePhoto"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => e?.fileList}
                      rules={[
                        { required: true, message: "Please upload your profile picture" }
                      ]}
                    >
                      <Upload beforeUpload={() => false} maxCount={1}>
                        <Button icon={<UploadOutlined />} size="large">
                          Upload Profile Picture
                        </Button>
                      </Upload>
                    </Form.Item>

                    <Form.Item
                      label="Mobile Number"
                      name="phone"
                      rules={[
                        { required: true, message: "Please enter your mobile number" },
                        {
                          pattern: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10 digit mobile number"
                        }
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Enter mobile number"
                        maxLength={10}
                        inputMode="numeric"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Gender"
                      name="gender"
                      rules={[
                        { required: true, message: "Please select gender" }
                      ]}
                    >
                      <Select size="large">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>

                  </div>
                )}

                {/* STEP 2 */}
                {step === 1 && (
                  <div className="space-y-4">

                    <Form.Item
                      label="Primary Category"
                      name="category"
                      rules={[
                        { required: true, message: "Please select a primary category" }
                      ]}
                    >
                      <Select size="large" placeholder="Select category">
                        <Option value="electrician">Electrician</Option>
                        <Option value="plumber">Plumber</Option>
                        <Option value="cleaner">Cleaner</Option>
                        <Option value="salon">Salon</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Sub Category"
                      name="subCategory"
                      rules={[
                        { required: true, message: "Please select at least one sub category" }
                      ]}
                    >
                      <Select size="large" mode="multiple" placeholder="Select services">
                        <Option value="fan">Fan Repair</Option>
                        <Option value="ac">AC Service</Option>
                        <Option value="wiring">Full Wiring</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Years of Experience"
                      name="experience"
                      rules={[
                        { required: true, message: "Please select your experience" }
                      ]}
                    >
                      <Select size="large" placeholder="Select experience">
                        <Option value="1">1 Year</Option>
                        <Option value="3">3 Years</Option>
                        <Option value="5">5+ Years</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Work Description (Bio)"
                      name="bio"
                      rules={[
                        { required: true, message: "Please write about your work" },
                        { min: 20, message: "Description must be at least 20 characters" }
                      ]}
                    >
                      <TextArea rows={4} placeholder="Describe your services and experience" />
                    </Form.Item>

                  </div>
                )}

                {/* STEP 3 */}
                {step === 2 && (
                  <div className="space-y-4">

                    <Form.Item
                      label="Service Location"
                      name="location"
                      rules={[
                        { required: true, message: "Please enter your service location" },
                        { min: 3, message: "Location must be at least 3 characters" }
                      ]}
                    >
                      <Input size="large" placeholder="Enter area / pincode" maxLength={6} />
                    </Form.Item>

                    <Form.Item
                      label="Work Radius"
                      name="radius"
                      rules={[
                        { required: true, message: "Please select your work radius" }
                      ]}
                    >
                      <Select size="large" placeholder="Select radius">
                        <Option value="5">5 km</Option>
                        <Option value="10">10 km</Option>
                        <Option value="20">20+ km</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Typical Visiting Fee (₹)"
                      name="fee"
                      rules={[
                        { required: true, message: "Please enter visiting fee" },
                        {
                          pattern: /^[0-9]+$/,
                          message: "Fee must be a valid number"
                        }
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Enter visiting fee"
                        maxLength={5}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Languages Known"
                      name="languages"
                      rules={[
                        { required: true, message: "Please select at least one language" }
                      ]}
                    >
                      <Select
                        size="large"
                        mode="multiple"
                        placeholder="Select languages"
                      >
                        <Option value="hindi">Hindi</Option>
                        <Option value="english">English</Option>
                      </Select>
                    </Form.Item>

                  </div>
                )}

                {/* STEP 4 */}
                {step === 3 && (
                  <div className="space-y-4">

                    <Form.Item
                      label="Identity Proof Type"
                      name="idType"
                      rules={[
                        { required: true, message: "Please select identity proof type" }
                      ]}
                    >
                      <Select size="large" placeholder="Select ID type">
                        <Option value="aadhaar">Aadhaar</Option>
                        <Option value="pan">PAN</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Upload Identity Document"
                      name="documents"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => e?.fileList}
                      rules={[
                        { required: true, message: "Please upload identity document" }
                      ]}
                    >
                      <Upload beforeUpload={() => false} maxCount={1}>
                        <Button icon={<UploadOutlined />} size="large">
                          Upload Document
                        </Button>
                      </Upload>
                    </Form.Item>

                    <Form.Item
                      label="Current Residential Address"
                      name="address"
                      rules={[
                        { required: true, message: "Please enter your address" },
                        { min: 10, message: "Address should be at least 10 characters" }
                      ]}
                    >
                      <Input size="large" placeholder="Enter your address" />
                    </Form.Item>

                    <Form.Item
                      label="Emergency Contact"
                      name="emergency"
                      rules={[
                        { required: true, message: "Please enter emergency contact number" },
                        {
                          pattern: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10 digit mobile number"
                        }
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Enter emergency contact"
                        maxLength={10}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>

                    {/* TERMS & CONDITIONS */}

                    <Form.Item
                      name="terms"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value
                              ? Promise.resolve()
                              : Promise.reject(
                                new Error("You must accept the Terms & Conditions")
                              ),
                        },
                      ]}
                    >
                      <Checkbox>
                        I agree to the{" "}
                        <a
                          href="/terms"
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          Terms & Conditions
                        </a>{" "}
                        and confirm that the information provided is correct.
                      </Checkbox>
                    </Form.Item>

                  </div>
                )}

                {/* BUTTONS */}
                <div className="flex justify-between mt-10">

                  {step > 0 && (
                    <Button size="large" onClick={prev}>
                      Previous
                    </Button>
                  )}

                  {step < steps.length - 1 && (
                    <Button
                      type="primary"
                      size="large"
                      onClick={next}
                    >
                      Next
                    </Button>
                  )}

                  {step === steps.length - 1 && (
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleSubmit}
                      loading={isPending}
                    >
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
  );
};

export default ServiceProviderForm;