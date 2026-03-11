import { useState } from "react";
import SPLeftSidebar from "../Components/SPLeftSidebar";
import SPMainContent from "../Components/SPMainContent";
import SPRightSidebar from "../Components/SPRightSidebar";
import { HiX } from "react-icons/hi";

const ServicePage: React.FC = () => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    service: "",
    search: ""
  });

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
        <SPLeftSidebar filters={filters} setFilters={setFilters} />
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
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-900 p-4 overflow-y-auto shadow-xl transition-colors duration-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-slate-500 hover:text-red-500 dark:text-slate-400">
                <HiX size={22} />
              </button>
            </div>

            <SPLeftSidebar filters={filters} setFilters={setFilters} />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="space-y-4">

        <SPMainContent onOpenFilters={() => setMobileFilterOpen(true)} filters={filters} />

      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden lg:block">
        <SPRightSidebar />
      </div>
    </div>
  );
};

export default ServicePage;
