export interface ChatSession {
  id: string;
  visitor_name?: string;
  is_human_mode: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id?: string;
  session_id: string;
  sender: 'visitor' | 'bot' | 'agent';
  text: string;
  created_at?: string;
}