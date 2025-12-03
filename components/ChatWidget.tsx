
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from '@google/genai';

interface ChatWidgetProps {
  notify?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ notify }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Merhaba! Ben Ege Asistan. 🌿 Bebeğinizin gelişimi, spa paketlerimiz veya randevu süreçleri hakkında bana dilediğinizi sorabilirsiniz.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Hizmetleriniz neler?",
    "Fiyatlar hakkında bilgi alabilir miyim?",
    "Hidroterapi nedir?",
    "Randevu nasıl alırım?"
  ];

  useEffect(() => {
    if (isOpen && !chatSession) {
      try {
        const session = createChatSession();
        setChatSession(session);
      } catch (e) {
        console.error("Failed to init chat", e);
      }
    }
  }, [isOpen, chatSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || !chatSession) return;

    const userMessage = textToSend;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(chatSession, userMessage);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Üzgünüm, bir bağlantı sorunu oluştu. Lütfen biraz sonra tekrar deneyin.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 group ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-gradient-to-r from-brand to-brand-dark hover:scale-110 hover:shadow-brand/40'}`}
      >
        {isOpen ? (
          <X className="text-white" size={28} />
        ) : (
          <>
            <MessageCircle className="text-white relative z-10" size={28} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 w-[calc(100%-2rem)] md:w-[380px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden animate-fade-in-up origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand via-brand to-[#4DB6AC] p-5 flex items-center justify-between shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                <Bot className="text-white" size={26} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Ege Asistan</h3>
                <div className="flex items-center gap-1.5">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                   <p className="text-brand-light text-xs font-medium opacity-90">Çevrimiçi • Yapay Zeka</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-1 relative z-10">
               <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white shrink-0 shadow-sm text-xs font-bold">
                    AI
                  </div>
                )}
                <div 
                  className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                    msg.role === 'user' 
                      ? 'bg-brand text-white rounded-br-none' 
                      : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                  <div className={`text-[10px] mt-1 opacity-70 flex justify-end ${msg.role === 'user' ? 'text-white/80' : 'text-gray-400'}`}>
                    {new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white shrink-0 shadow-sm text-xs font-bold">
                    AI
                  </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
                   <div className="flex space-x-1.5 items-center">
                      <div className="w-2 h-2 bg-brand/50 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-brand/50 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-brand/50 rounded-full animate-bounce delay-200"></div>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions & Input Area */}
          <div className="bg-white border-t border-gray-100">
            {/* Chips */}
            {messages.length < 4 && !isLoading && (
                <div className="px-4 pt-3 pb-1 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2">
                    {suggestedQuestions.map((q, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSend(q)}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-50 hover:bg-brand/10 border border-gray-200 hover:border-brand/30 rounded-full text-xs font-medium text-gray-600 hover:text-brand transition-colors"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            <div className="p-3 flex gap-2 items-center">
                <div className="flex-1 relative">
                    <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Bir şeyler yazın..."
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all text-sm placeholder:text-gray-400"
                    disabled={isLoading}
                    />
                    <Sparkles size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand/40 animate-pulse" />
                </div>
                <button 
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-brand text-white rounded-xl hover:bg-brand-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center"
                >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
