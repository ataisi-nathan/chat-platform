import React from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans antialiased">
      {/* Sidebar Shell */}
      <DashboardSidebar />

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}