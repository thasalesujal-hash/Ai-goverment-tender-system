import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";


import { tenderService } from "../services/tenderService";
import { savedTenderService } from "../services/savedTenderService";
import { recommendationService } from "../services/recommendationService";
import { companyService } from "../services/companyService";
import { Tender } from "../types";
import { Recommendation } from "../types";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [deadlines, setDeadlines] = useState<Tender[]>([]);
  
  const [companyTenders, setCompanyTenders] = useState<Tender[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const { user } = useAuth();
  

  useEffect(() => {
    async function load() {
      // Get company name from user or company service
      if (user?.companyName) {
        setCompanyName(user.companyName);
      } else {
        try {
          const profile = await companyService.getProfile();
          setCompanyName(profile?.name || "ABC Infrastructure");
        } catch (err) {
          setCompanyName("ABC Infrastructure");
        }
      }
      
      const [upcoming, , forCompany, saved, recs] = await Promise.all([
        tenderService.getUpcomingDeadlines(5),
        tenderService.getRecent(5),
        tenderService.getForCompany(6),
        savedTenderService.getAll(),
        recommendationService.getAll(),
      ]);
      setDeadlines(upcoming);
      
      setCompanyTenders(forCompany);
      setSavedCount(saved.length);
      setRecommendations(recs);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Good Morning, {companyName}! 👋
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Find, understand and manage government tenders with AI.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-20 bg-slate-100 rounded-lg"></div>
            <div className="h-20 bg-slate-100 rounded-lg"></div>
            <div className="h-20 bg-slate-100 rounded-lg"></div>
            <div className="h-20 bg-slate-100 rounded-lg"></div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg p-6">
              <h3 className="mb-4 text-lg font-medium text-slate-900">Active Tenders</h3>
              <p className="text-xl font-bold text-slate-900">{companyTenders.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="mb-4 text-lg font-medium text-slate-900">New Matches</h3>
              <p className="text-xl font-bold text-slate-900">{recommendations.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="mb-4 text-lg font-medium text-slate-900">Saved Tenders</h3>
              <p className="text-xl font-bold text-slate-900">{savedCount}</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="mb-4 text-lg font-medium text-slate-900">Deadlines This Week</h3>
              <p className="text-xl font-bold text-slate-900">{deadlines.length}</p>
            </div>
          </div>
        )}

        {!loading && recommendations.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Recommended For You</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.slice(0, 3).map((rec) => (
                <Link key={rec.id} to={`/tenders/${rec.tenderId}`}>
                  <div className="bg-white rounded-lg p-5">
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
                        {rec.matchPercentage}% Match
                      </span>
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-slate-900">{rec.title}</h3>
                    <p className="text-sm text-slate-500">{rec.department}</p>
                    <div className="mt-2">
                      <span className="text-sm text-slate-600">
                        {rec.location} • {rec.value} • {rec.deadline}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!loading && deadlines.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {deadlines.slice(0, 3).map((tender) => (
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-900">{tender.title}</h3>
                    <p className="text-xs text-slate-500">{tender.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
