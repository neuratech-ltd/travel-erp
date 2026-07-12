import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, CornerDownRight, Check, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function AiConsultant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I am your AI Travel Consultant & ERP Copilot. I can draft custom itineraries for tour packages, outline visa requirements for any country, generate simulated ticket invoices, or compose professional client refund emails. How can I help you optimize your agency workflow today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { title: "Singapore 5-Day package", prompt: "Draft a premium 5-day tour package itinerary for Singapore including hotel Marina Bay Sands, transport transfers, and sightseeing tours." },
    { title: "Refund Email Draft", prompt: "Compose a professional client refund notification email for cancelled Turkish Airlines flight TK-235 because of air traffic disruption." },
    { title: "IATA BSP explanation", prompt: "Explain how IATA BSP (Billing and Settlement Plan) upcoming fortnightly billing capacity is calculated and how to manage Remittance Holding Capacity limits." },
    { title: "Check Visa requirements", prompt: "Summarize current tourist visa document requirements for citizens traveling to Japan." }
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    // Add user message
    const userMsg: Message = { id: String(Date.now()), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();
      if (data.success && data.text) {
        setMessages(prev => [...prev, {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: data.text
        }]);
      } else {
        throw new Error(data.message || 'Failed to generate response');
      }
    } catch (e: any) {
      setMessages(prev => [...prev, {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: `Error: ${e.message}. Please verify that GEMINI_API_KEY is configured correctly under Secrets in your AI Studio settings.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div id="ai-consultant-container" className="flex-1 flex flex-col md:flex-row h-[calc(100-4rem)] bg-slate-50 overflow-hidden">
      
      {/* Sidebar Suggestions */}
      <div id="ai-quick-sidebar" className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">AI Copilot Tasks</h3>
          </div>
          <p className="text-3xs text-slate-400 font-medium">Select a predefined ERP workspace template below to query Gemini immediately:</p>
          
          <div className="space-y-2.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.prompt)}
                className="w-full text-left p-3.5 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-100 rounded-xl transition-all cursor-pointer group text-2xs"
              >
                <span className="font-bold text-slate-700 block group-hover:text-indigo-600 transition-colors mb-1">{p.title}</span>
                <span className="text-3xs text-slate-400 font-medium line-clamp-2 leading-relaxed">{p.prompt}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-4xs leading-relaxed text-indigo-700 font-medium">
          <p className="font-bold mb-1">💡 Travel Agent Tip:</p>
          To auto-fill invoices with simulated passenger data, use the <strong className="text-indigo-900">"AI Auto-Fill Form"</strong> button directly inside any invoice creator form.
        </div>
      </div>

      {/* Main Chat Area */}
      <div id="ai-chat-main" className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        
        {/* Scrollable messages log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-4xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${isAi ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl border text-2xs leading-relaxed ${
                  isAi 
                    ? 'bg-white border-slate-200/60 text-slate-700 rounded-tl-none shadow-sm' 
                    : 'bg-indigo-600 border-indigo-700 text-white rounded-tr-none shadow-md shadow-indigo-950/10'
                }`}>
                  {/* Handle newlines in AI text */}
                  {m.text.split('\n').map((line, i) => (
                    <p key={i} className={line.trim() === '' ? 'h-2' : 'mb-1 last:mb-0'}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200/60 p-4 rounded-2xl rounded-tl-none text-3xs text-slate-400 font-bold animate-pulse flex items-center gap-1.5 shadow-sm">
                <span>Gemini is planning your travel solutions...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your travel request or booking query here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow shadow-indigo-600/20 active:scale-95 shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
