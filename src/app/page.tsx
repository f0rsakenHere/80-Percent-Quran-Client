'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import DashboardOverview from '@/components/dashboard/overview';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 md:p-8">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
          <div className="absolute top-0 -left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 -right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <DashboardOverview />
        </div>
      </div>
    </ProtectedRoute>
  );
}

