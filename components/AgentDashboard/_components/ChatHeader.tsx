'use client';

import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { ChatSession } from '../types';

interface ChatHeaderProps {
  activeSession: ChatSession;
  onToggleHumanMode: (sessionId: string, currentMode: boolean) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ activeSession, onToggleHumanMode }) => {
  return (
    <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between shrink-0">
      <div>
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <span>{activeSession.visitor_name || 'Visitor'}</span>
          <span className="text-xs font-mono text-slate-500 font-normal">({activeSession.id})</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Mode: {activeSession.is_human_mode ? 'Human Agent Takeover Active' : 'Automated AI Response'}
        </p>
      </div>

      <button
        onClick={() => onToggleHumanMode(activeSession.id, activeSession.is_human_mode)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs transition-all cursor-pointer ${
          activeSession.is_human_mode
            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950/50'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
        }`}
      >
        {activeSession.is_human_mode ? (
          <>
            <ToggleRight className="h-5 w-5 text-amber-300" />
            <span>Release to AI</span>
          </>
        ) : (
          <>
            <ToggleLeft className="h-5 w-5 text-slate-400" />
            <span>Take Over Chat</span>
          </>
        )}
      </button>
    </div>
  );
};