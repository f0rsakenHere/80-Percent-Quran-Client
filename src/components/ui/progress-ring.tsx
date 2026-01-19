'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressRing({
  percentage,
  size = 'md',
  strokeWidth = 8,
  showLabel = true,
  className,
}: ProgressRingProps) {
  // Ensure the ring fits within the 100x100 viewBox by adjusting radius based on strokeWidth
  const radius = 50 - (strokeWidth / 2); 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Background Ring */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-muted/20"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress Ring */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-primary"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      
      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("font-bold text-primary", textSizes[size])}
          >
            {Math.round(percentage)}%
          </motion.span>
          {size !== 'sm' && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-muted-foreground uppercase tracking-widest"
            >
              Quran
            </motion.span>
          )}
        </div>
      )}
    </div>
  );
}
