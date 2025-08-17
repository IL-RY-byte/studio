'use client';

import { useState, useEffect } from 'react';
import type { Location } from '@/lib/types';
import InteractiveMap from './InteractiveMap';
import { restaurantLocation, beachClubLocation, coworkingLocation } from '@/lib/mock-data';
import { Skeleton } from './ui/skeleton';
import { useSearchParams } from 'next/navigation';


const allLocations: Record<string, Location> = {
  'restaurant-1': restaurantLocation,
  'beach-club-1': beachClubLocation,
  'coworking-1': coworkingLocation,
};


export default function MapView() {
  const [location, setLocation] = useState<Location | null>(null);
  const searchParams = useSearchParams();
  const locationId = searchParams.get('location');

  useEffect(() => {
    let dataToLoad: Location | null = null;
    
    if (locationId && allLocations[locationId]) {
      dataToLoad = allLocations[locationId];
      const localStorageKey = `planwise-map-data-${locationId}`;
      const savedData = localStorage.getItem(localStorageKey);
       if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (parsedData?.id === locationId) { 
              dataToLoad = parsedData;
          }
        } catch (error) {
          console.error("Failed to parse saved map data.", error);
        }
      }
    } else {
       // Fallback to default restaurant if no ID or invalid ID
       dataToLoad = restaurantLocation;
       const savedData = localStorage.getItem(`planwise-map-data-${restaurantLocation.id}`);
       if (savedData) {
         try {
           dataToLoad = JSON.parse(savedData);
         } catch (e) { /* ignore */ }
       }
    }

    setLocation(dataToLoad);

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
