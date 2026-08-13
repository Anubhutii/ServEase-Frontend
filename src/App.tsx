import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Layout/Navbar";
import Home from "./Pages/Home";
import BecomeProvider from "./Pages/ServiceProviderPage";
import ServicePage from './Pages/ServicePage';
import ViewAllServices from "./Components/ViewAllServices";
import NotFound from "./Components/ViewAllServices";
import CartPage from "./Pages/CartPage";
import ProviderDashboard from "./Pages/ProviderDashboard";
import UserDashboard from "./Pages/UserDashboard";
import JobPostingPage from "./Pages/JobPostingPage";
import BidReviewList from "./Pages/BidReviewList";
import NegotiationPage from "./Pages/NegotiationPage";
import UserChatPage from "./Pages/UserChatPage";
import ProviderChatPage from "./Pages/ProviderChatPage";
import UserOnlyLayout, { ProviderGuard } from "./Components/RoleGuard";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Provider only */}
        <Route path="/provider-dashboard" element={<ProviderGuard><ProviderDashboard /></ProviderGuard>} />
        <Route path="/provider-chat/:bookingId" element={<ProviderGuard><ProviderChatPage /></ProviderGuard>} />

        {/* All other routes — blocked in provider mode */}
        <Route element={<UserOnlyLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/become-provider" element={<BecomeProvider />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/all-services" element={<ViewAllServices />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/post-job" element={<JobPostingPage />} />
          <Route path="/jobs/:jobId/bids" element={<BidReviewList />} />
          <Route path="/negotiation/:id" element={<NegotiationPage />} />
          <Route path="/user-chat/:bookingId" element={<UserChatPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
