'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Sparkles, X, MessageSquare } from 'lucide-react';

export default function WidgetEmbedContent() {
  const searchParams = useSearchParams();

  const appId = searchParams.get('appId') || 'app_live_8f93a02c';
  const color = searchParams.get('color') || '#2563eb';
  const botName = searchParams.get('botName') || 'Support Bot';
  const welcomeMessage = searchParams.get('welcomeMessage') || 'Hi there! 👋 How can we help you today?';
  const logoUrl = searchParams.get('logoUrl') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';

  const [isOpen, setIsOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'bot', text: welcomeMessage },
  ]);

  // Send message to host page whenever open state changes
  const toggleWidget = (openState: boolean) => {
    setIsOpen(openState);
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage(
        { type: 'CHAT_WIDGET_RESIZE', isOpen: openState },
        '*'
      );
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: `user_${Date.now()}`, sender: 'user', text: inputMessage },
    ]);
    setInputMessage('');
  };

  if (!isOpen) {
    return (
      <div className="flex h-screen w-full items-end justify-end p-0 bg-transparent">
        <button
          onClick={() => toggleWidget(true)}
          className="h-14 w-14 rounded-full text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{ backgroundColor: color }}
        >
          <MessageSquare className="h-7 w-7" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-white overflow-hidden font-sans text-gray-800">
      {/* Header */}
      <div 
        className="p-4 text-white flex items-center justify-between transition-colors duration-300 shadow-sm"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt={botName}
            className="h-9 w-9 rounded-full object-cover border-2 border-white/30"
          />
          <div>
            <h3 className="text-sm font-bold leading-tight">{botName}</h3>
            <p className="text-[11px] text-white/80">Typically replies instantly</p>
          </div>
        </div>
        <button 
          onClick={() => toggleWidget(false)}
          className="text-white/80 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          title="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 bg-gray-50/50 overflow-y-auto space-y-3 text-xs">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 max-w-[85%] ${
                isBot ? '' : 'ml-auto flex-row-reverse'
              }`}
            >
              {isBot && (
                <img
                  src={logoUrl}
                  alt={botName}
                  className="h-6 w-6 rounded-full object-cover mt-1 shrink-0"
                />
              )}
              <div
                className={`p-3 rounded-2xl shadow-xs space-y-1 ${
                  isBot
                    ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                    : 'text-white rounded-tr-none'
                }`}
                style={!isBot ? { backgroundColor: color } : undefined}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-gray-100 text-xs text-gray-800 px-3 py-2.5 rounded-xl focus:outline-none focus:bg-gray-50 border border-transparent focus:border-gray-200 transition-all"
        />
        <button 
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2.5 text-white rounded-xl disabled:opacity-50 transition-all active:scale-95 shrink-0"
          style={{ backgroundColor: color }}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>

      {/* Footer Branding */}
      <div className="py-1.5 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
        <span>Powered by</span>
        <Sparkles className="h-3 w-3 text-blue-500 inline" />
        <span className="font-semibold text-gray-600">ChatEngine AI</span>
      </div>
    </div>
  );
}