import React from 'react';
import { WeekData } from '../types';
import { CheckCircle2, Circle, GraduationCap, Plane, Code, Globe, AlertCircle } from 'lucide-react';

interface Props {
  data: WeekData;
  isCompleted: boolean;
  isCurrent: boolean;
  onToggle: () => void;
  index: number;
}

const WeekCard: React.FC<Props> = ({ data, isCompleted, isCurrent, onToggle }) => {
  const isExamMode = data.phase.toLowerCase().includes('exam') || data.phase.toLowerCase().includes('final');
  
  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-300 group
        ${isCurrent 
          ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 ring-2 ring-indigo-600/10' 
          : isCompleted 
            ? 'bg-slate-50 border-slate-200 opacity-60' 
            : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
        }
      `}
    >
      {isCurrent && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-bl-lg shadow-sm z-10">
          Focus
        </div>
      )}

      <div className="p-4 flex gap-4">
        {/* Checkbox Section */}
        <div className="flex-shrink-0 pt-1">
          <button 
            onClick={onToggle}
            className={`
              transition-all duration-200 active:scale-90
              ${isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}
            `}
          >
            {isCompleted 
              ? <CheckCircle2 className="w-6 h-6 fill-emerald-50" /> 
              : <Circle className="w-6 h-6" />
            }
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider">WK {data.week}</span>
            <span className={`
              text-[10px] px-1.5 py-0 rounded-full font-bold uppercase tracking-wide
              ${isExamMode 
                ? 'bg-red-50 text-red-600 border border-red-100' 
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}
            `}>
              {data.phase}
            </span>
          </div>
          
          <h3 className={`text-sm font-bold mb-3 leading-tight ${isCompleted ? 'text-slate-400 line-through decoration-2 decoration-slate-200' : 'text-slate-900'}`}>
            {data.primary_focus}
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {/* Russian Task - Keep prominent even in secondary view */}
            {data.russian_task && (
                <div className={`p-2 rounded-lg border flex gap-2 items-start ${isCurrent ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                <Globe className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-slate-600 text-xs font-medium leading-tight">{data.russian_task}</p>
                </div>
            )}

            {/* Other tasks collapsed into simple lines unless current */}
            {(data.nepse_project || data.application_task || data.visa_task) && (
              <div className="flex flex-wrap gap-2">
                {data.nepse_project && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100 text-slate-500">
                        <Code className="w-3 h-3" /> Project
                    </span>
                )}
                 {data.application_task && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100 text-slate-500">
                        <GraduationCap className="w-3 h-3" /> App
                    </span>
                )}
                 {data.visa_task && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100 text-slate-500">
                        <Plane className="w-3 h-3" /> Visa
                    </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekCard;