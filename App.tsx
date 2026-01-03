import React, { useState, useEffect } from 'react';
import { AS_LEVEL_DATA, A2_LEVEL_DATA } from './constants';
import DailyRoutine from './components/DailyRoutine';
import WeekCard from './components/WeekCard';
import WeekFocusWidget from './components/WeekFocusWidget';
import FocusChart from './components/FocusChart';
import PhaseChart from './components/PhaseChart';
import { LayoutDashboard, Calendar, Target, GraduationCap, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'AS' | 'A2'>('AS');
  const [currentView, setCurrentView] = useState<'dashboard' | 'roadmap'>('dashboard');
  const [completedWeeks, setCompletedWeeks] = useState<{ AS: number[]; A2: number[] }>({
    AS: [],
    A2: []
  });
  const [completedDailyTasks, setCompletedDailyTasks] = useState(0);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('scholarPathProgress');
    if (saved) {
      setCompletedWeeks(JSON.parse(saved));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('scholarPathProgress', JSON.stringify(completedWeeks));
  }, [completedWeeks]);

  const activeData = activeTab === 'AS' ? AS_LEVEL_DATA : A2_LEVEL_DATA;
  const activeCompleted = activeTab === 'AS' ? completedWeeks.AS : completedWeeks.A2;
  
  const currentWeekIndex = activeData.weeks.findIndex(w => !activeCompleted.includes(w.week));
  const currentWeek = currentWeekIndex !== -1 ? activeData.weeks[currentWeekIndex] : activeData.weeks[activeData.weeks.length - 1];

  const toggleWeek = (weekNum: number) => {
    setCompletedWeeks(prev => {
      const isCompleted = prev[activeTab].includes(weekNum);
      const newTabList = isCompleted 
        ? prev[activeTab].filter(w => w !== weekNum)
        : [...prev[activeTab], weekNum];
      
      return {
        ...prev,
        [activeTab]: newTabList
      };
    });
  };

  const totalDailyTasks = Object.keys(activeData.daily_routine_template).length;
  const dailyProgressPercent = Math.round((completedDailyTasks / totalDailyTasks) * 100);
  
  // Calculate overall roadmap progress
  const roadmapProgress = Math.round((activeCompleted.length / activeData.weeks.length) * 100);

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden md:flex flex-col justify-between z-20">
        <div>
          <div className="p-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">ScholarSync</h1>
          </div>

          <div className="px-6 mb-6">
             <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-1">Current Phase</p>
                <div 
                   onClick={() => setActiveTab(activeTab === 'AS' ? 'A2' : 'AS')}
                   className="flex items-center justify-between cursor-pointer group"
                >
                    <p className="text-sm font-bold text-indigo-900 group-hover:text-indigo-700 transition-colors">
                        {activeTab === 'AS' ? 'AS-Level Domination' : 'A2-Level Mastery'}
                    </p>
                    <span className="text-xs text-indigo-400">&gt;</span>
                </div>
             </div>
          </div>

          <nav className="px-3 space-y-1">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                currentView === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('roadmap')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                currentView === 'roadmap' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Full Roadmap
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
              <Target className="w-5 h-5" />
              Goals & Uni
            </button>
          </nav>
        </div>

        {/* Target University Card - Forced Light Theme */}
        <div className="p-4 m-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
           <div className="flex justify-between items-start mb-2">
              <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Target University</p>
                  <p className="font-bold text-slate-900">HSE University</p>
              </div>
              <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${roadmapProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
                  {roadmapProgress}%
              </div>
           </div>
           <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 mb-1 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${roadmapProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                style={{ width: `${roadmapProgress}%` }}
              ></div>
           </div>
           <p className="text-[10px] text-slate-400 text-right">Real-time Preparedness</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 lg:p-10">
        
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Good Morning, Scholar.</h2>
          <div className="flex items-center gap-2 text-slate-500 mt-1 text-sm font-medium">
             <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {todayDate}</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span>Week {currentWeek?.week} of {activeData.weeks.length}</span>
          </div>
        </header>

        {currentView === 'dashboard' ? (
          <div className="space-y-6">
            
            {/* Daily Goals Banner */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm flex items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex items-center gap-4 z-10">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <Target className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Daily Goals</h3>
                        <p className="text-sm text-slate-500">{completedDailyTasks} of {totalDailyTasks} tasks completed</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 z-10">
                    <span className="text-2xl font-bold text-indigo-600">{dailyProgressPercent}%</span>
                </div>
                {/* Progress Background */}
                <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
                    <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${dailyProgressPercent}%` }}></div>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Left Column (Schedule) */}
               <div className="lg:col-span-2 space-y-6">
                  <DailyRoutine 
                    routine={activeData.daily_routine_template} 
                    currentWeek={currentWeek}
                    totalTasks={totalDailyTasks}
                    onProgressUpdate={setCompletedDailyTasks}
                  />
                  
                  {/* Phase Chart visible in dashboard too for overview */}
                   <div>
                       <PhaseChart weeks={activeData.weeks} completedWeeks={activeCompleted} />
                   </div>
               </div>

               {/* Right Column (Widgets) */}
               <div className="space-y-6">
                  {currentWeek && <WeekFocusWidget week={currentWeek} />}
                  <FocusChart progressPercent={dailyProgressPercent} />
               </div>
            </div>
          </div>
        ) : (
          /* Full Roadmap View */
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-700">All Weeks</h3>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">
                    {activeCompleted.length}/{activeData.weeks.length} Done
                </span>
             </div>
             <div className="grid grid-cols-1 gap-4">
               {activeData.weeks.map((week, idx) => (
                 <WeekCard 
                   key={week.week}
                   index={idx}
                   data={week}
                   isCompleted={activeCompleted.includes(week.week)}
                   isCurrent={currentWeek?.week === week.week}
                   onToggle={() => toggleWeek(week.week)}
                 />
               ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;