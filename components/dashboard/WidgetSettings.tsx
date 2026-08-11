'use client';

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Copy, 
  Check, 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Code2, 
  Palette 
} from 'lucide-react';

export function WidgetSettings() {
  const [appId] = useState<string>('app_live_8f93a02c');
  const [botName, setBotName] = useState<string>('Support Bot');
  const [welcomeMessage, setWelcomeMessage] = useState<string>('Hi there! 👋 How can we help you today?');
  const [primaryColor, setPrimaryColor] = useState<string>('#2563eb');
  const [logoUrl, setLogoUrl] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // State to store the detected domain dynamically
  const [domain, setDomain] = useState<string>('');

  useEffect(() => {
    // Detect the domain dynamically
    if (typeof window !== 'undefined') {
      setDomain(window.location.origin);
    }
  }, []);

  const COLOR_PRESETS = [
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Purple', hex: '#7c3aed' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Rose', hex: '#e11d48' },
    { name: 'Dark', hex: '#0f172a' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatedSnippet = `<script>
    (function() {
      var iframe = document.createElement('iframe');
      iframe.src = "${domain}/embed/widget?appId=${appId}&color=${encodeURIComponent(primaryColor)}&botName=${encodeURIComponent(botName)}&welcomeMessage=${encodeURIComponent(welcomeMessage)}&logoUrl=${encodeURIComponent(logoUrl)}";
      iframe.style.cssText = "position:fixed;bottom:20px;right:20px;width:380px;height:600px;border:none;z-index:999999;border-radius:16px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1);";
      iframe.id = "chat-widget-iframe";
      document.body.appendChild(iframe);
    })();
  </script>`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(generatedSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat Widget Customizer</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure your embeddable chat widget's appearance, logo, and welcome messages.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                <Palette className="h-5 w-5 text-blue-600" />
                Branding & Styling
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Assistant / Bot Name
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. Acme Support"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Initial Greeting
                </label>
                <textarea
                  rows={2}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Type welcome message..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Primary Theme Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        onClick={() => setPrimaryColor(preset.hex)}
                        style={{ backgroundColor: preset.hex }}
                        className={`h-8 w-8 rounded-full border-2 transition-transform active:scale-95 ${
                          primaryColor === preset.hex ? 'border-gray-900 scale-110 shadow-sm' : 'border-transparent'
                        }`}
                        title={preset.name}
                      />
                    ))}
                  </div>
                  <div className="h-6 w-px bg-gray-200 mx-1" />
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1 bg-gray-50">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-6 w-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono font-medium text-gray-600">{primaryColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Custom Avatar / Logo
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="h-12 w-12 rounded-xl object-cover border border-gray-200 shadow-sm"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-all">
                    <Upload className="h-4 w-4" />
                    Upload New Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <Code2 className="h-5 w-5 text-blue-600" />
                  Embed Code
                </div>
                <span className="text-xs text-gray-400 font-mono">App ID: {appId}</span>
              </div>

              <div className="relative group">
                <pre className="bg-gray-900 text-gray-200 text-xs font-mono p-4 rounded-xl overflow-x-auto leading-relaxed border border-gray-800">
                  {generatedSnippet}
                </pre>
                
                <button
                  onClick={handleCopySnippet}
                  className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-10 w-full max-w-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
                <span>Live Widget Preview</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden h-135 flex flex-col">
                <div 
                  className="p-4 text-white flex items-center justify-between transition-colors duration-300"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={logoUrl}
                      alt="Bot Avatar"
                      className="h-9 w-9 rounded-full object-cover border-2 border-white/30"
                    />
                    <div>
                      <h3 className="text-sm font-bold leading-tight">{botName}</h3>
                      <p className="text-[11px] text-white/80">Typically replies instantly</p>
                    </div>
                  </div>
                  <button className="text-white/80 hover:text-white p-1 rounded-lg">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 p-4 bg-gray-50/50 overflow-y-auto space-y-3 text-xs">
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <img
                      src={logoUrl}
                      alt="Bot Avatar"
                      className="h-6 w-6 rounded-full object-cover mt-1"
                    />
                    <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm space-y-1">
                      <p>{welcomeMessage}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    placeholder="Write a message..."
                    className="flex-1 bg-gray-100 text-xs text-gray-400 px-3 py-2 rounded-xl cursor-not-allowed"
                  />
                  <button 
                    disabled
                    className="p-2 text-white rounded-xl opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="py-1.5 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
                  <span>Powered by</span>
                  <Sparkles className="h-3 w-3 text-blue-500 inline" />
                  <span className="font-semibold text-gray-600">ChatEngine AI</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <div 
                  className="h-12 w-12 rounded-full text-white flex items-center justify-center shadow-lg cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}