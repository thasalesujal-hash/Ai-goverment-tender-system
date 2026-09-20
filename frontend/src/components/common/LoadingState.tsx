export function LoadingState({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-slate-200" />
      ))}
    </div>
  );
}

export function SkeletonLine({ width = "100%" }: { width?: string }) {
  return <div className="h-4 rounded bg-slate-200" style={{ width }} />;
}
