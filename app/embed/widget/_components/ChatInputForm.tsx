import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputFormProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  primaryColor: string;
}

export function ChatInputForm({ input, setInput, onSubmit, loading, primaryColor }: ChatInputFormProps) {
  return (
    <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        placeholder="Type your message..."
        disabled={loading}
        className="flex-1 bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500 disabled:opacity-50"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !input.trim()}
        style={{ backgroundColor: primaryColor }}
        className="text-white px-3.5 py-2 rounded-xl disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center shrink-0"
      >
        <Send className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}