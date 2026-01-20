'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import DashboardOverview from '@/components/dashboard/overview';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 md:p-8">
        {/* Background Image - Calligraphy Vortex */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
          <div 
            className="absolute inset-0 opacity-[0.06] dark:opacity-[0.10]"
            style={{
              backgroundImage: 'url(/bg-pattern.jpg)',
              backgroundSize: '150%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <DashboardOverview />
        </div>
      </div>
    </ProtectedRoute>
  );
}

