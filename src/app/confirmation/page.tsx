'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Calendar, MapPin, Tag } from 'lucide-react';
import { restaurantLocation, beachClubLocation, coworkingLocation } from '@/lib/mock-data';
import type { Location, BookableObject } from '@/lib/types';
import { format } from 'date-fns';

const allLocationsMap: Record<string, Location> = {
    'restaurant-1': restaurantLocation,
    'beach-club-1': beachClubLocation,
    'coworking-1': coworkingLocation,
};

function ConfirmationView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [location, setLocation] = useState<Location | null>(null);
    const [object, setObject] = useState<BookableObject | null>(null);
    const [bookingDate, setBookingDate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const locationId = searchParams.get('locationId');
        const objectId = searchParams.get('objectId');
        const dateStr = searchParams.get('date');

        if (!locationId || !objectId || !dateStr) {
            // Redirect if params are missing
            router.replace('/map');
            return;
        }

        const customLocations: Location[] = JSON.parse(localStorage.getItem('planwise-locations') || '[]');
        const customLocationsMap = customLocations.reduce((acc, loc) => {
            acc[loc.id] = loc;
            return acc;
        }, {} as Record<string, Location>);

        const allVenuesMap = { ...allLocationsMap, ...customLocationsMap };
        
        const mapDataKey = `planwise-map-data-${locationId}`;
        const savedMapLayout = localStorage.getItem(mapDataKey);
        
        let foundLocation = allVenuesMap[locationId] || null;

        if (savedMapLayout) {
             try {
                const parsedLayout = JSON.parse(savedMapLayout);
                if (parsedLayout.id === locationId) {
                    foundLocation = parsedLayout;
                }
            } catch (error) { console.error("Failed to parse saved map data.", error); }
        }

        if (foundLocation) {
            setLocation(foundLocation);
            const foundObject = foundLocation.floors.flatMap(f => f.objects).find(o => o.id === objectId);
            setObject(foundObject || null);
        }

        setBookingDate(new Date(dateStr));
        setIsLoading(false);

    }, [searchParams, router]);

    if (isLoading) {
        return (
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-2/3" />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-12 w-full" />
                </CardFooter>
            </Card>
        );
    }
    
    if (!location || !object || !bookingDate) {
         return (
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Booking Not Found</CardTitle>
                    <CardDescription>We couldn't find the details of your booking. Please try again.</CardDescription>
                </CardHeader>
                 <CardFooter>
                    <Button onClick={() => router.push('/map')} className="w-full">
                        Back to Map
                    </Button>
                </CardFooter>
            </Card>
         );
    }

    const price = object.price;
    const tax = price * 0.1; // 10% tax
    const total = price + tax;

    return (
        <Card className="w-full max-w-lg shadow-2xl">
            <CardHeader>
                <CardTitle className="text-3xl font-headline">Confirm Your Booking</CardTitle>
                <CardDescription>Please review the details below before proceeding to payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="font-semibold text-lg">{object.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-5 w-5" />
                        <span>{location.name}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                         <Calendar className="mr-2 h-5 w-5" />
                        <span>{format(bookingDate, 'PPPP')}</span>
                    </div>
                     <div className="flex items-center text-muted-foreground">
                         <Tag className="mr-2 h-5 w-5" />
                        <span>{object.description}</span>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h4 className="font-semibold">Price Details</h4>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Price</span>
                        <span>${price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes & Fees (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.push('/payment')} className="w-full" size="lg">
                    Confirm & Pay
                    <ArrowRight className="ml-2" />
                </Button>
            </CardFooter>
        </Card>
    );
}


export default function ConfirmationPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-muted/40 p-4">
                <Suspense fallback={<Card className="w-full max-w-lg"><CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader></Card>}>
                    <ConfirmationView />
                </Suspense>
            </main>
        </div>
    );
}
