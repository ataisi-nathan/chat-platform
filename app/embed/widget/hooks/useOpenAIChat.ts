import { useState, useEffect, useRef, useCallback } from 'react';
import OpenAI from 'openai';
import { Message } from '../types';

export function useOpenAIChat(isOpen: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Auto-scroll when messages update or panel opens
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  // 2. Initialize visitor ID & load chat history once on mount
  useEffect(() => {
    let id = localStorage.getItem('visitorId');
    if (!id) {
      id = `visitor_${crypto.randomUUID()}`;
      localStorage.setItem('visitorId', id);
    }
    setVisitorId(id);

    async function loadHistory(sessionId: string) {
      try {
        const res = await fetch(`/api/chat/history?visitorSessionId=${sessionId}`);
        const data = await res.json();
        if (data.messages) {
          setMessages(
            data.messages.map((m: { id: string; sender: 'visitor' | 'bot'; content: string }) => ({
              id: m.id,
              sender: m.sender,
              text: m.content,
            }))
          );
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }

    loadHistory(id);
  }, []); // Run ONCE on mount to avoid infinite loops

  // 3. Register visitor in Supabase
  const registerVisitorInSupabase = async (visitorId: string) => {
    try {
        const res = await fetch('/api/visitors/register', { // Ensure your route matches this path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
        });

        if (!res.ok) {
        const rawText = await res.text();
        let errorData;
        try {
            errorData = JSON.parse(rawText);
        } catch {
            errorData = rawText;
        }

        console.error('Supabase Visitor Registration Failed:', {
            status: res.status,
            statusText: res.statusText,
            details: errorData,
        });
        return;
        }
    } catch (err) {
        console.error('Network or execution error registering visitor:', err);
    }
    };

  // 4. Save individual messages to Supabase
  const saveMessageToSupabase = useCallback(
    async (sessionId: string | null, sender: 'visitor' | 'bot', content: string) => {
      if (!sessionId || !content.trim()) return;
      try {
        const res = await fetch('/api/chat/save-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorSessionId: sessionId, sender, content }),
        });

        if (!res.ok) throw new Error('Failed to save message in Supabase');
        return await res.json();
      } catch (error) {
        console.error('Error saving message in Supabase:', error);
      }
    },
    []
  );

  // 5. Stream OpenAI response and persist messages
  const sendTextToOpenAI = async (text: string) => {
    if (!text.trim() || loading || !visitorId) return;

    // Register/update visitor activity in database
    await registerVisitorInSupabase(visitorId);

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      alert('Missing NEXT_PUBLIC_OPENAI_API_KEY in environment variables.');
      return;
    }

    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const visitorMsgId = `user_${Date.now()}`;
    const botMsgId = `bot_${Date.now()}`;

    // Append user message to state
    const updatedMessages: Message[] = [
      ...messages,
      { id: visitorMsgId, sender: 'visitor', text },
    ];

    setMessages(updatedMessages);
    setLoading(true);

    // Save user message to Supabase
    await saveMessageToSupabase(visitorId, 'visitor', text);

    // Add empty bot placeholder message
    setMessages((prev) => [...prev, { id: botMsgId, sender: 'bot', text: '' }]);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.sender === 'visitor' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful customer support assistant.' },
          ...apiMessages,
        ],
        stream: true,
      });

      setLoading(false);
      let accumulatedBotText = ''; // Track response content for DB write

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          accumulatedBotText += content;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, text: msg.text + content } : msg
            )
          );
        }
      }

      // Save complete streamed bot response to Supabase
      if (accumulatedBotText) {
        await saveMessageToSupabase(visitorId, 'bot', accumulatedBotText);
      }
    } catch (err) {
      console.error('OpenAI Error:', err);
      setLoading(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, text: 'Error connecting to OpenAI. Please check your key.', failed: true }
            : msg
        )
      );
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput('');
    await sendTextToOpenAI(userText);
  };

  return {
    messages,
    input,
    setInput,
    loading,
    messagesEndRef,
    handleSendMessage,
  };
}