import React from 'react';
import { 
  Clock, 
  Package, 
  Factory, 
  Truck, 
  CheckCircle2, 
  Check 
} from 'lucide-react';
import { OrderStage } from '../types/order';
import { ORDER_STAGES, getStageIndex } from '../utils/orderTracker';

interface OrderProgressTrackerProps {
  currentStage: OrderStage;
  onSelectStage: (stage: OrderStage) => void;
}

export const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({
  currentStage,
  onSelectStage,
}) => {
  const currentIndex = getStageIndex(currentStage);

  const getIcon = (iconName: string, isCompleted: boolean, isCurrent: boolean) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Clock':
        return <Clock {...props} />;
      case 'Package':
        return <Package {...props} />;
      case 'Factory':
        return <Factory {...props} />;
      case 'Truck':
        return <Truck {...props} />;
      case 'CheckCircle2':
        return <CheckCircle2 {...props} />;
      default:
        return <Clock {...props} />;
    }
  };

  // Calculate percentage of bar completed
  const progressPercent = (currentIndex / (ORDER_STAGES.length - 1)) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80">
      {/* Title & Interactive Mode Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Sifariş statusu</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Canlı İzləmə
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Status dəyişikliyini sınaqdan keçirmək üçün aşağıdakı addımlardan birini seçə bilərsiniz
          </p>
        </div>

        {/* Quick Stage Simulator Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100/80 p-1 rounded-xl text-xs">
          <span className="px-2 py-1 text-slate-500 font-medium text-[11px]">Sınaq rejimi:</span>
          {ORDER_STAGES.map((s, idx) => (
            <button
              key={s.key}
              onClick={() => onSelectStage(s.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentStage === s.key
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title={s.labelAz}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modern 5-Step Tracker Bar */}
      <div className="relative pb-2">
        {/* Background Track Line */}
        <div className="absolute top-6 sm:top-7 left-5 right-5 sm:left-10 sm:right-10 h-1 bg-slate-100 rounded-full -translate-y-1/2 z-0" />
        
        {/* Active Progress Filled Line */}
        <div 
          className="absolute top-6 sm:top-7 left-5 sm:left-10 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full -translate-y-1/2 z-0 transition-all duration-500 ease-out"
          style={{ width: `calc(${progressPercent}% * (100% - 2.5rem) / 100)` }}
        />

        {/* Steps Container */}
        <div className="relative z-10 flex items-start justify-between">
          {ORDER_STAGES.map((stage, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;

            return (
              <button
                key={stage.key}
                onClick={() => onSelectStage(stage.key)}
                className="group flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-0.5 sm:p-1 transition-all"
                style={{ width: `${100 / ORDER_STAGES.length}%` }}
              >
                {/* Step Icon Container */}
                <div className="relative flex items-center justify-center">
                  {/* Ripple pulse for active step */}
                  {isCurrent && (
                    <span className="absolute -inset-1.5 rounded-2xl bg-emerald-500/20 animate-ping opacity-75" />
                  )}

                  <div
                    className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isCurrent
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-500/25 ring-2 sm:ring-4 ring-emerald-100 scale-105'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-500 group-hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-400 border border-slate-200 group-hover:border-slate-300 group-hover:text-slate-500'
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <Check className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
                    ) : (
                      getIcon(stage.iconName, isCompleted, isCurrent)
                    )}
                  </div>

                  {/* Completed status mini checkmark badge */}
                  {isCompleted && isCurrent && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center ring-2 ring-white">
                      <Check className="w-2 sm:w-2.5 h-2 sm:h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Step Label & Text */}
                <div className="mt-2 text-center px-0.5">
                  <span
                    className={`block text-[10px] sm:text-xs md:text-sm font-bold tracking-tight transition-colors line-clamp-1 ${
                      isCurrent
                        ? 'text-emerald-700'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.labelAz}
                  </span>
                  
                  <span className="hidden md:block text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-[120px] mx-auto">
                    {stage.shortDesc}
                  </span>

                  {/* Current Indicator badge */}
                  {isCurrent && (
                    <span className="hidden sm:inline-flex items-center gap-1 mt-1 text-[9px] sm:text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      Hazırkı
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
