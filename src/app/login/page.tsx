'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import { BookOpen, Loader2, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithGoogle, signInAsGuest, user } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Redirect if already logged in (inside useEffect to avoid render-time updates)
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Prevent flash of content if user is verified
  if (user) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome! Signed in successfully');
      router.push('/');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="relative bg-card border border-primary/20 p-6 rounded-2xl">
              <BookOpen className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to 80% Quran
          </h1>
          <p className="text-muted-foreground">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 space-y-4 bg-card/50 backdrop-blur-xl border-primary/10">
          {/* Google Sign-In (Primary) */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          {/* Dev Mode Guest Login */}
          <Button
            onClick={() => {
              // @ts-ignore
              signInAsGuest();
              router.push('/');
              toast.success('Signed in as Guest (Dev Mode)');
            }}
            variant="outline"
            className="w-full h-11 border-dashed border-primary/40 text-primary hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <UserCircle className="w-4 h-4 mr-2" />
            Dev Mode: Guest Login
          </Button>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
