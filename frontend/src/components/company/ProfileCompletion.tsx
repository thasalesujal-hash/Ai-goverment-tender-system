import { CheckCircle, XCircle } from "lucide-react";

interface ProfileCompletionProps {
  completion: number;
  completedItems: string[];
  incompleteItems: string[];
  onNavigate?: (item: string) => void;
}

export function ProfileCompletion({ completion, completedItems, incompleteItems, onNavigate }: ProfileCompletionProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Profile Completion</h3>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">{completion}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all"
          style={{ width: `${completion}%` }}
        />
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-900">Completed</h4>
          <div className="space-y-2">
            {completedItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle size={16} className="text-green-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-900">Incomplete</h4>
          <div className="space-y-2">
            {incompleteItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavigate?.(item)}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
              >
                <XCircle size={16} className="text-amber-600" />
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
