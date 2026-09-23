import { Button } from "../common/Button";
import { Badge } from "../common/Badge";

type EligibilityAnalysisProps = {
  onClose: () => void;
  onStartBid: () => void;
};

export default function EligibilityAnalysis({ onClose, onStartBid }: EligibilityAnalysisProps) {
  const mockEligibilityData = {
    tenderName: "Road Development Project – Pune",
    preliminaryMatch: 82,
    requirements: [
      {
        label: "Experience",
        tenderRequires: "5 years",
        myCompany: "8 years",
        status: "match",
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
        status: "available",
      },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border rounded-xl p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">AI Eligibility Analysis</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Tender:</span>
              <span className="font-medium text-slate-900">{mockEligibilityData.tenderName}</span>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <span className="text-white text-bold">{mockEligibilityData.preliminaryMatch}%</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">Preliminary Match</p>
                <p className="text-2xl font-bold text-slate-900">{mockEligibilityData.preliminaryMatch}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="border rounded-xl p-6 bg-white">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Eligibility Requirements</h3>
        <div className="space-y-3">
          {mockEligibilityData.requirements.map((req, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">{req.label}</div>
                  <div className="text-sm text-slate-500">
                    Tender requires: {req.tenderRequires}
                  </div>
                  <div className="text-sm text-slate-500">
                    My company: {req.myCompany}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {req.status === "match" ? (
                    <Badge variant="success">
                      ✓ Requirement Appears Met
                    </Badge>
                  ) : req.status === "needsVerification" ? (
                    <Badge variant="warning">
                      ⚠ Needs Verification
                    </Badge>
                  ) : (
                    <Badge variant="error">
                      ✕ Missing
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Explanation */}
      <div className="border rounded-xl p-6 bg-white">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">AI Explanation</h3>
        <p className="text-sm text-slate-700">{mockEligibilityData.aiExplanation}</p>
      </div>

      {/* Strengths */}
      <div className="border rounded-xl p-6 bg-white">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Strengths</h3>
        <div className="space-y-2">
          {mockEligibilityData.strengths.map((strength, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-green-600">✓</span>
              <span>{strength}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attention Required */}
      <div className="border rounded-xl p-6 bg-white">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Attention Required</h3>
        <div className="space-y-2">
          {mockEligibilityData.attentionRequired.map((attention, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-amber-600">⚠</span>
              <span>{attention}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Document Evidence */}
      <div className="border rounded-xl p-6 bg-white">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Document Evidence</h3>
        <div className="space-y-4">
          {mockEligibilityData.documentEvidence.map((evidence, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="space-y-2">
                <div className="font-medium text-slate-900">Requirement:</div>
                <div className="text-sm text-slate-700">{evidence.requirement}</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-slate-900">Evidence:</div>
                <div className="text-sm text-slate-700">{evidence.evidence}</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-slate-900">Document:</div>
                <div className="text-sm text-slate-700">{evidence.document}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {evidence.status === "available" ? (
                    <Badge variant="success">
                      ✓ Available
                    </Badge>
                  ) : (
                    <Badge variant="error">
                      ✕ Missing
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <Button variant="outline" size="sm">
                  View Document
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility Breakdown */}
      <div className="border rounded-xl p-6 bg-white">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Eligibility Breakdown</h3>
        <div className="space-y-3">
          {mockEligibilityData.eligibilityBreakdown.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium text-slate-900">{item.label}</div>
              <div className="flex-1">
                <div className="bg-slate-200 h-2.5 rounded-full">
                  <div
                    className={`h-2.5 rounded-full bg-blue-600 transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-medium text-slate-900 text-right">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border rounded-xl p-6 bg-white">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            View Requirements
          </Button>
          <Button variant="outline" onClick={onClose}>
            View Missing Items
          </Button>
          <Button variant="primary" onClick={onStartBid}>
            Start Bid
          </Button>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Preliminary analysis based on available company information. Final eligibility is determined by the tender authority and tender documents.
        </p>
      </div>
    </div>
  );
}