import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { LoadingState } from "../components/common/LoadingState";
import { EmptyState } from "../components/common/EmptyState";
import { savedTenderService } from "../services/savedTenderService";
import { tenderService } from "../services/tenderService";
import { Tender } from "../types";
import { BookmarkX, Trash2, ExternalLink } from "lucide-react";

export default function SavedTenders() {
  const [savedTenders, setSavedTenders] = useState<(Tender & { savedAt: Date; trackingStatus: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const allTenders = await tenderService.getAll();
      const saved = await savedTenderService.getSavedTenders(allTenders);
      setSavedTenders(saved);
      setLoading(false);
    }
    load();
  }, []);

  const handleRemove = async (tenderId: string) => {
    await savedTenderService.remove(tenderId);
    setSavedTenders((prev) => prev.filter((t) => t.id !== tenderId));
  };

  if (loading) {
    return (
      <AppLayout>
        <LoadingState lines={4} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Saved Tenders</h1>
          <p className="mt-2 text-slate-600">Tenders you are interested in.</p>
        </div>

        {savedTenders.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedTenders.map((tender) => (
              <Card key={tender.id} className="flex flex-col p-5">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-base font-semibold text-slate-900">{tender.title}</h3>
                </div>
                <p className="text-sm text-slate-500">{tender.department}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span>{tender.location}</span>
                  <span>{tender.value}</span>
                  <span>{tender.deadline}</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Link to={`/tenders/${tender.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink size={14} className="mr-1" />
                      View Tender
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(tender.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookmarkX size={48} />}
            title="No saved tenders"
            description="You haven't saved any tenders yet. Browse tenders and save the ones you're interested in."
            actionLabel="Find Tenders"
            onAction={() => (window.location.href = "/tenders")}
          />
        )}
      </div>
    </AppLayout>
  );
}
