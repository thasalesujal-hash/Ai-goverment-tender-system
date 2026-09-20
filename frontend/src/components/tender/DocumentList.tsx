import { Document } from "../../types";
import { FileText, ExternalLink } from "lucide-react";
import { useState } from "react";

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const [viewing, setViewing] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{doc.name}</p>
              <p className="text-xs text-slate-500">
                {doc.type.toUpperCase()} {doc.pages ? `• ${doc.pages} pages` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewing(doc.name)}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ExternalLink size={16} />
            View
          </button>
        </div>
      ))}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Viewing Document</h3>
              <button
                onClick={() => setViewing(null)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <FileText className="mx-auto mb-4 text-slate-400" size={48} />
              <p className="text-sm text-slate-600">{viewing}</p>
              <p className="mt-2 text-xs text-slate-500">
                Document preview will be available when connected to the backend.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
