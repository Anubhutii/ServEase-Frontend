import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Layout/Navbar";
import Home from "./Pages/Home";
import BecomeProvider from "./Pages/ServiceProviderPage";
import ServicePage from './Pages/ServicePage';
import ViewAllServices from "./Components/ViewAllServices";
import NotFound from "./Components/ViewAllServices";
import CartPage from "./Pages/CartPage";


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

      </Routes>
    </>
  );
}

export default App;

