import { Recommendation } from "../types";
import { recommendations as mockRecommendations } from "../data/recommendations";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const recommendationService = {
  async getAll(): Promise<Recommendation[]> {
    await delay(700);
    return [...mockRecommendations];
  },
};
