import { useEffect, useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "../components/common/Button";
import { LoadingState } from "../components/common/LoadingState";
import { Toast } from "../components/common/Toast";
import { CompanyHeader } from "../components/company/CompanyHeader";
import { CompanyInformation } from "../components/company/CompanyInformation";
import { RegistrationDetails } from "../components/company/RegistrationDetails";
import { CapabilitySelector } from "../components/company/CapabilitySelector";
import { FinancialInformation } from "../components/company/FinancialInformation";
import { ExperienceSection } from "../components/company/ExperienceSection";
import { CertificationList } from "../components/company/CertificationList";
import { PastProjectList } from "../components/company/PastProjectList";
import { CompanyDocumentList } from "../components/company/CompanyDocumentList";
import { TenderPreferences } from "../components/company/TenderPreferences";
import { ProfileCompletion } from "../components/company/ProfileCompletion";
import { MatchingInfoCard } from "../components/company/MatchingInfoCard";
import { companyService } from "../services/companyService";
import { CompanyProfile, Certification, PastProject, CompanyDocument, TenderPreference } from "../types";
import { Edit3, Save, X } from "lucide-react";

export default function Company() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [initialProfile, setInitialProfile] = useState<CompanyProfile | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<PastProject[]>([]);
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [preferences, setPreferences] = useState<TenderPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function load() {
      const [profileData, certs, projectsData, docs, prefs] = await Promise.all([
        companyService.getProfile(),
        companyService.getCertifications(),
        companyService.getPastProjects(),
        companyService.getCompanyDocuments(),
        companyService.getTenderPreferences(),
      ]);
      setProfile(profileData);
      setInitialProfile(profileData);
      setCertifications(certs);
      setProjects(projectsData);
      setDocuments(docs);
      setPreferences(prefs);
      setLoading(false);
    }
    load();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await companyService.updateProfile(profile);
    setInitialProfile(profile);
    setEditing(false);
    setSaving(false);
    setToast({ message: "Company profile updated successfully!", type: "success" });
  };

  const handleProfileChange = (field: keyof CompanyProfile, value: string | number | string[]) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleAddCertification = async (cert: Omit<Certification, "id">) => {
    const newCert = await companyService.addCertification(cert);
    setCertifications((prev) => [...prev, newCert]);
    setToast({ message: "Certification added successfully!", type: "success" });
  };

  const handleDeleteCertification = async (id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
    setToast({ message: "Certification removed.", type: "success" });
  };

  const handleAddProject = async (project: Omit<PastProject, "id">) => {
    const newProject = await companyService.addPastProject(project);
    setProjects((prev) => [...prev, newProject]);
    setToast({ message: "Project added successfully!", type: "success" });
  };

  const handleUpdateProject = async (id: string, updates: Partial<PastProject>) => {
    const updated = await companyService.updatePastProject(id, updates);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    setToast({ message: "Project updated successfully!", type: "success" });
  };

  const handleDeleteProject = async (id: string) => {
    await companyService.deletePastProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setToast({ message: "Project deleted.", type: "success" });
  };

  const handlePreferencesChange = (updates: Partial<TenderPreference>) => {
    setPreferences((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const completedItems = [
    "Company information",
    "Registrations",
    "Financial information",
    "Experience",
    "Capabilities",
  ];

  const incompleteItems = [
    "Add 2 past projects",
    "Upload experience certificate",
    "Add government registration",
  ];

  if (loading) {
    return (
      <AppLayout>
        <LoadingState lines={5} />
      </AppLayout>
    );
  }

  if (!profile || !preferences) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Company</h1>
            <p className="mt-2 text-slate-600">
              Manage your company information to improve tender matching and eligibility analysis.
            </p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  <Save size={18} className="mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X size={18} className="mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleEdit}>
                <Edit3 size={18} className="mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <CompanyHeader profile={profile} />

        <ProfileCompletion
          completion={profile.profileCompletion}
          completedItems={completedItems}
          incompleteItems={incompleteItems}
        />

        <MatchingInfoCard />

        <CompanyInformation
          profile={profile}
          onChange={handleProfileChange}
          editing={editing}
        />

        <RegistrationDetails
          profile={profile}
          editing={editing}
          onChange={handleProfileChange}
        />

        <CapabilitySelector
          capabilities={profile.capabilities}
          onChange={(capabilities) => handleProfileChange("capabilities", capabilities)}
          editing={editing}
        />

        <FinancialInformation
          profile={profile}
          onChange={handleProfileChange}
          editing={editing}
        />

        <ExperienceSection
          profile={profile}
          onChange={handleProfileChange}
          editing={editing}
        />

        <CertificationList
          certifications={certifications}
          onAdd={handleAddCertification}
          onDelete={handleDeleteCertification}
          editing={editing}
        />

        <PastProjectList
          projects={projects}
          onAdd={handleAddProject}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
          editing={editing}
        />

        <CompanyDocumentList documents={documents} />

        <TenderPreferences
          preferences={preferences}
          onChange={handlePreferencesChange}
          editing={editing}
        />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AppLayout>
  );
}
