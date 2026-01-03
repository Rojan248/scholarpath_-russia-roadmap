import React from 'react';
import { WeekData } from '../types';

interface Props {
  weeks: WeekData[];
  completedWeeks: number[];
}

const PhaseChart: React.FC<Props> = ({ weeks, completedWeeks }) => {
  // Aggregate data by phase
  const phases = weeks.reduce((acc, week) => {
    if (!acc[week.phase]) {
      acc[week.phase] = { total: 0, completed: 0 };
    }
    acc[week.phase].total += 1;
    if (completedWeeks.includes(week.week)) {
      acc[week.phase].completed += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  const phaseKeys = Object.keys(phases);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
      <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-6">Phase Performance</h3>
      
      <div className="flex flex-col gap-6">
        {phaseKeys.map((phase) => {
          const { total, completed } = phases[phase];
          const percentage = Math.round((completed / total) * 100);
          
          return (
            <div key={phase} className="space-y-3">
              <div className="flex justify-between text-base font-bold">
                <span className="text-slate-700">{phase}</span>
                <span className="text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md text-sm">{completed}/{total}</span>
              </div>
              <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-100">
                {/* Background bar */}
                <div className="absolute inset-0 bg-slate-100"></div>
                {/* Progress bar */}
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    percentage === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseChart;