'use client';

import { useState, useEffect, useRef } from 'react';
import { getRandomStory, getStoryById } from '@/lib/api/stories';
import { Story } from '@/types/story';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, RefreshCw, Share2, Lightbulb, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function WisdomPage() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const seenIds = useRef<Set<string>>(new Set());

  // Function to fetch a purely random story
  async function fetchRandomStory() {
    try {
      setRefreshing(true);
      // Min loading time for UX
      const minLoadTime = new Promise(resolve => setTimeout(resolve, 600));
      
      let attempts = 0;
      let newStory: Story | null = null;

      // Retry loop to find a new story
      while (attempts < 3) {
        const res = await getRandomStory();
        if (res.success && res.data) {
           const idStr = String(res.data._id || res.data.id);
           if (!seenIds.current.has(idStr)) {
             newStory = res.data;
             seenIds.current.add(idStr);
             break;
           }
        }
        attempts++;
      }

      await minLoadTime;
      
      if (newStory) {
        setStory(newStory);
      } else if (!story) {
         toast.error("Couldn't find a new story right now");
      } else {
         toast.info("No new stories found, showing the previous one.");
      }
    } catch (error) {
      console.error('Failed to get story', error);
      toast.error('Failed to load wisdom');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Function to fetch a specific story by numeric ID
  async function fetchStoryById(id: number) {
    try {
      setNavigating(true);
      const res = await getStoryById(id.toString());
      if (res.success && res.data) {
        setStory(res.data);
        const idStr = String(res.data._id || res.data.id);
        seenIds.current.add(idStr);
      } else {
        toast.error('Story not found');
      }
    } catch (error) {
      console.error('Failed to get story', error);
      toast.error('Failed to navigate');
    } finally {
      setNavigating(false);
    }
  }

  useEffect(() => {
    fetchRandomStory();
  }, []);

  const handleNext = () => {
    if (story && story.id) {
      fetchStoryById(story.id + 1);
    }
  };

  const handlePrevious = () => {
    if (story && story.id && story.id > 1) {
      fetchStoryById(story.id - 1);
    } else {
      toast.info('This is the first story.');
    }
  };

  const handleShare = () => {
    if (!story) return;

    const content = story.body || story.content || story.text || story.description || '';
    const textToShare = `${story.title}\n\n"${content}"\n\n— ${story.source || 'Daily Wisdom'}`;

    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: textToShare,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Robust Clipboard Copy
      if (navigator.clipboard && navigator.clipboard.writeText) {
         navigator.clipboard.writeText(textToShare)
           .then(() => toast.success('Copied to clipboard'))
           .catch((err) => {
             console.error('Clipboard failed', err);
             toast.error('Failed to copy');
           });
      } else {
         // Fallback for older browsers or non-secure contexts
         try {
           const textArea = document.createElement("textarea");
           textArea.value = textToShare;
           textArea.style.position = "fixed";
           textArea.style.opacity = "0";
           textArea.style.left = "-9999px";
           document.body.appendChild(textArea);
           textArea.focus();
           textArea.select();
           const successful = document.execCommand('copy');
           document.body.removeChild(textArea);
           if (successful) toast.success('Copied to clipboard');
           else toast.error('Failed to copy');
         } catch (err) {
           console.error('Copy fallback failed', err);
           toast.error('Failed to copy');
         }
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 min-h-[80vh] flex flex-col items-center justify-center space-y-8 animate-fade-in pb-24">
      
      {/* Header */}
      <div className="text-center space-y-2 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
           <div className="p-2 bg-primary/10 rounded-full text-primary">
             <Lightbulb className="w-6 h-6" />
           </div>
           <h1 className="text-sm font-bold uppercase tracking-widest text-primary">Daily Wisdom</h1>
        </div>
        <p className="text-lg text-muted-foreground font-medium">
          Authentic lessons from the Sunnah
        </p>
      </div>

      {/* Main Content Card */}
      <div className="w-full relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-50 transition-opacity duration-1000" />
        
        <Card className="relative w-full overflow-hidden border-primary/10 bg-card/80 backdrop-blur-sm p-6 md:p-10 flex flex-col items-center text-center shadow-2xl">
          
          {/* Decorative Pattern Background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
          />

          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm animate-pulse">Finding a gem for you...</p>
            </div>
          ) : story ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={story._id || story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 md:space-y-8 z-10 w-full"
              >
                {/* Icon/Quote */}
                <Quote className="w-10 h-10 text-primary/20 mx-auto transform rotate-180" />

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                  {story.title}
                </h2>

                {/* Body */}
                <div className="relative mb-6">
                   {/* Side lines */}
                   <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent opacity-50" />
                   <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent opacity-50" />
                   
                   <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-serif italic px-6 md:px-8 max-h-[50vh] overflow-y-auto hide-scrollbar">
                     "{story.body || story.content || story.text || story.description || 'No content available'}"
                   </p>
                </div>

                {/* Source */}
                {story.source && (
                   <div className="pt-4 border-t border-border/40 w-full max-w-xs mx-auto pb-2">
                     <p className="text-xs font-bold text-primary uppercase tracking-widest">
                       Source
                     </p>
                     <p className="text-sm text-foreground/80 font-medium mt-1">
                       {story.source}
                     </p>
                   </div>
                )}

              </motion.div>
            </AnimatePresence>
          ) : (
             <div className="py-20 text-muted-foreground">
               Failed to load content.
             </div>
          )}
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4 z-10 items-center">
        
        {/* Previous Button */}
        <Button
           variant="ghost"
           size="icon"
           onClick={handlePrevious}
           disabled={navigating || !story || (story.id !== undefined && story.id <= 1)}
           className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
           title="Previous Story"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Random / New Wisdom Button */}
        <Button 
          variant="outline" 
          size="lg"
          onClick={fetchRandomStory}
          disabled={refreshing || loading}
          className="gap-2 rounded-full border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>New Wisdom</span>
        </Button>

        {/* Next Button */}
        <Button
           variant="ghost"
           size="icon"
           onClick={handleNext}
           disabled={navigating || !story}
           className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
           title="Next Story"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        
        {/* Share Button (moved slightly or kept as auxiliary) */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleShare}
          className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors ml-2"
          title="Share"
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
}
