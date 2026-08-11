'use client';

import { useSearchParams } from 'next/navigation';
import { Send } from 'lucide-react';

export default function EmbeddedWidgetPage() {
  const searchParams = useSearchParams();
  const appId = searchParams.get('appId') || 'demo';
  const primaryColor = searchParams.get('color') || '#2563eb';

  return (
    <div className="h-screen w-screen bg-transparent flex flex-col justify-end p-4 font-sans">
      <div className="w-full max-w-sm h-137.5 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Widget Header */}
        <div 
          className="p-4 text-white font-bold text-sm flex items-center justify-between"
          style={{ backgroundColor: primaryColor }}
        >
          <span>Support Chat</span>
          <span className="text-xs font-normal opacity-80">App: {appId}</span>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-3 text-xs">
          <div className="bg-white border border-gray-200 p-3 rounded-xl max-w-[80%] shadow-sm">
            Hi! How can we help you today?
          </div>
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100 flex gap-2 bg-white">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 text-xs bg-gray-100 px-3 py-2 rounded-lg focus:outline-none"
          />
          <button 
            className="p-2 text-white rounded-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}