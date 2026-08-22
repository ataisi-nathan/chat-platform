'use client';

import React from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  agentInput: string;
  isHumanMode: boolean;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  agentInput,
  isHumanMode,
  onInputChange,
  onSendMessage,
}) => {
  return (
    <div className="p-4 border-t border-slate-800 bg-slate-900/80">
      {!isHumanMode && (
        <div className="mb-2 text-[11px] text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/40 flex items-center justify-between">
          <span>AI is currently handling this chat. Click "Take Over Chat" above to respond directly.</span>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={agentInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder={
            isHumanMode ? 'Type reply as human agent...' : 'Take over chat to send a message...'
          }
          disabled={!isHumanMode}
          className="flex-1 bg-slate-950 text-xs text-slate-100 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 disabled:opacity-50 transition-all placeholder:text-slate-500"
        />
        <button
          type="button"
          onClick={onSendMessage}
          disabled={!isHumanMode || !agentInput.trim()}
          className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition-all cursor-pointer font-medium text-xs flex items-center gap-1.5 shrink-0"
        >
          <Send className="h-4 w-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};