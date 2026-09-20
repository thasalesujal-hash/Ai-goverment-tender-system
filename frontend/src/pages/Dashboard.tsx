import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ActionCard } from "../components/dashboard/ActionCard";
import { DeadlineCard } from "../components/dashboard/DeadlineCard";
import { RecentTender } from "../components/dashboard/RecentTender";
import { StatsRow } from "../components/dashboard/StatsRow";
import { LoadingState } from "../components/common/LoadingState";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { tenderService } from "../services/tenderService";
import { savedTenderService } from "../services/savedTenderService";
import { recommendationService } from "../services/recommendationService";
import { Recommendation } from "../types";
import { Tender } from "../types";
import { Search, Bot, Star } from "lucide-react";

export default function Dashboard() {
  const [deadlines, setDeadlines] = useState<Tender[]>([]);
  const [recent, setRecent] = useState<Tender[]>([]);
  const [companyTenders, setCompanyTenders] = useState<Tender[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [upcoming, recentTenders, forCompany, saved, recs] = await Promise.all([
        tenderService.getUpcomingDeadlines(5),
        tenderService.getRecent(5),
        tenderService.getForCompany(6),
        savedTenderService.getAll(),
        recommendationService.getAll(),
      ]);
      setDeadlines(upcoming);
      setRecent(recentTenders);
      setCompanyTenders(forCompany);
      setSavedCount(saved.length);
      setRecommendations(recs);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Good morning 👋</h1>
          <p className="mt-2 text-lg text-slate-600">
            Find, understand and manage government tenders in one place.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Find Tenders"
            description="Search government tenders by title, department or location."
            buttonText="Find Tenders"
            to="/tenders"
            icon={<Search size={24} />}
          />
          <ActionCard
            title="Tender Copilot"
            description="Ask questions about tender documents."
            buttonText="Ask AI"
            to="/copilot"
            icon={<Bot size={24} />}
          />
          <ActionCard
            title="Recommended"
            description="Find tenders for your company."
            buttonText="View Matches"
            to="/recommendations"
            icon={<Star size={24} />}
          />
        </div>

        {loading ? (
          <LoadingState lines={1} />
        ) : (
          <StatsRow
            activeCount={companyTenders.length}
            newMatches={recommendations.length}
            savedCount={savedCount}
            deadlinesCount={deadlines.length}
          />
        )}

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Upcoming Deadlines</h2>
          {loading ? (
            <LoadingState lines={3} />
          ) : deadlines.length > 0 ? (
            <div className="space-y-3">
              {deadlines.map((tender) => (
                <DeadlineCard key={tender.id} tender={tender} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No upcoming deadlines.</p>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Recommended For You</h2>
          {loading ? (
            <LoadingState lines={3} />
          ) : recommendations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.slice(0, 3).map((rec) => (
                <Link key={rec.id} to={`/tenders/${rec.tenderId}`}>
                  <Card className="h-full p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          rec.matchPercentage >= 90
                            ? "bg-green-100 text-green-700"
                            : rec.matchPercentage >= 80
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <Star size={12} className="mr-1" />
                        {rec.matchPercentage}% Match
                      </span>
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-slate-900">{rec.title}</h3>
                    <p className="text-sm text-slate-500">{rec.department}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span>{rec.location}</span>
                      <span>{rec.value}</span>
                      <span>{rec.deadline}</span>
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
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No recommendations yet.</p>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">For Your Company</h2>
          <Card className="p-6">
            <p className="text-sm text-slate-600">
              Based on your profile: <strong>Construction</strong>, <strong>Maharashtra</strong>,{" "}
              <strong>₹5–20 Cr</strong>, <strong>5+ years experience</strong>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {companyTenders.length} tenders may match your profile.
            </p>
            <Link to="/recommendations">
              <Button className="mt-4">View Matches</Button>
            </Link>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Recently Added Tenders</h2>
          {loading ? (
            <LoadingState lines={3} />
          ) : recent.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Tender
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Value
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        Deadline
                      </th>
                    </tr>
                  </thead>
                  <tbody>{recent.map((tender) => <RecentTender key={tender.id} tender={tender} />)}</tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No recent tenders.</p>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
