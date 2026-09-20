import { CompanyProfile } from "../../types";

interface ExperienceSectionProps {
  profile: CompanyProfile;
  onChange: (field: keyof CompanyProfile, value: string | number) => void;
  editing: boolean;
}

export function ExperienceSection({ profile, onChange, editing }: ExperienceSectionProps) {
  const fields = [
    { key: "yearsInBusiness" as const, label: "Years in Business" },
    { key: "relevantExperience" as const, label: "Years of Relevant Experience" },
    { key: "similarProjects" as const, label: "Number of Similar Projects" },
    { key: "governmentProjects" as const, label: "Number of Government Projects" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Experience & Capabilities</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700">{field.label}</label>
            {editing ? (
              <input
                type="number"
                value={profile[field.key] as number}
                onChange={(e) => onChange(field.key, parseInt(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-slate-900">{profile[field.key]}</p>
            )}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Largest Completed Project</label>
          {editing ? (
            <input
              value={profile.largestProject}
              onChange={(e) => onChange("largestProject", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-slate-900">{profile.largestProject}</p>
          )}
        </div>
      </div>
    </div>
  );
}
