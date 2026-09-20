import { CompanyProfile } from "../../types";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface RegistrationDetailsProps {
  profile: CompanyProfile;
  editing: boolean;
  onChange: (field: keyof CompanyProfile, value: string) => void;
}

const registrationFields: { key: keyof CompanyProfile; label: string }[] = [
  { key: "gstNumber", label: "GST Number" },
  { key: "panNumber", label: "PAN Number" },
  { key: "cinNumber", label: "CIN / Registration Number" },
  { key: "msmeNumber", label: "MSME / Udyam Number" },
  { key: "contractorRegistrationNumber", label: "Government Contractor Registration" },
];

export function RegistrationDetails({ profile, editing, onChange }: RegistrationDetailsProps) {
  const getStatus = (value: string) => {
    if (!value) return "missing";
    if (value.length < 5) return "needs_update";
    return "added";
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "added":
        return { color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle size={16} />, label: "Added" };
      case "needs_update":
        return { color: "text-amber-600", bg: "bg-amber-50", icon: <AlertTriangle size={16} />, label: "Needs update" };
      default:
        return { color: "text-red-600", bg: "bg-red-50", icon: <XCircle size={16} />, label: "Missing" };
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Registrations & Identifiers</h3>
      <div className="space-y-4">
        {registrationFields.map((field) => {
          const value = profile[field.key] as string;
          const status = getStatus(value);
          const statusConfig = getStatusConfig(status);

          return (
            <div key={field.key} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{field.label}</p>
                {editing ? (
                  <input
                    value={value}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder="Enter number"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-slate-600">{value || "Not provided"}</p>
                )}
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusConfig.color} ${statusConfig.bg}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
