'use client';

import React from 'react';
import { User } from 'lucide-react';
import { ChatSession } from '../types';

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({ session, isActive, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(session.id)}
      className={`p-3.5 cursor-pointer transition-all flex items-start justify-between gap-2 ${
        isActive ? 'bg-slate-800/90 border-l-4 border-blue-500' : 'hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="p-2 rounded-full bg-slate-800 text-slate-300 shrink-0">
          <User className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-200 truncate">
            {session.visitor_name || 'Visitor'}
          </p>
          <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
            {session.id}
          </p>
        </div>
      </div>

      <span
        className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
          session.is_human_mode
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}
      >
        {session.is_human_mode ? 'Human' : 'AI Bot'}
      </span>
    </div>
  );
};