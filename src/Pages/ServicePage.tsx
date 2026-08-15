import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SPLeftSidebar from "../Components/SPLeftSidebar";
import SPMainContent from "../Components/SPMainContent";
import SPRightSidebar from "../Components/SPRightSidebar";
import { X, SlidersHorizontal } from "lucide-react";

const ServicePage: React.FC = () => {
  const { state } = useLocation();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{
    category: string;
    service: string;
    search: string;
    maxBudget?: number;
    minRating?: number;
  }>({
    category: (state as any)?.category || "",
    service: (state as any)?.service || "",
    search: (state as any)?.search || "",
    maxBudget: 15000,
    minRating: 0,
  });

  // Handle location state changes and custom filter events
  useEffect(() => {
    if (state) {
      setFilters((f) => ({
        ...f,
        category: (state as any).category !== undefined ? (state as any).category : f.category,
        service: (state as any).service !== undefined ? (state as any).service : f.service,
        search: (state as any).search !== undefined ? (state as any).search : f.search,
      }));
    }
  }, [state]);

  // Listen to job_posted event or apply_job_filter event
  useEffect(() => {
    const handleJobFilter = (e: any) => {
      if (e.detail?.category) {
        setFilters((f) => ({
          ...f,
          category: e.detail.category.toLowerCase(),
          search: e.detail.search || "",
        }));
      }
    };

    window.addEventListener("apply_job_filter", handleJobFilter);
    return () => {
      window.removeEventListener("apply_job_filter", handleJobFilter);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[290px_1fr_330px] xl:grid-cols-[310px_1fr_350px] gap-6 px-3 sm:px-6 py-6 items-start">
        
        {/* LEFT SIDEBAR – DESKTOP (STICKY) */}
        <div className="hidden lg:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
          <SPLeftSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* LEFT SIDEBAR – MOBILE DRAWER */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
            />

            {/* DRAWER */}
            <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-900 p-4 overflow-y-auto shadow-2xl transition-transform duration-300">
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-blue-600" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Service Filters
                  </h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              <SPLeftSidebar filters={filters} setFilters={setFilters} />
            </div>
          </div>
        )}

        {/* MAIN CONTENT (CENTER FEED) */}
        <main className="min-w-0">
          <SPMainContent
            onOpenFilters={() => setMobileFilterOpen(true)}
            filters={filters}
          />
        </main>

        {/* RIGHT SIDEBAR – DESKTOP (STICKY) */}
        <div className="hidden lg:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
          <SPRightSidebar />
        </div>

      </div>
    </div>
  );
};

export default ServicePage;
