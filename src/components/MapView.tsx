'use client';

import { useState, useEffect } from 'react';
import type { Location } from '@/lib/types';
import InteractiveMap from './InteractiveMap';
import { restaurantLocation } from '@/lib/mock-data';
import { Skeleton } from './ui/skeleton';

const LOCAL_STORAGE_KEY = 'planwise-map-data';

export default function MapView() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    // Since localStorage is not available on the server, we need to
    // access it only on the client side, inside useEffect.
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setLocation(parsedData);
      } catch (error) {
        console.error("Failed to parse saved map data, falling back to mock data.", error);
        setLocation(restaurantLocation);
      }
    } else {
      setLocation(restaurantLocation);
    }
  }, []);

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
