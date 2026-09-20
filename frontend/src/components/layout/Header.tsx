import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, X, Check, Clock, FileText, AlertTriangle, Sparkles } from "lucide-react";
import { notificationService } from "../../services/notificationService";
import { Notification } from "../../types";

const notificationConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  new_tender: { icon: <Sparkles size={18} />, color: "text-blue-600 bg-blue-100" },
  deadline: { icon: <Clock size={18} />, color: "text-amber-600 bg-amber-100" },
  updated: { icon: <FileText size={18} />, color: "text-blue-600 bg-blue-100" },
  corrigendum: { icon: <AlertTriangle size={18} />, color: "text-red-600 bg-red-100" },
};

export function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function load() {
      const data = await notificationService.getAll();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    }
    load();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">AI Tender Assistant</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => {
                        const config = notificationConfig[notification.type] || notificationConfig.new_tender;
                        return (
                          <div
                            key={notification.id}
                            className={`border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.color}`}
                              >
                                {config.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <h4 className="text-sm font-medium text-slate-900">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-slate-400 hover:text-slate-600"
                                    >
                                      <Check size={14} />
                                    </button>
                                  )}
                                </div>
                                <p className="mt-1 text-xs text-slate-600">{notification.message}</p>
                                <p className="mt-1 text-xs text-slate-400">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2">
                    <Link
                      to="/alerts"
                      onClick={() => setOpen(false)}
                      className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View All Alerts
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
