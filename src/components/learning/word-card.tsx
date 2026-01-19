'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Volume2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WordCardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  className?: string;
}

export function WordCard({ word, isFlipped, onFlip, className }: WordCardProps) {
  // Sound handler (placeholder for now)
  const playSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In future: new Audio(word.audioUrl).play();
    console.log('Play audio for:', word.arabic);
  };

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
          className="absolute w-full h-full"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
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
          className="absolute w-full h-full"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)' 
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
  
                <div className="shrink-0 space-y-0.5">
                  <h3 className="text-2xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {word.translation}
                  </h3>
                  <p className="text-base text-primary/80 font-medium italic font-serif">
                    /{word.transliteration}/
                  </p>
                </div>
  
                {/* Quran Verses Section */}
                {word.examples && word.examples.length > 0 && (
                  <div className="w-full text-left space-y-2 pt-2 border-t border-border/50">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground text-center font-semibold mb-1">
                      Usage in Quran
                    </p>
                    {word.examples.slice(0, 2).map((ex, i) => (
                      <div key={i} className="bg-muted/30 p-3 rounded-lg border border-border/30 text-sm">
                        <p className="font-arabic text-base text-right mb-1 leading-relaxed text-foreground/90 py-1" dir="rtl">
                          {(() => {
                            // Simple highlighter
                            const parts = ex.verse.split(word.arabic);
                            if (parts.length === 1) return ex.verse; // No match found
                            return parts.map((part, idx) => (
                               <span key={idx}>
                                 {part}
                                 {idx < parts.length - 1 && (
                                   <span className="text-red-500 font-bold mx-1">{word.arabic}</span>
                                 )}
                               </span>
                            ));
                          })()}
                        </p>
                        {ex.translation ? (
                           <p className="text-xs text-foreground/70 italic leading-normal mt-1.5">
                             "{ex.translation}" <span className="text-primary/70 not-italic font-bold ml-1 text-[10px]">({ex.reference})</span>
                           </p>
                        ) : (
                           <p className="text-xs text-muted-foreground/50 italic leading-normal mt-1.5">
                             Translation unavailable <span className="text-primary/70 not-italic font-bold ml-1">({ex.reference})</span>
                           </p>
                        )}
                      </div>
                    ))}
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
