
import React from 'react';
import { ThemeConfig } from '../types';

interface SettingsProps {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
  const handleColorChange = (key: keyof ThemeConfig, value: string) => {
    setTheme({ ...theme, [key]: value });
  };

  const resetTheme = () => {
    setTheme({
      primary: '#3b82f6',
      background: '#f8fafc',
      text: '#1e293b',
      card: '#ffffff'
    });
  };

  return (
    <div className="space-y-8 pt-4 pb-12">
      <header>
        <h2 className="text-lg font-semibold text-slate-800">Personalização</h2>
        <p className="text-xs text-slate-500">Crie um ambiente que te faça sentir calmo e focado.</p>
      </header>

      <section className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Cores do Tema</h3>
          
          <div className="space-y-4">
            <ColorPickerItem 
              label="Cor Principal (Botões e Destaques)" 
              value={theme.primary} 
              onChange={(v) => handleColorChange('primary', v)} 
            />
            <ColorPickerItem 
              label="Fundo do Aplicativo" 
              value={theme.background} 
              onChange={(v) => handleColorChange('background', v)} 
            />
            <ColorPickerItem 
              label="Cor do Texto" 
              value={theme.text} 
              onChange={(v) => handleColorChange('text', v)} 
            />
            <ColorPickerItem 
              label="Fundo dos Cards" 
              value={theme.card} 
              onChange={(v) => handleColorChange('card', v)} 
            />
          </div>
        </div>

        <button 
          onClick={resetTheme}
          className="w-full py-3 text-sm text-slate-400 font-medium border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
        >
          Restaurar Cores Padrão
        </button>
      </section>

      <section className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
        <div className="flex gap-3">
          <i className="fas fa-palette text-blue-500 mt-1"></i>
          <div>
            <h4 className="text-sm font-bold text-blue-800 mb-1">Dica de Design TDAH</h4>
            <p className="text-xs text-blue-600 leading-relaxed">
              Cores pastéis e fundos com baixo contraste podem reduzir a estimulação sensorial excessiva, ajudando a manter a calma.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const ColorPickerItem: React.FC<{ label: string, value: string, onChange: (val: string) => void }> = ({ label, value, onChange }) => (
  <div className="flex justify-between items-center gap-4">
    <span className="text-xs text-slate-500 font-medium">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-400 font-mono uppercase">{value}</span>
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-full cursor-pointer border-none bg-transparent"
      />
    </div>
  </div>
);

export default Settings;
