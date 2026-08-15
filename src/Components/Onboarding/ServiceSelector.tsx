import React from "react";
import { Check } from "lucide-react";

interface ServiceSelectorProps {
  selectedServices: string[];
  onChange: (services: string[]) => void;
  availableServices?: string[];
}

export const defaultPlumbingServices = [
  "Tap Repair",
  "Leak Fixing",
  "Pipe Installation",
  "Bathroom Plumbing",
  "Drain Cleaning",
  "Water Tank Installation",
  "Motor Pump Repair",
];

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedServices,
  onChange,
  availableServices = defaultPlumbingServices,
}) => {
  const handleToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      if (selectedServices.length === 1) {
        return; // Keep at least 1 selected
      }
      onChange(selectedServices.filter((s) => s !== service));
    } else {
      onChange([...selectedServices, service]);
    }
  };

  return (
    <div className="bg-white dark:bg-[#161926] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] transition-all">
      {/* Card Header with Counter */}
      <div className="flex items-start justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/40">
            02
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Services You Offer
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Select the services you provide to customers.
            </p>
          </div>
        </div>

        {/* Counter Badge on Right */}
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 shrink-0">
          {selectedServices.length} Selected
        </span>
      </div>

      {/* Selectable Rectangular Chips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {availableServices.map((service) => {
          const isSelected = selectedServices.includes(service);

          return (
            <button
              key={service}
              type="button"
              onClick={() => handleToggle(service)}
              className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-center gap-3 cursor-pointer group select-none ${
                isSelected
                  ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/15"
                  : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
              }`}
            >
              {/* Small Check Circle on Left */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : "border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
                }`}
              >
                {isSelected && <Check size={12} strokeWidth={3} />}
              </div>

              {/* Service Title */}
              <span className="text-sm font-medium leading-snug">
                {service}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelector;
