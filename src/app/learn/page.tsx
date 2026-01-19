'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import LearningSession from '@/components/learning/learning-session';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LearnPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="h-full flex flex-col">
        {/* Simple Header */}
        <header className="px-6 py-4 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="font-bold text-lg">Learning Mode</div>
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <X className="w-6 h-6" />
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 flex flex-col justify-center min-h-[calc(100vh-140px)]">
            <div className="relative z-10 w-full max-w-lg mx-auto">
                <LearningSession />
            </div>
            
            {/* Background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] left-[-10%] w-[40vh] h-[40vh] bg-primary/5 rounded-full blur-[80px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[40vh] h-[40vh] bg-accent/5 rounded-full blur-[80px]" />
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
