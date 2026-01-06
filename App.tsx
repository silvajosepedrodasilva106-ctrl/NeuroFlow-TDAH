import React, { useState, useEffect, useCallback } from 'react';
import { EnergyMode, Task, ThemeConfig, AppTab, Habit } from './types.ts';
import { geminiService } from './services/geminiService.ts';
import Dashboard from './components/Dashboard.tsx';
import ThoughtDiary from './components/ThoughtDiary.tsx';
import EmotionalRegulator from './components/EmotionalRegulator.tsx';
import PremiumArea from './components/PremiumArea.tsx';
import Navigation from './components/Navigation.tsx';
import Timer from './components/Timer.tsx';
import Games from './components/Games.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [energyMode, setEnergyMode] = useState<EnergyMode>(EnergyMode.MEDIUM);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Beber um copo de água', completed: false, isMicro: true },
    { id: '2', title: 'Abrir a janela para ventilar', completed: false, isMicro: true },
  ]);
  const [habits, setHabits] = useState<Habit[]>([
    { id: 'h1', title: 'Meditar', completed: false, icon: 'spa' },
    { id: 'h2', title: 'Sol', completed: false, icon: 'sun' },
    { id: 'h3', title: 'Remédio', completed: false, icon: 'pills' },
  ]);
  const [isSurvivalMode, setIsSurvivalMode] = useState(false);
  const [dopaminePoints, setDopaminePoints] = useState(0);
  const [showPremium, setShowPremium] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const [theme, setTheme] = useState<ThemeConfig>({
    primary: '#0ea5e9',
    background: '#f0f9ff',
    text: '#0f172a',
    card: '#ffffff'
  });

  useEffect(() => {
    const saved = localStorage.getItem('neuroflow_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.dopaminePoints) setDopaminePoints(parsed.dopaminePoints);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.isPremium) setIsPremium(parsed.isPremium);
      } catch (e) { console.error("Error hydrating state", e); }
    }
  }, []);

  useEffect(() => {
    const currentState = { theme, dopaminePoints, tasks, isPremium };
    localStorage.setItem('neuroflow_state', JSON.stringify(currentState));
    
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--bg-color', theme.background);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--card-bg', theme.card);
  }, [theme, dopaminePoints, tasks, isPremium]);

  const handleCompleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined } 
        : t
    ));
    setDopaminePoints(prev => prev + 15);
  }, []);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    setDopaminePoints(prev => prev + 5);
  };

  const addTask = (title: string) => {
    if (!title.trim()) return;
    const newTask: Task = { id: Date.now().toString(), title, completed: false, isMicro: false };
    setTasks(prev => [newTask, ...prev]);
  };

  const handlePremiumSuccess = () => {
    setIsPremium(true);
    setDopaminePoints(prev => prev + 500); // Recompensa de boas vindas
  };

  if (isSurvivalMode) {
    return (
      <div className="fixed inset-0 survival-mode flex flex-col items-center justify-center p-8 text-center z-50">
        <div className="w-32 h-32 bg-sky-500/20 rounded-full flex items-center justify-center animate-pulse-soft mb-8">
          <i className="fas fa-wind text-4xl text-sky-300"></i>
        </div>
        <h1 className="text-2xl font-bold mb-4">Modo Sobrevivência</h1>
        <p className="text-sky-200/60 mb-8 max-w-xs">Pausa total. Foque apenas em existir agora.</p>
        <button onClick={() => setIsSurvivalMode(false)} className="bg-white/10 text-white px-8 py-3 rounded-2xl">Voltar aos poucos</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen transition-all duration-700" style={{ backgroundColor: theme.background }}>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col md:pl-28 w-full">
        <div className="max-w-2xl mx-auto w-full flex flex-col min-h-screen relative">
          
          <header className="p-6 flex justify-between items-center sticky top-0 z-30" style={{ backgroundColor: `${theme.background}A0`, backdropFilter: 'blur(16px)' }}>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: theme.text }}>NeuroFlow</h1>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                 <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white shadow-sm border border-sky-100 text-sky-600 px-4 py-1.5 rounded-2xl text-sm font-bold flex items-center gap-2">
                <i className="fas fa-fire-alt text-orange-400"></i>
                {dopaminePoints}
              </div>
              <button onClick={() => setShowPremium(true)} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isPremium ? 'bg-amber-100 text-amber-600' : 'bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-200'}`}>
                <i className={`fas fa-${isPremium ? 'check-circle' : 'crown'} text-sm`}></i>
              </button>
            </div>
          </header>

          <main className="flex-1 pb-24 md:pb-12 overflow-y-auto px-6">
            {activeTab === 'home' && (
              <Dashboard 
                energyMode={energyMode} setEnergyMode={setEnergyMode} 
                tasks={tasks} onCompleteTask={handleCompleteTask}
                addTask={addTask}
                habits={habits} onToggleHabit={toggleHabit}
                onSurvivalToggle={() => setIsSurvivalMode(true)}
                theme={theme}
                isPremium={isPremium}
                onUpgradeClick={() => setShowPremium(true)}
              />
            )}
            {activeTab === 'diary' && <ThoughtDiary />}
            {activeTab === 'regulator' && <EmotionalRegulator />}
            {activeTab === 'timer' && <Timer theme={theme} />}
            {activeTab === 'games' && <Games theme={theme} />}
          </main>
        </div>
      </div>

      {showPremium && (
        <PremiumArea 
          onClose={() => setShowPremium(false)} 
          theme={theme} 
          onPremiumSuccess={() => {
            handlePremiumSuccess();
            setShowPremium(false);
          }}
        />
      )}
    </div>
  );
};

export default App;