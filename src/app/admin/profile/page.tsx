'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, LogOut, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({ variant: 'destructive', title: 'Logout Failed', description: 'Could not log out. Please try again.' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // The redirect is handled in the effect
  }

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 items-center justify-center bg-muted/20">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
            <Avatar className="mx-auto h-24 w-24 mb-4">
                <AvatarFallback>
                    <UserIcon className="h-12 w-12" />
                </AvatarFallback>
            </Avatar>
          <CardTitle className="text-2xl font-headline">User Profile</CardTitle>
          <CardDescription>View and manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2 text-center">
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="text-lg font-mono">{user.phoneNumber}</p>
            </div>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
