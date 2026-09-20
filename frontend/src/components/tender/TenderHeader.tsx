import { Tender } from "../../types";
import { MapPin, IndianRupee, Clock, FileText } from "lucide-react";

interface TenderHeaderProps {
  tender: Tender;
}

export function TenderHeader({ tender }: TenderHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900">{tender.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{tender.id}</p>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Department</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{tender.department}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Location</p>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-900">
            <MapPin size={14} />
            {tender.location}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Tender Value</p>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-900">
            <IndianRupee size={14} />
            {tender.value}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Deadline</p>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-900">
            <Clock size={14} />
            {tender.deadline}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-xs text-slate-500">EMD (Earnest Money Deposit)</p>
        <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-900">
          <FileText size={14} />
          {tender.emd}
        </p>
      </div>
    </div>
  );
}
