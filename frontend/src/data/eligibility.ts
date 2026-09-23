export const mockEligibilityData = {
  tenderName: "Road Development Project – Pune",
  preliminaryMatch: 82,
  requirements: [
    {
      label: "Experience",
      tenderRequires: "5 years",
      myCompany: "8 years",
      status: "match", // match, needsVerification, missing
    },
    {
      label: "Annual Turnover",
      tenderRequires: "₹5 Crore",
      myCompany: "₹10 Crore",
      status: "match",
    },
    {
      label: "Similar Projects",
      tenderRequires: "2 projects",
      myCompany: "4 projects",
      status: "match",
    },
    {
      label: "ISO Certification",
      tenderRequires: "ISO 9001",
      myCompany: "Available",
      status: "match",
    },
    {
      label: "EMD",
      tenderRequires: "₹17 Lakh",
      myCompany: "Not completed",
      status: "needsVerification",
    },
    {
      label: "Technical Certification",
      tenderRequires: "Required",
      myCompany: "Needs verification",
      status: "needsVerification",
    },
  ],
  aiExplanation: "Based on the tender requirements and your company profile, your company appears to meet most preliminary eligibility requirements. Some requirements still need verification before bid submission.",
  strengths: [
    "8 years experience",
    "₹10 Cr annual turnover",
    "4 similar projects",
    "ISO 9001 certification",
  ],
  attentionRequired: [
    "EMD not completed",
    "Technical certification needs verification",
  ],
  documentEvidence: [
    {
      requirement: "Similar Project Experience",
      evidence: "Pune Road Development Project",
      document: "Experience_Certificate.pdf",
      status: "available", // available, missing
    },
    // We can add more evidence for other requirements if needed, but for mock data, one example is enough.
  ],
  eligibilityBreakdown: [
    { label: "Experience", percentage: 100 },
    { label: "Turnover", percentage: 100 },
    { label: "Similar Projects", percentage: 100 },
    { label: "Certifications", percentage: 80 },
    { label: "Documents", percentage: 70 },
    { label: "Financial", percentage: 60 },
  ],
};