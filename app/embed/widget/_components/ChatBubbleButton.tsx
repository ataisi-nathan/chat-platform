import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatBubbleButtonProps {
  onClick: () => void;
  primaryColor: string;
  size: number;
}

export function ChatBubbleButton({ onClick, primaryColor, size }: ChatBubbleButtonProps) {
  return (
    <div
      className="flex items-center justify-center bg-transparent"
      style={{ width: size, height: size }}
    >
      <button
        onClick={onClick}
        style={{ backgroundColor: primaryColor }}
        className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label="Open Chat"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
}