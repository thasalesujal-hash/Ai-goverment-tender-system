import { AISummary } from "../../types";
import { Bot, IndianRupee, Clock, MapPin, FileText } from "lucide-react";

interface TenderSummaryProps {
  summary: AISummary;
}

export function TenderSummary({ summary }: TenderSummaryProps) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">AI Tender Summary</h3>
          <p className="text-xs text-slate-500">Preliminary overview based on tender documents</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-500">What is this tender?</p>
          <p className="mt-1 text-sm text-slate-700">{summary.whatIsThis}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2 rounded-lg bg-white p-3">
            <IndianRupee size={16} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Estimated Value</p>
              <p className="text-sm font-medium text-slate-900">{summary.estimatedValue}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-white p-3">
            <Clock size={16} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Deadline</p>
              <p className="text-sm font-medium text-slate-900">{summary.deadline}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-white p-3 sm:col-span-2">
            <MapPin size={16} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="text-sm font-medium text-slate-900">{summary.location}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500">Who can apply?</p>
          <p className="mt-1 text-sm text-slate-700">{summary.whoCanApply}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500">Important Documents</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {summary.importantDocuments.map((doc) => (
              <span
                key={doc}
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
              >
                <FileText size={12} />
                {doc}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
