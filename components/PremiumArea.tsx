
import React, { useState } from 'react';
import Checkout from './Checkout';
import { ThemeConfig } from '../types';

interface PremiumAreaProps {
  onClose: () => void;
  theme: ThemeConfig;
  onPremiumSuccess: () => void;
}

const PremiumArea: React.FC<PremiumAreaProps> = ({ onClose, theme, onPremiumSuccess }) => {
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout) {
    return (
      <Checkout 
        theme={theme} 
        onClose={() => setShowCheckout(false)} 
        onSuccess={() => {
          onPremiumSuccess();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col p-8 overflow-y-auto animate-in slide-in-from-bottom-full duration-500">
      <button 
        onClick={onClose}
        className="self-end w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
      >
        <i className="fas fa-times"></i>
      </button>

      <div className="text-center mt-6 mb-12">
        <div className="w-24 h-24 bg-gradient-to-tr from-sky-400 to-blue-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-white text-4xl shadow-2xl shadow-sky-200 mb-6 rotate-3">
          <i className="fas fa-crown"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">NeuroFlow Pro</h2>
        <p className="text-slate-400 text-sm">Menos ruído mental, mais fluxo real.</p>
      </div>

      <div className="space-y-6 mb-12">
        <FeatureItem icon="wand-magic-sparkles" color="text-sky-500" bg="bg-sky-50" title="IA Ilimitada" desc="Quebre projetos gigantes em micro-passos sem limites diários." />
        <FeatureItem icon="chart-line" color="text-indigo-500" bg="bg-indigo-50" title="Relatórios de Energia" desc="Descubra seus melhores horários de foco com precisão." />
        <FeatureItem icon="headset" color="text-purple-500" bg="bg-purple-50" title="Sons Terapêuticos" desc="Acesso ao Ruído Marrom, Branco e Binaurais premium." />
        <FeatureItem icon="shield-heart" color="text-rose-500" bg="bg-rose-50" title="Suporte Empático" desc="Comunidade e recursos exclusivos para momentos de crise." />
      </div>

      <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-black text-slate-800 block">Plano Anual</span>
            <span className="text-[10px] text-sky-600 font-black uppercase tracking-widest">Economize 40%</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-800">R$ 12,90</span>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">/mês</span>
          </div>
        </div>
        
        <button 
          onClick={() => setShowCheckout(true)}
          className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          Experimentar Grátis
        </button>
        
        <p className="text-[10px] text-slate-400 text-center font-medium">7 dias grátis, cancele quando quiser com um toque.</p>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: string, color: string, bg: string, title: string, desc: string }> = ({ icon, color, bg, title, desc }) => (
  <div className="flex gap-5 items-start">
    <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center flex-shrink-0 text-lg shadow-sm`}>
      <i className={`fas fa-${icon}`}></i>
    </div>
    <div>
      <h4 className="text-sm font-black text-slate-800 mb-0.5">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default PremiumArea;
