'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Volume2, RotateCw, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WordCardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  className?: string;
}

export function WordCard({ word, isFlipped, onFlip, className }: WordCardProps) {
  const [playingVerseUrl, setPlayingVerseUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayVerse = (url: string) => {
    // 1. If same URL is playing, pause it
    if (playingVerseUrl === url && audioRef.current) {
        audioRef.current.pause();
        setPlayingVerseUrl(null);
        return;
    }

    // 2. Stop any existing audio
    if (audioRef.current) {
        audioRef.current.pause();
    }

    // 3. Play new
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingVerseUrl(url);

    audio.onended = () => {
        setPlayingVerseUrl(null);
    };

    audio.onerror = () => {
        console.error("Failed to play verse audio");
        setPlayingVerseUrl(null);
    };

    audio.play().catch(err => {
        console.error("Playback error:", err);
        setPlayingVerseUrl(null);
    });
  };
  // Sound handler
  return (
    <div className={cn("relative w-full aspect-[4/5] perspective-1000", className)} onClick={onFlip}>
      <motion.div
        className="w-full h-full relative cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT FACING (Arabic) */}
        <div 
          className="absolute w-full h-full [backface-visibility:hidden]"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            zIndex: isFlipped ? 1 : 2,
            visibility: isFlipped ? 'hidden' : 'visible'
          }}
        >
          <Card className="w-full h-full flex flex-col items-center justify-center p-8 bg-card border-primary/20 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <RotateCw className="w-5 h-5 text-muted-foreground" />
            </div>
            
            {/* Design: Soft Spotlight Background (Replaces Circle) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[120%] h-[80%] bg-primary/5 blur-3xl rounded-full" />
            </div>

            {/* 1. The Container: Fixed Height + Flex Center */}
            <div className="relative flex h-64 w-full items-center justify-center overflow-visible z-10">
              {/* 2. The Text: Open Typography */}
              <h2 
                className="font-arabic text-7xl md:text-8xl text-center w-full leading-normal text-primary drop-shadow-md"
              >
                {word.arabic}
              </h2>
            </div>
            
            <div className="absolute bottom-6 text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-50">
              Tap to flip
            </div>
          </Card>
        </div>

        {/* BACK FACING (Details) */}
        <div 
          className="absolute w-full h-full [backface-visibility:hidden]"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            zIndex: isFlipped ? 2 : 1,
            visibility: isFlipped ? 'visible' : 'hidden'
          }}
        >
          <Card className="w-full h-full flex flex-col p-5 bg-card border-accent/20 shadow-xl relative overflow-hidden">
            {/* Scroll Container */}
            <div className="flex-1 w-full overflow-y-auto hide-scrollbar space-y-3 pb-8">
              
              <div className="flex flex-col items-center text-center space-y-2 w-full">
                
                {/* Type Badge */}
                <div className="shrink-0 inline-flex items-center px-3 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-semibold uppercase tracking-wider">
                  {word.type} • #{word.id}
                </div>
  
                <div className="shrink-0 flex flex-col items-center justify-center gap-3 py-2">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground/90 leading-snug">
                    {word.translation}
                  </h3>
                  {word.bangla && (
                    <p className="text-2xl md:text-3xl font-bengali text-primary leading-relaxed -mt-1">
                      {word.bangla}
                    </p>
                  )}
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                    <p className="text-sm text-primary/80 font-medium italic font-serif">
                      /{word.transliteration}/
                    </p>
                  </div>
                </div>
  
                {/* Quran Verses Section */}
                {word.examples && word.examples.length > 0 && (
                  <div className="w-full text-left space-y-2 pt-2 border-t border-border/50">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground text-center font-semibold mb-1">
                      Usage in Quran
                    </p>
                    {word.examples.slice(0, 2).map((ex, i) => {
                      // Extract Surah and Ayah from reference (e.g. "1:1" or "Al-Fatiha 1:1")
                      const match = ex.reference.match(/(\d+):(\d+)/);
                      const surah = match ? match[1].padStart(3, '0') : null;
                      const ayah = match ? match[2].padStart(3, '0') : null;
                      const audioUrl = surah && ayah ? `https://everyayah.com/data/Alafasy_128kbps/${surah}${ayah}.mp3` : null;

                      const isPlaying = playingVerseUrl === audioUrl;

                      return (
                        <div key={i} className="bg-muted/30 p-3 rounded-lg border border-border/30 text-sm">
                          <p className="font-arabic text-base text-right mb-1 leading-relaxed text-foreground/90 py-1" dir="rtl">
                            {(() => {
                                const removeDiacritics = (t: string) => t.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0610-\u061A\u0640]/g, '');
                                const cleanSearch = removeDiacritics(word.arabic);
                                
                                if (!cleanSearch) return ex.verse;

                                // Build a flexible regex pattern
                                // 1. Escape special regex chars
                                // 2. Map Arabic chars to flexible groups (e.g. Alefs)
                                // 3. Insert optional diacritics between every char
                                const chars = cleanSearch.split('');
                                
                                const getCharPattern = (char: string) => {
                                  // Alef variations: Alif, Alif with Hamzas, Alif Madda, Alif Wasla
                                  if (/[اأإآٱ]/.test(char)) return '[اأإآٱ]';
                                  // Ya / Alif Maqsura (optional, usually good to safely distinguish but sometimes mixed)
                                  if (/[يى]/.test(char)) return '[يى]';
                                  // Ta Marbuta / Ha (often distinct but sometimes worth grouping if data is messy)
                                  // if (/[ةه]/.test(char)) return '[ةه]';
                                  
                                  return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                };
                                
                                const diacriticsPattern = '[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0610-\\u061A\\u0640]*';
                                
                                const pattern = chars
                                  .map(getCharPattern)
                                  .join(diacriticsPattern); 
                                
                                const regex = new RegExp(`(${pattern})`, 'g');
                                const parts = ex.verse.split(regex);

                                if (parts.length === 1) return ex.verse;

                                return parts.map((part, idx) => {
                                  // Odd indices are the captured matches
                                  if (idx % 2 === 1) {
                                    return (
                                      <span key={idx} className="text-primary font-bold mx-0.5 drop-shadow-sm">
                                        {part}
                                      </span>
                                    );
                                  }
                                  return <span key={idx}>{part}</span>;
                                });
                            })()}
                          </p>
                          {ex.translation ? (
                             <div className="flex flex-col gap-1.5 mt-2">
                                <p className="text-sm font-bengali text-foreground/90 leading-relaxed">
                                  {(() => {
                                    const text = ex.translation.replace(/\s*\d+\s*$/, '');
                                    if (!word.bangla) return `"${text}"`;

                                    // 1. Split definition into individual words
                                    // "তা থেকে / তা হতে" -> ["তা", "থেকে", "হতে"]
                                    const allWords = word.bangla
                                      .split(/[\/\s,]+/) // Split by slash, space, comma
                                      .map(s => s.trim())
                                      .filter(w => w.length > 0);
                                    
                                    const uniqueWords = Array.from(new Set(allWords));
                                    
                                    if (uniqueWords.length === 0) return `"${text}"`;

                                    // 2. Sort by length descending to match longer words first
                                    // e.g. ["থেকে", "হতে", "তা"]
                                    uniqueWords.sort((a, b) => b.length - a.length);

                                    // 3. Create Regex from tokens
                                    const patternString = uniqueWords
                                      .map(w => {
                                        const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                        // For short words (<= 2 chars), enforce boundaries to avoid matching inside unrelated words
                                        // e.g. avoid matching "তা" (ta) inside "তারা" (tara - they)
                                        // Bengali Unicode Range: \u0980-\u09FF
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
                               <div className="flex items-center justify-between">
                                  {audioUrl && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlayVerse(audioUrl);
                                      }}
                                      className="h-6 px-2 text-[10px] text-primary hover:text-primary hover:bg-primary/10 gap-1.5"
                                    >
                                      {isPlaying ? (
                                        <>
                                          <Pause className="w-3 h-3" />
                                          Playing...
                                        </>
                                      ) : (
                                        <>
                                          <Volume2 className="w-3 h-3" />
                                          Listen
                                        </>
                                      )}
                                    </Button>
                                  )}
                                  <span className="text-primary/70 font-bold text-[10px] ml-auto">({ex.reference})</span>
                               </div>
                             </div>
                          ) : (
                             <p className="text-xs text-muted-foreground/50 italic leading-normal mt-1.5">
                               Translation unavailable <span className="text-primary/70 not-italic font-bold ml-1">({ex.reference})</span>
                             </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {(!word.examples || word.examples.length === 0) && (
                   <div className="flex-1 w-full flex items-center justify-center text-xs text-muted-foreground italic min-h-[100px]">
                      No examples available
                   </div>
                )}
  
              </div>
            </div>

            {/* Bottom Scroll Gradient Hint */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
