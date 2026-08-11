'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  AlertTriangle, 
  UserCheck, 
  Search, 
  Clock, 
  ArrowLeftRight,
  LogOut,
  ShieldAlert
} from 'lucide-react';

export type HandoverStatus = 'bot' | 'needs_human' | 'agent';

export interface Message {
  id: string;
  sender: 'visitor' | 'bot' | 'agent';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  visitorName: string;
  visitorAvatar?: string;
  status: HandoverStatus;
  lastMessage: string;
  lastMessageTime: string;
  assignedAgent?: string;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'chat_1',
    visitorName: 'Alex Rivera',
    status: 'needs_human',
    lastMessage: 'I need to process a refund for order #84920 right now.',
    lastMessageTime: '10:42 AM',
    messages: [
      { id: 'm1', sender: 'visitor', text: 'Hi, I need help with my order.', timestamp: '10:40 AM' },
      { id: 'm2', sender: 'bot', text: 'Hello Alex! I can help with orders. What is your order ID?', timestamp: '10:40 AM' },
      { id: 'm3', sender: 'visitor', text: 'Order #84920. I need to process a refund right now.', timestamp: '10:42 AM' },
      { id: 'm4', sender: 'bot', text: 'Refund processing requires human authorization. Escalating to a live support agent...', timestamp: '10:42 AM' },
    ],
  },
  {
    id: 'chat_2',
    visitorName: 'Sarah Jenkins',
    status: 'bot',
    lastMessage: 'Where can I find your pricing documentation?',
    lastMessageTime: '10:38 AM',
    messages: [
      { id: 'm10', sender: 'visitor', text: 'Where can I find your pricing documentation?', timestamp: '10:38 AM' },
      { id: 'm11', sender: 'bot', text: 'You can view our plans at example.com/pricing!', timestamp: '10:38 AM' },
    ],
  },
  {
    id: 'chat_3',
    visitorName: 'Michael Chen',
    status: 'agent',
    assignedAgent: 'You',
    lastMessage: 'Thanks for updating my shipping address!',
    lastMessageTime: '10:15 AM',
    messages: [
      { id: 'm20', sender: 'visitor', text: 'Can I change my address?', timestamp: '10:10 AM' },
      { id: 'm21', sender: 'bot', text: 'Let me connect you to a team member.', timestamp: '10:11 AM' },
      { id: 'm22', sender: 'agent', text: 'Hi Michael! I have updated your address to the new location.', timestamp: '10:14 AM' },
      { id: 'm23', sender: 'visitor', text: 'Thanks for updating my shipping address!', timestamp: '10:15 AM' },
    ],
  },
];

export function AgentDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState<string>('chat_1');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'needs_human' | 'agent'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeChat = conversations.find((c) => c.id === activeChatId);

  const handleTakeover = (chatId: string) => {
    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const takeoverMsg: Message = {
            id: `msg_${Date.now()}`,
            sender: 'agent',
            text: 'An agent has joined the chat and taken over the conversation.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...chat,
            status: 'agent',
            assignedAgent: 'You',
            messages: [...chat.messages, takeoverMsg],
          };
        }
        return chat;
      })
    );
  };

  const handleReturnToBot = (chatId: string) => {
    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const returnMsg: Message = {
            id: `msg_${Date.now()}`,
            sender: 'bot',
            text: 'The agent has left. The virtual assistant is back online to assist you.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...chat,
            status: 'bot',
            assignedAgent: undefined,
            messages: [...chat.messages, returnMsg],
          };
        }
        return chat;
      })
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChat) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: activeChat.status === 'agent' ? 'agent' : 'bot',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            lastMessage: newMsg.text,
            lastMessageTime: newMsg.timestamp,
            messages: [...chat.messages, newMsg],
          };
        }
        return chat;
      })
    );

    setInputMessage('');
  };

  const filteredConversations = conversations
    .filter((c) => {
      if (filter === 'needs_human') return c.status === 'needs_human';
      if (filter === 'agent') return c.status === 'agent';
      return true;
    })
    .filter((c) => c.visitorName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans text-gray-800 antialiased overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 md:w-96 flex flex-col border-r border-gray-200 bg-white shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Support Workspace</h1>
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg text-xs font-medium text-gray-600">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 text-center rounded-md transition-all ${
                filter === 'all' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('needs_human')}
              className={`flex-1 py-1.5 text-center rounded-md transition-all flex items-center justify-center gap-1 ${
                filter === 'needs_human'
                  ? 'bg-amber-500 text-white font-semibold shadow-sm'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Escalated
            </button>
            <button
              onClick={() => setFilter('agent')}
              className={`flex-1 py-1.5 text-center rounded-md transition-all ${
                filter === 'agent' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'hover:text-gray-900'
              }`}
            >
              My Chats
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No active conversations found</div>
          ) : (
            filteredConversations.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-4 cursor-pointer transition-colors relative ${
                    isActive ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-gray-900 truncate max-w-40">
                      {chat.visitorName}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {chat.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-1 mb-2.5">{chat.lastMessage}</p>

                  <div className="flex items-center justify-between">
                    {chat.status === 'needs_human' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                        <AlertTriangle className="h-3 w-3" /> Needs Human
                      </span>
                    )}
                    {chat.status === 'bot' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        <Bot className="h-3 w-3 text-gray-500" /> Bot Handled
                      </span>
                    )}
                    {chat.status === 'agent' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        <UserCheck className="h-3 w-3" /> Assigned: {chat.assignedAgent}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Feed */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-gray-50 h-full">
          <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                {activeChat.visitorName.charAt(0)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">{activeChat.visitorName}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Session ID: {activeChat.id}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {activeChat.status === 'agent' ? (
                      <span className="text-blue-600 font-medium">Agent Active ({activeChat.assignedAgent})</span>
                    ) : activeChat.status === 'needs_human' ? (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <ShieldAlert className="h-3.5 w-3.5" /> Action Required
                      </span>
                    ) : (
                      <span className="text-gray-500">Bot Automated</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeChat.status !== 'agent' ? (
                <button
                  onClick={() => handleTakeover(activeChat.id)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-blue-500 active:scale-95"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Take Over Chat
                </button>
              ) : (
                <button
                  onClick={() => handleReturnToBot(activeChat.id)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Return to Bot
                </button>
              )}
            </div>
          </div>

          {activeChat.status === 'needs_human' && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>The bot reached a query boundary and requested human support takeover.</span>
              </div>
              <button
                onClick={() => handleTakeover(activeChat.id)}
                className="text-xs font-bold text-amber-900 underline hover:text-amber-950"
              >
                Accept Takeover
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeChat.messages.map((msg) => {
              const isVisitor = msg.sender === 'visitor';
              const isBot = msg.sender === 'bot';
              const isAgent = msg.sender === 'agent';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isVisitor ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-xs text-gray-400 px-1">
                    {isBot && <Bot className="h-3.5 w-3.5 text-purple-600" />}
                    {isAgent && <User className="h-3.5 w-3.5 text-blue-600" />}
                    <span className="font-medium text-gray-600">
                      {isVisitor ? activeChat.visitorName : isBot ? 'Chatbot' : 'Agent (You)'}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-sm leading-relaxed ${
                      isVisitor
                        ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                        : isBot
                        ? 'bg-purple-50 border border-purple-100 text-purple-950 rounded-tr-none'
                        : 'bg-blue-600 text-white rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  activeChat.status === 'agent'
                    ? 'Type your reply as human agent...'
                    : 'Bot is handling this chat. Type to override as bot...'
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-sm flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
          Select a conversation from the sidebar to inspect the feed.
        </div>
      )}
    </div>
  );
}