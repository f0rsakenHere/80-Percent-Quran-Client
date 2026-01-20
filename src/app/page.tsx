'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import DashboardOverview from '@/components/dashboard/overview';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 md:p-8">
        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <DashboardOverview />
        </div>
      </div>
    </ProtectedRoute>
  );
}


