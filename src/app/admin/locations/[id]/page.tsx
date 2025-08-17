

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, PlusCircle, Trash2, Edit } from 'lucide-react';
import { restaurantLocation, beachClubLocation, coworkingLocation } from '@/lib/mock-data';
import type { Location } from '@/lib/types';
import LocationImageGallery from '@/components/admin/LocationImageGallery';


const allDefaultLocations: Location[] = [restaurantLocation, beachClubLocation, coworkingLocation];

export default function EditLocationPage() {
    const [location, setLocation] = useState<Location | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const id = params.id as string;

    useEffect(() => {
        const fetchLocation = () => {
            const locationsFromStorage = JSON.parse(localStorage.getItem('planwise-locations') || '[]');
            const mapDataFromStorage = localStorage.getItem(`planwise-map-data-${id}`);

            const allVenues = [...locationsFromStorage, ...allDefaultLocations];
            let foundLocation = allVenues.find(l => l.id === id) || null;

            if (mapDataFromStorage && foundLocation) {
                 try {
                    const parsedLayout = JSON.parse(mapDataFromStorage);
                    if (parsedLayout.id === id) {
                        foundLocation = parsedLayout;
                    }
                } catch (error) {
                    console.error("Failed to parse saved map data.", error);
                }
            }

            if (foundLocation) {
                setLocation(foundLocation);
            } else {
                toast({ variant: 'destructive', title: 'Location not found!' });
                router.push('/admin/locations');
            }
        };
        fetchLocation();
    }, [id, router, toast]);

    const handleSave = async () => {
        if (!location) return;
        setIsSaving(true);
        
        // This combines the location details with the map editor data
        const mapDataKey = `planwise-map-data-${location.id}`;
        const mapDataFromStorage = localStorage.getItem(mapDataKey);
        let finalDataToSave = { ...location };

        if (mapDataFromStorage) {
            try {
                const parsedMapData = JSON.parse(mapDataFromStorage);
                // Ensure floors from map editor are preserved
                finalDataToSave.floors = parsedMapData.floors; 
            } catch (error) {
                console.error("Could not merge map data", error);
            }
        }
        
        // Save to the main 'planwise-locations' list which is used for the locations page
        const locationsFromStorage: Location[] = JSON.parse(localStorage.getItem('planwise-locations') || '[]');
        let updatedLocations = locationsFromStorage.filter(loc => !allDefaultLocations.some(def => def.id === loc.id));
        const existingIndex = updatedLocations.findIndex((loc) => loc.id === id);
        if (existingIndex > -1) {
            updatedLocations[existingIndex] = {
                ...updatedLocations[existingIndex],
                ...finalDataToSave,
            };
        } else {
            updatedLocations.push(finalDataToSave);
        }
        localStorage.setItem('planwise-locations', JSON.stringify(updatedLocations));
        
        // Also update the dedicated key for the map editor to have the latest details
        localStorage.setItem(mapDataKey, JSON.stringify(finalDataToSave));

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsSaving(false);
        toast({ title: 'Location Updated', description: `${location?.name} has been successfully saved.` });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocation(prev => prev ? { ...prev, [name]: value } as Location : null);
    };
    
    const handleDelete = () => {
        if(!location) return;
        const locationsFromStorage = JSON.parse(localStorage.getItem('planwise-locations') || '[]');
        const updatedLocations = locationsFromStorage.filter((loc: Location) => loc.id !== location.id);
        localStorage.setItem('planwise-locations', JSON.stringify(updatedLocations));
        localStorage.removeItem(`planwise-map-data-${location.id}`);
        toast({ title: 'Location Deleted', description: `${location.name} has been removed.` });
        router.push('/admin/locations');
    }

    if (!location) {
        return (
            <main className="flex flex-1 flex-col p-4 md:p-6 justify-center items-center">
                <p>Loading...</p>
            </main>
        );
    }
    
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
                <h1 className="font-semibold text-2xl md:text-3xl font-headline">Edit Location</h1>
                <div className="ml-auto flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Save className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Details</CardTitle>
                            <CardDescription>Update the name and description for your venue.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Location Name</Label>
                                <Input id="name" name="name" value={location.name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Slogan / Description</Label>
                                <Textarea id="description" name="description" placeholder="A cozy place for you and your friends." value={location.description || ''} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>Manage how customers can reach you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" placeholder="123 Main St, Anytown, USA" value={location.address || ''} onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" placeholder="+1 (555) 123-4567" value={location.phone || ''} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="contact@yourvenue.com" value={location.email || ''} onChange={handleInputChange} />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="website">Website / Social Media</Label>
                                <Input id="website" name="website" placeholder="https://yourvenue.com" value={location.website || ''} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Cuisine & Menu</CardTitle>
                             <CardDescription>Let customers know what you offer.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="cuisine">Type of Cuisine</Label>
                                <Input id="cuisine" name="cuisine" placeholder="e.g., Italian, Japanese, Fusion" value={location.cuisine || ''} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Popular Dishes / Special Offers</Label>
                                <Textarea id="specials" name="specials" placeholder="- Margherita Pizza&#10;- Carbonara Pasta&#10;- Tiramisu" value={location.specials?.join('\n') || ''} onChange={(e) => setLocation(prev => prev ? { ...prev, specials: e.target.value.split('\n') } : null)} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <LocationImageGallery 
                        coverImage={location.coverImageUrl}
                        gallery={location.gallery}
                    />
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities & Services</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm">Wi-Fi</Button>
                                <Button variant="outline" size="sm">Parking</Button>
                                <Button variant="outline" size="sm">Delivery</Button>
                                <Button variant="outline" size="sm">Card Accepted</Button>
                                <Button variant="outline" size="sm">Event Hall</Button>
                            </div>
                             <Button variant="ghost" className="w-full">
                                <PlusCircle className="mr-2" />
                                Add Amenity
                            </Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Working Hours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex justify-between items-center text-sm"><span>Monday - Friday</span> <span>10:00 - 22:00</span></div>
                           <div className="flex justify-between items-center text-sm"><span>Saturday</span> <span>12:00 - 23:00</span></div>
                           <div className="flex justify-between items-center text-sm text-muted-foreground"><span>Sunday</span> <span>Closed</span></div>
                            <Button variant="outline" className="w-full">
                                <Edit className="mr-2" />
                                Edit Hours
                            </Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                             <CardTitle className="text-red-500">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">
                                        <Trash2 className="mr-2" />
                                        Delete Location
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this location and all its data.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
