export interface DailyTask {
  time: string;
  focus: string;
  details: string[];
}

export interface DailyRoutine {
  morning: DailyTask;
  college: DailyTask;
  afternoon_block: DailyTask;
  evening_block: DailyTask;
  night: DailyTask;
}

export interface WeekData {
  week: number;
  phase: string;
  primary_focus: string;
  russian_task: string;
  // Optional fields as they differ between AS and A2
  nepse_project?: string;
  college_days_focus?: string;
  weekend_focus?: string;
  application_task?: string;
  visa_task?: string;
  notes?: string;
}

export interface RoadmapData {
  title: string;
  student_context: string;
  subjects: string[];
  daily_routine_template: DailyRoutine;
  weeks: WeekData[];
}