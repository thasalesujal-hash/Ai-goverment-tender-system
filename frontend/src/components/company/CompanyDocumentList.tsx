import { CompanyDocument } from "../../types";
import { FileText, Upload } from "lucide-react";

interface Props {
  documents: CompanyDocument[];
}

export function CompanyDocumentList({ documents }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Company Documents</h3>
          <p className="text-sm text-slate-500">Documents will later be processed by the document intelligence pipeline.</p>
        </div>
        <button className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Upload size={16} />
          Upload Document
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <FileText size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{doc.name}</p>
              <span className={`text-xs font-medium ${
                doc.status === "added" ? "text-green-600" : "text-amber-600"
              }`}>
                {doc.status === "added" ? "✓ Added" : "⚠ Missing"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
