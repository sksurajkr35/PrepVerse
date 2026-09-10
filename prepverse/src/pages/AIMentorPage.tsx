import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Bug,
  HelpCircle,
  FileCheck2,
  CalendarCheck,
  UserCheck,
  Code2,
  User
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { AIChatMessage } from '../types';

export const AIMentorPage: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello Surya 👋! I am your PrepVerse AI Placement Mentor. Ask me anything about Data Structures, Algorithms, System Design, Aptitude shortcuts, DBMS, OS, or Mock Interviews!",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    { label: 'Explain Binary Search', icon: HelpCircle, prompt: 'Explain binary search to me in simple, beginner-friendly terms with C++ code.' },
    { label: 'Find Bug in My Code', icon: Bug, prompt: 'How do I debug a Segmentation Fault in C++ pointers?' },
    { label: 'Review My Resume', icon: FileCheck2, prompt: 'Review my resume summary and give 3 improvements for an SDE-1 role.' },
    { label: 'Mock Interview Me', icon: UserCheck, prompt: 'Act as a Google interviewer and ask me a hard Binary Tree question.' },
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim()) return;

    const userMsg: AIChatMessage = {
      id: `m_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const historyPayload = messages.map(m => ({
      role: m.sender === 'user' ? 'user' as const : 'ai' as const,
      content: m.text
    }));

    const aiResponse = await aiService.askAIMentor(promptText, historyPayload);

    const aiMsg: AIChatMessage = {
      id: `m_${Date.now() + 1}`,
      sender: 'ai',
      text: aiResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>PrepVerse AI Mentor</span>
              <span className="text-[9px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Gemini 2.5 Flash
              </span>
            </h1>
            <p className="text-xs text-slate-400">Your 24/7 personal placement preparation assistant.</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {quickPrompts.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all flex items-center gap-2 group"
            >
              <Icon className="w-4 h-4 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white line-clamp-1">{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Window */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-[480px] flex flex-col justify-between shadow-xl">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 border border-slate-800 text-indigo-400'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs whitespace-pre-wrap'
                }`}
              >
                <p>{m.text}</p>
                <span className="text-[9px] text-slate-400 block text-right mt-1.5 opacity-60">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>PrepVerse AI is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask PrepVerse AI anything (e.g. Explain binary search, review resume)..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
