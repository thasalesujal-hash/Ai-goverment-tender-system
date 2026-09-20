import { CompanyProfile } from "../../types";
import { Input } from "../common/Input";

interface CompanyInformationProps {
  profile: CompanyProfile;
  onChange: (field: keyof CompanyProfile, value: string | number) => void;
  editing: boolean;
}

const industryOptions = [
  "Construction",
  "IT & Software",
  "Healthcare",
  "Electrical",
  "Manufacturing",
  "Consulting",
  "Transportation",
  "Other",
];

const companyTypeOptions = [
  "Private Limited",
  "Public Limited",
  "Partnership",
  "LLP",
  "Proprietorship",
  "Other",
];

export function CompanyInformation({ profile, onChange, editing }: CompanyInformationProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Company Information</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Company Name"
          value={profile.name}
          onChange={(e) => onChange("name", e.target.value)}
          editing={editing}
        />
        <Input
          label="Legal Name"
          value={profile.legalName}
          onChange={(e) => onChange("legalName", e.target.value)}
          editing={editing}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700">Company Type</label>
          {editing ? (
            <select
              value={profile.companyType}
              onChange={(e) => onChange("companyType", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {companyTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <p className="mt-1 text-sm text-slate-900">{profile.companyType}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Industry</label>
          {editing ? (
            <select
              value={profile.industry}
              onChange={(e) => onChange("industry", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {industryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <p className="mt-1 text-sm text-slate-900">{profile.industry}</p>
          )}
        </div>
        <Input
          label="Year Established"
          value={profile.yearEstablished}
          onChange={(e) => onChange("yearEstablished", e.target.value)}
          editing={editing}
        />
        <Input
          label="Website"
          value={profile.website}
          onChange={(e) => onChange("website", e.target.value)}
          editing={editing}
        />
        <Input
          label="Email"
          type="email"
          value={profile.email}
          onChange={(e) => onChange("email", e.target.value)}
          editing={editing}
        />
        <Input
          label="Phone"
          value={profile.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          editing={editing}
        />
        <Input
          label="Address"
          value={profile.address}
          onChange={(e) => onChange("address", e.target.value)}
          editing={editing}
        />
        <Input
          label="City"
          value={profile.city}
          onChange={(e) => onChange("city", e.target.value)}
          editing={editing}
        />
        <Input
          label="State"
          value={profile.state}
          onChange={(e) => onChange("state", e.target.value)}
          editing={editing}
        />
        <Input
          label="PIN Code"
          value={profile.pinCode}
          onChange={(e) => onChange("pinCode", e.target.value)}
          editing={editing}
        />
      </div>
    </div>
  );
}
