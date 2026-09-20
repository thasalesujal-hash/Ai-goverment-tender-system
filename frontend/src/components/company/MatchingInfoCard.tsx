import { CheckCircle, ArrowRight } from "lucide-react";

export function MatchingInfoCard() {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">How Your Profile Is Used</h3>
      <p className="mb-4 text-sm text-slate-600">
        Your company profile helps the system:
      </p>
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <CheckCircle size={16} className="text-green-600" />
          Find relevant tenders
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <CheckCircle size={16} className="text-green-600" />
          Compare tender requirements
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <CheckCircle size={16} className="text-green-600" />
          Identify missing requirements
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <CheckCircle size={16} className="text-green-600" />
          Generate preliminary eligibility matches
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <CheckCircle size={16} className="text-green-600" />
          Recommend potentially relevant tenders
        </div>
      </div>
      <div className="rounded-lg border border-blue-200 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Company Profile</span>
          <ArrowRight size={16} className="text-slate-400" />
          <span className="text-slate-600">Tender Requirements</span>
          <ArrowRight size={16} className="text-slate-400" />
          <span className="text-slate-600">Profile Matching</span>
          <ArrowRight size={16} className="text-slate-400" />
          <span className="text-slate-600">Potential Matches</span>
          <ArrowRight size={16} className="text-slate-400" />
          <span className="text-slate-600">Recommendations</span>
        </div>
      </div>
    </div>
  );
}
