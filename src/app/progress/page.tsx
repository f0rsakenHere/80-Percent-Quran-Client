'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { getUserStats, getLearnedWords } from '@/lib/api/progress';
import { UserStats, Word } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/progress-ring';
import { StatCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, TrendingUp, Calendar, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { formatNumber } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ProgressPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [learnedWords, setLearnedWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (user?.isAnonymous || user?.providerData[0]?.providerId === 'dev-mode') {
           // Mock Data for Guest
           await new Promise(r => setTimeout(r, 800));
           setStats({
             totalWordsLearned: 3,
             totalFrequencyKnown: 7283,
             memberSince: new Date().toISOString(),
             lastActive: new Date().toISOString(),
             totalAvailableWords: 100,
             quranCoveragePercentage: 62,
             progressPercentage: 3,
             recentlyLearned: []
           });
           setLearnedWords([
             { _id: '4', id: 4, arabic: 'اللَّهِ', translation: 'Allah', transliteration: 'Allāh', frequency: 940, type: 'Noun', createdAt: '', updatedAt: '' },
             { _id: '1', id: 1, arabic: 'مِنْ', translation: 'From', transliteration: 'Min', frequency: 1673, type: 'Noun', createdAt: '', updatedAt: '' },
             { _id: '17', id: 17, arabic: 'إِلَى', translation: 'To', transliteration: 'Ilā', frequency: 405, type: 'Noun', createdAt: '', updatedAt: '' },
           ]);
        } else {
           // Real API
           const statsRes = await getUserStats();
           if (statsRes.success && statsRes.data) {
             setStats(statsRes.data);
           }
           
           const wordsRes = await getLearnedWords(page, 20);
           if (wordsRes.success && wordsRes.data) {
             setLearnedWords(wordsRes.data.words);
             setHasMore(wordsRes.data.pagination.currentPage < wordsRes.data.pagination.totalPages);
           }
        }
      } catch (err: any) {
        console.error("Failed to load progress:", err);
        
        // If 404, it just means no stats yet (new user). Use defaults.
        if (err.response && err.response.status === 404) {
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
        // Only show toast if it's not a 404 and not a mock/guest user
        else if (!user?.isAnonymous) {
             toast.error("Could not sync progress. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    }

    if (user) {
        loadData();
    }
  }, [user, page]);

  if (loading && !stats) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-2">
           <Skeleton className="h-10 w-10 rounded-full" />
           <Skeleton className="h-8 w-40" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3">
           <Skeleton className="col-span-2 h-40 rounded-xl" />
           <Skeleton className="h-24 rounded-xl" />
           <Skeleton className="h-24 rounded-xl" />
        </div>

        {/* Vocabulary List Skeleton */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <Skeleton className="h-6 w-32" />
             <Skeleton className="h-4 w-16" />
           </div>
           <Skeleton className="h-24 rounded-xl" />
           <Skeleton className="h-24 rounded-xl" />
           <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6 pb-24">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Your Progress</h1>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div 
          className="col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-to-br from-card/80 to-card/30 border-primary/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-10 -mt-10" />
             
             <div className="flex flex-row items-center justify-between gap-4 relative z-10">
               <div className="flex-1 space-y-1">
                 <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Quran Coverage</p>
                 <div className="flex items-baseline gap-1">
                    <h2 className="text-3xl font-bold text-primary">{stats?.quranCoveragePercentage || 0}%</h2>
                 </div>
                 <p className="text-xs text-muted-foreground leading-tight max-w-[160px]">
                   You understand <span className="text-primary font-bold">{stats?.quranCoveragePercentage || 0}%</span> of the Quran's vocabulary!
                 </p>
               </div>
               <div className="shrink-0">
                 <ProgressRing 
                   percentage={stats?.quranCoveragePercentage || 0} 
                   size="md" 
                   strokeWidth={8} 
                   className="drop-shadow-md"
                 />
               </div>
             </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
            <StatCard 
                label="Total Words" 
                value={stats?.totalWordsLearned || 0} 
                icon={<BookOpen className="w-4 h-4" />}
                variant="primary"
            />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
            <StatCard 
                label="Verses Unlocked" 
                value={formatNumber(stats?.totalFrequencyKnown || 0)} 
                icon={<TrendingUp className="w-4 h-4" />}
                variant="accent"
            />
        </motion.div>
      </div>

      {/* Vocabulary Bank */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Vocabulary Bank
            </h2>
            <span className="text-xs text-muted-foreground">{learnedWords.length} words</span>
        </div>
        
         {/* List */}
         <div className="space-y-3">
            {learnedWords.length === 0 ? (
               <Card className="p-8 flex flex-col items-center justify-center text-center space-y-3 bg-muted/20 border-border/50">
                  <BookOpen className="w-10 h-10 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm">You haven't learned any words yet.</p>
                  <Button onClick={() => router.push('/learn')} variant="outline">Start Learning</Button>
               </Card>
            ) : (
              learnedWords.map((word, index) => (
                 <motion.div
                   key={word.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.05 }}
                 >
                   <Card 
                     className="p-4 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                     onClick={() => router.push(`/words/${word.id}`)}
                   >
                      {/* Background gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-center gap-4 relative z-10">
                        {/* Arabic Circle - Larger & More Prominent */}
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all group-hover:scale-105">
                            <span className="font-arabic text-2xl text-primary drop-shadow-sm">
                              {word.arabic}
                            </span>
                          </div>
                        </div>
                        
                        {/* Content - Better Typography */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                            {word.translation}
                          </h3>
                          <p className="text-sm text-muted-foreground italic mt-0.5">
                            /{word.transliteration}/
                          </p>
                        </div>
                        
                        {/* Frequency Badge - Premium Design */}
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Freq</span>
                            <span className="text-sm font-bold text-foreground font-mono bg-primary/10 px-2 py-0.5 rounded-md">
                              {formatNumber(word.frequency)}
                            </span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                   </Card>
                 </motion.div>
              ))
            )}
         </div>
        
        {/* Simple Pagination */}
        {hasMore && !user?.isAnonymous && (
           <Button 
             variant="ghost" 
             className="w-full text-xs text-muted-foreground"
             onClick={() => setPage(p => p + 1)}
           >
             Load More
           </Button>
        )}
      </motion.div>

    </div>
  );
}
