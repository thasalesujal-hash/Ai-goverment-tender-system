import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { LoadingState } from "../components/common/LoadingState";
import { EmptyState } from "../components/common/EmptyState";
import { tenderService } from "../services/tenderService";
import { companyService } from "../services/companyService";
import { Tender, CompanyProfile } from "../types";
import { CheckCircle, AlertTriangle, XCircle, ArrowLeft } from "lucide-react";

export default function Eligibility() {
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const [tenderData, companyData] = await Promise.all([
        tenderService.getById(id),
        companyService.getProfile(),
      ]);
      setTender(tenderData || null);
      setCompany(companyData);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <LoadingState lines={6} />
      </AppLayout>
    );
  }

  if (!tender || !company) {
    return (
      <AppLayout>
        <EmptyState
          icon={<AlertTriangle size={48} />}
          title="Information not available"
          description="Unable to load eligibility information."
          actionLabel="Find Tenders"
          onAction={() => (window.location.href = "/tenders")}
        />
      </AppLayout>
    );
  }

  const checks = tender.requirements.map((req) => {
    let status: "met" | "warning" | "not-met" = "met";
    if (!req.met && req.required) status = "not-met";
    else if (!req.met && !req.required) status = "warning";

    return { ...req, status };
  });

  const metCount = checks.filter((c) => c.status === "met").length;
  const totalRequired = checks.filter((c) => c.required).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={`/tenders/${tender.id}`}>
            <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
              <ArrowLeft size={18} />
              Back to Tender
            </button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">Check My Eligibility</h1>
          <p className="mt-2 text-slate-600">
            Compare your company profile with this tender&apos;s requirements.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Your Company</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-600">Company Name</span>
                <span className="text-sm font-medium text-slate-900">{company.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-600">Industry</span>
                <span className="text-sm font-medium text-slate-900">{company.industry}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-600">Location</span>
                <span className="text-sm font-medium text-slate-900">{company.city}, {company.state}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-600">Annual Turnover</span>
                <span className="text-sm font-medium text-slate-900">{company.annualTurnover}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-600">Relevant Experience</span>
                <span className="text-sm font-medium text-slate-900">{company.relevantExperience} years</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-600">GST Registration</span>
                <span className="text-sm font-medium text-slate-900">
                  {company.gstNumber ? "Available" : "Not Available"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-sm text-slate-600">Certifications</span>
                <span className="text-sm font-medium text-slate-900">
                  {company.certifications.join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Similar Projects</span>
                <span className="text-sm font-medium text-slate-900">{company.similarProjects}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Tender Requirements</h2>
            <div className="space-y-3">
              {tender.requirements.map((req, index) => (
                <div key={index} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm text-slate-600">{req.label}</span>
                  <span className="text-sm font-medium text-slate-900">{req.required ? "Required" : "Preferred"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Eligibility Check</h2>
          <div className="space-y-3">
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
                      ? "Meets requirement"
                      : check.status === "warning"
                      ? "Needs attention"
                      : "Does not meet requirement"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              <strong>Result:</strong> {metCount} of {totalRequired} required criteria met.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This is a preliminary check based on your company profile. Review
            the tender documents carefully before making a final bid decision. This tool does not
            provide a legally binding eligibility decision.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
