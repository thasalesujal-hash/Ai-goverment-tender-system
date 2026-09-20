import { AISummary } from "../types";
import { tenders } from "../data/tenders";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const summaryService = {
  async getSummary(tenderId: string): Promise<AISummary | undefined> {
    await delay(600);
    return tenders.find((t) => t.id === tenderId)?.aiSummary;
  },
};
