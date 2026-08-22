'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOpenAIChat } from './hooks/useOpenAIChat';
import { ChatBubbleButton } from './_components/ChatBubbleButton';
import { ChatHeader } from './_components/ChatHeader';
import { ChatMessageList } from './_components/ChatMessageList';
import { ChatInputForm } from './_components/ChatInputForm';

const BUBBLE_SIZE = 64;
const PANEL_WIDTH = 384;
const PANEL_HEIGHT = 600;

export default function WidgetEmbedContent() {
  const searchParams = useSearchParams();
  const primaryColor = searchParams.get('color') || '#2563eb';
  const botName = searchParams.get('botName') || 'OpenAI Assistant';

  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, setInput, loading, messagesEndRef, handleSendMessage } = useOpenAIChat(isOpen);

  const toggleWidget = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage(
        {
          type: 'WIDGET_TOGGLE',
          isOpen: nextState,
          width: nextState ? PANEL_WIDTH : BUBBLE_SIZE,
          height: nextState ? PANEL_HEIGHT : BUBBLE_SIZE,
        },
        '*'
      );
    }
  };

  if (!isOpen) {
    return <ChatBubbleButton onClick={toggleWidget} primaryColor={primaryColor} size={BUBBLE_SIZE} />;
  }

  return (
    <div
      className="flex flex-col bg-slate-900 text-slate-100 font-sans rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
      style={{ width: '100%', height: 580 }}
    >
      <ChatHeader botName={botName} onToggle={toggleWidget} />
      <ChatMessageList
        messages={messages}
        loading={loading}
        primaryColor={primaryColor}
        messagesEndRef={messagesEndRef}
      />
      <ChatInputForm
        input={input}
        setInput={setInput}
        onSubmit={handleSendMessage}
        loading={loading}
        primaryColor={primaryColor}
      />
    </div>
  );
}