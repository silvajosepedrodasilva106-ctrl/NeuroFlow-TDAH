
import React, { useState } from 'react';
import { ThemeConfig } from '../types';

interface CheckoutProps {
  theme: ThemeConfig;
  onClose: () => void;
  onSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ theme, onClose, onSuccess }) => {
  const [step, setStep] = useState<'plan' | 'payment' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simula processamento
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      onSuccess();
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
          <i className="fas fa-check text-5xl text-emerald-500"></i>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Você agora é Pro!</h2>
        <p className="text-slate-500 max-w-xs mb-10">
          Obrigado por investir em você. Estamos aqui para tornar sua jornada mais leve e organizada.
        </p>
        <button 
          onClick={onClose}
          className="w-full max-w-xs bg-slate-900 text-white py-4 rounded-3xl font-bold shadow-xl active:scale-95 transition-all"
        >
          Começar minha nova rotina
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col p-6 overflow-y-auto">
      {/* Header com Progresso */}
      <header className="flex items-center justify-between mb-8">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="flex gap-2">
          <div className={`w-8 h-1.5 rounded-full transition-all ${step === 'plan' ? 'bg-sky-500 w-12' : 'bg-sky-100'}`}></div>
          <div className={`w-8 h-1.5 rounded-full transition-all ${step === 'payment' ? 'bg-sky-500 w-12' : 'bg-sky-100'}`}></div>
        </div>
        <div className="w-10"></div>
      </header>

      {step === 'plan' ? (
        <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Escolha seu ritmo</h2>
          <p className="text-sm text-slate-400 mb-8">Cancele quando quiser, sem letras miúdas.</p>

          <div className="space-y-4 flex-1">
            {/* Plano Anual */}
            <div 
              onClick={() => setSelectedPlan('annual')}
              className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer relative overflow-hidden ${selectedPlan === 'annual' ? 'border-sky-500 bg-sky-50/30' : 'border-slate-100'}`}
            >
              {selectedPlan === 'annual' && <div className="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl uppercase">Melhor Valor</div>}
              <div className="flex justify-between items-center mb-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'annual' ? 'border-sky-500 bg-sky-500' : 'border-slate-200'}`}>
                  {selectedPlan === 'annual' && <i className="fas fa-check text-[10px] text-white"></i>}
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 uppercase font-black">Plano Anual</span>
                  <span className="text-2xl font-black text-slate-800">R$ 154,80</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Equivalente a apenas <strong className="text-slate-800">R$ 12,90/mês</strong>. Menos que um café!</p>
            </div>

            {/* Plano Mensal */}
            <div 
              onClick={() => setSelectedPlan('monthly')}
              className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer ${selectedPlan === 'monthly' ? 'border-sky-500 bg-sky-50/30' : 'border-slate-100'}`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'monthly' ? 'border-sky-500 bg-sky-500' : 'border-slate-200'}`}>
                  {selectedPlan === 'monthly' && <i className="fas fa-check text-[10px] text-white"></i>}
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 uppercase font-black">Plano Mensal</span>
                  <span className="text-2xl font-black text-slate-800">R$ 24,90</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Ideal para testar sem compromisso de longo prazo.</p>
            </div>
          </div>

          <button 
            onClick={() => setStep('payment')}
            className="w-full bg-sky-500 text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-sky-100 mt-8 active:scale-95 transition-all"
          >
            Continuar para Pagamento
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Quase lá</h2>
          <p className="text-sm text-slate-400 mb-8">Pagamento seguro e criptografado.</p>

          <div className="space-y-4 flex-1">
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-6 rounded-[2rem] border-2 flex items-center gap-4 transition-all ${paymentMethod === 'card' ? 'border-sky-500 bg-sky-50/30' : 'border-slate-50'}`}
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                <i className="fas fa-credit-card"></i>
              </div>
              <div className="text-left">
                <span className="block font-bold text-slate-700">Cartão de Crédito</span>
                <span className="text-[10px] text-slate-400">Ativação instantânea</span>
              </div>
            </button>

            <button 
              onClick={() => setPaymentMethod('pix')}
              className={`w-full p-6 rounded-[2rem] border-2 flex items-center gap-4 transition-all ${paymentMethod === 'pix' ? 'border-sky-500 bg-sky-50/30' : 'border-slate-50'}`}
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                <i className="fab fa-pix"></i>
              </div>
              <div className="text-left">
                <span className="block font-bold text-slate-700">Pix</span>
                <span className="text-[10px] text-slate-400">Liberação em segundos</span>
              </div>
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl mb-8 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Total a pagar:</span>
            <span className="text-xl font-black text-slate-800">
              {selectedPlan === 'annual' ? 'R$ 154,80' : 'R$ 24,90'}
            </span>
          </div>

          <button 
            disabled={!paymentMethod || isProcessing}
            onClick={handlePayment}
            className={`w-full py-5 rounded-3xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3
              ${!paymentMethod || isProcessing ? 'bg-slate-100 text-slate-300' : 'bg-emerald-500 text-white shadow-emerald-100 active:scale-95'}
            `}
          >
            {isProcessing ? (
              <>
                <i className="fas fa-circle-notch animate-spin"></i>
                Finalizando...
              </>
            ) : (
              'Confirmar Pagamento'
            )}
          </button>
        </div>
      )}
      
      <p className="text-center text-[10px] text-slate-300 mt-6 pb-4">
        Ao confirmar, você concorda com nossos Termos de Uso. 
        <br/>Ambiente 100% seguro.
      </p>
    </div>
  );
};

export default Checkout;
