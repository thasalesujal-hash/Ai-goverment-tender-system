import { Link } from "react-router-dom";
import { Button } from "../common/Button";

interface EligibilityCheckProps {
  tenderId: string;
  missingCount: number;
}

export function EligibilityCheck({ tenderId, missingCount }: EligibilityCheckProps) {
  return (
    <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6">
      <h3 className="mb-2 text-lg font-semibold text-slate-900">Check My Eligibility</h3>
      <p className="mb-4 text-sm text-slate-600">
        Compare your company profile with this tender&apos;s requirements.
      </p>
      {missingCount > 0 && (
        <p className="mb-4 text-sm text-amber-700">
          Note: You have {missingCount} requirement{missingCount !== 1 ? "s" : ""} that need{" "}
          attention.
        </p>
      )}
      <Link to={`/tenders/${tenderId}/eligibility`}>
        <Button size="lg" className="w-full sm:w-auto">
          Check My Eligibility
        </Button>
      </Link>
    </div>
  );
}
