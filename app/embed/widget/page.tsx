// app/embed/widget/page.tsx
import { Suspense } from 'react';
import WidgetEmbedContent from './WidgetEmbedContent';

export default function WidgetEmbedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <WidgetEmbedContent />
    </Suspense>
  );
}