
import React, { useState, useEffect, useRef } from 'react';
import { ThemeConfig } from '../types';

interface GamesProps {
  theme: ThemeConfig;
}

const Games: React.FC<GamesProps> = ({ theme }) => {
  // --- Jogo 1: Pop Sensorial ---
  const [bubbles, setBubbles] = useState(() => Array.from({ length: 12 }, (_, i) => ({ id: i, popped: false })));
  const [bubbleScore, setBubbleScore] = useState(0);

  // --- Jogo 2: Foco no Alvo (Reflexo com Timer) ---
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  const [gameActive, setGameActive] = useState(false);
  const [targetScore, setTargetScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('neuroflow_high_score')) || 0);

  // --- Atividade 3: Fidget Spinner ---
  const [rotation, setRotation] = useState(0);
  const [spinVelocity, setSpinVelocity] = useState(0);

  // Monitora bolhas para resetar
  useEffect(() => {
    if (bubbles.every(b => b.popped)) {
      const timer = setTimeout(() => {
        setBubbles(prev => prev.map(b => ({ ...b, popped: false })));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [bubbles]);

  // Timer do Jogo de Reflexo
  useEffect(() => {
    let timer: any;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
      if (targetScore > highScore) {
        setHighScore(targetScore);
        localStorage.setItem('neuroflow_high_score', targetScore.toString());
      }
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft, targetScore, highScore]);

  // Física básica do Fidget Spinner
  useEffect(() => {
    const loop = setInterval(() => {
      if (spinVelocity > 0.1) {
        setRotation(r => r + spinVelocity);
        setSpinVelocity(v => v * 0.98); // Atrito
      } else {
        setSpinVelocity(0);
      }
    }, 16);
    return () => clearInterval(loop);
  }, [spinVelocity]);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setBubbleScore(s => s + 1);
  };

  const startGame = () => {
    setTargetScore(0);
    setTimeLeft(30);
    setGameActive(true);
    moveTarget();
  };

  const moveTarget = () => {
    if (!gameActive && targetScore > 0) return;
    const nextTop = Math.floor(Math.random() * 70 + 15) + '%';
    const nextLeft = Math.floor(Math.random() * 70 + 15) + '%';
    setTargetPos({ top: nextTop, left: nextLeft });
    if (gameActive) setTargetScore(s => s + 1);
  };

  const spin = () => {
    setSpinVelocity(v => Math.min(v + 20, 80));
  };

  return (
    <div className="space-y-8 pt-6 pb-24 max-w-lg mx-auto">
      <header className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Centro Sensorial</h2>
        <p className="text-xs text-slate-500">Ferramentas para regular sua dopamina de forma saudável.</p>
      </header>

      {/* 1. Pop Sensorial */}
      <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-sky-50">
        <div className="flex justify-between items-center mb-6 px-2">
          <div>
            <h3 className="font-bold text-sm text-slate-700">Pop Terapêutico</h3>
            <p className="text-[10px] text-slate-400">Feedback tátil digital</p>
          </div>
          <div className="bg-sky-50 px-3 py-1 rounded-full flex items-center gap-2">
            <i className="fas fa-bullseye text-[10px] text-sky-400"></i>
            <span className="text-[10px] font-black text-sky-600">{bubbleScore}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {bubbles.map(b => (
            <button 
              key={b.id} 
              onClick={() => !b.popped && popBubble(b.id)}
              className={`aspect-square rounded-full transition-all duration-300 flex items-center justify-center relative active:scale-75
                ${b.popped 
                  ? 'bg-slate-50 scale-90 border-transparent shadow-inner opacity-40' 
                  : 'shadow-md border-4 border-white hover:shadow-lg'
                }
              `}
              style={{ backgroundColor: b.popped ? '#f1f5f9' : theme.primary }}
            >
              {!b.popped && (
                <div className="w-1/2 h-1/2 bg-white/20 rounded-full blur-[2px] absolute top-2 left-2"></div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Foco no Alvo (Mini-Game) */}
      <section className="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden h-72">
        <div className="relative z-20 flex justify-between items-start">
          <div>
            <h3 className="font-bold text-sm">Hiperfoco 30s</h3>
            <p className="text-[10px] opacity-50">Recorde: {highScore}</p>
          </div>
          {gameActive ? (
            <div className="bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              {timeLeft}s
            </div>
          ) : (
            <button 
              onClick={startGame}
              className="bg-sky-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95"
            >
              Iniciar
            </button>
          )}
        </div>

        {gameActive ? (
          <button 
            onClick={moveTarget}
            className="absolute w-14 h-14 rounded-full shadow-2xl transition-all duration-150 flex items-center justify-center group active:scale-75 z-20"
            style={{ 
              top: targetPos.top, 
              left: targetPos.left,
              backgroundColor: theme.primary,
              boxShadow: `0 0 30px ${theme.primary}60`
            }}
          >
            <div className="w-8 h-8 border-2 border-white/30 rounded-full animate-ping"></div>
            <div className="absolute w-2 h-2 bg-white rounded-full"></div>
          </button>
        ) : timeLeft === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-30 backdrop-blur-sm">
            <span className="text-4xl font-black mb-1">{targetScore}</span>
            <span className="text-[10px] uppercase font-bold text-sky-400 mb-4">Pontos atingidos!</span>
            <button onClick={startGame} className="text-xs underline opacity-50">Tentar novamente</button>
          </div>
        )}

        {/* Efeito de grade no fundo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </section>

      {/* 3. Spinner Cinético */}
      <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-sky-50 flex flex-col items-center overflow-hidden">
        <h3 className="font-bold text-sm text-slate-700 mb-8 w-full text-left">Âncora Cinética</h3>
        
        <div 
          onClick={spin}
          className="w-44 h-44 relative cursor-pointer active:scale-95 transition-transform duration-75 select-none"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Sombra de Movimento (Glow) */}
          <div 
            className="absolute inset-0 rounded-full blur-3xl opacity-20 transition-opacity"
            style={{ 
              backgroundColor: theme.primary,
              opacity: Math.min(spinVelocity / 50, 0.4)
            }}
          ></div>

          {/* Corpo do Spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Centro / Rolamento */}
            <div className="w-14 h-14 bg-white rounded-full border-4 border-slate-50 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.05)] z-20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-slate-100 shadow-inner"></div>
            </div>
            
            {/* Hastes */}
            {[0, 120, 240].map(deg => (
              <div 
                key={deg} 
                className="absolute w-16 h-40 flex flex-col items-center justify-between py-1"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                {/* Peso Superior */}
                <div 
                  className="w-14 h-14 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}dd)`,
                    boxShadow: `0 8px 15px ${theme.primary}40`
                  }}
                >
                    <div className="w-full h-full bg-gradient-to-tr from-white/0 to-white/20"></div>
                </div>

                {/* Peso Inferior */}
                <div 
                  className="w-14 h-14 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}dd)`,
                    boxShadow: `0 8px 15px ${theme.primary}40`
                  }}
                >
                    <div className="w-full h-full bg-gradient-to-tr from-white/0 to-white/20"></div>
                </div>
              </div>
            ))}

            {/* Braços conectores (subtis) */}
            <div className="absolute w-36 h-36 rounded-full border-[16px] border-slate-50/50 opacity-20"></div>
          </div>
        </div>
        
        <div className="mt-10 flex flex-col items-center gap-2">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] animate-pulse">Toque para girar</p>
            <div className="h-1 w-24 bg-slate-50 rounded-full overflow-hidden">
                <div 
                    className="h-full transition-all duration-300" 
                    style={{ 
                        width: `${(spinVelocity / 80) * 100}%`,
                        backgroundColor: theme.primary
                    }}
                ></div>
            </div>
        </div>
      </section>

      {/* Card Informativo */}
      <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex gap-4">
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm flex-shrink-0">
          <i className="fas fa-brain"></i>
        </div>
        <div>
          <h4 className="text-xs font-bold text-emerald-800 mb-1">Por que isso funciona?</h4>
          <p className="text-[10px] text-emerald-700 leading-relaxed italic">
            Atividades de micro-estimulação (fidgeting) ajudam a ocupar a parte do cérebro que se distrai, permitindo que você retome a calma e o controle emocional mais rápido.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Games;
