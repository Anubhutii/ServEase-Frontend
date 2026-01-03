import { useState } from "react";
import { message, Modal, Form, Input, Button, Divider, Typography } from "antd";
import { FcGoogle } from "react-icons/fc";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import loginImg from "../assets/loginimg.png";
import { useApi } from "../Context/useApi";
import { useAuth } from "../Context/AuthContext";


const { Title, Text } = Typography;

const LoginPopup = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const { login, register, loading, error } = useApi();
  const { login: authLogin } = useAuth();


  /* 🔐 LOGIN SUBMIT */
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const res = await login(values);
      console.log("Login success:", res);
      authLogin();
      message.success("Login successful!");
      loginForm.resetFields();
      onClose();
    } catch (err) {
      console.log("Login failed");
    }
  };

  /* 🧑‍💼 REGISTER SUBMIT */
  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await register(values);
      console.log("Register success:", res);
      message.success("Registration successful!");
      registerForm.resetFields();
      setIsLogin(true);
    } catch (err) {
      console.log("Register failed");
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    if (isLogin) {
      loginForm.resetFields();
    } else {
      registerForm.resetFields();
    }
  };

  return (
    <Modal
      open={show}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      closeIcon={null}
      className="custom-login-modal"
      styles={{
        body: { padding: 0, margin: 0 }
      }}
    >
      <div className="flex w-full relative min-h-[500px]">
        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.img
            src={loginImg}
            alt="Login Illustration"
            className="w-full h-full object-cover relative z-10"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 z-20"></div>
          <div className="absolute bottom-8 left-8 right-8 z-30 text-white">
            <Title level={2} className="!text-white !mb-2">
              Welcome to ServEase
            </Title>
            <Text className="text-white/90">
              Your trusted partner for home services
            </Text>
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* <Button
            type="text"
            icon={<span className="text-xl">✕</span>}
            onClick={onClose}
            className="absolute right-0 top-0"
          /> */}

          <div className="mb-6">
            <Title level={2} className="!mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </Title>
            <Text type="secondary">
              {isLogin
                ? "Sign in to continue to ServEase"
                : "Join us and start your journey"}
            </Text>
          </div>

          {/* GOOGLE BUTTON */}
          <Button
            size="large"
            block
            icon={<FcGoogle className="text-xl" />}
            className="mb-4 !h-12 !rounded-lg !flex !items-center !justify-center"
          >
            Continue with Google
          </Button>

          <Divider>OR</Divider>

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Text type="danger">{error}</Text>
            </div>
          )}

          <div className="relative ">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Form
                    form={loginForm}
                    onFinish={handleLogin}
                    layout="vertical"
                    size="large"
                    requiredMark={false}
                  >
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Please enter a valid email!" },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="Email"
                        className="!rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Password"
                        className="!rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        className="!h-12 !rounded-lg !border-none"
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </Form>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Form
                    form={registerForm}
                    onFinish={handleRegister}
                    layout="vertical"
                    size="large"
                    requiredMark={false}
                  >
                    <Form.Item
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your full name!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Full Name"
                        className="!rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Please enter a valid email!" },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="Email"
                        className="!rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                        {
                          min: 6,
                          message: "Password must be at least 6 characters!",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Password"
                        className="!rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        className="!h-12 !rounded-lg !border-none"
                      >
                        Create Account
                      </Button>
                    </Form.Item>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TOGGLE */}
          <div className="text-center mt-6">
            <Text type="secondary">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button
                type="link"
                onClick={switchMode}
                className="!p-0 !h-auto"
                style={{ padding: 0 }}
              >
                {isLogin ? "Sign up" : "Login"}
              </Button>
            </Text>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginPopup;
