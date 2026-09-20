import { Link } from "react-router-dom";
import { Card } from "../common/Card";

interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  to: string;
  icon: React.ReactNode;
}

export function ActionCard({ title, description, buttonText, to, icon }: ActionCardProps) {
  return (
    <Card className="flex flex-col p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mb-4 flex-1 text-sm text-slate-500">{description}</p>
      <Link to={to}>
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
          {buttonText}
        </button>
      </Link>
    </Card>
  );
}
