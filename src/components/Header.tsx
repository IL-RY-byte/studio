'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { LayoutGrid, BotMessageSquare, LogIn, User as UserIcon, ChevronDown } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">PlanWise</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                Solutions
                <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild><Link href="/solutions/resorts">Resorts & Beaches</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/solutions/restaurants">Restaurants & Halls</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/solutions/sports">Sports & Leisure</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/solutions/coworking">Coworking & Offices</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild variant="ghost">
            <Link href="/how-it-works">
              How It Works
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/pricing">
              Pricing
            </Link>
          </Button>
        </nav>
        <div className="flex-1" />
        <nav className="flex items-center gap-4">
            {isLoading ? (
                <Skeleton className="h-9 w-24" />
            ) : user ? (
                <>
                <Button asChild variant="ghost">
                    <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        My Profile
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/admin">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        Admin Panel
                    </Link>
                </Button>
                </>
            ) : (
                <Button asChild>
                    <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                    </Link>
                </Button>
            )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
