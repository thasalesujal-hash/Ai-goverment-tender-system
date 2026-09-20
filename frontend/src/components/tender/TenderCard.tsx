import { Link } from "react-router-dom";
import { Tender } from "../../types";
import { Clock, IndianRupee, MapPin, Bookmark, FileText } from "lucide-react";
import { Badge } from "../common/Badge";
import { savedTenderService } from "../../services/savedTenderService";

interface TenderCardProps {
  tender: Tender;
  onSaveChange?: (tenderId: string, saved: boolean) => void;
}

export function TenderCard({ tender, onSaveChange }: TenderCardProps) {
  const statusVariants: Record<string, "success" | "warning" | "default"> = {
    open: "success",
    closing_soon: "warning",
    closed: "default",
  };

  const experienceReq = tender.requirements.find((r) => r.label.toLowerCase().includes("experience") && r.required);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = await savedTenderService.isSaved(tender.id);
    if (isSaved) {
      await savedTenderService.remove(tender.id);
      onSaveChange?.(tender.id, false);
    } else {
      await savedTenderService.save(tender.id);
      onSaveChange?.(tender.id, true);
    }
  };

  return (
    <Link to={`/tenders/${tender.id}`}>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-base font-semibold text-slate-900">{tender.title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveClick}
              className="rounded-lg p-1 text-slate-400 hover:text-blue-600"
              aria-label="Save tender"
            >
              <Bookmark size={18} />
            </button>
            <Badge variant={statusVariants[tender.status]}>
              {tender.status === "open" ? "New" : tender.status === "closing_soon" ? "Closing Soon" : "Closed"}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-slate-500">{tender.department}</p>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            {tender.location}
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee size={16} className="text-slate-400" />
            {tender.value}
          </div>
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-slate-400" />
            EMD: {tender.emd}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            {tender.deadline}
          </div>
        </div>

        {experienceReq && (
          <p className="mt-3 text-xs text-slate-500">
            <span className="font-medium">Experience:</span> {experienceReq.label}
          </p>
        )}

        <div className="mt-4">
          <span className="text-sm font-medium text-blue-600 hover:text-blue-700">View Tender →</span>
        </div>
      </div>
    </Link>
  );
}
