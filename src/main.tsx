import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme as antTheme, App as AntdApp } from 'antd'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ApiProvider } from './Context/ApiContext.tsx'
import { AuthProvider } from './Context/AuthContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { CartProvider } from "./Context/CartContext.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from './Context/ThemeContext.tsx';
import { RoleProvider } from './Context/RoleContext.tsx';
import { PostJobProvider } from './Components/PostJobModal.tsx';

const AppConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme: appTheme } = useTheme();
  return (
    <ConfigProvider
      theme={{
        ...theme,
        algorithm: appTheme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm
      }}
    >
      <AntdApp>
        {children}
      </AntdApp>
    </ConfigProvider>
  );
};

const queryClient = new QueryClient();

console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
    },
  },
}

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "366269720110-bndt22fmmq7gs1d944ccf15a1s7vg0mu.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider>
          <AppConfigProvider>
            <BrowserRouter>
              <ApiProvider>
                <AuthProvider>
                  <RoleProvider>
                    <CartProvider>
                      <PostJobProvider>
                        <App />
                      </PostJobProvider>
                    </CartProvider>
                  </RoleProvider>
                </AuthProvider>
              </ApiProvider>
            </BrowserRouter>
          </AppConfigProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
