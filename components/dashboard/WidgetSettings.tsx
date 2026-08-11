'use client';

import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  MessageSquare, 
  Copy, 
  Check, 
  Code2, 
  Bot, 
  Sparkles, 
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';

const STORAGE_KEY = 'chat_widget_customizer_settings';

interface WidgetSettingsState {
  appId: string;
  botName: string;
  welcomeMessage: string;
  primaryColor: string;
  logoUrl: string;
}

const DEFAULT_SETTINGS: WidgetSettingsState = {
  appId: 'app_live_8f93a02c',
  botName: 'Support Bot',
  welcomeMessage: 'Hi there! 👋 How can we help you today?',
  primaryColor: '#2563eb',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
};

const COLOR_PRESETS = [
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Midnight', hex: '#0f172a' },
];

export function WidgetSettings() {
  const [settings, setSettings] = useState<WidgetSettingsState>(DEFAULT_SETTINGS);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [baseUrl, setBaseUrl] = useState<string>('https://your-domain.com');

  // Load saved settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);

      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Failed to parse saved widget settings from localStorage:', error);
        }
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSetting = <K extends keyof WidgetSettingsState>(key: K, value: WidgetSettingsState[K]) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Reset settings to default
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Construct iframe embed snippet with dynamic domain & parameters
  const generatedSnippet = `<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = "${baseUrl}/embed/widget?appId=${settings.appId}&color=${encodeURIComponent(settings.primaryColor)}&botName=${encodeURIComponent(settings.botName)}&welcomeMessage=${encodeURIComponent(settings.welcomeMessage)}&logoUrl=${encodeURIComponent(settings.logoUrl)}";
    iframe.id = "chat-widget-iframe";
    iframe.style.cssText = "position:fixed;bottom:20px;right:20px;width:380px;height:600px;border:none;z-index:999999;border-radius:16px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1);transition:all 0.2s ease;";
    document.body.appendChild(iframe);

    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'CHAT_WIDGET_RESIZE') {
        if (event.data.isOpen) {
          iframe.style.width = '380px';
          iframe.style.height = '600px';
          iframe.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
        } else {
          iframe.style.width = '70px';
          iframe.style.height = '70px';
          iframe.style.boxShadow = 'none';
        }
      }
    });
  })();
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Widget Customizer <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Customize how your AI Chatbot looks and behaves on your website.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          title="Reset to default settings"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity & Branding Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Bot className="h-4 w-4 text-blue-600" /> Identity & Branding
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={settings.botName}
                  onChange={(e) => updateSetting('botName', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="e.g. Support Assistant"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Welcome Greeting
                </label>
                <textarea
                  rows={2}
                  value={settings.welcomeMessage}
                  onChange={(e) => updateSetting('welcomeMessage', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="e.g. Hi there! How can I help?"
                />
              </div>

              <div>
                <label className=" text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5 text-slate-500" /> Avatar / Logo Image URL
                </label>
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => updateSetting('logoUrl', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Theme Color Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Palette className="h-4 w-4 text-blue-600" /> Theme Color
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => updateSetting('primaryColor', e.target.value)}
                  className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => updateSetting('primaryColor', e.target.value)}
                  className="w-32 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 pt-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => updateSetting('primaryColor', preset.hex)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-black/10"
                      style={{ backgroundColor: preset.hex }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Embed Code Output Card */}
          <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-blue-400" /> Embed Code Snippet
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-sm"
              >
                {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {isCopied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
              {generatedSnippet}
            </pre>
            <p className="text-[11px] text-slate-400">
              Paste this snippet right before the closing <code className="text-blue-400">&lt;/body&gt;</code> tag on your website.
            </p>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview Card */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" /> Live Preview
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                Saved to Local Storage
              </span>
            </h2>

            {/* Widget Container Simulation */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg bg-white flex flex-col h-120">
              {/* Header */}
              <div
                className="p-4 text-white flex items-center gap-3 transition-colors duration-300"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <img
                  src={settings.logoUrl}
                  alt={settings.botName}
                  className="h-9 w-9 rounded-full object-cover border-2 border-white/30 shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold leading-tight">{settings.botName}</h3>
                  <p className="text-[11px] text-white/80">Typically replies instantly</p>
                </div>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 p-4 bg-slate-50/50 overflow-y-auto space-y-3 text-xs">
                <div className="flex items-start gap-2 max-w-[85%]">
                  <img
                    src={settings.logoUrl}
                    alt={settings.botName}
                    className="h-6 w-6 rounded-full object-cover mt-1 shrink-0"
                  />
                  <div className="p-3 bg-white border border-slate-200/80 rounded-2xl rounded-tl-none text-slate-800 shadow-xs">
                    {settings.welcomeMessage}
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  disabled
                  placeholder="Write a message..."
                  className="flex-1 bg-slate-100 text-xs px-3 py-2.5 rounded-xl text-slate-400 cursor-not-allowed"
                />
                <button
                  disabled
                  className="p-2.5 text-white rounded-xl opacity-80 cursor-not-allowed"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}