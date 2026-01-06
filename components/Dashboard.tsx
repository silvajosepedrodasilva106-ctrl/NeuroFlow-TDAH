
import React, { useState, useMemo } from 'react';
import { EnergyMode, Task, ThemeConfig, Habit } from '../types';

interface DashboardProps {
  energyMode: EnergyMode;
  setEnergyMode: (mode: EnergyMode) => void;
  tasks: Task[];
  onCompleteTask: (id: string) => void;
  addTask: (title: string) => void;
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onSurvivalToggle: () => void;
  theme: ThemeConfig;
  isPremium: boolean;
  onUpgradeClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  energyMode, setEnergyMode, tasks, onCompleteTask, addTask, 
  habits, onToggleHabit, onSurvivalToggle, theme, isPremium, onUpgradeClick 
}) => {
  const [newTaskInput, setNewTaskInput] = useState('');
  
  const visibleTasks = tasks.filter(t => !t.completed).slice(0, 3);
  const completedTasks = tasks.filter(t => t.completed);
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const dailyPulse = useMemo(() => {
    const slots = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
    completedTasks.forEach(t => {
      if (!t.completedAt) return;
      const hour = new Date(t.completedAt).getHours();
      if (hour >= 6 && hour < 12) slots.Morning++;
      else if (hour >= 12 && hour < 18) slots.Afternoon++;
      else if (hour >= 18 && hour < 24) slots.Evening++;
      else slots.Night++;
    });
    const max = Math.max(...Object.values(slots), 1);
    return Object.entries(slots).map(([key, val]) => ({
      label: key === 'Morning' ? 'Manhã' : key === 'Afternoon' ? 'Tarde' : key === 'Evening' ? 'Noite' : 'Madru',
      value: (val / max) * 100,
      count: val
    }));
  }, [completedTasks]);

  const energyStyles = {
    [EnergyMode.LOW]: { 
      bg: 'bg-teal-50', 
      bar: 'bg-teal-400', 
      text: 'text-teal-700', 
      label: 'Recarregar', 
      icon: 'battery-quarter',
      desc: 'Ritmo suave, foco em autocuidado.'
    },
    [EnergyMode.MEDIUM]: { 
      bg: 'bg-sky-50', 
      bar: 'bg-sky-400', 
      text: 'text-sky-700', 
      label: 'Equilibrado', 
      icon: 'battery-half',
      desc: 'Bom para tarefas rotineiras.'
    },
    [EnergyMode.HIGH]: { 
      bg: 'bg-blue-50', 
      bar: 'bg-blue-400', 
      text: 'text-blue-700', 
      label: 'Hiperfoco', 
      icon: 'battery-full',
      desc: 'Energia máxima para projetos criativos.'
    },
  };

  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      addTask(newTaskInput);
      setNewTaskInput('');
    }
  };

  return (
    <div className="space-y-6 pt-4 pb-12">
      {/* Banner Premium (Checkout Entry Point) */}
      {!isPremium && (
        <section 
          onClick={onUpgradeClick}
          className="bg-gradient-to-r from-sky-600 to-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-sky-200 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all group overflow-hidden relative"
        >
          <div className="relative z-10">
            <h3 className="font-black text-sm uppercase tracking-widest mb-1">NeuroFlow Pro</h3>
            <p className="text-xs opacity-80 max-w-[180px]">Desbloqueie IA ilimitada e sons terapêuticos hoje.</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center relative z-10 group-hover:rotate-12 transition-transform">
            <i className="fas fa-crown text-amber-300"></i>
          </div>
          {/* Decorative element */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </section>
      )}

      {/* Resumo Visual: Progresso & Gráfico */}
      <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-sky-50 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold" style={{ color: theme.text }}>Seu Pulso</h2>
            <p className="text-xs text-slate-400">Você concluiu {completedTasks.length} tarefas hoje.</p>
          </div>
          <div className="bg-sky-50 text-sky-600 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
            {progressPercent}% Foco
          </div>
        </div>

        <div className="flex items-end justify-between h-24 px-2 gap-4">
          {dailyPulse.map((slot, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full relative bg-slate-50 rounded-t-xl overflow-hidden h-full">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-sky-400 transition-all duration-1000 ease-out rounded-t-lg group-hover:bg-sky-500"
                  style={{ height: `${slot.value}%` }}
                >
                  {slot.count > 0 && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {slot.count}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{slot.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Indicador de Energia */}
      <section className={`${energyStyles[energyMode].bg} p-6 rounded-[2.5rem] border border-white transition-colors duration-500`}>
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className={`text-lg font-bold ${energyStyles[energyMode].text}`}>Nível de Bateria</h3>
            <p className="text-[11px] opacity-60 leading-tight">{energyStyles[energyMode].desc}</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm ${energyStyles[energyMode].text}`}>
            <i className={`fas fa-${energyStyles[energyMode].icon} text-xl`}></i>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {Object.keys(EnergyMode).map((m) => (
            <button 
              key={m} 
              onClick={() => setEnergyMode(m as EnergyMode)} 
              className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                energyMode === m 
                ? 'bg-white shadow-md text-sky-600 scale-105' 
                : 'bg-black/5 text-slate-400 opacity-50 hover:opacity-80'
              }`}
            >
              {m === 'LOW' ? 'Baixa' : m === 'MEDIUM' ? 'Média' : 'Alta'}
            </button>
          ))}
        </div>
      </section>

      {/* Tarefas */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-slate-800">Próximos Micro-Passos</h3>
          <div className="flex gap-2">
            {habits.map(h => (
              <button key={h.id} onClick={() => onToggleHabit(h.id)} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] transition-all ${h.completed ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-100 text-slate-300'}`}>
                <i className={`fas fa-${h.icon}`}></i>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <input 
            type="text" 
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Adicionar um pensamento rápido..."
            className="w-full bg-white border border-sky-50 rounded-3xl px-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all shadow-sm pr-16"
          />
          <button 
            onClick={handleAddTask}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${newTaskInput.trim() ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-200'}`}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>

        <div className="space-y-3">
          {visibleTasks.length > 0 ? (
            visibleTasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => onCompleteTask(task.id)} 
                className="group p-5 bg-white rounded-[2rem] border border-sky-50/50 flex items-center gap-4 cursor-pointer hover:shadow-xl hover:shadow-sky-100/50 transition-all active:scale-95 border-b-4 border-b-transparent hover:border-b-sky-400"
              >
                <div className={`w-8 h-8 rounded-2xl border-2 flex-shrink-0 flex items-center justify-center transition-all ${task.completed ? 'bg-sky-500 border-sky-500' : 'border-slate-100 group-hover:border-sky-200'}`}>
                  {task.completed && <i className="fas fa-check text-xs text-white"></i>}
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className={`block font-medium text-slate-700 truncate ${task.completed ? 'line-through opacity-30' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <i className="fas fa-chevron-right text-slate-100 group-hover:text-sky-200 transition-colors"></i>
              </div>
            ))
          ) : (
             <div className="py-12 text-center bg-white/40 rounded-[2.5rem] border border-dashed border-sky-200">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-sky-300">
                  <i className="fas fa-check-double"></i>
                </div>
                <p className="text-sm font-bold text-slate-400">Tudo limpo por agora!</p>
             </div>
          )}
        </div>
      </section>

      <button 
        onClick={onSurvivalToggle} 
        className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center gap-4 shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
      >
        <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
          <i className="fas fa-ghost text-sky-300 animate-bounce"></i>
        </div>
        <div className="text-left">
          <span className="block font-black uppercase text-xs tracking-widest">Modo Sobrecarga</span>
          <span className="block text-[10px] opacity-40">Respire, pare tudo e relaxe agora.</span>
        </div>
      </button>
    </div>
  );
};

export default Dashboard;
