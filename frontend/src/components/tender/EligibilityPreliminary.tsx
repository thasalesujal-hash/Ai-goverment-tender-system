import { Tender, CompanyProfile } from "../../types";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface EligibilityPreliminaryProps {
  tender: Tender;
  company: CompanyProfile;
}

export function EligibilityPreliminary({ tender, company }: EligibilityPreliminaryProps) {
  const checks = tender.requirements.map((req) => {
    let status: "met" | "warning" | "not-met" = "met";
    if (!req.met && req.required) status = "not-met";
    else if (!req.met && !req.required) status = "warning";
    return { ...req, status };
  });

  const metCount = checks.filter((c) => c.status === "met").length;
  const totalRequired = checks.filter((c) => c.required).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Preliminary Eligibility Check</h3>
      <p className="mb-4 text-sm text-slate-600">
        Compare your company profile with this tender&apos;s requirements.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Your Company</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Relevant Experience</span>
              <span className="font-medium text-slate-900">{company.relevantExperience} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Annual Turnover</span>
              <span className="font-medium text-slate-900">{company.annualTurnover}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Similar Projects</span>
              <span className="font-medium text-slate-900">{company.similarProjects}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">GST</span>
              <span className="font-medium text-slate-900">
                {company.gstNumber ? "Available" : "Not Available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Certifications</span>
              <span className="font-medium text-slate-900">
                {company.certifications.join(", ")}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Tender Requirements</h4>
          <div className="space-y-2 text-sm">
            {tender.requirements.map((req, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-slate-600">{req.label}</span>
                <span className="font-medium text-slate-900">
                  {req.required ? "Required" : "Preferred"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <h4 className="text-sm font-semibold text-slate-900">Eligibility Check</h4>
        {checks.map((check, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              check.status === "met"
                ? "border-green-200 bg-green-50"
                : check.status === "warning"
                ? "border-amber-200 bg-amber-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            {check.status === "met" ? (
              <CheckCircle className="mt-0.5 shrink-0 text-green-600" size={20} />
            ) : check.status === "warning" ? (
              <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} />
            ) : (
              <XCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{check.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {check.status === "met"
                  ? "Requirement appears met"
                  : check.status === "warning"
                  ? "Needs verification"
                  : "Does not meet requirement"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          <strong>Preliminary Match:</strong> {metCount} of {totalRequired} required criteria appear
          to be met.
        </p>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        This is a preliminary check based on your company profile. Review the tender documents
        carefully before making a final bid decision. This tool does not provide a legally binding
        eligibility decision.
      </p>
    </div>
  );
}
