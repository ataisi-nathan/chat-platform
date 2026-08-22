'use client';

import React from 'react';
import { Headset, RefreshCw, Search } from 'lucide-react';
import { ChatSession } from '../types';
import { SessionItem } from './SessionItem';

interface SessionSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  loadingSessions: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectSession: (id: string) => void;
  onRefresh: () => void;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions,
  activeSessionId,
  loadingSessions,
  searchQuery,
  onSearchChange,
  onSelectSession,
  onRefresh,
}) => {
  return (
    <div className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Headset className="h-5 w-5 text-blue-400" />
          <h2 className="font-bold text-sm">Live Conversations</h2>
        </div>
        <button
          onClick={onRefresh}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Refresh Sessions"
        >
          <RefreshCw className={`h-4 w-4 ${loadingSessions ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search session or visitor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950 text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
        {sessions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No active conversations found.
          </div>
        ) : (
          sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isActive={session.id === activeSessionId}
              onSelect={onSelectSession}
            />
          ))
        )}
      </div>
    </div>
  );
};