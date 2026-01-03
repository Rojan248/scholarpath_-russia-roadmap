import React from 'react';
import { WeekData } from '../types';
import { BookOpen, Globe, CheckCircle2 } from 'lucide-react';

interface Props {
  week: WeekData;
}

const WeekFocusWidget: React.FC<Props> = ({ week }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        This Week's Focus
      </h3>

      <div className="space-y-6">
        {/* Primary Focus */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">PRIMARY</p>
          <p className="text-sm font-medium text-slate-900 leading-relaxed">
            {week.primary_focus}
          </p>
        </div>

        {/* Russian Focus */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">RUSSIAN</p>
          <p className="text-sm font-medium text-slate-900 leading-relaxed">
            {week.russian_task}
          </p>
        </div>

        {/* Deliverable/Phase */}
        <div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">DELIVERABLE</p>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-3 items-start">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-emerald-800 leading-snug">
              Complete weekly goals for {week.phase} phase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekFocusWidget;