import { useState } from "react";
import SPLeftSidebar from "../Components/SPLeftSidebar";
import SPMainContent from "../Components/SPMainContent";
import SPRightSidebar from "../Components/SPRightSidebar";
import { HiMenu, HiX } from "react-icons/hi";

const ServicePage: React.FC = () => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-[280px_1fr_320px]
        gap-6
        px-4
        py-6
      "
    >
      {/* LEFT SIDEBAR – DESKTOP */}
      <div className="hidden lg:block">
        <SPLeftSidebar />
      </div>

      {/* LEFT SIDEBAR – MOBILE DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* DRAWER */}
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white p-4 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <HiX size={22} />
              </button>
            </div>

            <SPLeftSidebar />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
          <div className="space-y-4">
              
        <SPMainContent onOpenFilters={() => setMobileFilterOpen(true)} />

      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden lg:block">
        <SPRightSidebar />
      </div>
    </div>
  );
};

export default ServicePage;
