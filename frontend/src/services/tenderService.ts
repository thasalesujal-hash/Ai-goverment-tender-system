import { Tender } from "../types";
import { tenders as mockTenders } from "../data/tenders";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const tenderService = {
  async getAll(): Promise<Tender[]> {
    await delay(600);
    return [...mockTenders];
  },

  async getById(id: string): Promise<Tender | undefined> {
    await delay(400);
    return mockTenders.find((t) => t.id === id);
  },

  async search(query: string): Promise<Tender[]> {
    await delay(500);
    const q = query.toLowerCase();
    return mockTenders.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
    );
  },

  async getUpcomingDeadlines(limit = 5): Promise<Tender[]> {
    await delay(400);
    return mockTenders
      .filter((t) => t.status !== "closed")
      .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime())
      .slice(0, limit);
  },

  async getRecent(limit = 5): Promise<Tender[]> {
    await delay(400);
    return [...mockTenders].slice(0, limit);
  },

  async getForCompany(limit = 6): Promise<Tender[]> {
    await delay(500);
    return [...mockTenders].slice(0, limit);
  },
};
