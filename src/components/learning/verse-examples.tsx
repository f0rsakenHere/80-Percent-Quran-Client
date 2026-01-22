'use client';

import { useState, useEffect, useRef } from 'react';
import { getQuranExamples } from '@/lib/api/quran';
import { QuranSearchResult } from '@/types/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Volume2, Pause } from 'lucide-react';

interface VerseExamplesProps {
  arabicWord: string;
  banglaMeaning?: string; // Optional Bengali meaning for highlighting
}

export function VerseExamples({ arabicWord, banglaMeaning }: VerseExamplesProps) {
  const [examples, setExamples] = useState<QuranSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchVerses() {
      if (!arabicWord) return;

      setLoading(true);
      setError(null);
      
      try {
        // Backend now returns both Bengali and English by default
        const response = await getQuranExamples(arabicWord, 2);
        
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

  const handlePlayAudio = async (index: number, verseKey: string) => {
    // 1. Stop if currently playing same verse
    if (playingIndex === index && audioRefs.current[index]) {
      audioRefs.current[index]?.pause();
      setPlayingIndex(null);
      return;
    }

    // 2. Stop any other playing verse
    if (playingIndex !== null && audioRefs.current[playingIndex]) {
      audioRefs.current[playingIndex]?.pause();
    }

    // 3. Construct URL for Full Verse Recitation (Mishary Alafasy)
    // Format: https://everyayah.com/data/Alafasy_128kbps/SSSAAA.mp3 (3 digits zero padded)
    const [surah, ayah] = verseKey.split(':');
    if (!surah || !ayah) return;
    
    const paddedSurah = surah.padStart(3, '0');
    const paddedAyah = ayah.padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}${paddedAyah}.mp3`;

    // 4. Play new audio
    setPlayingIndex(index);
    
    const audio = new Audio(audioUrl);
    audioRefs.current[index] = audio;

    audio.onended = () => {
      setPlayingIndex(null);
    };

    audio.onerror = (e) => {
      console.warn("Audio failed to load:", audioUrl);
      setPlayingIndex(null);
    };

    try {
      await audio.play();
    } catch (err) {
      console.warn('Playback interrupted:', err);
      setPlayingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground opacity-50 uppercase tracking-wider text-center">
        Usage Examples
      </h3>
      
      {examples.map((ex, idx) => (
        <Card 
          key={idx} 
          className={`p-4 bg-card/50 transition-all duration-300 ${
            playingIndex === idx 
              ? 'border-primary/50 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)] bg-primary/5' 
              : 'border-primary/10 hover:border-primary/20'
          }`}
        >
          <div className="space-y-2">
            
            {/* Arabic Text */}
            <p 
              className="text-xl font-arabic leading-loose text-right opacity-90 text-foreground" 
              dir="rtl"
            >
               {(() => {
                 const text = ex.text_uthmani || ex.text || "";
                 // Normalize text for matching (simple approach)
                 // Note: Ideally we'd match exact IDs, but splitting by the lemma/word is a good visual approximation
                 const parts = text.split(arabicWord);
                 if (parts.length === 1) return text;
                 
                 return parts.map((part, i) => (
                   <span key={i}>
                     {part}
                     {i < parts.length - 1 && (
                       <span className="text-primary font-bold mx-0.5 drop-shadow-sm">{arabicWord}</span>
                     )}
                   </span>
                 ));
               })()}
            </p>
            
            <div className="h-px w-full bg-border/40 my-2" />

            {/* Translations (English & Bengali) */}
            <div className="flex flex-col gap-2">
               {ex.translations && ex.translations.length > 0 ? (
                 // Display single Bengali translation
                 (() => {
                   const cleanText = ex.translations[0].text
                     .replace(/<[^>]*>/g, '') 
                     .replace(/(\d+)/g, '')   
                     .trim();
                   
                   return (
                     <p className="text-lg font-bengali text-foreground/95 leading-relaxed">
                       {(() => {
                         // Highlighting Logic (Same as WordCard)
                         const text = cleanText;
                         if (!banglaMeaning) return `"${text}"`;

                         // 1. Split definition into individual words
                         const allWords = banglaMeaning
                           .split(/[\/\s,]+/)
                           .map(s => s.trim())
                           .filter(w => w.length > 0);
                         
                         const uniqueWords = Array.from(new Set(allWords));
                         
                         if (uniqueWords.length === 0) return `"${text}"`;

                         // 2. Sort by length descending
                         uniqueWords.sort((a, b) => b.length - a.length);

                         // 3. Create Regex from tokens with boundary checks for short words
                         const patternString = uniqueWords
                           .map(w => {
                             const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                             if (w.length <= 2) {
                                return `(?<![\\u0980-\\u09FF])${escaped}(?![\\u0980-\\u09FF])`;
                             }
                             return escaped;
                           })
                           .join('|');
                         
                         const regex = new RegExp(`(${patternString})`, 'gi');
                         const parts = text.split(regex);

                         return (
                           <>
                             "{parts.map((part, i) => (
                               regex.test(part) ? (
                                 <span key={i} className="text-primary font-bold">
                                   {part}
                                 </span>
                               ) : (
                                 <span key={i}>{part}</span>
                               )
                             ))}"
                           </>
                         );
                       })()}
                     </p>
                   );
                 })()
               ) : (
                 // Fallback to word-by-word translation
                 <p className="text-sm text-foreground italic leading-relaxed opacity-90">
                   "{(() => {
                     const anyEx = ex as any; 
                     if (anyEx.words && anyEx.words.length > 0) {
                         return anyEx.words
                           .map((w: any) => w.translation?.text)
                           .filter(Boolean)
                           .join(' ')
                           .replace(/[\(\)\[\]]/g, '')
                           .replace(/(\d+)/g, '') // remove numbers
                           .trim();
                     }
                     return '';
                   })()}"
                 </p>
               )}
               <div className="flex justify-between items-center mt-1">
                 <Button
                   size="sm"
                   variant="ghost"
                   onClick={() => handlePlayAudio(idx, ex.verse_key)}
                   className="h-7 px-2 text-xs text-foreground hover:text-primary hover:bg-primary/10"
                 >
                   {playingIndex === idx ? (
                     <>
                       <Pause className="w-3.5 h-3.5 mr-1" />
                       Playing...
                     </>
                   ) : (
                     <>
                       <Volume2 className="w-3.5 h-3.5 mr-1" />
                       Listen
                     </>
                   )}
                 </Button>
                 <span className="text-xs font-bold text-foreground bg-primary/20 px-2 py-0.5 rounded">
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
