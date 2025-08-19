

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Home } from "lucide-react";
import { beachClubLocation, restaurantLocation, coworkingLocation } from "@/lib/mock-data";
import type { Location } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const defaultLocations: Location[] = [restaurantLocation, beachClubLocation, coworkingLocation];

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newLocationName, setNewLocationName] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const storedLocations: Location[] = JSON.parse(localStorage.getItem('planwise-locations') || '[]');
        const allLocations = [...defaultLocations, ...storedLocations];
        
        const uniqueLocations = allLocations.reduce((acc, current) => {
            if (!acc.find((item) => item.id === current.id)) {
                const editorData = localStorage.getItem(`planwise-map-data-${current.id}`);
                if (editorData) {
                    try {
                        const parsedData = JSON.parse(editorData);
                        // Smartly set cover image if not already set
                        if (!parsedData.coverImageUrl && parsedData.floors && parsedData.floors.length > 0 && parsedData.floors[0].floorPlanUrl) {
                            parsedData.coverImageUrl = parsedData.floors[0].floorPlanUrl;
                        }
                        acc.push(parsedData);
                    } catch (e) {
                        console.error("failed to parse", e);
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

    const handleAddLocation = () => {
        if (!newLocationName.trim()) {
            toast({ variant: 'destructive', title: 'Location name is required.' });
            return;
        }

        const newLocation: Location = {
            id: `custom-${Date.now()}`,
            name: newLocationName,
            floors: [{
                id: `floor-${Date.now()}`,
                name: 'Main Floor',
                floorPlanUrl: '',
                objects: []
            }],
        };
        
        const storedLocations: Location[] = JSON.parse(localStorage.getItem('planwise-locations') || '[]');
        const updatedStoredLocations = [...storedLocations, newLocation];
        localStorage.setItem('planwise-locations', JSON.stringify(updatedStoredLocations));
        
        // Also pre-populate the map editor data for the new location
        const mapDataKey = `planwise-map-data-${newLocation.id}`;
        localStorage.setItem(mapDataKey, JSON.stringify(newLocation));

        const updatedLocationsForState = [...locations, newLocation];
        setLocations(updatedLocationsForState);

        toast({ title: 'Location Created!', description: `"${newLocationName}" has been added.` });
        setIsDialogOpen(false);
        setNewLocationName('');
        router.push(`/admin/locations/${newLocation.id}`);
    };

    return (
        <>
            <main className="flex flex-1 flex-col p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="font-semibold text-2xl md:text-3xl font-headline">Locations</h1>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusCircle className="mr-2" />
                        Add New Location
                    </Button>
                </div>
                {locations.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {locations.map((location) => (
                            <Card key={location.id}>
                                <CardHeader>
                                    <div className="aspect-[4/3] relative mb-4">
                                        <Image
                                            src={location.coverImageUrl || (location.floors && location.floors[0]?.floorPlanUrl) || 'https://placehold.co/400x300.png'}
                                            alt={`${location.name} Floor Plan`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-md bg-muted"
                                        />
                                    </div>
                                    <CardTitle>{location.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{location.floors.map(f => f.objects.length).reduce((a,b) => a+b, 0)} objects across {location.floors.length} floor(s)</p>
                                </CardContent>
                                <CardFooter className="flex justify-between gap-2">
                                     <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/editor?locationId=${location.id}`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Map
                                        </Link>
                                    </Button>
                                    <Button size="sm" asChild>
                                        <Link href={`/admin/locations/${location.id}`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Details
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <Home className="w-16 h-16 text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Create Your First Location</h2>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            It looks like you haven't set up any venues yet.
                            Add a new location to start designing your interactive map.
                        </p>
                        <Button size="lg" onClick={() => setIsDialogOpen(true)}>
                            <PlusCircle className="mr-2" />
                            Add Your First Location
                        </Button>
                    </div>
                )}
            </main>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a New Location</DialogTitle>
                        <DialogDescription>
                            Give your new venue a name. You can add more details later.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="location-name">Location Name</Label>
                        <Input
                            id="location-name"
                            value={newLocationName}
                            onChange={(e) => setNewLocationName(e.target.value)}
                            placeholder="e.g., 'Downtown Restaurant'"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddLocation}>Create Location</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

    
