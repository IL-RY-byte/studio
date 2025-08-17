'use client';

import { useState, useEffect } from 'react';
import type { Location } from '@/lib/types';
import InteractiveMap from './InteractiveMap';
import { restaurantLocation, beachClubLocation, coworkingLocation } from '@/lib/mock-data';
import { Skeleton } from './ui/skeleton';
import { useSearchParams } from 'next/navigation';

const LOCAL_STORAGE_KEY = 'planwise-map-data';

const locations: Record<string, Location> = {
  'restaurant-1': restaurantLocation,
  'beach-club-1': beachClubLocation,
  'coworking-1': coworkingLocation,
};


export default function MapView() {
  const [location, setLocation] = useState<Location | null>(null);
  const searchParams = useSearchParams();
  const locationId = searchParams.get('location');

  useEffect(() => {
    if (locationId && locations[locationId]) {
      setLocation(locations[locationId]);
      return;
    }

    // Fallback to locally saved map if no (or invalid) id is provided
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData?.id) { // basic validation
            setLocation(parsedData);
        } else {
            setLocation(restaurantLocation);
        }
      } catch (error) {
        console.error("Failed to parse saved map data, falling back to mock data.", error);
        setLocation(restaurantLocation);
      }
    } else {
      setLocation(restaurantLocation);
    }
  }, [locationId]);

  if (!location) {
    return (
        <div className="relative w-full h-[calc(100vh-57px)] flex items-center justify-center">
            <Skeleton className="w-full h-full" />
            <p className="absolute text-lg text-muted-foreground">Loading Map...</p>
        </div>
    );
  }

  return <InteractiveMap location={location} />;
}
