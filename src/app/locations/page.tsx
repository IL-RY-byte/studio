

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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const defaultLocations: Location[] = [restaurantLocation, beachClubLocation, coworkingLocation];

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const storedLocations: Location[] = JSON.parse(localStorage.getItem('planwise-locations') || '[]');
        
        const allLocations = [...defaultLocations, ...storedLocations];
        
        const uniqueLocations = allLocations.reduce((acc, current) => {
            if (!acc.find((item) => item.id === current.id)) {
                 const editorData = localStorage.getItem(`planwise-map-data-${current.id}`);
                if (editorData) {
                    try {
                        const parsedData = JSON.parse(editorData);
                        acc.push(parsedData);
                    } catch(e) {
                        console.error("failed to parse", e)
                        acc.push(current);
                    }
                } else {
                    acc.push(current);
                }
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
                                      <Carousel className="w-full">
                                        <CarouselContent>
                                          {location.floors && location.floors.length > 0 && location.floors.some(f => f.floorPlanUrl) ? (
                                            location.floors.map((floor, index) => (
                                              floor.floorPlanUrl &&
                                              <CarouselItem key={floor.id}>
                                                <div className="aspect-video relative">
                                                  <Image
                                                    src={floor.floorPlanUrl}
                                                    alt={`Floor plan for ${floor.name}`}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="bg-muted"
                                                    data-ai-hint="restaurant floor plan"
                                                  />
                                                   <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded-md text-xs">{floor.name}</div>
                                                </div>
                                              </CarouselItem>
                                            ))
                                          ) : (
                                            <CarouselItem>
                                              <div className="aspect-video relative">
                                                <Image
                                                  src={location.coverImageUrl || 'https://placehold.co/400x300.png'}
                                                  alt={`Photo of ${location.name}`}
                                                  layout="fill"
                                                  objectFit="cover"
                                                  data-ai-hint="restaurant interior"
                                                  className="bg-muted"
                                                />
                                              </div>
                                            </CarouselItem>
                                          )}
                                        </CarouselContent>
                                        {(location.floors && location.floors.length > 1) && (
                                            <>
                                                <CarouselPrevious className="left-4" />
                                                <CarouselNext className="right-4" />
                                            </>
                                        )}
                                      </Carousel>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <CardTitle className="mb-2">{location.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {location.floors.map(f => f.objects.length).reduce((a, b) => a + b, 0)} bookable items across {location.floors.length} floor(s)
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
