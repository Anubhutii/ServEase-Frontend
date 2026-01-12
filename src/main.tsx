import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ApiProvider } from './Context/ApiContext.tsx'
import { AuthProvider } from './Context/AuthContext.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'


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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ConfigProvider theme={theme}>
        <ApiProvider>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
        </ApiProvider>
      </ConfigProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)
