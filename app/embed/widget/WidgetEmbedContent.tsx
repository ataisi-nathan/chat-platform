'use client';

import { useSearchParams } from 'next/navigation';

export default function WidgetEmbedContent() {
  const searchParams = useSearchParams();

  // Extract query parameters with fallbacks
  const appId = searchParams.get('appId') || 'default_app';
  const color = searchParams.get('color') || '#2563eb';

  return (
    <div className="min-h-screen bg-white p-4" style={{ accentColor: color }}>
      <header className="rounded-xl p-4 text-white" style={{ backgroundColor: color }}>
        <h1 className="text-lg font-bold">Widget Embed</h1>
        <p className="text-xs opacity-90">App ID: {appId}</p>
      </header>

      {/* Widget main body content */}
      <main className="mt-4 space-y-3">
        <p className="text-sm text-gray-600">
          Chat widget successfully loaded with theme color <span className="font-mono">{color}</span>.
        </p>
      </main>
    </div>
  );
}