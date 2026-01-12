import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Layout/Navbar";
import Home from "./Pages/Home";
import BecomeProvider from "./Pages/ServiceProviderPage";
import ServicePage from './Pages/ServicePage';
import ViewAllServices from "./Components/ViewAllServices";
import NotFound from "./Components/ViewAllServices";

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
      </Routes>
    </>
  );
}

export default App;

