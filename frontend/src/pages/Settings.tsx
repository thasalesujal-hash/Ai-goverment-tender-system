import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { User, Bell, Shield, Palette, Globe } from "lucide-react";

export default function Settings() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-600">
            Manage your account preferences and application settings.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <User size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">Account</h2>
                <p className="text-sm text-slate-500">
                  Manage your account details and preferences.
                </p>
              </div>
              <Button variant="outline">Edit</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Bell size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
                <p className="text-sm text-slate-500">
                  Configure how and when you receive alerts.
                </p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Shield size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">Privacy & Security</h2>
                <p className="text-sm text-slate-500">
                  Manage your privacy settings and security options.
                </p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Palette size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
                <p className="text-sm text-slate-500">
                  Customize the look and feel of the application.
                </p>
              </div>
              <Button variant="outline">Customize</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Globe size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">Language</h2>
                <p className="text-sm text-slate-500">
                  Choose your preferred language for the interface.
                </p>
              </div>
              <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English</option>
                <option>हिंदी</option>
                <option>मराठी</option>
              </select>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
