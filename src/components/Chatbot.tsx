import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { getFarmerAssistantResponse } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export function Chatbot() {
  const [messages, setMessages] = useState<{ id: string, role: 'user' | 'bot', text: string }[]>([
    { id: '1', role: 'bot', text: "Hello! I'm your Mirai Assistant. How can I help you with your farm today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user' as const, text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getFarmerAssistantResponse(text);
      const botMsg = { id: (Date.now()+1).toString(), role: 'bot' as const, text: response || 'Error' };
      setMessages(prev => [...prev, botMsg]);

      // Log to SQL API
      await fetch('/api/chatbot/log', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mirai_token')}` 
        },
        body: JSON.stringify({ message: text, response })
      });
    } catch (err) {
      setMessages(prev => [...prev, { id: 'err', role: 'bot', text: 'Error interacting with AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[600px]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white"><Bot size={28} /></div>
        <h2 className="text-xl font-bold text-slate-800">Relational Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex items-start gap-3", m.role === 'user' ? "flex-row-reverse" : "")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", m.role === 'user' ? "bg-slate-800 text-white" : "bg-orange-500 text-white")}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn("max-w-[80%] p-4 rounded-3xl", m.role === 'user' ? "bg-green-600 text-white" : "bg-white border")}>
              <div className="prose prose-sm">
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="relative">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="w-full bg-white border rounded-[2rem] px-6 py-5 pr-16"
          placeholder="Ask something..."
        />
        <button onClick={() => handleSend()} className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center"><Send size={20} /></button>
      </div>
    </div>
  );
}
