export interface Message {
  id: string;
  sender: 'visitor' | 'bot';
  text: string;
  failed?: boolean;
}