'use client';

import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  Palette, 
  Bot, 
  Sparkles, 
  MessageSquare,
  Minus,
  Send,
  Eye
} from 'lucide-react';

export default function WidgetSettings() {
  // Configuration State
  const [botName, setBotName] = useState('Support Bot');
  const [primaryColor, setPrimaryColor] = useState('#2563eb'); // Default Blue
  const [initialGreeting, setInitialGreeting] = useState('Hi there! How can I help you today?');
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Derived base deployment URL
  const appDomain = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
  
  // Construct widget URL with query parameters
  const widgetUrl = `${appDomain}/embed/widget?botName=${encodeURIComponent(
    botName
  )}&color=${encodeURIComponent(primaryColor)}`;

  // Generated Embed Code Snippet for static HTML
  const generatedEmbedCode = `<!-- RAG Chatbot Embed Code -->
<script>
  (function () {
    const WIDGET_URL = "${widgetUrl}";
    const iframe = document.createElement("iframe");
    iframe.src = WIDGET_URL;
    iframe.id = "rag-chat-widget-iframe";
    
    Object.assign(iframe.style, {
      position: "fixed",
      bottom: "16px",
      right: "16px",
      width: "70px",
      height: "70px",
      border: "none",
      zIndex: "999999",
      background: "transparent",
      colorScheme: "none",
      transition: "width 0.3s ease, height 0.3s ease"
    });

    document.body.appendChild(iframe);

    window.addEventListener("message", function (event) {
      if (event.data && event.data.type === "WIDGET_TOGGLE") {
        if (event.data.isOpen) {
          iframe.style.width = "380px";
          iframe.style.height = "580px";
        } else {
          iframe.style.width = "70px";
          iframe.style.height = "70px";
        }
      }
    });
  })();
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedEmbedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Sparkles className="h-6 w-6 text-blue-500" />
          Widget Customization & Integration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize your chatbot widget's appearance and copy the embed code for standard HTML websites.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Controls & Code Output */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Appearance Customization */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Palette className="h-4 w-4 text-blue-400" />
              Appearance & Branding
            </h2>

            {/* Bot Name Input */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Bot Display Name
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Support Assistant"
                className="w-full bg-slate-950 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-slate-200"
              />
            </div>

            {/* Initial Greeting Input */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Initial Welcome Message
              </label>
              <input
                type="text"
                value={initialGreeting}
                onChange={(e) => setInitialGreeting(e.target.value)}
                placeholder="Hi! How can I help?"
                className="w-full bg-slate-950 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-slate-200"
              />
            </div>

            {/* Color Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Brand Primary Color
              </label>
              <div className="flex items-center gap-3">
                {['#2563eb', '#16a34a', '#d97706', '#9333ea', '#dc2626', '#0f172a'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setPrimaryColor(color)}
                    className={`h-7 w-7 rounded-full transition-all cursor-pointer border-2 ${
                      primaryColor === color ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-8 w-8 rounded-lg bg-transparent border border-slate-800 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 2. HTML Embed Code Generator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Code className="h-4 w-4 text-emerald-400" />
                HTML Embed Code
              </h2>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Paste this script tag right before the closing <code className="text-blue-400 font-mono">&lt;/body&gt;</code> tag on your website or static HTML file.
            </p>

            <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3.5 overflow-x-auto font-mono text-[11px] text-slate-300 leading-relaxed">
              <pre>{generatedEmbedCode}</pre>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Widget Preview */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between min-h-130 relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-slate-400" />
              Live Interactive Preview
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              State: {previewOpen ? 'Expanded' : 'Closed Launcher'}
            </span>
          </div>

          {/* Canvas Area simulating website corner */}
          <div className="w-full flex-1 flex flex-col justify-end items-end p-4 relative">
            {previewOpen ? (
              <div className="w-full max-w-85 h-110 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                
                {/* Simulated Header */}
                <div 
                  className="p-3.5 flex items-center justify-between shrink-0 text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div>
                      <h4 className="text-xs font-bold leading-none">{botName || 'Support Bot'}</h4>
                      <p className="text-[9px] opacity-80 mt-0.5">Online</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="p-1 hover:bg-black/20 rounded-md text-white transition-colors cursor-pointer"
                    title="Minimize"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Simulated Chat Body */}
                <div className="flex-1 p-3 space-y-2.5 text-[11px] overflow-y-auto bg-slate-950">
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-200 p-2.5 rounded-2xl rounded-tl-none max-w-[85%] border border-slate-700/60">
                      {initialGreeting}
                    </div>
                  </div>
                </div>

                {/* Simulated Input */}
                <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    disabled
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-950 text-[11px] px-3 py-2 rounded-lg border border-slate-800 text-slate-400"
                  />
                  <button
                    disabled
                    className="p-2 rounded-lg text-white opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Simulated Floating Launcher Button */
              <button
                onClick={() => setPreviewOpen(true)}
                className="h-12 w-12 rounded-full text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
                title="Click to preview open state"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-500 text-center mt-2">
            Click the preview launcher button or minimize icon to toggle states.
          </p>
        </div>

      </div>
    </div>
  );
}