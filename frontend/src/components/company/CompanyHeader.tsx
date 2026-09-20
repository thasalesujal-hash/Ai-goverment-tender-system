import { CompanyProfile } from "../../types";
import { Building2, MapPin, Globe, CheckCircle } from "lucide-react";

interface CompanyHeaderProps {
  profile: CompanyProfile;
}

export function CompanyHeader({ profile }: CompanyHeaderProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl font-bold text-blue-600">
          {profile.name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
          <p className="text-sm text-slate-500">{profile.legalName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <Building2 size={16} className="text-slate-400" />
              {profile.industry}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={16} className="text-slate-400" />
              {profile.city}, {profile.state}
            </span>
            <span className="flex items-center gap-1">
              <Globe size={16} className="text-slate-400" />
              {profile.companyType}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-sm text-slate-600">
              Profile helps improve tender matching and eligibility analysis.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
