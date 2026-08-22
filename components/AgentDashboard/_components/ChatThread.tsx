'use client';

import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';

interface ChatThreadProps {
  messages: Message[];
  loadingMessages: boolean;
}

export const ChatThread: React.FC<ChatThreadProps> = ({ messages, loadingMessages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
        Loading chat thread...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
        No messages in this session yet.
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/80">
      {messages.map((msg, idx) => (
        <ChatMessage key={msg.id || idx} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};