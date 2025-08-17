'use client';

import { useState, type FC, useEffect } from 'react';
import Image from 'next/image';
import type { Location, BookableObject } from '@/lib/types';
import ObjectMarker from './ObjectMarker';
import BookingSheet from './BookingSheet';
import { restaurantLocation } from '@/lib/mock-data';

interface InteractiveMapProps {
  location: Location;
}

const InteractiveMap: FC<InteractiveMapProps> = ({ location }) => {
  const [selectedObject, setSelectedObject] = useState<BookableObject | null>(null);

  const handleObjectClick = (obj: BookableObject) => {
    if (obj.status !== 'Occupied') {
      setSelectedObject(obj);
    }
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedObject(null);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-57px)]">
      <Image
        src={location.floorPlanUrl}
        alt={`${location.name} Floor Plan`}
        layout="fill"
        objectFit="contain"
        className="pointer-events-none p-4"
        data-ai-hint="restaurant floor plan"
      />
      <div className="absolute inset-0">
        {location.objects.map((obj) => (
          <ObjectMarker key={obj.id} object={obj} onClick={handleObjectClick} />
        ))}
      </div>
      <BookingSheet
        object={selectedObject}
        isOpen={!!selectedObject}
        onOpenChange={handleSheetOpenChange}
      />
    </div>
  );
};

export default InteractiveMap;
