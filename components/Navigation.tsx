
import React from 'react';
import { AppTab } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: 'fas fa-th-large', label: 'Início' },
    { id: 'timer', icon: 'fas fa-stopwatch', label: 'Timer' },
    { id: 'diary', icon: 'fas fa-feather', label: 'Notas' },
    { id: 'games', icon: 'fas fa-gamepad', label: 'Jogos' },
    { id: 'regulator', icon: 'fas fa-wind', label: 'Respiro' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-sky-50 flex justify-around items-center px-4 z-40 md:top-0 md:bottom-0 md:left-0 md:h-full md:w-28 md:flex-col md:justify-start md:pt-10 md:border-t-0 md:border-r md:px-0 md:bg-white shadow-2xl shadow-sky-100">
      <div className="hidden md:flex mb-12 items-center justify-center">
        <div className="w-14 h-14 bg-[var(--primary-color)] rounded-[1.4rem] flex items-center justify-center text-white shadow-xl shadow-sky-200 transition-transform hover:scale-105">
          <i className="fas fa-brain text-xl"></i>
        </div>
      </div>

      <div className="flex md:flex-col justify-around w-full md:gap-6">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as AppTab)} 
            className="flex flex-col items-center gap-1.5 group relative w-full"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeTab === tab.id ? 'bg-[var(--primary-color)] text-white scale-110 shadow-lg shadow-sky-200' : 'text-slate-400 hover:text-sky-500 hover:bg-sky-50'}`}>
              <i className={`${tab.icon} text-base`}></i>
            </div>
            <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${activeTab === tab.id ? 'text-[var(--primary-color)]' : 'text-slate-500 group-hover:text-sky-600'}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="hidden md:block absolute -right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-sky-500 rounded-l-full"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
