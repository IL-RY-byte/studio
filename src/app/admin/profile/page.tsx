
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, LogOut, User as UserIcon, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [orgName, setOrgName] = useState('PlanWise');
  const [orgDescription, setOrgDescription] = useState('Interactive booking for any space.');

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

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({ title: 'Profile Updated', description: 'Your organization details have been saved.' });
  }

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
      <Card className="w-full max-w-2xl">
        <CardHeader>
            <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarFallback>
                        <UserIcon className="h-12 w-12" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-2xl font-headline">Administrator Profile</CardTitle>
                    <CardDescription>View and manage your organization's details.</CardDescription>
                     <p className="text-lg font-mono mt-2">{user.phoneNumber}</p>
                </div>
                 <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="mr-2" />
                    Logout
                  </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="orgDescription">Organization Description</Label>
              <Textarea id="orgDescription" value={orgDescription} onChange={(e) => setOrgDescription(e.target.value)} placeholder="Tell us about your organization" />
            </div>
            
          <Button onClick={handleSave} className="w-full" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
