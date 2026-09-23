import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  X,
  ChevronDown,
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    async function load() {
      const data = await notificationService.getAll();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    }
    load();
  }, []);

  const handleLogout = () => {
    logout();
    // logout function already redirects to /login
  };

  const companyName = user?.companyName || 'ABC Infrastructure Pvt. Ltd.';
  const accountType = 'Business Account';

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side - Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
              <Bell size={18} />
            </div>
            <span className="font-semibold text-slate-900">AI Tender Assistant</span>
          </Link>
        </div>

        {/* Right Side - Notifications and Company Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="relative p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 border border-white">
                </span>
              )}
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setOpen(false)}></div>
                <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-slate-200 bg-white shadow-lg">
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-900">{t('header.notifications')}</h3>
                      <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                            <div className="flex h-8 w-8 items-center justify-center">
                              <Bell size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-slate-700 line-clamp-1">{notification.message}</p>
                              <p className="text-xs text-slate-500">{notification.time}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-sm text-slate-500">
                          {t('header.noNotifications')}
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <Link
                        to="/notifications"
                        onClick={() => setOpen(false)}
                        className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {t('header.viewAllNotifications')}
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Company Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              {/* Avatar: using first letter of company name */}
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500 text-white">
                {companyName.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900 truncate w-24">{companyName}</span>
                <span className="text-xs text-slate-500">{accountType}</span>
              </div>
              <ChevronDown size={4} className="ml-1 text-slate-400" />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)}></div>
                <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg">
                  <div className="py-2">
                    <Link
                      to="/company"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {t('navigation.myCompany')}
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {t('navigation.settings')}
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setProfileOpen(false); }}
                      className="block w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {t('auth.logout') || 'Logout'}
                    </button>
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