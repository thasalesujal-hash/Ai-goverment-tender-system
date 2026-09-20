import { PastProject } from "../../types";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";

interface PastProjectListProps {
  projects: PastProject[];
  onAdd: (project: Omit<PastProject, "id">) => void;
  onUpdate: (id: string, project: Partial<PastProject>) => void;
  onDelete: (id: string) => void;
  editing: boolean;
}

export function PastProjectList({ projects, onAdd, onUpdate, onDelete, editing }: PastProjectListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    category: "",
    value: "",
    startDate: "",
    completionDate: "",
    location: "",
    description: "",
    contractType: "",
    status: "completed" as "completed" | "ongoing",
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      client: "",
      category: "",
      value: "",
      startDate: "",
      completionDate: "",
      location: "",
      description: "",
      contractType: "",
      status: "completed",
    });
  };

  const handleAdd = () => {
    if (!formData.name || !formData.client) return;
    onAdd(formData);
    resetForm();
  };

  const handleEdit = (project: PastProject) => {
    setFormData({
      name: project.name,
      client: project.client,
      category: project.category,
      value: project.value,
      startDate: project.startDate,
      completionDate: project.completionDate,
      location: project.location,
      description: project.description,
      contractType: project.contractType,
      status: project.status,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name) return;
    onUpdate(editingId, formData);
    resetForm();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Past Projects</h3>
          <p className="text-sm text-slate-500">Add completed projects to demonstrate your experience.</p>
        </div>
        {editing && (
          <button
            onClick={() => { setEditingId(null); setShowForm(true); }}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Project
          </button>
        )}
      </div>

      {showForm && editing && (
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Project Name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Client / Department</label>
              <input
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Project Category</label>
              <input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Project Value</label>
              <input
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Completion Date</label>
              <input
                type="date"
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Contract Type</label>
              <input
                value={formData.contractType}
                onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={editingId ? handleUpdate : handleAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              {editingId ? "Update" : "Save"}
            </button>
            <button onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="rounded-lg border border-slate-200 p-4">
            <div className="mb-2 flex items-start justify-between">
              <h4 className="text-sm font-semibold text-slate-900">{project.name}</h4>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                project.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              }`}>
                {project.status}
              </span>
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              <p><span className="font-medium">Client:</span> {project.client}</p>
              <p><span className="font-medium">Category:</span> {project.category}</p>
              <p><span className="font-medium">Value:</span> {project.value}</p>
              <p><span className="font-medium">Completed:</span> {project.completionDate}</p>
            </div>
            {editing && (
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleEdit(project)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                  <Edit2 size={14} />
                  Edit
                </button>
                <button onClick={() => onDelete(project.id)} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
