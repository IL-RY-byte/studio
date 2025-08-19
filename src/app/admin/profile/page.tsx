
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, LogOut, User as UserIcon, Save, Building, Info, Image as ImageIcon } from 'lucide-react';
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

  const [displayName, setDisplayName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  const fetchOrganizationData = useCallback(async (uid: string) => {
    const docRef = doc(db, 'organizations', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setOrgName(data.name || '');
      setOrgDescription(data.description || '');
      setPhotoURL(data.logoUrl || '');
    } else {
      setOrgName('My Organization');
      setOrgDescription('Interactive booking for any space.');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setPhotoURL(currentUser.photoURL || '');
        fetchOrganizationData(currentUser.uid);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router, fetchOrganizationData]);

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
    if (!user) {
        toast({variant: 'destructive', title: 'Not authenticated'});
        return;
    }
    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName, photoURL });
      
      // Update Firestore organization data
      const orgData = {
        name: orgName,
        description: orgDescription,
        logoUrl: photoURL,
        adminId: user.uid,
      };
      await setDoc(doc(db, 'organizations', user.uid), orgData, { merge: true });
      toast({ title: 'Profile Updated', description: 'Your organization details have been saved.' });
    } catch (error) {
      console.error("Error saving organization data:", error);
      toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save your data. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex-1 flex-col p-4 md:p-6 bg-muted/20">
       <div className="flex items-center mb-6">
        <h1 className="font-semibold text-2xl md:text-3xl font-headline">Profile & Settings</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2" />}
                Save All Changes
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="mr-2" />
                Logout
            </Button>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                         <UserIcon className="h-5 w-5 text-primary" />
                         <CardTitle>Administrator</CardTitle>
                    </div>
                    <CardDescription>Your personal account details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24">
                           <AvatarImage src={photoURL || undefined} alt={displayName} />
                            <AvatarFallback>
                                <UserIcon className="h-12 w-12" />
                            </AvatarFallback>
                        </Avatar>
                        <Input
                            id="photoURL"
                            placeholder="Image URL for your avatar"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                         />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Full Name</Label>
                      <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" value={user.email || ''} disabled />
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                         <Building className="h-5 w-5 text-primary" />
                         <CardTitle>Organization Details</CardTitle>
                    </div>
                    <CardDescription>Public information about your company.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="orgDescription">Organization Description</Label>
                      <Textarea id="orgDescription" value={orgDescription} onChange={(e) => setOrgDescription(e.target.value)} placeholder="Tell us about your organization" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                     <div className='flex items-center gap-2'>
                         <Info className="h-5 w-5 text-primary" />
                         <CardTitle>Integrations</CardTitle>
                    </div>
                    <CardDescription>Connect with third-party services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                      <Label htmlFor="stripeKey">Stripe API Key</Label>
                      <Input id="stripeKey" type="password" placeholder="sk_test_••••••••••••••••••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telegramToken">Telegram Bot Token</Label>
                      <Input id="telegramToken" type="password" placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" />
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </main>
  );
}
