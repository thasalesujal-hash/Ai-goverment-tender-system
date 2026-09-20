import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/common/Card";
import { LoadingState } from "../components/common/LoadingState";
import { EmptyState } from "../components/common/EmptyState";
import { recommendationService } from "../services/recommendationService";
import { Recommendation } from "../types";
import { Star, IndianRupee, Clock, MapPin } from "lucide-react";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await recommendationService.getAll();
      setRecommendations(data);
      setLoading(false);
    }
    load();
  }, []);

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-700";
    if (percentage >= 80) return "bg-blue-100 text-blue-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recommended For You</h1>
          <p className="mt-2 text-slate-600">
            Tenders that may match your company profile.
          </p>
        </div>

        {loading ? (
          <LoadingState lines={3} />
        ) : recommendations.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec) => (
              <Link key={rec.id} to={`/tenders/${rec.tenderId}`}>
                <Card className="h-full p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getMatchColor(rec.matchPercentage)}`}
                    >
                      <Star size={12} className="mr-1" />
                      {rec.matchPercentage}% Profile Match
                    </span>
                  </div>
                  <h3 className="mb-1 text-base font-semibold text-slate-900">{rec.title}</h3>
                  <p className="text-sm text-slate-500">{rec.department}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} className="text-slate-400" />
                      {rec.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee size={16} className="text-slate-400" />
                      {rec.value}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} className="text-slate-400" />
                      {rec.deadline}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-slate-500">Why this matches:</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {rec.matchReasons.map((reason) => (
                        <span
                          key={reason}
                          className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700"
                        >
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      View Tender →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Star size={48} />}
            title="No recommendations yet"
            description="Complete your company profile to get personalized tender recommendations."
            actionLabel="Update Profile"
            onAction={() => (window.location.href = "/company")}
          />
        )}
      </div>
    </AppLayout>
  );
}
