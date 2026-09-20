import { useEffect, useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { TenderCard } from "../components/tender/TenderCard";
import { LoadingState } from "../components/common/LoadingState";
import { EmptyState } from "../components/common/EmptyState";
import { tenderService } from "../services/tenderService";
import { Tender } from "../types";
import { Search, Filter } from "lucide-react";

export default function FindTenders() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    location: "",
    status: "",
    minValue: "",
    maxValue: "",
  });

  useEffect(() => {
    async function load() {
      const data = await tenderService.getAll();
      setTenders(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = tenders.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.department.toLowerCase().includes(query.toLowerCase()) ||
      t.location.toLowerCase().includes(query.toLowerCase());
    const matchesDepartment = !filters.department || t.department === filters.department;
    const matchesLocation = !filters.location || t.location === filters.location;
    const matchesStatus = !filters.status || t.status === filters.status;
    const matchesMinValue = !filters.minValue || t.valueNumeric >= Number(filters.minValue);
    const matchesMaxValue = !filters.maxValue || t.valueNumeric <= Number(filters.maxValue);
    return matchesQuery && matchesDepartment && matchesLocation && matchesStatus && matchesMinValue && matchesMaxValue;
  });

  const departments = Array.from(new Set(tenders.map((t) => t.department)));
  const locations = Array.from(new Set(tenders.map((t) => t.location)));

  const clearFilters = () => {
    setFilters({ department: "", location: "", status: "", minValue: "", maxValue: "" });
    setQuery("");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Find Tenders</h1>
          <p className="mt-2 text-slate-600">
            Search government tenders that match your business profile.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search tender, department, location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-700">
                Clear all
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="open">New</option>
                  <option value="closing_soon">Closing Soon</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Min Value (₹)</label>
                <input
                  type="number"
                  placeholder="Min value"
                  value={filters.minValue}
                  onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Max Value (₹)</label>
                <input
                  type="number"
                  placeholder="Max value"
                  value={filters.maxValue}
                  onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingState lines={4} />
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Search size={48} />}
            title="No tenders found"
            description="Try adjusting your search or filters to find what you're looking for."
            actionLabel="Clear Search"
            onAction={() => { setQuery(""); clearFilters(); }}
          />
        )}
      </div>
    </AppLayout>
  );
}
