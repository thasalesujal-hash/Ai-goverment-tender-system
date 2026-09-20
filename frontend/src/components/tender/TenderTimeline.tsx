import { TimelineEvent } from "../../types";
import { CheckCircle, Circle } from "lucide-react";

interface TenderTimelineProps {
  events: TimelineEvent[];
}

export function TenderTimeline({ events }: TenderTimelineProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-6 text-lg font-semibold text-slate-900">Tender Timeline</h3>
      <div className="space-y-0">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  event.completed ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                }`}
              >
                {event.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
              </div>
              {index < events.length - 1 && (
                <div
                  className={`h-8 w-0.5 ${
                    event.completed ? "bg-green-200" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
            <div className="pb-6">
              <p
                className={`text-sm font-medium ${
                  event.completed ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {event.label}
              </p>
              <p className="text-xs text-slate-500">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
