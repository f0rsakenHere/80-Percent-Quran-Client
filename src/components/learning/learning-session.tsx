'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/types';
import { WordCard } from '@/components/learning/word-card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { getWordsToLearn } from '@/lib/api/words';
import { markWordLearned } from '@/lib/api/progress';
import { getQuranExamples } from '@/lib/api/quran';
import { CheckCircle2, RotateCcw, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function LearningSession() {
  const router = useRouter();
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);
  
  // Confetti dimensions
  const { width, height } = useWindowSize(); // Optional hook, can mock or install 'react-use'

  useEffect(() => {
    loadSession();
  }, [user]);

  async function loadSession() {
    setLoading(true);
    try {
      if (user?.isAnonymous || user?.providerData[0]?.providerId === 'dev-mode') {
        // Guest Mock Data
        await new Promise(r => setTimeout(r, 1000));
        setWords([
          { 
            _id: '4', id: 4, arabic: 'اللَّهِ', translation: 'Allah', transliteration: 'Allāh', frequency: 940, type: 'Noun', createdAt: '', updatedAt: '',
            examples: [
              { verse: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', reference: '1:1' },
              { verse: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ', translation: 'All praise is due to Allah, Lord of the worlds.', reference: '1:2' }
            ]
          },
          { 
            _id: '1', id: 1, arabic: 'مِنْ', translation: 'From', transliteration: 'Min', frequency: 1673, type: 'Noun', createdAt: '', updatedAt: '',
            examples: [
              { verse: 'مِن شَرِّ مَا خَلَقَ', translation: 'From the evil of that which He created', reference: '113:2' },
              { verse: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translation: 'And from the evil of darkness when it settles', reference: '113:3' }
            ]
          },
          { 
            _id: '17', id: 17, arabic: 'إِلَى', translation: 'To', transliteration: 'Ilā', frequency: 405, type: 'Noun', createdAt: '', updatedAt: '',
            examples: [
              { verse: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', translation: 'Indeed we belong to Allah, and indeed to Him we will return.', reference: '2:156' },
              { verse: 'وَإِلَى ٱللَّهِ تُرْجَعُ ٱلْأُمُورُ', translation: 'And to Allah all matters return.', reference: '3:109' }
            ] 
          },
          { 
             _id: '9', id: 9, arabic: 'عَلَى', translation: 'On', transliteration: "ʿAlā", frequency: 670, type: 'Noun', createdAt: '', updatedAt: '',
             examples: [
               { verse: 'عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ', translation: 'On a straight path.', reference: '36:4' },
               { verse: 'وَعَلَى ٱللَّهِ فَلْيَتَوَكَّلِ ٱلْمُؤْمِنُونَ', translation: 'And upon Allah let the believers rely.', reference: '3:122' }
             ]
          },
          { 
            _id: '2', id: 2, arabic: 'فِي', translation: 'In', transliteration: 'Fiy', frequency: 1185, type: 'Noun', createdAt: '', updatedAt: '',
            examples: [
               { verse: 'فِي قُلُوبِهِم مَّرَضٌ', translation: 'In their hearts is disease', reference: '2:10' },
               { verse: 'لَقَدْ كَانَ لَكُمْ فِي رَسُولِ ٱللَّهِ أُسْوَةٌ حَسَنَةٌ', translation: 'There has certainly been for you in the Messenger of Allah an excellent pattern', reference: '33:21' }
            ]
          },
        ]);
      } else {
        const res = await getWordsToLearn(10);
        if (res.success && res.data && res.data.words) {
          // Hydrate with examples if missing
          const hydratedWords = await Promise.all(res.data.words.map(async (word: any) => {
             try {
               // Only fetch if not already present
               if (!word.examples) {
                   let exRes;
                   try {
                     exRes = await getQuranExamples(word.arabic, 2);
                   } catch (firstError) {
                     // Retry with simple Arabic (no diacritics)
                     const simpleArabic = word.arabic.replace(/[\u064B-\u065F\u0670]/g, '');
                     if (simpleArabic !== word.arabic) {
                       try {
                         exRes = await getQuranExamples(simpleArabic, 2);
                       } catch (secondError) {
                         throw firstError; // Throw original error if fallback also fails
                       }
                     } else {
                       throw firstError;
                     }
                   }
                   // Robust check for results (handle {results:[]} or {data:{results:[]}} or {success:true, data:...})
                   const data = exRes as any;
                   const searchResults = data.results 
                       || (data.search && data.search.results)
                       || (data.data && data.data.results)
                       || (data.data && data.data.search && data.data.search.results);

                   if (searchResults) {
                      return {
                        ...word,
                        examples: searchResults.map((r: any) => {
                           let translationText = '';
                           if (r.translations && r.translations.length > 0) {
                               translationText = r.translations[0].text
                                   .replace(/<[^>]*>/g, '') // remove HTML
                                   .replace(/(\d+)/g, '')   // remove numbers/footnotes
                                   .trim();
                           } else if (r.words && r.words.length > 0) {
                               // Clean up word-by-word translation (remove brackets for smoother reading)
                               translationText = r.words
                                 .map((w: any) => w.translation?.text)
                                 .filter(Boolean)
                                 .join(' ')
                                 .replace(/[\(\)\[\]]/g, ''); // Remove ( ) [ ]
                           }

                           return {
                               verse: r.text_uthmani || r.text,
                               translation: translationText,
                               reference: r.verse_key
                           };
                        })
                      };
                   }
               }
               return word;
             } catch (e) {
               console.warn('Failed to fetch examples for', word.arabic);
               return word;
             }
          }));
          setWords(hydratedWords);
        }
      }
    } catch (error) {
      console.error('Failed to load session', error);
      // Fallback to mock data
      setWords([
        { 
          _id: '4', id: 4, arabic: 'اللَّهِ', translation: 'Allah', transliteration: 'Allāh', frequency: 940, type: 'Noun', createdAt: '', updatedAt: '',
          examples: [
            { verse: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', reference: '1:1' },
            { verse: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ', translation: 'All praise is due to Allah, Lord of the worlds.', reference: '1:2' }
          ]
        },
        { 
          _id: '1', id: 1, arabic: 'مِنْ', translation: 'From', transliteration: 'Min', frequency: 1673, type: 'Noun', createdAt: '', updatedAt: '',
          examples: [
            { verse: 'مِن شَرِّ مَا خَلَقَ', translation: 'From the evil of that which He created', reference: '113:2' },
            { verse: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translation: 'And from the evil of darkness when it settles', reference: '113:3' }
          ]
        },
        { 
          _id: '17', id: 17, arabic: 'إِلَى', translation: 'To', transliteration: 'Ilā', frequency: 405, type: 'Noun', createdAt: '', updatedAt: '',
          examples: [
            { verse: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', translation: 'Indeed we belong to Allah, and indeed to Him we will return.', reference: '2:156' },
            { verse: 'وَإِلَى ٱللَّهِ تُرْجَعُ ٱلْأُمُورُ', translation: 'And to Allah all matters return.', reference: '3:109' }
          ] 
        },
        { 
           _id: '9', id: 9, arabic: 'عَلَى', translation: 'On', transliteration: "ʿAlā", frequency: 670, type: 'Noun', createdAt: '', updatedAt: '',
           examples: [
             { verse: 'عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ', translation: 'On a straight path.', reference: '36:4' },
             { verse: 'وَعَلَى ٱللَّهِ فَلْيَتَوَكَّلِ ٱلْمُؤْمِنُونَ', translation: 'And upon Allah let the believers rely.', reference: '3:122' }
           ]
        },
        { 
          _id: '2', id: 2, arabic: 'فِي', translation: 'In', transliteration: 'Fiy', frequency: 1185, type: 'Noun', createdAt: '', updatedAt: '',
          examples: [
             { verse: 'فِي قُلُوبِهِم مَّرَضٌ', translation: 'In their hearts is disease', reference: '2:10' },
             { verse: 'لَقَدْ كَانَ لَكُمْ فِي رَسُولِ ٱللَّهِ أُسْوَةٌ حَسَنَةٌ', translation: 'There has certainly been for you in the Messenger of Allah an excellent pattern', reference: '33:21' }
          ]
        },
      ]);
      toast.error('Network error. Using offline mode.');
    } finally {
      setLoading(false);
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = async (learned: boolean) => {
    if (learned) {
      setLearnedCount(prev => prev + 1);
      // API call to mark learned (fire and forget for UI responsiveness)
      if (user && !user.isAnonymous && user.providerData[0]?.providerId !== 'dev-mode') {
         markWordLearned(words[currentIndex].id).catch(e => console.error(e));
      }
      toast.success('Marked as learned!', { duration: 1500 });
    }

    // Reset card state
    setIsFlipped(false);

    // Move to next card after short delay for animation
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setSessionComplete(true);
      }
    }, 200);
  };

  const restartSession = () => {
    setSessionComplete(false);
    setCurrentIndex(0);
    setLearnedCount(0);
    loadSession(); // reload new words? or same? For now reload.
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Preparing your session...</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center max-w-md mx-auto">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
        <h2 className="text-2xl font-bold">You're all caught up!</h2>
        <p className="text-muted-foreground">
          You've learned all available words for now. Come back later for more!
        </p>
        <Button onClick={() => router.push('/')}>Return Home</Button>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center max-w-md mx-auto relative">
        <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-5xl"
        >
          🎉
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Session Complete!</h2>
          <p className="text-muted-foreground">
            You reviewed <span className="text-primary font-bold">{words.length}</span> words and mastered <span className="text-accent font-bold">{learnedCount}</span> new ones.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 sm:flex-row justify-center">
          <Button variant="outline" onClick={() => router.push('/')} className="gap-2">
            Go Home
          </Button>
          <Button onClick={restartSession} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Start Another Session
          </Button>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const progress = ((currentIndex) / words.length) * 100;

  return (
    <div className="max-w-md mx-auto mb-14">
      {/* Progress Header */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <span>Session Progress</span>
          <span>{currentIndex + 1} / {words.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Card Container */}
      <div className="mb-8">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentWord.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <WordCard 
              word={currentWord} 
              isFlipped={isFlipped} 
              onFlip={handleFlip} 
              className="shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="secondary" 
          size="lg" 
          className="h-14 text-base font-semibold"
          onClick={() => handleNext(false)}
        >
          Still Learning
        </Button>
        <Button 
          size="lg"
          className="h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          onClick={() => handleNext(true)}
        >
          <CheckCircle2 className="w-5 h-5" />
          I Know This
        </Button>
      </div>
      

    </div>
  );
}
