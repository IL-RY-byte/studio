
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, LogOut, User as UserIcon, BookMarked } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockBookings } from "@/lib/mock-data";

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
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({ variant: 'destructive', title: 'Logout Failed', description: 'Could not log out. Please try again.' });
    }
  };

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
            <CardHeader className="flex flex-row items-center space-x-6">
              <Avatar className="h-24 w-24">
                  <AvatarFallback>
                      <UserIcon className="h-12 w-12" />
                  </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                  <CardTitle className="text-2xl font-headline">My Profile</CardTitle>
                  <CardDescription>View your details and manage your bookings.</CardDescription>
                  <p className="text-lg font-mono mt-2">{user.phoneNumber}</p>
              </div>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2" />
                Logout
              </Button>
            </CardHeader>
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
