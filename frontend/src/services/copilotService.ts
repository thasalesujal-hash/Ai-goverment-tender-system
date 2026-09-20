const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockResponses: Record<string, { answer: string; source: string; sourceDetail: string }> = {
  "What is the EMD?": {
    answer:
      "The EMD (Earnest Money Deposit) for this tender is ₹25 Lakh. It must be submitted along with the bid in the form of a Demand Draft or Bank Guarantee.",
    source: "Tender Notice.pdf",
    sourceDetail: "Page 8, Section 3.2",
  },
  "What documents are required?": {
    answer:
      "You need to submit: (1) Tender document filled and signed, (2) EMD proof, (3) GST registration certificate, (4) Company incorporation certificate, (5) Past project experience certificates, (6) ISO certification if applicable.",
    source: "Tender Notice.pdf",
    sourceDetail: "Page 12, Section 5.1",
  },
  "What is the deadline?": {
    answer:
      "The bid submission deadline is 28 Sep 2026, 3:00 PM IST. Late submissions will not be considered.",
    source: "Tender Notice.pdf",
    sourceDetail: "Page 3, Section 2.1",
  },
  "Explain eligibility requirements": {
    answer:
      "The key eligibility requirements are: (1) Minimum 5 years experience in road construction, (2) GST registration, (3) 3 similar projects completed, (4) Minimum annual turnover of ₹5 Crore, (5) ISO 9001 certification. Your company meets most requirements. Only ISO 9001 certification is currently missing.",
    source: "Technical Specifications.pdf",
    sourceDetail: "Page 12, Section 4.2",
  },
  "Summarize this tender": {
    answer:
      "This is a road construction tender for a 45 km four-lane road from Pune to Mumbai Expressway. Estimated value is ₹12.5 Crore. Deadline is 28 Sep 2026. Requirements include 5 years experience, GST registration, 3 similar projects, and minimum turnover of ₹5 Crore.",
    source: "Tender Notice.pdf",
    sourceDetail: "Page 1-3",
  },
  "What experience is required?": {
    answer:
      "The tender requires a minimum of 5 years experience in road construction projects. You must have completed at least 3 similar projects of comparable scale.",
    source: "Technical Specifications.pdf",
    sourceDetail: "Page 10, Section 4.1",
  },
  "What is the submission deadline?": {
    answer:
      "The bid submission deadline is 28 Sep 2026, 3:00 PM IST. Bids submitted after this deadline will not be considered.",
    source: "Tender Notice.pdf",
    sourceDetail: "Page 3, Section 2.1",
  },
};

export const copilotService = {
  async sendMessage(
    _tenderId: string,
    message: string
  ): Promise<{ answer: string; source: string; sourceDetail: string }> {
    await delay(1200);
    const normalized = message.trim().toLowerCase();
    if (mockResponses[message]) {
      return { ...mockResponses[message] };
    }
    for (const key of Object.keys(mockResponses)) {
      if (normalized.includes(key.toLowerCase().replace("?", ""))) {
        return { ...mockResponses[key] };
      }
    }
    return {
      answer:
        "Based on the tender documents, this requirement is specified in the Technical Specifications section. Please refer to the relevant document for detailed information.",
      source: "Tender Document",
      sourceDetail: "Technical Specifications",
    };
  },

  async getSuggestedQuestions(_tenderId: string): Promise<string[]> {
    await delay(300);
    return [
      "Summarize this tender",
      "What is the EMD?",
      "What documents are required?",
      "What experience is required?",
      "What is the submission deadline?",
      "Explain the eligibility requirements",
    ];
  },
};
