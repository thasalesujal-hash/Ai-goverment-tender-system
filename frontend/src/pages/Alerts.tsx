import { useEffect, useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/common/Card";
import { LoadingState } from "../components/common/LoadingState";
import { EmptyState } from "../components/common/EmptyState";
import { notificationService } from "../services/notificationService";
import { Notification } from "../types";
import { Bell, Clock, FileText, AlertTriangle, Sparkles } from "lucide-react";

const notificationConfig: Record<string, { icon: React.ReactNode; variant: "info" | "success" | "warning" | "danger" }> = {
  new_tender: { icon: <Sparkles size={20} />, variant: "info" },
  deadline: { icon: <Clock size={20} />, variant: "warning" },
  updated: { icon: <FileText size={20} />, variant: "info" },
  corrigendum: { icon: <AlertTriangle size={20} />, variant: "danger" },
};

export default function Alerts() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await notificationService.getAll();
      setNotifications(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Alerts</h1>
          <p className="mt-2 text-slate-600">
            Stay updated with tender notifications and important updates.
          </p>
        </div>

        {loading ? (
          <LoadingState lines={4} />
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const config = notificationConfig[notification.type] || notificationConfig.new_tender;
              return (
                <Card
                  key={notification.id}
                  className={`p-4 ${!notification.read ? "border-blue-200 bg-blue-50" : ""}`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        notification.read ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{notification.time}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Bell size={48} />}
            title="No notifications"
            description="You're all caught up! New alerts will appear here."
          />
        )}
      </div>
    </AppLayout>
  );
}
