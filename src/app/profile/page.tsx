
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, LogOut, User as UserIcon, BookMarked, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockBookings } from "@/lib/mock-data";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState('Customer');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // A real app would fetch the user's name from a database
        // For now, we'll just use a default or previously saved name
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
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({ variant: 'destructive', title: 'Logout Failed', description: 'Could not log out. Please try again.' });
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call to save user profile data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({ title: 'Profile Updated', description: 'Your details have been saved.' });
  }

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-6 bg-muted/20">
        <div className="w-full max-w-4xl space-y-8">
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                  <AvatarFallback>
                      <UserIcon className="h-12 w-12" />
                  </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-headline">My Profile</CardTitle>
                    <CardDescription>View your details and manage your bookings.</CardDescription>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input value={user.phoneNumber || ''} disabled />
                    </div>
                  </div>
              </div>
            </CardHeader>
             <CardContent className="flex justify-end gap-2">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2" />}
                   Save Profile
                </Button>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="mr-2" />
                  Logout
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookMarked className="h-6 w-6 text-primary" />
                <CardTitle>My Bookings</CardTitle>
              </div>
              <CardDescription>An overview of all your past and upcoming reservations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Object</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.filter(b => b.customerName !== 'Peter Jones').map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.objectName}</TableCell>
                      <TableCell>{booking.locationName}</TableCell>
                      <TableCell>{booking.bookingDate}</TableCell>
                      <TableCell>
                        <Badge variant={booking.status === 'Confirmed' ? 'default' : 'destructive'}>{booking.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
