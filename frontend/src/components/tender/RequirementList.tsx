import { Requirement } from "../../types";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface RequirementListProps {
  requirements: Requirement[];
}

export function RequirementList({ requirements }: RequirementListProps) {
  return (
    <div className="space-y-3">
      {requirements.map((req, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 rounded-lg border p-3 ${
            req.met
              ? "border-green-200 bg-green-50"
              : req.required
              ? "border-red-200 bg-red-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          {req.met ? (
            <CheckCircle className="mt-0.5 shrink-0 text-green-600" size={20} />
          ) : req.required ? (
            <XCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
          ) : (
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">{req.label}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {req.met
                ? "Requirement met"
                : req.required
                ? "Requirement not met"
                : "Needs attention"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
