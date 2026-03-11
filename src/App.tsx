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


function App() {
  return (
    <>
      {/* Navbar will stay on all pages */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/become-provider" element={<BecomeProvider />} />
        <Route path="/service" element={<ServicePage />} />
        <Route path="/all-services" element={<ViewAllServices />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/cart" element={<CartPage />} />

        {/* NEW ROUTES */}
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/post-job" element={<JobPostingPage />} />
        <Route path="/jobs/:jobId/bids" element={<BidReviewList />} />
        <Route path="/negotiation/:id" element={<NegotiationPage />} />
      </Routes>
    </>
  );
}

export default App;

