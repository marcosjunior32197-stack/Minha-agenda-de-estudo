export type Priority = 'Baixa' | 'Média' | 'Alta';

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
  createdAt: string;
}

export interface PomodoroSettings {
  focusTime: number;
  breakTime: number;
}

export interface StudyData {
  subjects: Subject[];
  tasks: Task[];
  pomodoro: PomodoroSettings;
  theme: 'dark' | 'light';
}
