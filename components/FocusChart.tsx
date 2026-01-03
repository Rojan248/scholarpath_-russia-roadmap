import React from 'react';

interface Props {
  progressPercent: number;
}

const FocusChart: React.FC<Props> = ({ progressPercent }) => {
  const TARGET_HOURS = 7;
  const MAX_CHART_HOURS = 8;
  
  // Calculate today's hours based on task completion %
  const currentHours = (progressPercent / 100) * TARGET_HOURS;
  
  // Get current day index (0=Sun, 1=Mon, ..., 6=Sat)
  const today = new Date().getDay();
  // Adjust to 0=Mon, 1=Tue... 6=Sun
  const adjustedToday = today === 0 ? 6 : today - 1;

  // Raw data with hours only
  const chartData = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 5.2 },
    { day: 'Wed', hours: 3.5 },
    { day: 'Thu', hours: 6.1 },
    { day: 'Fri', hours: 4.2 },
    { day: 'Sat', hours: 7.0 },
    { day: 'Sun', hours: 5.0 },
  ];

  // Update today's data point dynamically
  chartData[adjustedToday].hours = Number(currentHours.toFixed(1));

  const totalHours = chartData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-800 text-lg mb-8">Focus Hours</h3>
        
        <div className="flex items-end justify-between gap-3 h-48 relative pl-6">
            {/* Y-axis grid lines & Labels using Absolute Positioning for perfect alignment */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {[0, 2, 4, 6, 8].map((val) => {
                    const bottomPos = (val / MAX_CHART_HOURS) * 100;
                    return (
                        <div 
                            key={val} 
                            className="absolute w-full border-t border-dashed border-slate-100 left-0" 
                            style={{ bottom: `${bottomPos}%` }}
                        >
                            <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                {val}
                            </span>
                        </div>
                    );
                })}
            </div>

            {chartData.map((d, i) => {
            const isToday = i === adjustedToday;
            // Calculate height percentage based on MAX_CHART_HOURS (8)
            const heightPercent = Math.min(100, (d.hours / MAX_CHART_HOURS) * 100);

            return (
                <div key={i} className="relative flex flex-col items-center flex-1 h-full justify-end z-10 group">
                    <div 
                        className={`
                        w-full rounded-t-md transition-all duration-700 ease-out relative
                        ${isToday ? 'bg-indigo-600' : 'bg-indigo-500'}
                        hover:opacity-90
                        `}
                        style={{ height: `${heightPercent}%` }}
                    >
                         {/* Tooltip on hover */}
                         <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded transition-opacity whitespace-nowrap pointer-events-none z-20">
                            {d.hours}h
                         </div>
                    </div>
                    {/* Consistent margin for X-axis labels */}
                    <span className="text-xs font-medium text-slate-500 mt-2 text-center w-full">{d.day}</span>
                </div>
            );
            })}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm font-medium mt-6 pt-4 border-t border-slate-100">
        <span className="text-slate-500">Target: <span className="text-slate-700 font-bold">{TARGET_HOURS}h</span></span>
        <span className="text-indigo-600 font-bold">Total: {totalHours}h</span>
      </div>
    </div>
  );
};

export default FocusChart;