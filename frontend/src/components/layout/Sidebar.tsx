import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Star,
  Bookmark,
  GitCompare,
  Bot,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/tenders", label: "Find Tenders", icon: Search },
  { path: "/recommendations", label: "Recommended", icon: Star },
  { path: "/saved", label: "Saved Tenders", icon: Bookmark },
  { path: "/compare", label: "Compare", icon: GitCompare },
  { path: "/copilot", label: "Tender Copilot", icon: Bot },
  { path: "/company", label: "My Company", icon: Building2 },
];

export function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 rounded-lg bg-white p-2 shadow-md md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 -translate-x-full bg-slate-900 transition-transform duration-200 md:translate-x-0 ${mobileOpen ? "translate-x-0" : ""}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6">
            <Bot className="mr-3 text-blue-400" size={28} />
            <span className="text-lg font-bold text-white">AI Tender Assistant</span>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <p className="text-xs text-slate-500">© 2026 AI Tender Assistant</p>
          </div>
        </div>
      </aside>
    </>
  );
}
