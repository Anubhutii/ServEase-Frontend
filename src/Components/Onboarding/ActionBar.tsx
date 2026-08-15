import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface ActionBarProps {
  currentStep: number;
  onCancel?: () => void;
  onBack?: () => void;
  onContinue: () => void;
  isLoading?: boolean;
  isContinueDisabled?: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  currentStep,
  onCancel,
  onBack,
  onContinue,
  isLoading = false,
  isContinueDisabled = false,
}) => {
  return (
    <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
      {/* Left Button */}
      {currentStep === 0 ? (
        <button
          type="button"
          onClick={onCancel}
          className="h-12 px-6 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          Cancel
        </button>
      ) : (
        <button
          type="button"
          onClick={onBack}
          className="h-12 px-6 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit</span>
        </button>
      )}

      {/* Right Primary Button */}
      <button
        type="button"
        onClick={onContinue}
        disabled={isContinueDisabled || isLoading}
        className={`h-12 px-8 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center gap-2 shadow-md shadow-indigo-500/20 select-none ${
          isContinueDisabled || isLoading
            ? "bg-indigo-400 dark:bg-indigo-700/60 cursor-not-allowed opacity-70"
            : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] cursor-pointer shadow-indigo-600/30"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Submitting...</span>
          </div>
        ) : currentStep === 0 ? (
          <>
            <span>Continue to Review</span>
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            <span>Submit for Verification</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};

export default ActionBar;
