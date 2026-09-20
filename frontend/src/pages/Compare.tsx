import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { LoadingState } from "../components/common/LoadingState";
import { EmptyState } from "../components/common/EmptyState";
import { tenderService } from "../services/tenderService";
import { Tender } from "../types";
import { GitCompare, X, ExternalLink } from "lucide-react";

export default function Compare() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await tenderService.getAll();
      setTenders(data);
      setLoading(false);
    }
    load();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((s) => s !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const selectedTenders = tenders.filter((t) => selected.includes(t.id));

  const comparisonFields = [
    { label: "Estimated Value", key: "value" as const },
    { label: "EMD", key: "emd" as const },
    { label: "Deadline", key: "deadline" as const },
    { label: "Department", key: "department" as const },
    { label: "Location", key: "location" as const },
    { label: "Status", key: "status" as const },
  ];

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
          <h1 className="text-3xl font-bold text-slate-900">Compare Tenders</h1>
          <p className="mt-2 text-slate-600">
            Select up to 3 tenders to compare side by side.
          </p>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              {selected.length} tender{selected.length !== 1 ? "s" : ""} selected
            </p>
            <Button size="sm" onClick={() => setSelected([])}>
              Clear Selection
            </Button>
          </div>
        )}

        {selected.length >= 2 && (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                      Field
                    </th>
                    {selectedTenders.map((tender) => (
                      <th key={tender.id} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                        {tender.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFields.map((field) => (
                    <tr key={field.key} className="border-b border-slate-100">
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">{field.label}</td>
                      {selectedTenders.map((tender) => (
                        <td key={tender.id} className="px-4 py-3 text-sm text-slate-900">
                          {tender[field.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">Actions</td>
                    {selectedTenders.map((tender) => (
                      <td key={tender.id} className="px-4 py-3">
                        <Link to={`/tenders/${tender.id}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink size={14} className="mr-1" />
                            View Tender
                          </Button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tenders.map((tender) => {
            const isSelected = selected.includes(tender.id);
            return (
              <Card
                key={tender.id}
                className={`p-5 ${
                  isSelected ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-base font-semibold text-slate-900">{tender.title}</h3>
                  {isSelected && (
                    <button
                      onClick={() => toggleSelect(tender.id)}
                      className="rounded-full bg-blue-100 p-1 text-blue-600 hover:bg-blue-200"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-500">{tender.department}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span>{tender.location}</span>
                  <span>{tender.value}</span>
                  <span>{tender.deadline}</span>
                </div>
                <div className="mt-4">
                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    onClick={() => toggleSelect(tender.id)}
                    className="w-full"
                  >
                    <GitCompare size={14} className="mr-1" />
                    {isSelected ? "Selected" : "Compare"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {tenders.length === 0 && (
          <EmptyState
            icon={<GitCompare size={48} />}
            title="No tenders available"
            description="There are no tenders to compare at the moment."
          />
        )}
      </div>
    </AppLayout>
  );
}
