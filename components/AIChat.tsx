
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';

interface AIChatProps {
  onAddTask: (title: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Oi! Sente que algo está pesado ou grande demais hoje? Me conte o que você quer fazer e eu te ajudo a quebrar em pedacinhos minúsculos.' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await geminiService.breakDownTask(input);
      
      let aiContent = "Legal! Aqui estão micro-passos para te ajudar:";
      if (result && Array.isArray(result)) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: aiContent,
          steps: result 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "Não consegui processar agora, mas que tal começar com algo bem pequeno, como levantar e esticar os braços?" 
        }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Houve um erro, mas não se preocupe. Respire fundo e tente novamente mais tarde." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] pt-4">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'}`}>
              <p className="text-sm leading-relaxed">{m.content}</p>
              {m.steps && (
                <div className="mt-4 space-y-2">
                  {m.steps.map((s: any, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => onAddTask(s.step)}
                      className="w-full text-left p-2 bg-blue-50 text-blue-600 rounded-xl text-xs hover:bg-blue-100 transition-colors flex items-center gap-2"
                    >
                      <i className="fas fa-plus-circle"></i>
                      {s.step}
                    </button>
                  ))}
                  <p className="text-[10px] text-slate-400 text-center mt-2 italic">Toque para adicionar à sua lista</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 flex gap-2">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="pt-4 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ex: Arrumar meu quarto inteiro..."
          className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default AIChat;
