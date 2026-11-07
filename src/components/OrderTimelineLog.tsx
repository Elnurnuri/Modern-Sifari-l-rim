import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Box, 
  Truck, 
  ArrowDown
} from 'lucide-react';
import { TimelineEvent, OrderStage } from '../types/order';

interface OrderTimelineLogProps {
  timeline: TimelineEvent[];
  currentStage: OrderStage;
}

export const OrderTimelineLog: React.FC<OrderTimelineLogProps> = ({
  timeline,
  currentStage,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Hərəkət tarixçəsi və logistika qeydləri
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Bağlamanızın keçdiyi məntəqələr və status yeniləmələri
          </p>
        </div>

        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50">
          Avtomatik Sinxronizasiya
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {timeline.map((event, index) => {
          return (
            <div key={index} className="relative group">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white transition-all ${
                  event.current
                    ? 'bg-emerald-600 text-white ring-emerald-100 scale-125 shadow-xs'
                    : event.completed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {event.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                )}
              </div>

              {/* Event Content Box */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  event.current
                    ? 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                    : event.completed
                    ? 'bg-slate-50/70 border-slate-200/80'
                    : 'bg-white border-dashed border-slate-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      event.current
                        ? 'text-emerald-900'
                        : event.completed
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {event.title}
                  </h4>

                  <span
                    className={`text-[11px] font-mono ${
                      event.current
                        ? 'text-emerald-700 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    {event.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.description}
                </p>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
