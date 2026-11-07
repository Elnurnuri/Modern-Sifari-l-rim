import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Store, 
  ShieldCheck, 
  Clock, 
  MessageCircle, 
  Sparkles,
  Paperclip,
  CheckCheck
} from 'lucide-react';

interface SellerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  orderId: string;
  itemName: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'seller';
  text: string;
  timestamp: string;
}

export const SellerChatModal: React.FC<SellerChatModalProps> = ({
  isOpen,
  onClose,
  sellerName,
  orderId,
  itemName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'seller',
      text: `Salam! "Elnur660's Store" mağazasına xoş gəlmisiniz. #${orderId.slice(0, 8)} nömrəli sifarişinizlə bağlı hər hansı sualınız varsa, məmnuniyyətlə cavablandırmağa hazırıq.`,
      timestamp: 'Dünən 23:45',
    },
    {
      id: '2',
      sender: 'seller',
      text: `Seçdiyiniz "Bant naxışlı qız uşağı geyim dəsti" 100% təbii pambıqdır və dəri üçün tam təhlükəsizdir. Qablaşdırma hazırda tamamlanır.`,
      timestamp: 'Bu gün 10:20',
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  const quickQuestions = [
    'Sifarişim dəqiq nə vaxt çatacaq?',
    'Ölçü dəyişmək mümkündürmü?',
    'Hədiyyəlik qutu ilə göndərilə bilərmi?',
    'Məhsulun parçası necədir?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: 'İndi',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Simulated quick automated seller response
    setTimeout(() => {
      let replyText = 'Məlumat üçün təşəkkür edirik! Menecerimiz qısa müddətdə sifariş qeydlərinizi yeniləyəcək.';
      if (text.includes('nə vaxt') || text.includes('çatacaq')) {
        replyText = 'Sifarişiniz kuryer xidmətinə təhvil verilmə mərhələsindədir. Təxmini çatdırılma tarixi sabah günorta saatlarıdır.';
      } else if (text.includes('Ölçü') || text.includes('ölçü')) {
        replyText = 'Bəli, sifariş kuryerdən təhvil alınarkən və ya 14 gün ərzində pulsuz ölçü dəyişimi edə bilərsiniz.';
      } else if (text.includes('Hədiyyə') || text.includes('qutu')) {
        replyText = 'Əlbəttə! Sifarişinizə xüsusi Panshop hədiyyə lenti və təbrik kartı əlavə olunacaq.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'seller',
          text: replyText,
          timestamp: 'İndi',
        },
      ]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col h-[580px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-white border border-white/15">
              <Store className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 id="chat-modal-title" className="text-sm font-bold text-white">
                  {sellerName}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Onlayn · Sifariş #{orderId.slice(0, 8)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Yazışmanı bağla"
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Context Pill */}
        <div className="bg-emerald-50/80 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-xs">
          <span className="text-slate-600 truncate max-w-[280px]">
            Məhsul: <strong>{itemName}</strong>
          </span>
          <span className="text-emerald-700 font-semibold shrink-0">10.87 ₼</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-white border-t border-slate-100 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg whitespace-nowrap transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Satıcıya mesaj yazın..."
            className="flex-1 px-4 py-2 bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-xl transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
