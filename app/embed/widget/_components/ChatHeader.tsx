import React from 'react';
import { Bot, Minus } from 'lucide-react';

interface ChatHeaderProps {
  botName: string;
  onToggle: () => void;
}

export function ChatHeader({ botName, onToggle }: ChatHeaderProps) {
  return (
    <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-100 font-sans">{botName}</h3>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Direct OpenAI Connected
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}