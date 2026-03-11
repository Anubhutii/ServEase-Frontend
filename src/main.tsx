import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme as antTheme } from 'antd'
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

const AppConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme: appTheme } = useTheme();
  return (
    <ConfigProvider
      theme={{
        ...theme,
        algorithm: appTheme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm
      }}
    >
      {children}
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <AppConfigProvider>
            <ApiProvider>
              <AuthProvider>
                <RoleProvider>
                  <CartProvider>
                    <BrowserRouter>
                      <App />
                    </BrowserRouter>
                  </CartProvider>
                </RoleProvider>
              </AuthProvider>
            </ApiProvider>
          </AppConfigProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
