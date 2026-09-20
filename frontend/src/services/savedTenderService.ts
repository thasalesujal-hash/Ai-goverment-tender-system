import { Tender } from "../types";
import { SavedTender } from "../types";

const STORAGE_KEY = "ata_saved_tenders";

function readSaved(): SavedTender[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSaved(items: SavedTender[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const savedTenderService = {
  async getAll(): Promise<SavedTender[]> {
    return readSaved();
  },

  async getSavedTenders(tenders: Tender[]): Promise<(Tender & { savedAt: Date; trackingStatus: SavedTender["trackingStatus"] })[]> {
    const saved = readSaved();
    const tenderMap = new Map(tenders.map((t) => [t.id, t]));
    return saved
      .map((s) => {
        const tender = tenderMap.get(s.tenderId);
        if (!tender) return null;
        return { ...tender, savedAt: new Date(s.savedAt), trackingStatus: s.trackingStatus };
      })
      .filter(Boolean) as (Tender & { savedAt: Date; trackingStatus: SavedTender["trackingStatus"] })[];
  },

  async save(tenderId: string, trackingStatus: SavedTender["trackingStatus"] = "saved"): Promise<void> {
    const saved = readSaved();
    const existing = saved.find((s) => s.tenderId === tenderId);
    if (!existing) {
      saved.push({ tenderId, savedAt: new Date().toISOString(), trackingStatus });
      writeSaved(saved);
    }
  },

  async remove(tenderId: string): Promise<void> {
    const saved = readSaved().filter((s) => s.tenderId !== tenderId);
    writeSaved(saved);
  },

  async updateTrackingStatus(tenderId: string, trackingStatus: SavedTender["trackingStatus"]): Promise<void> {
    const saved = readSaved();
    const item = saved.find((s) => s.tenderId === tenderId);
    if (item) {
      item.trackingStatus = trackingStatus;
      writeSaved(saved);
    }
  },

  async isSaved(tenderId: string): Promise<boolean> {
    const saved = readSaved();
    return saved.some((s) => s.tenderId === tenderId);
  },

  async getTrackingStatus(tenderId: string): Promise<SavedTender["trackingStatus"] | undefined> {
    const saved = readSaved();
    return saved.find((s) => s.tenderId === tenderId)?.trackingStatus;
  },
};
