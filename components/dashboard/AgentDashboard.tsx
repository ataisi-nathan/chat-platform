'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  User, 
  Bot, 
  Headset, 
  Send, 
  ToggleLeft, 
  ToggleRight, 
  MessageSquare,
  RefreshCw,
  Search
} from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.255.78.199:8000';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface ChatSession {
  id: string;
  visitor_name?: string;
  is_human_mode: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Message {
  id?: string;
  session_id: string;
  sender: 'visitor' | 'bot' | 'agent';
  text: string;
  created_at?: string;
}

export default function AgentDashboard() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentInput, setAgentInput] = useState('');
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // 1. Fetch all active sessions on mount & subscribe to updates
  useEffect(() => {
    fetchSessions();

    // Subscribe to new sessions or session mode updates
    const sessionChannel = supabase
      .channel('dashboard_sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_sessions' },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
    };
  }, []);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setSessions(data as ChatSession[]);
      if (data.length > 0 && !activeSessionId) {
        setActiveSessionId(data[0].id);
      }
    }
    setLoadingSessions(false);
  };

  // 2. Fetch messages whenever the active session changes
  useEffect(() => {
    if (!activeSessionId) return;

    fetchMessages(activeSessionId);

    // Realtime listener for incoming messages on selected session
    const messageChannel = supabase
      .channel(`dashboard_messages_${activeSessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${activeSessionId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [activeSessionId]);

  const fetchMessages = async (sessionId: string) => {
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data as Message[]);
    }
    setLoadingMessages(false);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Toggle Human Takeover Mode via FastAPI Endpoint
  const handleToggleHumanMode = async (sessionId: string, currentMode: boolean) => {
    const nextMode = !currentMode;

    // Optimistic UI update
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, is_human_mode: nextMode } : s))
    );

    try {
      await fetch(`${FASTAPI_URL}/api/sessions/toggle-human`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          is_human_mode: nextMode,
        }),
      });
    } catch (err) {
      console.error('Failed to toggle takeover mode:', err);
      // Revert on error
      fetchSessions();
    }
  };

  // 4. Send human agent message directly to Supabase
  const handleSendAgentMessage = async () => {
    if (!agentInput.trim() || !activeSessionId) return;

    const textToSend = agentInput;
    setAgentInput('');

    // Insert directly into Supabase so visitor widget receives it via Realtime
    const { data, error } = await supabase.from('messages').insert({
      session_id: activeSessionId,
      sender: 'agent',
      text: textToSend,
    }).select().single();

    if (error) {
      console.error('Error sending agent message:', error);
    } else if (data) {
      setMessages((prev) => [...prev, data as Message]);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    (s.visitor_name || s.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* LEFT SIDEBAR: Active User Sessions */}
      <div className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headset className="h-5 w-5 text-blue-400" />
            <h2 className="font-bold text-sm">Live Conversations</h2>
          </div>
          <button
            onClick={fetchSessions}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Refresh Sessions"
          >
            <RefreshCw className={`h-4 w-4 ${loadingSessions ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search session or visitor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
          {filteredSessions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No active conversations found.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
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
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN PANEL: Active Chat Thread */}
      {activeSession ? (
        <div className="flex-1 flex flex-col bg-slate-950 h-full overflow-hidden">
          {/* Header */}
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

            {/* Takeover Toggle Button */}
            <button
              onClick={() => handleToggleHumanMode(activeSession.id, activeSession.is_human_mode)}
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

          {/* Messages Thread */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/80">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                Loading chat thread...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                No messages in this session yet.
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={msg.id || idx}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'visitor' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {msg.sender === 'visitor' && (
                    <div className="p-1.5 rounded-full bg-slate-800 text-slate-300 shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl max-w-[70%] text-xs leading-relaxed wrap-break-word ${
                      msg.sender === 'visitor'
                        ? 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-tl-none'
                        : msg.sender === 'agent'
                        ? 'bg-amber-600/90 text-white border border-amber-500/80 rounded-tr-none shadow-md'
                        : 'bg-blue-600/90 text-white border border-blue-500/80 rounded-tr-none'
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-75 mb-1 capitalize">
                      {msg.sender === 'visitor' ? 'Visitor' : msg.sender === 'agent' ? 'Human Agent (You)' : 'AI Assistant'}
                    </div>
                    {msg.text}
                  </div>

                  {msg.sender !== 'visitor' && (
                    <div className="p-1.5 rounded-full bg-slate-800 text-slate-300 shrink-0">
                      {msg.sender === 'agent' ? (
                        <Headset className="h-4 w-4 text-amber-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Agent Reply Input */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/80">
            {!activeSession.is_human_mode && (
              <div className="mb-2 text-[11px] text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/40 flex items-center justify-between">
                <span>AI is currently handling this chat. Click "Take Over Chat" above to respond directly.</span>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAgentMessage()}
                placeholder={
                  activeSession.is_human_mode
                    ? 'Type reply as human agent...'
                    : 'Take over chat to send a message...'
                }
                disabled={!activeSession.is_human_mode}
                className="flex-1 bg-slate-950 text-xs text-slate-100 px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 disabled:opacity-50 transition-all placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={handleSendAgentMessage}
                disabled={!activeSession.is_human_mode || !agentInput.trim()}
                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition-all cursor-pointer font-medium text-xs flex items-center gap-1.5 shrink-0"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-500">
          <MessageSquare className="h-10 w-10 mb-2 opacity-40" />
          <p className="text-xs">Select a conversation from the left sidebar to view messages.</p>
        </div>
      )}
    </div>
  );
}