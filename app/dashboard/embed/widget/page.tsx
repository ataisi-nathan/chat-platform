import { Suspense } from 'react';
import WidgetEmbedContent from './WidgetEmbedContent';

export default function WidgetEmbedPage() {
  return (
    <Suspense fallback={<WidgetEmbedSkeleton />}>
      <WidgetEmbedContent />
    </Suspense>
  );
}

function WidgetEmbedSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}