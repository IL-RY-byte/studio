'use client';

import { useState, type FC, useEffect } from 'react';
import Image from 'next/image';
import type { Location, BookableObject, Floor } from '@/lib/types';
import ObjectMarker from './ObjectMarker';
import BookingSheet from './BookingSheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface InteractiveMapProps {
  location: Location;
}

const InteractiveMap: FC<InteractiveMapProps> = ({ location }) => {
  const [selectedObject, setSelectedObject] = useState<BookableObject | null>(null);
  const [activeFloorId, setActiveFloorId] = useState<string | undefined>(location.floors?.[0]?.id);

  const activeFloor = location.floors?.find(f => f.id === activeFloorId);

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

  if (!activeFloor) {
    return (
        <div className="relative w-full h-[calc(100vh-57px)] flex items-center justify-center bg-muted/50">
            <p className="text-muted-foreground">No floor plan available for this location.</p>
        </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-57px)]">
      {location.floors.length > 1 && (
        <div className="absolute top-4 left-4 z-10 bg-card/80 backdrop-blur-sm rounded-md shadow-md">
           <Select value={activeFloorId} onValueChange={setActiveFloorId}>
            <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a floor" />
            </SelectTrigger>
            <SelectContent>
                {location.floors.map(floor => (
                    <SelectItem key={floor.id} value={floor.id}>{floor.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
      )}
      <Image
        src={activeFloor.floorPlanUrl}
        alt={`${activeFloor.name} Floor Plan`}
        layout="fill"
        objectFit="contain"
        className="pointer-events-none p-4"
        data-ai-hint="restaurant floor plan"
      />
      <div className="absolute inset-0">
        {activeFloor.objects.map((obj) => (
          <ObjectMarker key={obj.id} object={obj} onClick={handleObjectClick} />
        ))}
      </div>
      <BookingSheet
        object={selectedObject}
        locationId={location.id}
        isOpen={!!selectedObject}
        onOpenChange={handleSheetOpenChange}
      />
    </div>
  );
};

export default InteractiveMap;
