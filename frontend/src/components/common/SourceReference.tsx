import { FileText } from "lucide-react";

interface SourceReferenceProps {
  source: string;
  sourceDetail?: string;
  onViewSource?: () => void;
}

export function SourceReference({ source, sourceDetail, onViewSource }: SourceReferenceProps) {
  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">Source</p>
      <div className="mt-1 flex items-center gap-2">
        <FileText size={14} className="text-slate-400" />
        <span className="text-sm text-slate-700">{source}</span>
        {sourceDetail && <span className="text-xs text-slate-500">({sourceDetail})</span>}
      </div>
      {onViewSource && (
        <button
          onClick={onViewSource}
          className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View Source →
        </button>
      )}
    </div>
  );
}
