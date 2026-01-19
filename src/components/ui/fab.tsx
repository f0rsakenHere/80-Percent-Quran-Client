'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface FabProps {
  onClick?: () => void;
  icon: ReactNode;
  label?: string;
  className?: string;
  show?: boolean;
}

export function FloatingActionButton({
  onClick,
  icon,
  label,
  className,
  show = true,
}: FabProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className={cn("fixed bottom-24 right-6 z-50", className)}
        >
          <Button
            onClick={onClick}
            size="lg"
            className="h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground px-6 gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            {icon}
            {label && <span className="font-semibold">{label}</span>}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
