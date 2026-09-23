import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { TenderHeader } from "../components/tender/TenderHeader";
import { TenderSummary } from "../components/tender/TenderSummary";
import { ThingsToCheck } from "../components/tender/ThingsToCheck";
import { RequirementList } from "../components/tender/RequirementList";
import { EligibilityPreliminary } from "../components/tender/EligibilityPreliminary";
import { DocumentList } from "../components/tender/DocumentList";
import { LoadingState } from "../components/common/LoadingState";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/common/Button";
import { tenderService } from "../services/tenderService";
import { companyService } from "../services/companyService";
import { savedTenderService } from "../services/savedTenderService";
import { Tender, CompanyProfile } from "../types";
import { Bot, Bookmark, ArrowLeft, AlertTriangle, Radio, CheckCircle } from "lucide-react";
import { mockBidData } from "../data/bidding";
import EligibilityAnalysis from "../components/tender/EligibilityAnalysis";

type Tab = "overview" | "requirements" | "documents" | "chat";

export default function TenderDetails() {
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isSaved, setIsSaved] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isBidOpen, setIsBidOpen] = useState(false);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const [tenderData, companyData, savedStatus, trackingStatus] = await Promise.all([
        tenderService.getById(id),
        companyService.getProfile(),
        savedTenderService.isSaved(id),
        savedTenderService.getTrackingStatus(id),
      ]);
      setTender(tenderData || null);
      setCompany(companyData);
      setIsSaved(savedStatus);
      setTracking(trackingStatus === "reviewing" || trackingStatus === "submission_pending");
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSaveToggle = async () => {
    if (!id || !tender) return;
    setSaving(true);
    if (isSaved) {
      await savedTenderService.remove(id);
      setIsSaved(false);
      setTracking(false);
    } else {
      await savedTenderService.save(id);
      setIsSaved(true);
    }
    setSaving(false);
  };

  const handleTrackToggle = async () => {
    if (!id) return;
    setTracking((prev) => !prev);
    await savedTenderService.updateTrackingStatus(id, tracking ? "saved" : "reviewing");
  };

  if (loading) {
    return (
      <AppLayout>
        <LoadingState lines={5} />
      </AppLayout>
    );
  }

  if (!tender) {
    return (
      <AppLayout>
        <EmptyState
          icon={<Bot size={48} />}
          title="Tender not found"
          description="The tender you are looking for does not exist or has been removed."
          actionLabel="Find Tenders"
          onAction={() => (window.location.href = "/tenders")}
        />
      </AppLayout>
    );
  }

  const missingRequired = tender.requirements.filter((r) => !r.met && r.required).length;
  const metCount = tender.requirements.filter((r) => r.met).length;
  const totalRequirements = tender.requirements.length;
  const readinessPercentage = Math.round((metCount / totalRequirements) * 100);

  const matchReasons = [
    tender.requirements.some((r) => r.label.toLowerCase().includes("experience") && r.met) && "Experience match",
    tender.requirements.some((r) => r.label.toLowerCase().includes("gst") && r.met) && "GST available",
    tender.valueNumeric <= 200000000 && "Project value within range",
  ].filter(Boolean);

  const potentialIssues = tender.requirements.filter((r) => !r.met && r.required).map((r) => r.label);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "requirements", label: "Requirements" },
    { id: "documents", label: "Documents" },
    { id: "chat", label: "Tender Copilot" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={`/tenders`}>
            <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
              <ArrowLeft size={18} />
              Back to Tenders
            </button>
          </Link>
        </div>

        <TenderHeader tender={tender} />

<div className="flex flex-wrap gap-3">
           <Button
             variant={isSaved ? "primary" : "outline"}
             onClick={handleSaveToggle}
             disabled={saving}
           >
             <Bookmark size={18} className="mr-2" />
             {isSaved ? "Saved" : "Save Tender"}
           </Button>
           {isSaved && (
             <Button variant={tracking ? "primary" : "outline"} onClick={handleTrackToggle}>
               <Radio size={18} className="mr-2" />
               {tracking ? "Tracking ON" : "Track Tender"}
             </Button>
           )}
           <Link to={`/compare?tender=${tender.id}`}>
             <Button variant="outline">Compare</Button>
           </Link>
           <Button variant="primary" onClick={() => setIsBidOpen(!isBidOpen)}>
             Start Bid
           </Button>
<Button variant="secondary" onClick={() => setIsEligibilityOpen(!isEligibilityOpen)}>
              <CheckCircle size={18} className="mr-2" />
              Check My Eligibility
            </Button>
          </div>
         {isEligibilityOpen && (
           <EligibilityAnalysis 
             onClose={() => setIsEligibilityOpen(false)}
             onStartBid={() => {
               setIsEligibilityOpen(false);
               setIsBidOpen(true);
             }}
           />
         )}
         
         {isBidOpen && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Bid Preparation</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Tender name</span>
                  <span className="font-medium text-slate-900">{mockBidData.tender.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Tender value</span>
                  <span className="font-medium text-slate-900">{mockBidData.tender.value}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Submission deadline</span>
                  <span className="font-medium text-slate-900">{mockBidData.tender.submissionDeadline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Department</span>
                  <span className="font-medium text-slate-900">{mockBidData.tender.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Bid preparation progress</span>
                  <span className="font-medium text-slate-900">{mockBidData.finalReview.progress}%</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Eligibility</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Experience requirement</span>
                  <span className="font-medium text-slate-900">{mockBidData.eligibility.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Turnover requirement</span>
                  <span className="font-medium text-slate-900">{mockBidData.eligibility.turnover}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Similar project requirement</span>
                  <span className="font-medium text-slate-900">{mockBidData.eligibility.similarProject}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Certifications</span>
                  <span className="font-medium text-slate-900">{mockBidData.eligibility.certifications.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Preliminary Match status</span>
                  <span className={mockBidData.eligibility.matchStatus === 'Full Match' ? 'text-green-600' : mockBidData.eligibility.matchStatus === 'Partial Match' ? 'text-amber-600' : 'text-red-600'}>
                    {mockBidData.eligibility.matchStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Required Documents</h3>
              <div className="space-y-2">
                {mockBidData.requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {doc.status === 'available' ? (
                      <span className="text-green-600">✓</span>
                    ) : doc.status === 'needsVerification' ? (
                      <span className="text-amber-600">⚠</span>
                    ) : (
                      <span className="text-red-600">✕</span>
                    )}
                    <span className={doc.status === 'available' ? 'text-slate-700' : doc.status === 'needsVerification' ? 'text-slate-600' : 'text-slate-900 font-medium'}>
                      {doc.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Technical Bid</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Company Profile</h4>
                  <p className="text-sm text-slate-700">{mockBidData.technicalBid.companyProfile}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Technical Experience</h4>
                  <p className="text-sm text-slate-700">{mockBidData.technicalBid.technicalExperience}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Similar Projects</h4>
                  <p className="text-sm text-slate-700">{mockBidData.technicalBid.similarProjects.join(', ')}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Methodology</h4>
                  <p className="text-sm text-slate-700">{mockBidData.technicalBid.methodology}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Manpower</h4>
                  <p className="text-sm text-slate-700">{mockBidData.technicalBid.manpower}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Equipment</h4>
                  <p className="text-sm text-slate-700">{mockBidData.technicalBid.equipment}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Certifications</h4>
                  <p className="text-sm text-slate-700">{mockBidData.technicalBid.certifications.join(', ')}</p>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">Prepare Draft</Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Financial / BOQ</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {mockBidData.financialBoq.map((item, index) => (
                      <tr key={index} className="bg-white">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.item}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.unit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.rate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
<tfoot className="bg-slate-50">
                     <tr>
                       <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-slate-500">
                         Subtotal
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                         {mockBidData.financialBoq.reduce((sum, item) => sum + item.amount, 0)}
                       </td>
                     </tr>
<tr>
                       <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-slate-500">
                         GST (18%)
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                         {Math.round(mockBidData.financialBoq.reduce((sum, item) => sum + item.amount, 0) * 0.18)}
                       </td>
                     </tr>
<tr>
                       <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-slate-500">
                         Total Bid Value
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-bold">
                         {Math.round(mockBidData.financialBoq.reduce((sum, item) => sum + item.amount, 0) * 1.18)}
                       </td>
                     </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Compliance Checklist</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Eligibility</span>
                  <span className="font-medium text-slate-900">{mockBidData.complianceChecklist.eligibility}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Documents</span>
                  <span className="font-medium text-slate-900">{mockBidData.complianceChecklist.documents}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Technical Requirements</span>
                  <span className="font-medium text-slate-900">{mockBidData.complianceChecklist.technicalRequirements}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Financial Requirements</span>
                  <span className="font-medium text-slate-900">{mockBidData.complianceChecklist.financialRequirements}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600">Declarations</span>
                  <span className="font-medium text-slate-900">{mockBidData.complianceChecklist.declarations}%</span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600">Overall Completion</span>
                    <span className="font-medium text-slate-900">{mockBidData.finalReview.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 mt-1">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all"
                      style={{ width: `${mockBidData.finalReview.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">AI Bid Assistant</h3>
              <div className="space-y-3">
                {mockBidData.aiAssistant.questions.map((qa, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <Bot size={16} className="mt-1 text-blue-500" />
                      <div>
                        <p className="font-medium text-slate-900">{qa.question}</p>
                        <p className="text-sm text-slate-700">{qa.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Final Review</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {mockBidData.finalReview.eligibility ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✕</span>
                  )}
                  <span className="text-slate-600">Eligibility reviewed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {mockBidData.finalReview.documents ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✕</span>
                  )}
                  <span className="text-slate-600">Documents checked</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {mockBidData.finalReview.technicalBid ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✕</span>
                  )}
                  <span className="text-slate-600">Technical bid prepared</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {mockBidData.finalReview.financialBoq ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✕</span>
                  )}
                  <span className="text-slate-600">BOQ reviewed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {mockBidData.finalReview.declarations ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-red-600">✕</span>
                  )}
                  <span className="text-slate-600">Declarations checked</span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600">Preparation Progress</span>
                    <span className="font-medium text-slate-900">{mockBidData.finalReview.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 mt-1">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all"
                      style={{ width: `${mockBidData.finalReview.progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="primary">Ready for Official Submission</Button>
                </div>
                <div className="mt-4">
                  <Button variant="outline">Open Official Procurement Portal</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {tender.aiSummary && <TenderSummary summary={tender.aiSummary} />}

        {tender.thingsToCheck && tender.thingsToCheck.length > 0 && (
          <ThingsToCheck items={tender.thingsToCheck} />
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Tender Readiness</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Preliminary readiness</span>
                    <span className="text-sm font-medium text-slate-900">{readinessPercentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all"
                      style={{ width: `${readinessPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {tender.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <span className="text-green-600">✓</span>
                    ) : req.required ? (
                      <span className="text-red-600">☐</span>
                    ) : (
                      <span className="text-amber-600">⚠</span>
                    )}
                    <span className={req.met ? "text-slate-700" : req.required ? "text-slate-900 font-medium" : "text-slate-600"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
              {missingRequired > 0 && (
                <Button variant="outline" size="sm" className="mt-4">
                  View Missing Requirements
                </Button>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Why This Tender Matches Your Company</h3>
              <div className="space-y-2">
                {matchReasons.map((reason, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                    <span>✓</span>
                    {reason as string}
                  </div>
                ))}
                {potentialIssues.map((issue, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-amber-700">
                    <span>⚠</span>
                    {issue}
                  </div>
                ))}
              </div>
              <Link to="/company">
                <Button variant="outline" size="sm" className="mt-4">
                  View Company Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {company && (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Your Profile</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Experience</span>
                    <span className="font-medium text-slate-900">{company.relevantExperience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Turnover</span>
                    <span className="font-medium text-slate-900">{company.annualTurnover}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Projects</span>
                    <span className="font-medium text-slate-900">{company.similarProjects}</span>
                  </div>
                </div>
              </div>
            )}

            {tender.timeline && tender.timeline.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Tender Timeline</h3>
                <div className="space-y-4">
                  {tender.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-3 w-3 rounded-full ${
                            event.completed ? "bg-green-500" : "bg-slate-300"
                          }`}
                        />
                        {index < tender.timeline!.length - 1 && (
                          <div
                            className={`h-8 w-0.5 ${
                              event.completed ? "bg-green-200" : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${event.completed ? "text-slate-900" : "text-slate-500"}`}>
                          {event.label}
                        </p>
                        <p className="text-xs text-slate-500">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex gap-6 overflow-x-auto px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                  {tab.id === "requirements" && missingRequired > 0 && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      <AlertTriangle size={12} />
                      {missingRequired}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">Tender Description</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{tender.description}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">Important Dates</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">Submission Deadline</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{tender.deadline}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">EMD Submission</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{tender.emd}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">Basic Information</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">Department</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{tender.department}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{tender.location}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">Estimated Value</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{tender.value}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-500">Tender ID</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{tender.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requirements" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Tender Requirements</h3>
                <p className="text-sm text-slate-500">
                  {totalRequirements} requirements identified • {metCount} met • {missingRequired} missing
                </p>
                <RequirementList requirements={tender.requirements} />
                {company && (
                  <EligibilityPreliminary tender={tender} company={company} />
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Tender Documents</h3>
                  <Link to={`/tenders/${tender.id}/chat`}>
                    <Button size="sm">
                      <Bot size={16} className="mr-1" />
                      Ask AI About Documents
                    </Button>
                  </Link>
                </div>
                <DocumentList documents={tender.documents} />
              </div>
            )}

            {activeTab === "chat" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Tender Copilot</h3>
                <p className="text-sm text-slate-600">
                  Ask any question about this tender and our AI will help you find answers from the
                  documents.
                </p>
                <Link to={`/tenders/${tender.id}/chat`}>
                  <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700">
                    <Bot size={18} />
                    Open Tender Copilot
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}