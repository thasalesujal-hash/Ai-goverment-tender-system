interface StatsRowProps {
  activeCount: number;
  newMatches: number;
  savedCount: number;
  deadlinesCount: number;
}

export function StatsRow({ activeCount, newMatches, savedCount, deadlinesCount }: StatsRowProps) {
  const stats = [
    { label: "Active Tenders", value: activeCount, color: "text-blue-600" },
    { label: "New Matches", value: newMatches, color: "text-green-600" },
    { label: "Saved Tenders", value: savedCount, color: "text-amber-600" },
    { label: "Deadlines This Week", value: deadlinesCount, color: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">{stat.label}</p>
          <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
