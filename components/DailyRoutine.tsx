import React, { useState, useEffect } from 'react';
import { DailyRoutine as IDailyRoutine, WeekData, DailyTask } from '../types';
import { Calendar, Clock, ChevronDown, ChevronUp, Circle, CheckCircle2 } from 'lucide-react';

interface Props {
  routine: IDailyRoutine;
  currentWeek: WeekData | null;
  onProgressUpdate: (progress: number) => void;
  totalTasks: number;
}

const DailyRoutine: React.FC<Props> = ({ routine, currentWeek, onProgressUpdate }) => {
  const [activeTab, setActiveTab] = useState<'Weekday' | 'Saturday' | 'Sunday'>('Weekday');
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Reset or load state logic
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('scholarPathLastDailyDate');
    const savedState = localStorage.getItem('scholarPathDailyState');

    if (savedDate !== today) {
      setCompleted({});
      localStorage.setItem('scholarPathLastDailyDate', today);
    } else if (savedState) {
      setCompleted(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scholarPathDailyState', JSON.stringify(completed));
    // Calculate progress for parent
    const total = activeTab === 'Weekday' ? Object.keys(routine).length : 2; 
    const done = Object.values(completed).filter(Boolean).length;
    onProgressUpdate(done); 
  }, [completed, activeTab, routine, onProgressUpdate]);

  const toggleTask = (e: React.MouseEvent, key: string) => {
    e.stopPropagation(); // Prevent toggling expand
    setCompleted(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderTaskRow = (key: string, task: DailyTask) => {
    const isChecked = !!completed[key];
    const isExpanded = !!expanded[key];
    
    return (
      <div 
        key={key} 
        onClick={() => toggleExpand(key)}
        className={`group border rounded-xl mb-4 transition-all duration-300 overflow-hidden ${
          isChecked ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md'
        }`}
      >
        {/* Header Row */}
        <div className="p-5 flex items-start gap-4 cursor-pointer">
           {/* Checkbox */}
           <div className="pt-1" onClick={(e) => toggleTask(e, key)}>
              {isChecked ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
              ) : (
                  <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-500 transition-colors" />
              )}
           </div>

           {/* Main Content */}
           <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 tracking-wide">{task.time}</span>
             </div>
             <h4 className={`text-base font-bold transition-all ${isChecked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                {task.focus}
             </h4>
           </div>

           {/* Expand Icon */}
           <div className="pt-1 text-slate-300 group-hover:text-indigo-400 transition-colors">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
           </div>
        </div>

        {/* Expanded Content (Details) */}
        <div className={`
             bg-slate-50 border-t border-slate-100 transition-all duration-300 ease-in-out px-5
             ${isExpanded ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}
        `}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Protocol</p>
            <ul className="space-y-2">
                {task.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span className={isChecked ? 'line-through opacity-70' : ''}>{detail}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    );
  };

  // Helper to get weekend tasks from currentWeek string
  const getWeekendTasks = (day: 'Sat' | 'Sun'): {key: string, task: DailyTask}[] => {
    if (!currentWeek?.weekend_focus) return [];
    const parts = currentWeek.weekend_focus.split('|');
    const dayPart = parts.find(p => p.trim().startsWith(day));
    if (dayPart) {
      return [{
        key: `weekend_${day}`,
        task: {
             time: '09:00-12:00', 
             focus: `${day} Focus Session`,
             details: [
                 dayPart.replace(`${day}:`, '').trim(),
                 "Review weekly errors",
                 "Prepare next week's plan"
             ]
        }
      }];
    }
    return [];
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Today's Schedule
        </h3>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['Weekday', 'Saturday', 'Sunday'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                activeTab === tab 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[300px]">
        {activeTab === 'Weekday' ? (
          Object.entries(routine).map(([key, task]) => {
            return renderTaskRow(key, task);
          })
        ) : (
          // Weekend View
          getWeekendTasks(activeTab === 'Saturday' ? 'Sat' : 'Sun').length > 0 ? (
            getWeekendTasks(activeTab === 'Saturday' ? 'Sat' : 'Sun').map(item => 
              renderTaskRow(item.key, item.task)
            )
          ) : (
             <div className="flex flex-col items-center justify-center h-48 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                <p>No specific tasks for this day.</p>
             </div>
          )
        )}
      </div>
    </div>
  );
};

export default DailyRoutine;