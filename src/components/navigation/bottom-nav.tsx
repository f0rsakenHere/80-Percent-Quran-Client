'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, BarChart3, User, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide on login page
  if (pathname === '/login') return null;

  const items = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Learn', icon: BookOpen, path: '/learn' },
    { label: 'Wisdom', icon: Lightbulb, path: '/wisdom' },
    { label: 'Progress', icon: BarChart3, path: '/progress' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full shadow-[0_0_10px_var(--primary)]"
                />
              )}
              
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <Icon className={cn("w-6 h-6", isActive && "fill-current/20")} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
