import { useState } from "react";
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

const { Option } = Select;
const { TextArea } = Input;

const steps = [
  { title: "Basic Info" },
  { title: "Work Details" },
  { title: "Profile" },
  { title: "Verification" },
];

// at top of file
const SERVICE_MAP: Record<string, string[]> = {
  electrician: [
    "Switch & Socket Repair",
    "Fan Installation",
    "Wiring",
  ],
  plumber: [
    "Tap Leakage Repair",
    "Wash Basin Installation",
    "Pipe Fitting",
  ],
  cleaner: [
    "Bathroom Cleaning",
    "Kitchen Cleaning",
    "Full Home Cleaning",
  ],
  salon: [
    "Waxing",
    "Facial & Cleanup",
    "Manicure & Pedicure",
    "Threading & Eyebrows",
    "Nail Art"
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
  const [step, setStep] = useState(0);

  // ✅ Step-wise validation mapping
  const stepFields: Record<number, string[]> = {
    0: ["fullName", "phone"],
    1: ["location", "services"],
    2: [], // optional step
    3: ["documents"],
  };

  const next = async () => {
    try {
      await form.validateFields(stepFields[step]);
      setStep(step + 1);
    } catch {}
  };

  const prev = () => setStep(step - 1);

  const onFinish = (values: any) => {
    console.log("Final Form Values:", values);
    message.success("Application submitted successfully!");
    onClose();
    setStep(0);
    form.resetFields();
  };

  return (
    
    <Modal
      open={onOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={720}
      destroyOnClose
      className="provider-modal"
    >
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Become a Service Provider
        </h2>

        <p className="text-md text-green-600 pt-5">
  Step {step + 1} of {steps.length} · {steps[step].title}
</p>

{/* <div className="mt-3">
  <Progress
    percent={(step / steps.length) * 100}
    showInfo={false}
    strokeColor="#2563eb"
    trailColor="#e5e7eb"
  />
</div> */}

      </div>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* FORM CARD */}
        <div
          className="
            rounded-2xl
            p-6
            bg-white/70
            backdrop-blur-xl
            border border-white/50
            shadow-xl
          "
        >
          {/* STEP 1 */}
          {step === 0 && (
            <>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[
                  { required: true, message: "Please enter your full name" },
                  { min: 3, message: "Name must be at least 3 characters" },
                  {
                    pattern: /^[a-zA-Z\s]+$/,
                    message: "Name can only contain letters",
                  },
                ]}
              >
                <Input placeholder="Full Name" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  {
                    pattern: /^[6-9]\d{9}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                ]}
              >
                <Input
                  placeholder="Phone Number"
                  maxLength={10}
                  inputMode="numeric"
                />
              </Form.Item>
            </>
          )}

          {/* STEP 2 */}
          {/* STEP 2 */}
{step === 1 && (
  <>
    {/* CATEGORY */}
    <Form.Item
      label="Select Your Category"
      name="category"
      rules={[{ required: true, message: "Select a category" }]}
    >
      <Select
        placeholder="Select category"
        onChange={() => {
          form.setFieldsValue({ subServices: [] });
        }}
      >
        <Option value="electrician">Electrician</Option>
        <Option value="plumber">Plumber</Option>
        <Option value="cleaner">Cleaning</Option>
        <Option value="salon">Salon / Beauty</Option>
      </Select>
    </Form.Item>

    {/* SUB SERVICES */}
    <Form.Item
      shouldUpdate={(prev, cur) => prev.category !== cur.category}
      noStyle
    >
      {({ getFieldValue }) => {
        const category = getFieldValue("category");
        if (!category) return null;

        return (
          <Form.Item
            label="Select Services You Provide"
            name="subServices"
            rules={[
              {
                required: true,
                message: "Select at least one service",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select services"
            >
              {SERVICE_MAP[category].map((service) => (
                <Option key={service} value={service}>
                  {service}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      }}
    </Form.Item>
  </>
)}


          {/* STEP 3 */}
          {step === 2 && (
            <>
              <Form.Item
                label="Briefly describe your experience"
                name="experience"
              >
                <TextArea
                  rows={4}
                  placeholder="Optional: tell us about your experience"
                />
              </Form.Item>

              <Form.Item name="profilePhoto" label="Profile Photo (optional)">
                <Upload
                  maxCount={1}
                  listType="picture"
                  beforeUpload={(file) => {
                    const isImage =
                      file.type === "image/jpeg" ||
                      file.type === "image/png";

                    if (!isImage) {
                      message.error("Only JPG or PNG images are allowed");
                      return Upload.LIST_IGNORE;
                    }

                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error("Image must be smaller than 2MB");
                      return Upload.LIST_IGNORE;
                    }

                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload Photo</Button>
                </Upload>
              </Form.Item>
            </>
          )}

          {/* STEP 4 */}
          {step === 3 && (
  <>
    <Form.Item
      label="Upload Documents"
      name="documents"
      valuePropName="fileList"
      getValueFromEvent={(e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      }}
      rules={[
        {
          validator: (_, value) => {
            if (!value || value.length === 0) {
              return Promise.reject(
                new Error("Please upload at least one document")
              );
            }
            return Promise.resolve();
          },
        },
      ]}
    >
      <Upload.Dragger
        multiple
        beforeUpload={(file) => {
          const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
          ];

          if (!allowedTypes.includes(file.type)) {
            message.error("Only PDF, JPG, PNG files allowed");
            return Upload.LIST_IGNORE;
          }

          const isLt5M = file.size / 1024 / 1024 < 5;
          if (!isLt5M) {
            message.error("File must be smaller than 5MB");
            return Upload.LIST_IGNORE;
          }

          return false; // IMPORTANT: prevent auto upload
        }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="text-sm font-medium">
          Drag & drop or <span className="text-blue-600">browse</span>
        </p>
        <p className="text-xs text-slate-500">
          PDF, PNG, JPG (Max 5 files)
        </p>
      </Upload.Dragger>
    </Form.Item>

    <p className="text-xs text-slate-500 mt-2">
      🔒 Your documents are safe and used only for verification.
    </p>
  </>
)}

        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex justify-between">
          {step > 0 && (
            <Button onClick={prev} className="rounded-full px-6">
              Back
            </Button>
          )}

          {step < steps.length - 1 ? (
            <Button
              type="primary"
              onClick={next}
              className="rounded-full px-8 shadow-md hover:shadow-lg"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              className="rounded-full px-8 shadow-md hover:shadow-lg"
            >
              Submit Application
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default ServiceProviderForm;
