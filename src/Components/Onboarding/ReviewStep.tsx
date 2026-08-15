import React from "react";
import { Check, Edit2 } from "lucide-react";

interface ReviewStepProps {
  formData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: string;
    experience?: string;
    fee?: number;
    address?: string;
    services?: string[];
  };
  onEditSection: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onEditSection,
}) => {
  const getExperienceLabel = (exp?: string) => {
    switch (exp) {
      case "1":
        return "1 Year (Beginner)";
      case "3":
        return "2 - 4 Years (Experienced)";
      case "5":
        return "5+ Years (Master Expert)";
      default:
        return exp || "2 - 4 Years";
    }
  };

  const getGenderLabel = (g?: string) => {
    if (!g) return "Male";
    return g.charAt(0).toUpperCase() + g.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Review your provider profile
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Make sure everything looks correct before submitting.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* 1. PERSONAL DETAILS CARD */}
        <div className="bg-white dark:bg-[#161926] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] transition-all">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Personal Details
            </h4>
            <button
              type="button"
              onClick={onEditSection}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                Full Name
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                {formData.firstName || "Anubhuti"} {formData.lastName || "Singh"}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">
                WhatsApp Number
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                +91 {formData.phone || "98765 43210"}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">
                Gender
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                {getGenderLabel(formData.gender)}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block">
                Experience
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
                {getExperienceLabel(formData.experience)}
              </span>
            </div>
          </div>

          {formData.address && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium block">
                Operating Locality
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5 block">
                {formData.address}
              </span>
            </div>
          )}
        </div>

        {/* 2. PROFESSIONAL DETAILS & SERVICES */}
        <div className="bg-white dark:bg-[#161926] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] transition-all">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Professional Details
            </h4>
            <button
              type="button"
              onClick={onEditSection}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block mb-2.5">
              Selected Services ({formData.services?.length || 2})
            </span>
            <div className="flex flex-wrap gap-2">
              {(formData.services || ["Tap Repair", "Leak Fixing"]).map(
                (service) => (
                  <span
                    key={service}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-semibold"
                  >
                    <Check size={12} className="text-indigo-600 dark:text-indigo-400" />
                    <span>{service}</span>
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* 3. VISITING FEE CARD */}
        <div className="bg-white dark:bg-[#161926] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] transition-all">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Visiting Fee
            </h4>
            <button
              type="button"
              onClick={onEditSection}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              ₹{formData.fee || 299}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              per standard consultation visit (100% direct customer payout)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
