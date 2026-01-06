
import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../types';

interface TimerProps {
  theme: ThemeConfig;
}

const Timer: React.FC<TimerProps> = ({ theme }) => {
  const [seconds, setSeconds] = useState(1500); // 25 mins padrão
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [initialSeconds, setInitialSeconds] = useState(1500);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      if (Notification.permission === "granted") {
        new Notification("Tempo esgotado!", { 
          body: mode === 'focus' ? "Hora de uma pausa!" : "Pronto para focar?" 
        });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, mode]);

  const toggle = () => {
    if (seconds > 0) setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };

  const adjustTime = (amount: number) => {
    if (isActive) return;
    const newSeconds = Math.max(60, seconds + amount);
    setSeconds(newSeconds);
    setInitialSeconds(newSeconds);
  };

  const setQuickTime = (mins: number) => {
    if (isActive) return;
    const sec = mins * 60;
    setSeconds(sec);
    setInitialSeconds(sec);
    setMode(mins <= 10 ? 'break' : 'focus');
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return {
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  const { m, s } = formatTime(seconds);

  return (
    <div className="flex flex-col items-center space-y-8 pt-4 pb-12 w-full max-w-sm mx-auto">
      <header className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-800">Timer de Fluxo</h2>
        <p className="text-[11px] text-slate-400">Escolha um tempo ou ajuste manualmente</p>
      </header>

      {/* Seleção Rápida */}
      <div className="flex flex-wrap justify-center gap-2">
        {[5, 10, 25, 45].map(mins => (
          <button 
            key={mins}
            onClick={() => setQuickTime(mins)}
            disabled={isActive}
            className={`px-4 py-2 rounded-2xl text-[10px] font-black transition-all border
              ${initialSeconds === mins * 60 
                ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-100' 
                : 'bg-white text-slate-400 border-sky-50 hover:border-sky-200'
              } ${isActive ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {mins}M
          </button>
        ))}
      </div>

      {/* Container Principal do Timer */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
         {/* Anel de Fundo */}
         <div className="absolute inset-0 rounded-full border-[10px] border-white shadow-inner bg-white/20"></div>
         
         {/* Progresso Circular */}
         <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <circle cx="50%" cy="50%" r="46%" fill="none" stroke={theme.primary} strokeWidth="10" 
              strokeDasharray="100%" strokeDashoffset={`${100 - (seconds / initialSeconds * 100)}%`} 
              style={{ strokeDasharray: '289%', strokeDashoffset: `${289 - (289 * seconds / initialSeconds)}%` }}
              strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
         </svg>

         {/* Conteúdo Central */}
         <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => adjustTime(-60)} 
                disabled={isActive}
                className={`w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-sky-50 hover:text-sky-500 transition-all ${isActive ? 'opacity-0 pointer-events-none' : 'active:scale-90'}`}
              >
                <i className="fas fa-minus text-xs"></i>
              </button>
              
              <div className="flex flex-col">
                <span className="text-6xl font-black text-slate-800 tracking-tighter tabular-nums leading-none">
                  {m}
                </span>
                <span className="text-xl font-bold text-sky-400/50 tabular-nums">
                  {s}
                </span>
              </div>

              <button 
                onClick={() => adjustTime(60)} 
                disabled={isActive}
                className={`w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-sky-50 hover:text-sky-500 transition-all ${isActive ? 'opacity-0 pointer-events-none' : 'active:scale-90'}`}
              >
                <i className="fas fa-plus text-xs"></i>
              </button>
            </div>
            
            <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em] mt-2">
              {mode === 'focus' ? 'Focar' : 'Descansar'}
            </p>
         </div>
      </div>

      {/* Controles Principais */}
      <div className="flex items-center gap-6 w-full justify-center">
         <button 
           onClick={reset} 
           className="w-12 h-12 rounded-full bg-white border border-slate-100 text-slate-300 flex items-center justify-center hover:text-sky-500 hover:border-sky-100 transition-all active:scale-90"
         >
            <i className="fas fa-redo-alt text-sm"></i>
         </button>

         <button 
           onClick={toggle} 
           className={`w-20 h-20 rounded-3xl text-white shadow-xl flex items-center justify-center text-2xl active:scale-95 transition-all
             ${isActive ? 'bg-slate-800 shadow-slate-200' : 'bg-sky-500 shadow-sky-200'}
           `}
         >
            <i className={`fas fa-${isActive ? 'pause' : 'play'} ${!isActive ? 'ml-1' : ''}`}></i>
         </button>

         <div className="w-12 h-12 opacity-0"></div> {/* Espaçador invisível para manter o Play centralizado */}
      </div>

      {/* Card de Dica */}
      <div className="bg-white p-5 rounded-[2rem] border border-sky-50 w-full shadow-sm flex gap-4 items-center">
         <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-2xl flex-shrink-0 flex items-center justify-center">
            <i className="fas fa-brain text-sm"></i>
         </div>
         <p className="text-[10px] text-slate-500 leading-relaxed italic">
           Pequenas pausas frequentes são melhores que uma pausa longa para o seu cérebro.
         </p>
      </div>
    </div>
  );
};

export default Timer;
