import { TenderPreference } from "../../types";

interface TenderPreferencesProps {
  preferences: TenderPreference;
  onChange: (preferences: Partial<TenderPreference>) => void;
  editing: boolean;
}

const allStates = [
  "Maharashtra", "Goa", "Karnataka", "Gujarat", "Rajasthan", "Tamil Nadu", "Kerala", "Delhi",
];
const allCategories = [
  "Construction", "Infrastructure", "Government Buildings", "IT Services", "Healthcare",
  "Electrical", "Water Resources", "Transportation",
];
const allDepartments = [
  "PWD", "Municipal Corporation", "Water Resources", "NHAI", "Health Department", "Education Department",
];
const allLocations = [
  "Pune", "Mumbai", "Nashik", "Kolhapur", "Nagpur", "Aurangabad", "Thane", "Mumbai Suburban",
];

export function TenderPreferences({ preferences, onChange, editing }: TenderPreferencesProps) {
  const toggleArrayItem = (key: keyof TenderPreference, item: string) => {
    if (!editing) return;
    const current = preferences[key] as string[];
    if (current.includes(item)) {
      onChange({ [key]: current.filter((i) => i !== item) });
    } else {
      onChange({ [key]: [...current, item] });
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-2 text-lg font-semibold text-slate-900">Tender Preferences</h3>
      <p className="mb-4 text-sm text-slate-500">This will help the future recommendation engine find relevant tenders.</p>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Preferred States</label>
          <div className="flex flex-wrap gap-2">
            {allStates.map((state) => (
              <button
                key={state}
                onClick={() => toggleArrayItem("preferredStates", state)}
                disabled={!editing}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  preferences.preferredStates.includes(state)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700"
                } ${!editing ? "cursor-default" : "cursor-pointer"}`}
              >
                {preferences.preferredStates.includes(state) ? "✓ " : ""}{state}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Tender Categories</label>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleArrayItem("preferredCategories", cat)}
                disabled={!editing}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  preferences.preferredCategories.includes(cat)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700"
                } ${!editing ? "cursor-default" : "cursor-pointer"}`}
              >
                {preferences.preferredCategories.includes(cat) ? "✓ " : ""}{cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Minimum Project Value</label>
            {editing ? (
              <input
                value={preferences.minimumValue}
                onChange={(e) => onChange({ minimumValue: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-slate-900">{preferences.minimumValue}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Maximum Project Value</label>
            {editing ? (
              <input
                value={preferences.maximumValue}
                onChange={(e) => onChange({ maximumValue: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-slate-900">{preferences.maximumValue}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Departments</label>
          <div className="flex flex-wrap gap-2">
            {allDepartments.map((dept) => (
              <button
                key={dept}
                onClick={() => toggleArrayItem("preferredDepartments", dept)}
                disabled={!editing}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  preferences.preferredDepartments.includes(dept)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700"
                } ${!editing ? "cursor-default" : "cursor-pointer"}`}
              >
                {preferences.preferredDepartments.includes(dept) ? "✓ " : ""}{dept}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Locations</label>
          <div className="flex flex-wrap gap-2">
            {allLocations.map((loc) => (
              <button
                key={loc}
                onClick={() => toggleArrayItem("preferredLocations", loc)}
                disabled={!editing}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  preferences.preferredLocations.includes(loc)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-700"
                } ${!editing ? "cursor-default" : "cursor-pointer"}`}
              >
                {preferences.preferredLocations.includes(loc) ? "✓ " : ""}{loc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
