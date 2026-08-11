'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  Sliders, 
  Bot, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  HelpCircle,
  BarChart3
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Live Support',
    href: '/dashboard',
    icon: MessageSquare,
    badge: 'Live',
  },
  {
    label: 'Widget Customizer',
    href: '/dashboard/settings',
    icon: Sliders,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Bot className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1">
                ChatEngine <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
              </span>
              <span className="text-[11px] font-medium text-slate-400">Agent Suite</span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-xs"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${isCollapsed ? 'sr-only' : ''}`}>
          Workspace
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50/80 text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />

              {!isCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  {item.badge}
                </span>
              )}

              {/* Active Route Pill Indicator */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Profile & Settings */}
      <div className="border-t border-slate-100 p-3 space-y-1">
        <Link
          href="/help"
          className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <HelpCircle className="h-5 w-5 shrink-0 text-slate-400" />
          {!isCollapsed && <span>Help & Docs</span>}
        </Link>

        <div className={`flex items-center gap-3 rounded-xl p-2 bg-slate-50 border border-slate-200/60 mt-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-8 w-8 shrink-0 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            AG
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 truncate">Agent Account</span>
              <span className="text-[10px] text-slate-400 truncate">agent@chatengine.io</span>
            </div>
          )}
          {!isCollapsed && (
            <button className="text-slate-400 hover:text-rose-600 p-1 transition-colors" title="Log out">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}