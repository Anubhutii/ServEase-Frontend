import React from "react";

interface ProgressStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps = [
    { number: 1, title: "Your Details" },
    { number: 2, title: "Review & Verify" },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-6">
      {steps.map((step, index) => {
        const isActive = currentStep === index;
        const isCompleted = currentStep > index;

        return (
          <React.Fragment key={step.number}>
            <button
              type="button"
              onClick={() => isCompleted && onStepClick?.(index)}
              className={`flex items-center gap-2.5 transition-all text-left ${
                isCompleted ? "cursor-pointer group" : "cursor-default"
              }`}
            >
              {/* Numbered circle (NO icons inside) */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-100 dark:ring-indigo-950/60"
                    : isCompleted
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {step.number}
              </div>

              <span
                className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-slate-900 dark:text-white font-semibold"
                    : isCompleted
                    ? "text-slate-700 dark:text-slate-300 group-hover:text-indigo-600"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {step.number} — {step.title}
              </span>
            </button>

            {/* Thin connecting progress line */}
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-[2px] rounded-full transition-colors duration-300 ${
                  currentStep > 0
                    ? "bg-indigo-600"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressStepper;
