import { Link } from "react-router-dom";
import { Tender } from "../../types";
import { Clock, IndianRupee } from "lucide-react";

interface DeadlineCardProps {
  tender: Tender;
}

export function DeadlineCard({ tender }: DeadlineCardProps) {
  const daysLeft = Math.ceil(
    (tender.deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  let urgencyColor = "text-green-600";
  let bgColor = "bg-green-50";
  let borderColor = "border-green-200";

  if (daysLeft <= 3) {
    urgencyColor = "text-red-600";
    bgColor = "bg-red-50";
    borderColor = "border-red-200";
  } else if (daysLeft <= 7) {
    urgencyColor = "text-orange-600";
    bgColor = "bg-orange-50";
    borderColor = "border-orange-200";
  }

  return (
    <div className={`flex items-center justify-between rounded-lg border ${borderColor} ${bgColor} p-4`}>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-900">{tender.title}</h4>
        <p className="text-xs text-slate-500">{tender.department}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            <span className={`font-medium ${urgencyColor}`}>
              {daysLeft <= 0 ? "Deadline passed" : `${daysLeft} days left`}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee size={14} />
            {tender.value}
          </span>
        </div>
      </div>
      <Link
        to={`/tenders/${tender.id}`}
        className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        View →
      </Link>
    </div>
  );
}
