/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Timer, 
  Calendar as CalendarIcon,
  Moon, 
  Sun, 
  Plus, 
  Trash2, 
  ChevronRight,
  Clock,
  Award,
  Settings,
  Bell,
  MoreVertical,
  Circle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Subject, Task, Priority, StudyData } from './types';

// Constants
const SUBJECT_COLORS = [
  'bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500', 
  'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500',
  'bg-blue-500', 'bg-rose-500'
];

const INITIAL_DATA: StudyData = {
  subjects: [
    { id: '1', name: 'Português', color: 'bg-indigo-500' },
    { id: '2', name: 'Matemática', color: 'bg-emerald-500' },
  ],
  tasks: [],
  pomodoro: { focusTime: 25, breakTime: 5 },
  theme: 'dark'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subjects' | 'tasks' | 'pomodoro'>('dashboard');
  const [data, setData] = useState<StudyData>(() => {
    const saved = localStorage.getItem('academia_study_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence
  useEffect(() => {
    localStorage.setItem('academia_study_data', JSON.stringify(data));
  }, [data]);

  // Theme support
  useEffect(() => {
    if (data.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data.theme]);

  const toggleTheme = () => {
    setData(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  // Helper functions
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const toggleTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const addSubject = (name: string, color: string) => {
    const newSubject: Subject = { id: crypto.randomUUID(), name, color };
    setData(prev => ({ ...prev, subjects: [...prev.subjects, newSubject] }));
  };

  const deleteSubject = (id: string) => {
    setData(prev => ({ 
      ...prev, 
      subjects: prev.subjects.filter(s => s.id !== id),
      tasks: prev.tasks.filter(t => t.subjectId !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 dark:text-zinc-100 transition-theme font-sans selection:bg-indigo-500/30">
      {/* Sidebar navigation */}
      <aside className={`fixed top-0 left-0 h-full bg-[#09090B] border-r border-zinc-800 transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <BookOpen size={20} />
          </div>
          {isSidebarOpen && <h1 className="font-semibold text-lg tracking-tight italic">StudyFlow</h1>}
        </div>

        <nav className="mt-6 px-3 flex flex-col gap-1">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            expanded={isSidebarOpen} 
          />
          <NavItem 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
            icon={<CheckSquare size={20} />} 
            label="Minhas Tarefas" 
            expanded={isSidebarOpen} 
          />
          <NavItem 
            active={activeTab === 'subjects'} 
            onClick={() => setActiveTab('subjects')} 
            icon={<BookOpen size={20} />} 
            label="Matérias" 
            expanded={isSidebarOpen} 
          />
          <NavItem 
            active={activeTab === 'pomodoro'} 
            onClick={() => setActiveTab('pomodoro')} 
            icon={<Timer size={20} />} 
            label="Pomodoro" 
            expanded={isSidebarOpen} 
          />
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-3 flex flex-col gap-1">
          <button 
            onClick={toggleTheme}
            className="w-full h-10 flex items-center gap-3 px-4 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-100"
          >
            {data.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {isSidebarOpen && <span className="text-sm font-medium">{data.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-10 flex items-center gap-3 px-4 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <ChevronRight size={18} className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
            {isSidebarOpen && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      <main className={`transition-all duration-300 pt-8 px-8 pb-20 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center h-16 border-b border-zinc-800 -mt-8 mb-8 sticky top-0 bg-[#09090B]/80 backdrop-blur-md z-40">
          <div>
            <h2 className="text-xl font-medium tracking-tight">Dashboard Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online Sync
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold font-mono">JS</div>
          </div>
        </header>

        <section className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardView 
                data={data} 
                onToggleTask={toggleTask} 
                onDeleteTask={deleteTask}
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === 'tasks' && (
              <TasksView 
                data={data} 
                onAddTask={addTask} 
                onToggleTask={toggleTask} 
                onDeleteTask={deleteTask} 
              />
            )}
            {activeTab === 'subjects' && (
              <SubjectsView 
                data={data} 
                onAddSubject={addSubject} 
                onDeleteSubject={deleteSubject} 
              />
            )}
            {activeTab === 'pomodoro' && (
              <PomodoroView settings={data.pomodoro} />
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

// Components
function NavItem({ active, onClick, icon, label, expanded }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, expanded: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`h-10 flex items-center gap-3 px-3 rounded-md transition-all duration-200 group relative
        ${active 
          ? 'bg-zinc-800 text-white font-medium' 
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
        }`}
    >
      <span className="shrink-0">{icon}</span>
      {expanded && <span className="text-sm whitespace-nowrap">{label}</span>}
      {!expanded && (
        <div className="absolute left-16 bg-[#1D1D1F] text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </button>
  );
}

function DashboardView({ data, onToggleTask, onDeleteTask, onTabChange }: { data: StudyData, onToggleTask: (id: string) => void, onDeleteTask: (id: string) => void, onTabChange: (tab: any) => void }) {
  const pendingTasks = data.tasks.filter(t => !t.completed);
  const completedToday = data.tasks.filter(t => t.completed).length;
  const progress = data.tasks.length > 0 ? (completedToday / data.tasks.length) * 100 : 0;

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date().getDay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          icon={<Clock className="text-indigo-400" />} 
          label="Tasks Finished" 
          value={`${completedToday}/${data.tasks.length}`} 
          subValue="Progress"
          color="bg-zinc-900 border-zinc-800"
        />
        <StatsCard 
          icon={<Timer className="text-emerald-400" />} 
          label="Study Hours" 
          value="04:42h" 
          subValue="Daily Average"
          color="bg-zinc-900 border-zinc-800"
        />
        <StatsCard 
          icon={<BookOpen className="text-blue-400" />} 
          label="Subjects Active" 
          value={data.subjects.length.toString()} 
          subValue="Current Course"
          color="bg-zinc-900 border-zinc-800"
        />
        <StatsCard 
          icon={<Award className="text-orange-400" />} 
          label="Streak Days" 
          value="12 🔥" 
          subValue="Active Streak"
          color="bg-zinc-900 border-zinc-800"
        />
      </div>

      {/* Weekly Schedule Preview */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
          Weekly View
        </h3>
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, idx) => (
            <div 
              key={day}
              className={`flex flex-col items-center py-2 rounded border transition-all ${
                idx === today 
                ? 'bg-indigo-500/20 border-indigo-500 ring-1 ring-indigo-500/50' 
                : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-500'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase ${idx === today ? 'text-indigo-400' : ''}`}>{day}</span>
              <span className={`text-xs font-bold ${idx === today ? 'text-zinc-100' : ''}`}>{new Date(new Date().setDate(new Date().getDate() - today + idx)).getDate()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Upcoming Tasks</h3>
            <button 
              onClick={() => onTabChange('tasks')}
              className="text-indigo-400 text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm min-h-[300px]">
            {pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 5).map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  subject={data.subjects.find(s => s.id === task.subjectId)}
                  onToggle={() => onToggleTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                <CheckSquare className="mb-4" size={32} />
                <p className="text-xs font-bold uppercase tracking-widest">No tasks pending</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Subjects</h3>
          <div className="space-y-2">
            {data.subjects.map(subject => (
              <div key={subject.id} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${subject.color}`} />
                  <span className="text-sm font-medium">{subject.name}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-bold font-mono">
                  {data.tasks.filter(t => t.subjectId === subject.id).length}h
                </span>
              </div>
            ))}
            <button 
              onClick={() => onTabChange('subjects')}
              className="w-full flex items-center justify-center gap-2 p-3 border border-zinc-800 border-dashed rounded-xl text-zinc-500 hover:text-indigo-400 hover:border-indigo-400 transition-all text-xs font-bold uppercase tracking-widest"
            >
              <Plus size={16} /> Manage
            </button>
          </div>

          <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group border border-indigo-400/30">
            <Timer className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10">
              <h4 className="font-bold mb-1 italic">Active Session</h4>
              <p className="text-xs opacity-80 mb-4 font-medium uppercase tracking-widest">Ready to focus?</p>
              <button 
                onClick={() => onTabChange('pomodoro')}
                className="w-full py-2 bg-white text-indigo-600 rounded-lg font-bold text-xs uppercase tracking-widest shadow-md active:scale-95 transition-transform"
              >
                Start Timer
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatsCard({ icon, label, value, subValue, color }: { icon: React.ReactNode, label: string, value: string, subValue: string, color: string }) {
  return (
    <div className={`p-5 rounded-xl ${color} border transition-all`}>
      <div className="text-zinc-500 text-xs uppercase tracking-tighter mb-1 font-medium">{label}</div>
      <div className="text-2xl font-bold font-mono tracking-tight">{value}</div>
      <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mt-1">{subValue}</div>
    </div>
  );
}

interface TaskItemProps {
  key?: string;
  task: Task;
  subject?: Subject;
  onToggle: () => void;
  onDelete: () => void;
}

function TaskItem({ task, subject, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className={`group flex items-center gap-4 p-4 hover:bg-zinc-800/30 transition-colors border-b border-zinc-800 last:border-0 ${task.completed ? 'opacity-50' : ''}`}>
      <button 
        onClick={onToggle}
        className={`shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
          task.completed 
            ? 'bg-indigo-500 border-indigo-500 text-white' 
            : 'border-zinc-600 bg-transparent'
        }`}
      >
        {task.completed && <CheckSquare size={10} strokeWidth={4} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium transition-all ${task.completed ? 'line-through text-zinc-600' : ''}`}>
          {task.title}
        </h4>
      </div>

      <div className="flex items-center gap-3">
        {subject && (
          <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-400 font-medium">
            {subject.name}
          </span>
        )}
        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
          task.priority === 'Alta' ? 'text-rose-400 bg-rose-400/10' : 
          task.priority === 'Média' ? 'text-amber-400 bg-amber-400/10' : 
          'text-blue-400 bg-blue-400/10'
        }`}>
          {task.priority === 'Alta' ? 'High' : task.priority === 'Média' ? 'Med' : 'Low'}
        </span>
      </div>

      <button 
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-rose-400 transition-all"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// Sub-views
function TasksView({ data, onAddTask, onToggleTask, onDeleteTask }: { data: StudyData, onAddTask: (t: any) => void, onToggleTask: (id: string) => void, onDeleteTask: (id: string) => void }) {
  const [newTitle, setNewTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(data.subjects[0]?.id || '');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('Média');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedSubject) return;
    onAddTask({
      title: newTitle,
      subjectId: selectedSubject,
      priority: selectedPriority,
      dueDate: new Date().toISOString()
    });
    setNewTitle('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Create New Task</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">What are you studying?</label>
            <input 
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Solve quantum physics problems..."
              className="w-full p-4 bg-zinc-950 rounded-lg border border-zinc-800 focus:border-indigo-500 outline-none transition-all text-sm"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Subject</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-4 bg-zinc-950 rounded-lg border border-zinc-800 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer text-sm"
              >
                {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Priority</label>
              <div className="flex gap-2">
                {(['Baixa', 'Média', 'Alta'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={`flex-1 py-3 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-widest ${
                      selectedPriority === p 
                        ? (p === 'Alta' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : p === 'Média' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-blue-500/10 border-blue-500 text-blue-400')
                        : 'border-zinc-800 bg-zinc-950 text-zinc-600 hover:border-zinc-700'
                    }`}
                  >
                    {p === 'Alta' ? 'High' : p === 'Média' ? 'Med' : 'Low'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-lg font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg active:scale-[0.98] transition-all"
          >
            <Plus size={16} /> Save Task
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Upcoming Tasks</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          {data.tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              subject={data.subjects.find(s => s.id === task.subjectId)}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
          {data.tasks.length === 0 && (
            <div className="p-20 text-center opacity-20 flex flex-col items-center">
              <CheckSquare className="mb-4" size={48} />
              <p className="text-xs font-bold uppercase tracking-[0.3em]">Clear Shelf</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SubjectsView({ data, onAddSubject, onDeleteSubject }: { data: StudyData, onAddSubject: (n: string, c: string) => void, onDeleteSubject: (id: string) => void }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(SUBJECT_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddSubject(name, color);
    setName('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Create New Subject</h3>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Subject Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Quantum Physics"
              className="w-full p-4 bg-zinc-950 rounded-lg border border-zinc-800 focus:border-indigo-500 outline-none transition-all text-sm"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Color Tag</label>
            <div className="flex gap-2 p-2 bg-zinc-950 rounded-lg border border-zinc-800">
              {SUBJECT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-md ${c} transition-all ${color === c ? 'ring-2 ring-offset-2 ring-indigo-500 ring-offset-zinc-900 scale-110' : 'opacity-40 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>
          <button 
            type="submit"
            className="h-14 px-8 bg-indigo-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg active:scale-95 transition-all"
          >
            Create
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.subjects.map(subject => (
          <div key={subject.id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm group">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-10 h-10 rounded-lg ${subject.color} flex items-center justify-center text-white shadow-xl shadow-current/10`}>
                <BookOpen size={20} />
              </div>
              <button 
                onClick={() => onDeleteSubject(subject.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 p-2 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h4 className="text-lg font-bold mb-1">{subject.name}</h4>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              <CheckSquare size={12} />
              <span>{data.tasks.filter(t => t.subjectId === subject.id).length} Active Tasks</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PomodoroView({ settings }: { settings: any }) {
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
      audio.play().catch(() => {});
      
      if (isBreak) {
        setTimeLeft(settings.focusTime * 60);
        setIsBreak(false);
      } else {
        setTimeLeft(settings.breakTime * 60);
        setIsBreak(true);
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, settings]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${s}`;
  };

  const progress = isBreak 
    ? (timeLeft / (settings.breakTime * 60)) * 100 
    : (timeLeft / (settings.focusTime * 60)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-md mx-auto flex flex-col items-center bg-zinc-900 border border-zinc-800 p-10 rounded-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Timer size={120} />
      </div>

      <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-8">
        {isBreak ? 'Break Session' : 'Focus Session'}
      </div>

      <div className="relative mb-12">
        <div className="text-7xl font-bold font-mono tracking-tighter text-white tabular-nums">
          {formatTime(timeLeft)}
        </div>
        <div className="absolute -bottom-4 left-0 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${isBreak ? 'bg-emerald-500' : 'bg-indigo-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg ${isActive ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700' : 'bg-white text-black hover:bg-zinc-200'}`}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={() => {
            setIsActive(false);
            setTimeLeft(isBreak ? settings.breakTime * 60 : settings.focusTime * 60);
          }}
          className="px-6 py-3 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-500 transition-all text-xs font-bold uppercase tracking-widest active:scale-95"
        >
          Reset
        </button>
      </div>

      <div className="mt-8 flex gap-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
        <button 
          onClick={() => {
            setIsBreak(false);
            setTimeLeft(settings.focusTime * 60);
            setIsActive(false);
          }}
          className={!isBreak ? "text-indigo-400 underline underline-offset-8" : "hover:text-zinc-300"}
        >
          Focus
        </button>
        <button 
          onClick={() => {
            setIsBreak(true);
            setTimeLeft(settings.breakTime * 60);
            setIsActive(false);
          }}
          className={isBreak ? "text-indigo-400 underline underline-offset-8" : "hover:text-zinc-300"}
        >
          Break
        </button>
      </div>
    </motion.div>
  );
}
