'use client';

import { useState, useEffect } from 'react';
import { getQuranExamples } from '@/lib/api/quran';
import { QuranSearchResult } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

interface VerseExamplesProps {
  arabicWord: string;
}

export function VerseExamples({ arabicWord }: VerseExamplesProps) {
  const [examples, setExamples] = useState<QuranSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchVerses() {
      if (!arabicWord) return;

      setLoading(true);
      setError(null);
      
      try {
        const response = await getQuranExamples(arabicWord, 2); // Default size 2
        
        if (mounted) {
          const data = response as any;
          const results = data.results 
             || (data.search && data.search.results)
             || (data.data && data.data.results)
             || (data.data && data.data.search && data.data.search.results);

          if (results && results.length > 0) {
            setExamples(results);
          } else {
             // Handle empty or malformed
             setExamples([]);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error("Failed to load verses:", err);
          setError("Could not load usage examples.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchVerses();

    return () => {
      mounted = false;
    };
  }, [arabicWord]);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-24 bg-muted/40 rounded-lg w-full" />
        <div className="h-24 bg-muted/40 rounded-lg w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground bg-muted/20 rounded-lg">
        <AlertCircle className="w-4 h-4 mr-2" />
        {error}
      </div>
    );
  }

  if (examples.length === 0) {
    return (
      <div className="text-center p-4 text-sm text-muted-foreground italic bg-muted/10 rounded-lg">
        No specific verse examples found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground opacity-50 uppercase tracking-wider text-center">
        Usage Examples
      </h3>
      {examples.map((ex, idx) => (
        <Card key={idx} className="p-4 bg-card/50 border-primary/10 hover:border-primary/20 transition-colors">
          <div className="space-y-2">
            
            {/* Arabic Text */}
            <p 
              className="text-xl font-arabic leading-loose text-right opacity-70 text-foreground/90" 
              dir="rtl"
            >
              {ex.text_uthmani || ex.text}
            </p>
            
            <div className="h-px w-full bg-border/40 my-2" />

            {/* Translation & Reference */}
            <div className="flex flex-col gap-1">
               <p className="text-sm text-foreground italic leading-relaxed opacity-90">
                 "{(() => {
                    if (ex.translations && ex.translations.length > 0) return ex.translations[0].text;
                    // Fallback to word-by-word
                    const anyEx = ex as any; 
                    if (anyEx.words && anyEx.words.length > 0) {
                        return anyEx.words
                          .map((w: any) => w.translation?.text)
                          .filter(Boolean)
                          .join(' ')
                          .replace(/[\(\)\[\]]/g, '');
                    }
                    return '';
                 })()}"
               </p>
               <div className="flex justify-end mt-1">
                 <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                   {ex.verse_key}
                 </span>
               </div>
            </div>

          </div>
        </Card>
      ))}
    </div>
  );
}
