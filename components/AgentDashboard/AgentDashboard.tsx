import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Adjust path as needed

export interface Message {
  id: string;
  session_id: string;
  sender: 'visitor' | 'bot' | 'agent';
  text: string;
  created_at: string;
  isOptimistic?: boolean;
  error?: boolean;
}

export interface Session {
  id: string;
  visitor_name?: string;
  last_activity: string;
  unreadCount?: number;
}

export const AgentDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentInput, setAgentInput] = useState('');

  // 1. Load active sessions & subscribe to new sessions/activities
  useEffect(() => {
    const fetchVisitors = async () => {
    console.log("Fetching visitors from Supabase...");
    const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('last_activity', { ascending: false });

    if (error) {
        console.error("Error fetching visitors:", error.message);
    } else {
        console.log("Visitors retrieved:", data);
        setSessions(data || []);
        
        // Auto-select the first visitor if non-selected
        if (data && data.length > 0) {
        setActiveSessionId(data[0].id);
        }
    }
    };

    fetchVisitors();

    // Realtime listener for new or updated sessions
    const sessionChannel = supabase
      .channel('public:sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSessions((prev) => [payload.new as Session, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSessions((prev) =>
              prev
                .map((s) => (s.id === payload.new.id ? { ...s, ...payload.new } : s))
                .sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime())
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionChannel);
    };
  }, []);

  // 2. Fetch and subscribe to messages for the active session
  useEffect(() => {
    if (!activeSessionId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', activeSessionId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to new messages for the selected visitor session
    const messageChannel = supabase
      .channel(`messages:${activeSessionId}`)
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

  // 3. Optimistic message delivery handler
  const handleSendMessage = async () => {
    if (!agentInput.trim() || !activeSessionId) return;

    const textToSend = agentInput.trim();
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage: Message = {
      id: tempId,
      session_id: activeSessionId,
      sender: 'agent',
      text: textToSend,
      created_at: new Date().toISOString(),
      isOptimistic: true,
    };

    setAgentInput('');
    setMessages((prev) => [...prev, optimisticMessage]);

    const { data, error } = await supabase
      .from('messages')
      .insert({
        session_id: activeSessionId,
        sender: 'agent',
        text: textToSend,
      })
      .select()
      .single();

    if (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, isOptimistic: false, error: true } : msg
        )
      );
    } else if (data) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? (data as Message) : msg))
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* Sidebar: Visitor List */}
      <aside className="w-80 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800 font-bold text-lg">
          Active Conversations
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
          {sessions.length === 0 ? (
            <div className="p-4 text-xs text-slate-500">No active sessions</div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`w-full text-left p-4 transition-colors flex justify-between items-center ${
                  activeSessionId === session.id
                    ? 'bg-slate-800 border-l-4 border-amber-500'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    {session.visitor_name || `Visitor #${session.id.slice(0, 6)}`}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {new Date(session.last_activity).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Panel: Chat History */}
      <main className="flex-1 flex flex-col">
        {activeSessionId ? (
          <>
            <header className="p-4 border-b border-slate-800 font-semibold text-sm">
              Session ID: {activeSessionId}
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'agent' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-3.5 text-xs transition-opacity ${
                      msg.isOptimistic ? 'opacity-70' : 'opacity-100'
                    } ${
                      msg.sender === 'visitor'
                        ? 'bg-slate-800 text-slate-100 border border-slate-700/80'
                        : msg.sender === 'bot'
                        ? 'bg-blue-600/90 text-white'
                        : 'bg-amber-600/90 text-white'
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-75 mb-1 capitalize flex justify-between gap-2">
                      <span>{msg.sender === 'visitor' ? 'Visitor' : msg.sender === 'bot' ? 'AI Bot' : 'Agent (You)'}</span>
                      {msg.isOptimistic && <span className="italic font-normal">Sending...</span>}
                      {msg.error && <span className="text-red-300 font-bold">Failed</span>}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Footer */}
            <footer className="p-4 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message as agent..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
              >
                Send
              </button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
            Select a session to view dialogue history
          </div>
        )}
      </main>
    </div>
  );
};