import React, { RefObject } from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageItemProps {
  msg: Message;
  primaryColor: string;
  loading: boolean;
}

export function ChatMessageItem({ msg, primaryColor, loading }: ChatMessageItemProps) {
  const isVisitor = msg.sender === 'visitor';

  return (
    <div className={`flex items-start gap-2 ${isVisitor ? 'justify-end' : 'justify-start'}`}>
      {!isVisitor && (
        <div className="p-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 shrink-0">
          <Bot className="h-3.5 w-3.5 text-blue-400" />
        </div>
      )}

      <div className="flex flex-col items-end max-w-[82%]">
        <div
          className={`p-3 rounded-2xl leading-relaxed wrap-break-word ${
            isVisitor
              ? 'text-white rounded-tr-none shadow-sm'
              : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none'
          } ${msg.failed ? 'border-red-500 text-red-300' : ''}`}
          style={isVisitor ? { backgroundColor: primaryColor } : {}}
        >
          {msg.text || (loading && !isVisitor ? '...' : '')}
        </div>
      </div>

      {isVisitor && (
        <div className="p-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 shrink-0">
          <User className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
}