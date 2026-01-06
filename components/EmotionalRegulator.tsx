
import React, { useState, useEffect } from 'react';

const EmotionalRegulator: React.FC = () => {
  const [activeExercise, setActiveExercise] = useState<null | 'breath' | 'grounding'>(null);
  const [timer, setTimer] = useState(0);
  const [phase, setPhase] = useState('');

  useEffect(() => {
    let interval: any;
    if (activeExercise === 'breath' && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
        // Phase logic for 4-4-4 box breathing (simplified)
        const cycle = (60 - timer) % 12;
        if (cycle < 4) setPhase('Inspire...');
        else if (cycle < 8) setPhase('Segure...');
        else setPhase('Expire...');
      }, 1000);
    } else if (timer === 0) {
      setActiveExercise(null);
      setPhase('');
    }
    return () => clearInterval(interval);
  }, [activeExercise, timer]);

  const startBreath = () => {
    setActiveExercise('breath');
    setTimer(60);
  };

  const startGrounding = () => {
    setActiveExercise('grounding');
    setTimer(90);
  };

  if (activeExercise) {
    return (
      <div className="h-[calc(100vh-180px)] flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-700">
        <div className="relative">
          <div className={`w-48 h-48 rounded-full border-4 border-blue-100 flex items-center justify-center transition-all duration-1000 ${phase === 'Inspire...' ? 'scale-125 bg-blue-50' : 'scale-95 bg-white'}`}>
            <span className="text-blue-600 font-medium text-lg">{phase || 'Prepare-se'}</span>
          </div>
          <div className="absolute -top-4 -right-4 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-md font-bold text-slate-400 border border-slate-100">
            {timer}
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-500 mb-8 max-w-[200px]">Foque apenas no círculo e na sua respiração.</p>
          <button 
            onClick={() => setActiveExercise(null)}
            className="text-slate-400 text-sm underline underline-offset-4"
          >
            Encerrar antes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-4">
      <header>
        <h2 className="text-lg font-semibold text-slate-800">Pausa Consciente</h2>
        <p className="text-xs text-slate-500">Pequenos exercícios para regular seu sistema nervoso.</p>
      </header>

      <div className="grid gap-4">
        <div 
          onClick={startBreath}
          className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-6 cursor-pointer hover:border-blue-200 transition-all active:scale-98"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 text-2xl">
            <i className="fas fa-wind"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800">Respiração Circular</h3>
            <p className="text-xs text-slate-400">60 segundos para baixar a ansiedade.</p>
          </div>
        </div>

        <div 
          onClick={startGrounding}
          className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-6 cursor-pointer hover:border-emerald-200 transition-all active:scale-98"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl">
            <i className="fas fa-leaf"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800">Grounding 5-4-3-2-1</h3>
            <p className="text-xs text-slate-400">Conecte-se com o presente através dos sentidos.</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
        <h4 className="text-amber-700 text-sm font-bold mb-2 flex items-center gap-2">
          <i className="fas fa-info-circle"></i>
          Dica de Ouro
        </h4>
        <p className="text-amber-600 text-xs leading-relaxed">
          Sentir-se sobrecarregado é normal. Seu cérebro só precisa de um "reboot". Tente fazer isso pelo menos uma vez ao dia, mesmo que se sinta bem.
        </p>
      </div>
    </div>
  );
};

export default EmotionalRegulator;
