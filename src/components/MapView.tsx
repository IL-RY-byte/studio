
'use client';

import { useState, useEffect } from 'react';
import type { Location } from '@/lib/types';
import InteractiveMap from './InteractiveMap';
import { restaurantLocation, beachClubLocation, coworkingLocation } from '@/lib/mock-data';
import { Skeleton } from './ui/skeleton';
import { useSearchParams } from 'next/navigation';
import LiveAnalytics from './LiveAnalytics';


const defaultLocations: Record<string, Location> = {
  'restaurant-1': restaurantLocation,
  'beach-club-1': beachClubLocation,
  'coworking-1': coworkingLocation,
};


export default function MapView() {
  const [location, setLocation] = useState<Location | null>(null);
  const searchParams = useSearchParams();
  const locationId = searchParams.get('location');

  useEffect(() => {
    // This logic ensures that both default and user-created locations are available.
    const customLocations: Location[] = JSON.parse(localStorage.getItem('planwise-locations') || '[]');
    const mapEditorKey = locationId ? `planwise-map-data-${locationId}` : `planwise-map-data-restaurant-1`;
    const savedMapLayout = localStorage.getItem(mapEditorKey);

    let dataToLoad: Location | null = null;
    
    // Determine the base location data to use
    if (locationId) {
      // Try finding in custom locations first
      dataToLoad = customLocations.find(l => l.id === locationId) || null;
      // If not found in custom, try default
      if (!dataToLoad) {
        dataToLoad = defaultLocations[locationId] || null;
      }
    }
    
    // If still no location, fall back to the default restaurant
    if (!dataToLoad) {
      dataToLoad = restaurantLocation;
    }

    // If there's a saved layout in the map editor, merge it with the location data
    if (savedMapLayout) {
      try {
        const parsedLayout = JSON.parse(savedMapLayout);
        if (parsedLayout.id === (locationId || restaurantLocation.id)) {
          dataToLoad = parsedLayout;
        }
      } catch (error) {
        console.error("Failed to parse saved map data.", error);
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

  return (
    <div className="flex h-[calc(100vh-57px)]">
      <div className="flex-1 relative">
        <InteractiveMap location={location} />
      </div>
      <div className="w-full max-w-sm border-l bg-muted/20 p-4 overflow-y-auto">
        <LiveAnalytics location={location} />
      </div>
    </div>
  );
}
