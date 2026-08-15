import React from "react";
import { ShieldCheck } from "lucide-react";

export const SecurityBanner: React.FC = () => {
  return (
    <div className="rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100/90 dark:border-indigo-900/40 p-4 sm:px-5 flex items-center gap-3.5 transition-all">
      <div className="w-8 h-8 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
          Your information is safe with us
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
          We use bank-level encryption to keep your data secure and private.
        </p>
      </div>
    </div>
  );
};

export default SecurityBanner;
