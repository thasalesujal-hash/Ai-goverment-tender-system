import { CompanyProfile } from "../../types";

interface FinancialInformationProps {
  profile: CompanyProfile;
  onChange: (field: keyof CompanyProfile, value: string) => void;
  editing: boolean;
}

export function FinancialInformation({ profile, onChange, editing }: FinancialInformationProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-2 text-lg font-semibold text-slate-900">Financial Information</h3>
      <p className="mb-4 text-sm text-slate-500">
        Financial information may be used to compare your profile with tender financial requirements.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Annual Turnover</label>
          {editing ? (
            <input
              value={profile.annualTurnover}
              onChange={(e) => onChange("annualTurnover", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-slate-900">{profile.annualTurnover}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Average Turnover — Last 3 Years</label>
          {editing ? (
            <input
              value={profile.averageTurnover3Years}
              onChange={(e) => onChange("averageTurnover3Years", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-slate-900">{profile.averageTurnover3Years}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Available Working Capital</label>
          {editing ? (
            <input
              value={profile.workingCapital}
              onChange={(e) => onChange("workingCapital", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-slate-900">{profile.workingCapital}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Maximum Project Value Handled</label>
          {editing ? (
            <input
              value={profile.maximumProjectValue}
              onChange={(e) => onChange("maximumProjectValue", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-slate-900">{profile.maximumProjectValue}</p>
          )}
        </div>
      </div>
    </div>
  );
}
