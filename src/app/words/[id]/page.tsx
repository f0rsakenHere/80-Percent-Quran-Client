'use client';

import { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getWordById } from '@/lib/api/words';
import { Word } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, BarChart3, Tag } from 'lucide-react';
import { VerseExamples } from '@/components/learning/verse-examples';
import { Skeleton } from '@/components/ui/skeleton';

export default function WordDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const wordId = Number(params.id);

  useEffect(() => {
    async function loadWord() {
      if (!wordId) return;
      try {
        setLoading(true);
        const response = await getWordById(wordId);
        if (response.success && response.data) {
          setWord(response.data);
        } else {
          setError('Word not found');
        }
      } catch (err) {
        console.error('Error loading word:', err);
        setError('Failed to load word details');
      } finally {
        setLoading(false);
      }
    }

    loadWord();
  }, [wordId]);

  if (loading) {
     return (
       <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
         <div className="flex items-center gap-4 mb-8">
           <Skeleton className="h-10 w-10 rounded-full" />
           <Skeleton className="h-8 w-32" />
         </div>
         <Skeleton className="h-64 w-full rounded-3xl" />
         <Skeleton className="h-40 w-full rounded-xl" />
       </div>
     );
  }

  if (error || !word) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-muted-foreground">{error || 'Word not found'}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 pb-20 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full hover:bg-muted/50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Word Details</h1>
      </div>

      {/* Hero Card */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full opacity-100 pointer-events-none" />
        <Card className="relative p-8 flex flex-col items-center justify-center border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
             
             {/* Decorative */}
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <BookOpen className="w-10 h-10" />
             </div>

             <div className="space-y-2 text-center z-10">
               <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                 {word.type}
               </span>
               <h2 className="font-arabic text-6xl md:text-7xl text-primary drop-shadow-sm leading-normal py-4">
                 {word.arabic}
               </h2>
                <div className="flex flex-col items-center gap-2 mt-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground/90">{word.translation}</h3>
                  {word.bangla && (
                    <p className="text-3xl md:text-4xl font-bengali text-primary leading-relaxed">{word.bangla}</p>
                  )}
                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mt-1">
                    <p className="text-muted-foreground text-lg italic serif">/{word.transliteration}/</p>
                  </div>
                </div>
             </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center bg-muted/20 border-border/50">
           <BarChart3 className="w-5 h-5 text-primary mb-2" />
           <span className="text-xl font-bold font-mono opacity-70">{word.frequency.toLocaleString()}</span>
           <span className="text-xs text-foreground uppercase tracking-wide font-medium">Occurrences</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center bg-muted/20 border-border/50">
           <Tag className="w-5 h-5 text-accent mb-2" />
           <span className="text-xl font-bold font-mono opacity-70">#{word.id}</span>
           <span className="text-xs text-foreground uppercase tracking-wide font-medium">Rank</span>
        </Card>
      </div>

      {/* Contextual Examples */}
      <div className="pt-4">
        <VerseExamples arabicWord={word.arabic} banglaMeaning={word.bangla} />
      </div>

    </div>
  );
}
