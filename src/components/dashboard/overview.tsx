'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getUserStats } from '@/lib/api/progress';
import { UserStats } from '@/types';
import { ProgressRing } from '@/components/ui/progress-ring';
import { StatCard } from '@/components/ui/stat-card';
import { FloatingActionButton } from '@/components/ui/fab';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, TrendingUp, Clock, ArrowRight, Play } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { toast } from 'sonner';

export default function DashboardOverview() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // If guest, use mock data
        if (user?.isAnonymous || user?.email === 'guest@example.com' || user?.providerData[0]?.providerId === 'dev-mode') {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 800));
          setStats({
            totalWordsLearned: 12,
            totalFrequencyKnown: 4500,
            memberSince: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            totalAvailableWords: 100,
            quranCoveragePercentage: 15.5,
            progressPercentage: 12,
            recentlyLearned: [
              { id: 1, arabic: 'ٱللَّهِ', translation: 'Allah', transliteration: 'Allah', frequency: 2699 },
              { id: 2, arabic: 'مِن', translation: 'From', transliteration: 'Min', frequency: 3226 },
              { id: 3, arabic: 'إِلَىٰ', translation: 'To', transliteration: 'Ila', frequency: 742 },
              { id: 4, arabic: 'عَلَىٰ', translation: 'On', transliteration: 'Ala', frequency: 670 },
            ]
          });
        } else {
          // Real API call
          const data = await getUserStats();
          if (data.success && data.data) {
            setStats(data.data);
          }
        }
      } catch (error: any) {
        console.error('Failed to fetch stats:', error);
        
        // If 404, user has no stats yet (new user). Use defaults silently.
        if (error.response && error.response.status === 404) {
          setStats({
            totalWordsLearned: 0,
            totalFrequencyKnown: 0,
            quranCoveragePercentage: 0,
            progressPercentage: 0,
            totalAvailableWords: 0,
            memberSince: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            recentlyLearned: []
          });
        } 
        // Only show error toast for real errors (not 404)
        else {
          toast.error('Could not load your progress');
        }
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchStats();
    }
  }, [user]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="space-y-6 pt-4 animate-pulse">
        <div className="h-20 bg-muted/20 rounded-xl" />
        <div className="h-64 bg-muted/20 rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-muted/20 rounded-xl" />
          <div className="h-32 bg-muted/20 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Header / Greeting */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-muted-foreground font-normal">Salam,</span>{' '}
            <span className="text-primary">{user?.displayName?.split(' ')[0] || 'Learning Friend'}</span>
          </h1>
          <p className="text-xs text-muted-foreground">Ready to continue your journey?</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-primary/20 text-primary hover:bg-primary/10 w-8 h-8"
          onClick={() => router.push('/profile')}
        >
          <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
            {user?.displayName?.[0] || 'U'}
          </div>
        </Button>
      </motion.div>

      {/* Main Progress Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Card className="p-4 bg-gradient-to-br from-card/80 to-card/30 border-primary/10 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex-1">
               <p className="text-muted-foreground text-xs mb-1">Total Progress</p>
               <p className="text-sm leading-tight">
                You know <span className="text-primary font-bold">{stats?.quranCoveragePercentage || 0}%</span> of Quranic text!
              </p>
              <p className="text-[10px] text-muted-foreground/70 leading-tight mt-0.5">
                Based on word frequency
              </p>
              
              <Button 
                onClick={() => router.push('/learn')}
                size="sm" 
                className="mt-3 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20 transition-all font-semibold gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Learning
              </Button>
            </div>
            <div className="shrink-0">
              <ProgressRing 
                percentage={stats?.quranCoveragePercentage || 0} 
                size="md" 
                strokeWidth={8}
                className="drop-shadow-[0_0_10px_rgba(16,185,129,0.1)]"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="h-full"
        >
          <StatCard
            label="Words Learned"
            value={stats?.totalWordsLearned || 0}
            icon={<BookOpen className="w-4 h-4" />}
            variant="primary"
            description="Keep going!"
            className="p-3"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="h-full"
        >
          <StatCard
            label="Total Frequency"
            value={formatNumber(stats?.totalFrequencyKnown || 0)}
            icon={<TrendingUp className="w-4 h-4" />}
            variant="accent"
            description="Verses unlocked"
            className="p-3"
          />
        </motion.div>
      </div>

      {/* Recently Learned Carousel */}
      {stats?.recentlyLearned && stats.recentlyLearned.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between px-1">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-accent" />
              Recently Learned
            </h2>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-muted-foreground" onClick={() => router.push('/progress')}>
              View All
            </Button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x hide-scrollbar">
            {stats.recentlyLearned.map((word, i) => (
              <Card 
                key={word.id}
                className="min-w-[120px] p-3 flex flex-col items-center gap-1 bg-card/40 hover:bg-card/60 transition-colors border-border/50 snap-center cursor-pointer"
                onClick={() => router.push(`/words/${word.id}`)}
              >
                <div className="font-arabic text-2xl text-primary">{word.arabic}</div>
                <div className="text-xs font-medium">{word.translation}</div>
                <div className="text-[10px] text-muted-foreground">{word.transliteration}</div>
              </Card>
            ))}
            
            <Card 
              className="min-w-[120px] flex flex-col items-center justify-center gap-1 bg-card/20 hover:bg-card/40 border-dashed border-border transition-colors cursor-pointer snap-center"
              onClick={() => router.push('/progress')}
            >
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">View History</span>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Meaningful Extra Content: Daily Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-4 bg-muted/30 border-none">
          <div className="flex justify-between items-center mb-2">
            <div>
               <h3 className="font-semibold text-sm">Daily Goal</h3>
               <p className="text-[10px] text-muted-foreground">Keep up your 5-day streak!</p>
            </div>
            <span className="text-xs font-bold text-primary">3 / 5 words</span>
          </div>
          <div className="h-2 w-full bg-background rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[60%] rounded-full" />
          </div>
        </Card>
      </motion.div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon={<Play className="w-6 h-6 ml-1 fill-current" />} 
        label="Continue Learning"
        onClick={() => router.push('/learn')}
      />
    </div>
  );
}
