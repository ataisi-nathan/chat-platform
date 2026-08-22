import React, { RefObject } from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';
import { ChatMessageItem } from './ChatMessageItem';

interface ChatMessageListProps {
  messages: Message[];
  loading: boolean;
  primaryColor: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export function ChatMessageList({ messages, loading, primaryColor, messagesEndRef }: ChatMessageListProps) {
  return (
    <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-slate-950/70">
      {messages.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-xs">
          Send a message to start chatting directly with OpenAI!
        </div>
      )}

      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} msg={msg} primaryColor={primaryColor} loading={loading} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}