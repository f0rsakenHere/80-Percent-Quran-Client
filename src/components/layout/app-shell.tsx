'use client';

import { BottomNav } from '@/components/navigation/bottom-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-20 md:pb-0">
      
      {/* Global Banner */}
      <div className="w-full text-center py-2 bg-red-500/10 backdrop-blur-sm border-b border-red-500/20 z-50">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Justice for Osman Hadi ✊</p>
      </div>

      <main className="flex-1 w-full max-w-md mx-auto md:max-w-4xl md:border-x md:border-border">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
