import { CompanyProfile, Certification, PastProject, CompanyDocument, TenderPreference } from "../types";
import { mockCompanyProfile } from "../data/company";
import { certifications as mockCertifications } from "../data/certifications";
import { pastProjects as mockProjects } from "../data/projects";
import { companyDocuments as mockDocuments } from "../data/companyDocuments";
import { tenderPreferences as mockPreferences } from "../data/preferences";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const companyService = {
  async getProfile(): Promise<CompanyProfile> {
    await delay(400);
    return { ...mockCompanyProfile };
  },

  async updateProfile(profile: Partial<CompanyProfile>): Promise<CompanyProfile> {
    await delay(600);
    return { ...mockCompanyProfile, ...profile };
  },

  async getCertifications(): Promise<Certification[]> {
    await delay(300);
    return [...mockCertifications];
  },

  async addCertification(cert: Omit<Certification, "id">): Promise<Certification> {
    await delay(400);
    return { ...cert, id: `cert-${Date.now()}` };
  },

  async getPastProjects(): Promise<PastProject[]> {
    await delay(300);
    return [...mockProjects];
  },

  async addPastProject(project: Omit<PastProject, "id">): Promise<PastProject> {
    await delay(400);
    return { ...project, id: `proj-${Date.now()}` };
  },

  async updatePastProject(id: string, project: Partial<PastProject>): Promise<PastProject> {
    await delay(400);
    const existing = mockProjects.find((p) => p.id === id);
    return { ...existing, ...project } as PastProject;
  },

  async deletePastProject(_id: string): Promise<void> {
    await delay(300);
  },

  async getCompanyDocuments(): Promise<CompanyDocument[]> {
    await delay(300);
    return [...mockDocuments];
  },

  async getTenderPreferences(): Promise<TenderPreference> {
    await delay(300);
    return { ...mockPreferences };
  },

  async updateTenderPreferences(preferences: Partial<TenderPreference>): Promise<TenderPreference> {
    await delay(400);
    return { ...mockPreferences, ...preferences };
  },
};
