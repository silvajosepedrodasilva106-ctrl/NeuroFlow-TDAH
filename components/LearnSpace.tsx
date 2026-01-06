
import React from 'react';

const LearnSpace: React.FC = () => {
  const contents = [
    { title: 'A Miopia Temporal', color: 'bg-indigo-50', text: 'TDAH torna difícil planejar o futuro porque o cérebro foca no "Agora" ou "Não Agora".' },
    { title: 'Dopamina e TDAH', color: 'bg-rose-50', text: 'Nossos cérebros buscam estímulos rápidos porque temos menos receptores de dopamina ativos.' },
    { title: 'Body Doubling', color: 'bg-amber-50', text: 'Ter alguém apenas sentado na mesma sala ajuda seu cérebro a manter o foco em uma tarefa.' },
    { title: 'Ruído Marrom', color: 'bg-teal-50', text: 'Frequências baixas podem acalmar o caos mental melhor do que o silêncio total.' },
  ];

  return (
    <div className="space-y-6 pt-4 pb-12">
      <header>
        <h2 className="text-lg font-semibold text-slate-800">Aprenda sobre você</h2>
        <p className="text-xs text-slate-500">Conhecimento é uma ferramenta contra a culpa.</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {contents.map((item, idx) => (
          <div key={idx} className={`${item.color} p-6 rounded-3xl border border-white flex flex-col justify-between h-48 shadow-sm`}>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">{item.title}</h3>
            <p className="text-[10px] text-slate-600 line-clamp-4 leading-relaxed mt-2">{item.text}</p>
            <button className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              Ler mais <i className="fas fa-arrow-right text-[8px]"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg animate-pulse">
          <i className="fas fa-play"></i>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Podcast: Foco sem Pressão</h4>
          <p className="text-xs text-slate-400">Episódio curto de 3 minutos.</p>
        </div>
      </div>
    </div>
  );
};

export default LearnSpace;
