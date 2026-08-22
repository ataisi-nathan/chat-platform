'use client';

import React from 'react';
import { User, Bot, Headset } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isVisitor = message.sender === 'visitor';
  const isAgent = message.sender === 'agent';

  return (
    <div className={`flex items-start gap-3 ${isVisitor ? 'justify-start' : 'justify-end'}`}>
      {isVisitor && (
        <div className="p-1.5 rounded-full bg-slate-800 text-slate-300 shrink-0">
          <User className="h-4 w-4" />
        </div>
      )}

      <div
        className={`p-3.5 rounded-2xl max-w-[70%] text-xs leading-relaxed wrap-break-word ${
          isVisitor
            ? 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-tl-none'
            : isAgent
            ? 'bg-amber-600/90 text-white border border-amber-500/80 rounded-tr-none shadow-md'
            : 'bg-blue-600/90 text-white border border-blue-500/80 rounded-tr-none'
        }`}
      >
        <div className="text-[10px] font-bold opacity-75 mb-1 capitalize">
          {isVisitor ? 'Visitor' : isAgent ? 'Human Agent (You)' : 'AI Assistant'}
        </div>
        {message.text}
      </div>

      {!isVisitor && (
        <div className="p-1.5 rounded-full bg-slate-800 text-slate-300 shrink-0">
          {isAgent ? (
            <Headset className="h-4 w-4 text-amber-400" />
          ) : (
            <Bot className="h-4 w-4 text-blue-400" />
          )}
        </div>
      )}
    </div>
  );
};