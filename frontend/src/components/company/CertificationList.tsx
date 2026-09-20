import { Certification } from "../../types";
import { CheckCircle, AlertTriangle, XCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface CertificationListProps {
  certifications: Certification[];
  onAdd: (certification: Omit<Certification, "id">) => void;
  onDelete: (id: string) => void;
  editing: boolean;
}

export function CertificationList({ certifications, onAdd, onDelete, editing }: CertificationListProps) {
  const [showForm, setShowForm] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", issueDate: "", expiryDate: "", status: "added" as const });

  const handleAdd = () => {
    if (!newCert.name) return;
    onAdd(newCert);
    setNewCert({ name: "", issueDate: "", expiryDate: "", status: "added" });
    setShowForm(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "added":
        return { color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle size={16} />, label: "Added" };
      case "needs_update":
        return { color: "text-amber-600", bg: "bg-amber-50", icon: <AlertTriangle size={16} />, label: "Needs update" };
      default:
        return { color: "text-red-600", bg: "bg-red-50", icon: <XCircle size={16} />, label: "Missing" };
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Certifications & Registrations</h3>
          <p className="text-sm text-slate-500">Manage your certifications and registrations.</p>
        </div>
        {editing && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Certification
          </button>
        )}
      </div>

      {showForm && editing && (
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Certification Name</label>
              <input
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Issue Date</label>
              <input
                type="date"
                value={newCert.issueDate}
                onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
              <input
                type="date"
                value={newCert.expiryDate}
                onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Save
            </button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {certifications.map((cert) => {
          const statusConfig = getStatusConfig(cert.status);
          return (
            <div key={cert.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusConfig.color} ${statusConfig.bg}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{cert.name}</p>
                  {(cert.issueDate || cert.expiryDate) && (
                    <p className="text-xs text-slate-500">
                      {cert.issueDate && `Issued: ${cert.issueDate}`}
                      {cert.issueDate && cert.expiryDate && " | "}
                      {cert.expiryDate && `Expires: ${cert.expiryDate}`}
                    </p>
                  )}
                </div>
              </div>
              {editing && (
                <button
                  onClick={() => onDelete(cert.id)}
                  className="rounded-lg p-1 text-slate-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
