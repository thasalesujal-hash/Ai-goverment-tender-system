import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/common/Card";
import { LoadingState } from "../components/common/LoadingState";
import { tenderService } from "../services/tenderService";
import { Tender } from "../types";
import { Bot, MessageSquare } from "lucide-react";

export default function Chat() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await tenderService.getAll();
      setTenders(data);
      setLoading(false);
    }
    load();
  }, []);

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
          <h1 className="text-3xl font-bold text-slate-900">AI Assistant</h1>
          <p className="mt-2 text-slate-600">
            Select a tender to ask questions about its documents.
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
              <p className="text-sm text-slate-500">
                Select a tender below and ask any question about its requirements, documents, or
                eligibility criteria.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tenders.map((tender) => (
            <Link key={tender.id} to={`/tenders/${tender.id}/chat`}>
              <Card className="h-full p-5 hover:shadow-md">
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare className="text-blue-600" size={20} />
                  <h3 className="text-sm font-semibold text-slate-900">{tender.title}</h3>
                </div>
                <p className="text-xs text-slate-500">{tender.department}</p>
                <p className="mt-3 text-sm font-medium text-blue-600">Open Chat →</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
