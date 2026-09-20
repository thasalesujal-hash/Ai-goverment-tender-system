export interface Tender {
  id: string;
  title: string;
  department: string;
  location: string;
  value: string;
  valueNumeric: number;
  deadline: string;
  deadlineDate: Date;
  status: "open" | "closing_soon" | "closed";
  emd: string;
  description: string;
  requirements: Requirement[];
  documents: Document[];
  timeline?: TimelineEvent[];
  aiSummary?: AISummary;
  thingsToCheck?: string[];
}

export interface Requirement {
  label: string;
  met: boolean;
  required: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  pages?: number;
}

export interface TimelineEvent {
  label: string;
  date: string;
  completed: boolean;
}

export interface AISummary {
  whatIsThis: string;
  estimatedValue: string;
  deadline: string;
  location: string;
  whoCanApply: string;
  importantDocuments: string[];
}

export interface Recommendation {
  id: string;
  tenderId: string;
  title: string;
  department: string;
  location: string;
  value: string;
  deadline: string;
  matchPercentage: number;
  matchReasons: string[];
}

export interface Notification {
  id: string;
  type: "new_tender" | "deadline" | "updated" | "corrigendum";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface CompanyProfile {
  name: string;
  legalName: string;
  companyType: string;
  industry: string;
  yearEstablished: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber: string;
  panNumber: string;
  cinNumber: string;
  msmeNumber: string;
  contractorRegistrationNumber: string;
  capabilities: string[];
  annualTurnover: string;
  averageTurnover3Years: string;
  workingCapital: string;
  maximumProjectValue: string;
  yearsInBusiness: number;
  relevantExperience: number;
  similarProjects: number;
  governmentProjects: number;
  largestProject: string;
  certifications: string[];
  profileCompletion: number;
}

export interface Certification {
  id: string;
  name: string;
  issueDate: string;
  expiryDate: string;
  status: "added" | "missing" | "needs_update";
}

export interface PastProject {
  id: string;
  name: string;
  client: string;
  category: string;
  value: string;
  startDate: string;
  completionDate: string;
  location: string;
  description: string;
  contractType: string;
  status: "completed" | "ongoing";
}

export interface CompanyDocument {
  id: string;
  name: string;
  status: "added" | "missing";
}

export interface TenderPreference {
  preferredStates: string[];
  preferredCategories: string[];
  minimumValue: string;
  maximumValue: string;
  preferredDepartments: string[];
  preferredLocations: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
  sourceDetail?: string;
  timestamp: Date;
}

export interface SavedTender {
  tenderId: string;
  savedAt: string;
  trackingStatus: "new" | "reviewing" | "saved" | "submission_pending" | "closed";
}
