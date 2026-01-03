import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Layout/Navbar";
import Home from "./Pages/Home";
import BecomeProvider from "./Pages/ServiceProviderForm";
import NotFound from "./Pages/NotFound";

function App() {
  return (
    <>
      {/* Navbar will stay on all pages */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/become-provider" element={<BecomeProvider />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

