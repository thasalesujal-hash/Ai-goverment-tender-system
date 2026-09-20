import { Link } from "react-router-dom";
import { Tender } from "../../types";
import { Clock } from "lucide-react";

interface RecentTenderProps {
  tender: Tender;
}

export function RecentTender({ tender }: RecentTenderProps) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="px-4 py-3">
        <Link to={`/tenders/${tender.id}`} className="text-sm font-medium text-blue-600 hover:underline">
          {tender.title}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{tender.department}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{tender.location}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{tender.value}</td>
      <td className="px-4 py-3 text-sm text-slate-600">
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {tender.deadline}
        </span>
      </td>
    </tr>
  );
}
