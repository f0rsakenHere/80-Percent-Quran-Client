'use client';

import { BottomNav } from '@/components/navigation/bottom-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-20 md:pb-0">
      
      <main className="flex-1 w-full max-w-md mx-auto md:max-w-4xl md:border-x md:border-border">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
