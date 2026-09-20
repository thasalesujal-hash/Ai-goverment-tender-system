import { AlertTriangle, CheckCircle } from "lucide-react";

interface ThingsToCheckProps {
  items: string[];
}

export function ThingsToCheck({ items }: ThingsToCheckProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Things to Check</h3>
      <div className="space-y-3">
        {items.map((item, index) => {
          const isWarning = item.startsWith("⚠");
          const isSuccess = item.startsWith("✓");
          return (
            <div
              key={index}
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                isWarning
                  ? "border-amber-200 bg-white"
                  : isSuccess
                  ? "border-green-200 bg-white"
                  : "border-slate-200 bg-white"
              }`}
            >
              {isWarning ? (
                <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} />
              ) : isSuccess ? (
                <CheckCircle className="mt-0.5 shrink-0 text-green-600" size={20} />
              ) : (
                <AlertTriangle className="mt-0.5 shrink-0 text-slate-400" size={20} />
              )}
              <p className="text-sm text-slate-700">{item.replace(/^[⚠✓]\s*/, "")}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        This is a preliminary assistance feature. Please verify all details from the original tender
        documents.
      </p>
    </div>
  );
}
