import { Notification } from "../types";
import { notifications as mockNotifications } from "../data/notifications";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    await delay(400);
    return [...mockNotifications];
  },

  async getUnreadCount(): Promise<number> {
    await delay(200);
    return mockNotifications.filter((n) => !n.read).length;
  },
};
