import { Badge } from "../common/Badge";

interface TrackingBadgeProps {
  status: "new" | "reviewing" | "saved" | "submission_pending" | "closed";
}

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  new: { label: "New", variant: "info" },
  reviewing: { label: "Reviewing", variant: "warning" },
  saved: { label: "Saved", variant: "success" },
  submission_pending: { label: "Submission Pending", variant: "warning" },
  closed: { label: "Closed", variant: "default" },
};

export function TrackingBadge({ status }: TrackingBadgeProps) {
  const config = statusConfig[status] || statusConfig.new;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
