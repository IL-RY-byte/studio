
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { beachClubLocation, restaurantLocation, coworkingLocation } from "@/lib/mock-data";
import type { Location } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

const defaultLocations: Location[] = [restaurantLocation, beachClubLocation, coworkingLocation];

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const storedLocations: Location[] = JSON.parse(localStorage.getItem('planwise-locations') || '[]');
        const allLocations = [...defaultLocations, ...storedLocations];
        
        const uniqueLocations = allLocations.reduce((acc, current) => {
            if (!acc.find((item) => item.id === current.id)) {
                acc.push(current);
            }
            return acc;
        }, [] as Location[]);
        
        setLocations(uniqueLocations);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-muted/40">
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                                Explore Our Venues
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                From cozy restaurants to sunny beach clubs, find the perfect spot for your next outing.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {locations.map((location) => (
                                <Card key={location.id} className="overflow-hidden">
                                    <CardHeader className="p-0">
                                        <div className="aspect-video relative">
                                            <Image
                                                src={location.floorPlanUrl || 'https://placehold.co/400x300.png'}
                                                alt={`${location.name} Floor Plan`}
                                                layout="fill"
                                                objectFit="cover"
                                                data-ai-hint="venue floor plan"
                                                className="bg-muted"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <CardTitle className="mb-2">{location.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {location.objects.length} bookable items available
                                        </p>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 p-4">
                                        <Button asChild className="w-full">
                                            <Link href={`/map?location=${location.id}`}>
                                                View Map <ArrowRight className="ml-2" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
