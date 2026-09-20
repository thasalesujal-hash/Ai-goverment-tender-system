const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockResponses: Record<string, { answer: string; source: string }> = {
  "What is the EMD?": {
    answer:
      "The EMD (Earnest Money Deposit) for this tender is ₹25 Lakh. It must be submitted along with the bid in the form of a Demand Draft or Bank Guarantee.",
    source: "Tender Notice — Section 3",
  },
  "What documents are required?": {
    answer:
      "You need to submit: (1) Tender document filled and signed, (2) EMD proof, (3) GST registration certificate, (4) Company incorporation certificate, (5) Past project experience certificates, (6) ISO certification if applicable.",
    source: "Tender Notice — Section 5",
  },
  "What is the deadline?": {
    answer:
      "The bid submission deadline is 28 Sep 2026, 3:00 PM IST. Late submissions will not be considered.",
    source: "Tender Notice — Section 2",
  },
  "Explain eligibility requirements": {
    answer:
      "The key eligibility requirements are: (1) Minimum 5 years experience in road construction, (2) GST registration, (3) 3 similar projects completed, (4) Minimum annual turnover of ₹5 Crore, (5) ISO 9001 certification. Your company meets most requirements. Only ISO 9001 certification is currently missing.",
    source: "Technical Specifications — Page 12",
  },
};

export const chatService = {
  async sendMessage(
    _tenderId: string,
    message: string
  ): Promise<{ answer: string; source: string }> {
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
      source: "Tender Document — Technical Specifications",
    };
  },

  async getSuggestedQuestions(_tenderId: string): Promise<string[]> {
    await delay(300);
    return [
      "What is the EMD?",
      "What documents do I need?",
      "What is the deadline?",
      "What experience is required?",
    ];
  },
};
