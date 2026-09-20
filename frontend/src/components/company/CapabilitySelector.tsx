interface CapabilitySelectorProps {
  capabilities: string[];
  onChange: (capabilities: string[]) => void;
  editing: boolean;
}

const allCapabilities = [
  "Road Construction",
  "Building Construction",
  "Bridge Construction",
  "Highway Construction",
  "Water Infrastructure",
  "Electrical Works",
  "IT Services",
  "Software Development",
  "Medical Equipment",
  "Consulting",
  "Transportation",
  "Other",
];

export function CapabilitySelector({ capabilities, onChange, editing }: CapabilitySelectorProps) {
  const toggleCapability = (cap: string) => {
    if (!editing) return;
    if (capabilities.includes(cap)) {
      onChange(capabilities.filter((c) => c !== cap));
    } else {
      onChange([...capabilities, cap]);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-2 text-lg font-semibold text-slate-900">Business Capabilities</h3>
      <p className="mb-4 text-sm text-slate-500">
        Select the services and areas your company can execute.
      </p>
      <div className="flex flex-wrap gap-2">
        {allCapabilities.map((cap) => {
          const selected = capabilities.includes(cap);
          return (
            <button
              key={cap}
              onClick={() => toggleCapability(cap)}
              disabled={!editing}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                selected
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              } ${!editing ? "cursor-default" : "cursor-pointer"}`}
            >
              {selected ? "✓ " : ""}
              {cap}
            </button>
          );
        })}
      </div>
    </div>
  );
}
