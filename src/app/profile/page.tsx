'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  User as UserIcon, 
  Settings, 
  Moon, 
  Bell, 
  ShieldAlert, 
  ChevronRight,
  ArrowLeft,
  Mail,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, signOut } = useAuth(); 
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      router.push('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const memberSince = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">My Profile</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-gradient-to-br from-card/80 to-card/30 border-primary/20 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
            
            <div className="relative z-10 shrink-0">
               <div className="w-24 h-24 rounded-full border-4 border-primary/10 bg-primary/5 flex items-center justify-center text-3xl font-bold text-primary mb-2 sm:mb-0">
                 {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
                 ) : (
                    initials
                 )}
               </div>
            </div>

            <div className="space-y-1 relative z-10 flex-1">
               <h2 className="text-2xl font-bold">{user?.displayName || 'User'}</h2>
               <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  <span>{user?.email}</span>
               </div>
               <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground pt-1">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {memberSince}</span>
               </div>
            </div>
            
            {user?.providerData[0]?.providerId === 'dev-mode' && (
                <div className="absolute top-4 right-4 z-20">
                    <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase border border-amber-500/20">
                        Guest Mode
                    </span>
                </div>
            )}
        </Card>
      </motion.div>

      {/* Settings Sections */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* App Settings */}
        <div className="space-y-3">
           <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">Preferences</h3>
           <Card className="divide-y divide-border/50 bg-card/50">
              <div className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                       <Moon className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="font-medium text-sm">Appearance</p>
                       <p className="text-xs text-muted-foreground">Dark mode is on</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                     <span className="text-xs text-muted-foreground">Managed by system</span>
                 </div>
              </div>
              <div className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors cursor-not-allowed opacity-70">
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-accent/10 text-accent">
                       <Bell className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="font-medium text-sm">Notifications</p>
                       <p className="text-xs text-muted-foreground">Daily reminders</p>
                    </div>
                 </div>
                 <Switch checked={true} disabled /> 
              </div>
           </Card>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
           <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">Account</h3>
           <Card className="divide-y divide-border/50 bg-card/50">
              
              <button 
                 onClick={handleSignOut}
                 className="w-full p-4 flex items-center justify-between hover:bg-destructive/5 transition-colors group text-left"
              >
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-destructive/10 text-destructive group-hover:bg-destructive/20 transition-colors">
                       <LogOut className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="font-medium text-sm text-destructive">Sign Out</p>
                       <p className="text-xs text-muted-foreground">Log out of your account</p>
                    </div>
                 </div>
                 <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </button>

              <button 
                  className="w-full p-4 flex items-center justify-between hover:bg-destructive/5 transition-colors group text-left opacity-60 hover:opacity-100"
              >
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted text-muted-foreground">
                       <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="font-medium text-sm text-muted-foreground">Delete Account</p>
                       <p className="text-xs text-muted-foreground">Permanently remove all data</p>
                    </div>
                 </div>
              </button>
           </Card>
        </div>

        <div className="text-center pt-8 pb-4">
             <p className="text-xs text-muted-foreground/40 font-mono">
               Version 1.0.0 • 80% Quran App
             </p>
        </div>

      </motion.div>
    </div>
  );
}

// Simple internal Switch component if shadcn/ui Switch is missing
function Switch({ checked, disabled }: { checked?: boolean, disabled?: boolean }) {
    return (
        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-primary' : 'bg-muted'} ${disabled ? 'opacity-50' : ''}`}>
             <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
    );
}
