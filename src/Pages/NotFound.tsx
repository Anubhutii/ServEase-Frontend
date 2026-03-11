import { Button, Result, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 dark:from-slate-900 to-blue-50 dark:to-slate-950 flex items-center justify-center px-4 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="dark:text-white">
          <Result
            status="404"
            title={
              <Title level={2} className="mb-2! dark:text-white">
                404
              </Title>
            }
            subTitle={<span className="dark:text-gray-400">Sorry, the page you visited does not exist.</span>}
            extra={
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/")}
                className="rounded-lg!"
              >
                Back Home
              </Button>
            }
          />
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

