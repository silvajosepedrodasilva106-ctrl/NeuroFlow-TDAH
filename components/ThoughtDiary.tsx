
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

const ThoughtDiary: React.FC = () => {
  const [thought, setThought] = useState('');
  const [organized, setOrganized] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const handleOrganize = async () => {
    if (!thought.trim() || loading) return;
    setLoading(true);
    try {
      const result = await geminiService.organizeThoughts(thought);
      if (result) {
        setOrganized(result);
        setHistory(prev => [{ ...result, date: new Date().toLocaleDateString(), original: thought }, ...prev]);
        setThought('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-4 pb-12">
      <header>
        <h2 className="text-lg font-semibold text-slate-800">Diário de Pensamentos</h2>
        <p className="text-xs text-slate-500">Despeje seu cérebro aqui, eu organizo pra você.</p>
      </header>

      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
        <textarea 
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="O que está na sua cabeça agora? Não se preocupe com a ordem ou gramática..."
          className="w-full h-32 text-sm bg-slate-50 border-none focus:ring-0 resize-none rounded-2xl p-4"
        />
        <button 
          onClick={handleOrganize}
          disabled={loading || !thought.trim()}
          className="mt-4 w-full bg-indigo-500 text-white py-3 rounded-2xl font-medium hover:bg-indigo-600 disabled:opacity-50 transition-all"
        >
          {loading ? 'Organizando...' : 'Clarear Pensamentos'}
        </button>
      </div>

      {organized && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
            <i className="fas fa-magic"></i>
            <span>Visão Organizada</span>
          </div>
          <p className="text-slate-700 text-sm italic leading-relaxed">
            "{organized.summary}"
          </p>
          <div className="space-y-2">
            {organized.keyPoints.map((point: string, i: number) => (
              <div key={i} className="flex gap-2 items-start text-sm text-slate-600">
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-1.5 flex-shrink-0"></div>
                {point}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setOrganized(null)}
            className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold pt-2"
          >
            Limpar Visualização
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Histórico</h3>
          {history.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 opacity-70">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-slate-400">{item.date}</span>
                <i className="fas fa-check-circle text-emerald-400 text-[10px]"></i>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThoughtDiary;
