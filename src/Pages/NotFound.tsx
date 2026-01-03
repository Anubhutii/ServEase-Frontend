import { Button, Result, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Result
          status="404"
          title={
            <Title level={2} className="!mb-2">
              404
            </Title>
          }
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/")}
              className="!rounded-lg"
            >
              Back Home
            </Button>
          }
        />
      </motion.div>
    </div>
  );
};

export default NotFound;

