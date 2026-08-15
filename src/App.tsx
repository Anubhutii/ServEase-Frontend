import { lazy, Suspense } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Layout/Navbar";
import UserOnlyLayout, { ProviderGuard } from "./Components/RoleGuard";

// Route-based Code Splitting (Lazy Loading)
const Home = lazy(() => import("./Pages/Home"));
const BecomeProvider = lazy(() => import("./Pages/ServiceProviderPage"));
const ServicePage = lazy(() => import("./Pages/ServicePage"));
const ViewAllServices = lazy(() => import("./Components/ViewAllServices"));
const CartPage = lazy(() => import("./Pages/CartPage"));
const ProviderDashboard = lazy(() => import("./Pages/ProviderDashboard"));
const HistoryPage = lazy(() => import("./Pages/HistoryPage"));
const JobPostingPage = lazy(() => import("./Pages/JobPostingPage"));
const BidReviewList = lazy(() => import("./Pages/BidReviewList"));
const NegotiationPage = lazy(() => import("./Pages/NegotiationPage"));
const UserChatPage = lazy(() => import("./Pages/UserChatPage"));
const ProviderChatPage = lazy(() => import("./Pages/ProviderChatPage"));

// Lightweight Page Loading Skeleton
const PageLoader = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
    <div className="w-9 h-9 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide animate-pulse">
      Loading...
    </span>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Provider only routes */}
          <Route
            path="/provider-dashboard"
            element={
              <ProviderGuard>
                <ProviderDashboard />
              </ProviderGuard>
            }
          />
          <Route
            path="/provider-chat/:bookingId"
            element={
              <ProviderGuard>
                <ProviderChatPage />
              </ProviderGuard>
            }
          />

          {/* User & Public routes — blocked in provider mode */}
          <Route element={<UserOnlyLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/become-provider" element={<BecomeProvider />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/all-services" element={<ViewAllServices />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/user-dashboard" element={<Navigate to="/history" replace />} />
            <Route path="/post-job" element={<JobPostingPage />} />
            <Route path="/jobs/:jobId/bids" element={<BidReviewList />} />
            <Route path="/negotiation/:id" element={<NegotiationPage />} />
            <Route path="/negotiation" element={<NegotiationPage />} />
            <Route path="/user-chat/:bookingId" element={<UserChatPage />} />
            <Route path="*" element={<ViewAllServices />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
