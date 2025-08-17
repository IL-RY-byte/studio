
'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { BookableObject, ObjectType, Location, PaletteItem, Floor } from '@/lib/types';
import ObjectPalette from './ObjectPalette';
import PlacementAssistant from './PlacementAssistant';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2, Save, Edit } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { SunbedIcon, TableIcon, BoatIcon, WorkspaceIcon, RoomIcon, Box } from '../icons';
import EditObjectDialog from './EditObjectDialog';
import { useSearchParams } from 'next/navigation';
import { restaurantLocation, beachClubLocation, coworkingLocation } from '@/lib/mock-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const allLocations: Record<string, Location> = {
  'restaurant-1': restaurantLocation,
  'beach-club-1': beachClubLocation,
  'coworking-1': coworkingLocation,
};


const defaultPaletteItems: PaletteItem[] = [
  { type: 'table', name: 'Table', icon: TableIcon },
  { type: 'sunbed', name: 'Sunbed', icon: SunbedIcon },
  { type: 'workspace', name: 'Workspace', icon: WorkspaceIcon },
  { type: 'boat', name: 'Boat/Jet Ski', icon: BoatIcon },
  { type: 'room', name: 'Room/House', icon: RoomIcon },
];

const getObjectIcon = (type: ObjectType, palette: PaletteItem[]): React.ElementType => {
    const item = palette.find(p => p.type === type);
    return item?.icon || Box;
}

type Suggestion = {
    x: number;
    y: number;
    confidence: number;
};

const getLocalStorageKey = (locationId: string) => `planwise-map-data-${locationId}`;


export default function MapEditor() {
  const [activeFloor, setActiveFloor] = useState<Floor | null>(null);
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedObject, setSelectedObject] = useState<BookableObject | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [draggingObject, setDraggingObject] = useState<BookableObject | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [paletteItems, setPaletteItems] = useState<PaletteItem[]>(defaultPaletteItems);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const searchParams = useSearchParams();
  const locationId = searchParams.get('locationId');


  useEffect(() => {
    const loadMapData = (loc: Location) => {
        const localStorageKey = getLocalStorageKey(loc.id);
        const savedData = localStorage.getItem(localStorageKey);
        let dataToLoad = loc;

        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if(parsedData.id === loc.id){ // check if saved data matches location
                    dataToLoad = parsedData;
                    toast({title: "Loaded Saved Progress", description: `Resumed editing for ${loc.name}.`})
                }
            } catch (e) {
                console.error("Failed to parse saved data", e);
            }
        }
        
        setActiveLocation(dataToLoad);
        if (dataToLoad.floors && dataToLoad.floors.length > 0) {
            const currentFloor = dataToLoad.floors[0];
            setActiveFloor(currentFloor);

            if(currentFloor && currentFloor.floorPlanUrl){
                fetch(currentFloor.floorPlanUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], `${dataToLoad.id}-plan.png`, { type: blob.type });
                        setFloorPlanFile(file);
                    });
            }
        } else {
            setActiveFloor(null);
        }
    }

    const customLocations: Location[] = JSON.parse(localStorage.getItem('planwise-locations') || '[]');
    const allVenues: Record<string, Location> = customLocations.reduce((acc, loc) => {
        acc[loc.id] = loc;
        return acc;
    }, {...allLocations});

    if (locationId && allVenues[locationId]) {
        loadMapData(allVenues[locationId]);
    } else {
        loadMapData(restaurantLocation);
    }
    
    const customItems = localStorage.getItem('planwise-custom-items');
    if (customItems) {
      setPaletteItems(prev => [...prev, ...JSON.parse(customItems).map((item: any) => ({...item, icon: Box}))]);
    }
  }, [locationId, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeFloor) {
      setFloorPlanFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFloorPlanUrl = event.target?.result as string;
        const updatedFloor = { ...activeFloor, floorPlanUrl: newFloorPlanUrl, objects: [] };
        setActiveFloor(updatedFloor);
        setSuggestions([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!mapContainerRef.current || !activeFloor) return;
    setDraggingObject(null);

    const type = e.dataTransfer.getData('objectType') as ObjectType;
    const existingObjectId = e.dataTransfer.getData('objectId');
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    let newObjects: BookableObject[];

    if (existingObjectId) {
      newObjects = activeFloor.objects.map((obj) =>
        obj.id === existingObjectId ? { ...obj, position: { x, y } } : obj
      );
    } else if (type) {
      const newObject: BookableObject = {
        id: `${type}-${Date.now()}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${activeFloor.objects.filter(o => o.type === type).length + 1}`,
        type: type,
        description: `A new ${type}.`,
        price: 25,
        position: { x, y },
        status: 'Free',
      };
      newObjects = [...activeFloor.objects, newObject];
    } else {
        return;
    }

    setActiveFloor({...activeFloor, objects: newObjects});
    setSuggestions([]);
  };

  const handleClear = () => {
    if (activeFloor) {
        setActiveFloor({...activeFloor, objects: []});
        setSuggestions([]);
        toast({ title: "Canvas Cleared", description: "All objects have been removed from the map." });
    }
  };
  
  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    if (!activeFloor) return;
    const objectType = 'table'; 
    const newObject: BookableObject = {
      id: `${objectType}-${Date.now()}`,
      name: `${objectType.charAt(0).toUpperCase() + objectType.slice(1)} ${activeFloor.objects.filter(o => o.type === objectType).length + 1}`,
      type: objectType,
      description: 'Placed by AI assistant.',
      price: 20,
      position: { x: suggestion.x, y: suggestion.y },
      status: 'Free',
    };
    setActiveFloor({...activeFloor, objects: [...activeFloor.objects, newObject]});
    setSuggestions((prev) => prev.filter(s => s !== suggestion));
  };

  const handleSaveMap = () => {
    if (!activeFloor || !activeLocation) {
      toast({ variant: 'destructive', title: 'Cannot Save', description: 'Please upload a floor plan first.' });
      return;
    }
    const updatedFloors = activeLocation.floors.map(f => f.id === activeFloor.id ? activeFloor : f);
    const mapData: Location = {
      ...activeLocation,
      floors: updatedFloors
    };

    const localStorageKey = getLocalStorageKey(activeLocation.id);
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(mapData));
      toast({ title: 'Map Saved!', description: `Your map for ${activeLocation.name} has been saved locally.` });
    } catch (error) {
      console.error('Failed to save map:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save the map.' });
    }
  };
  
  const handleObjectDragStart = (e: React.DragEvent<HTMLButtonElement>, obj: BookableObject) => {
    e.dataTransfer.setData('objectId', obj.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingObject(obj);
  };
  
  const handleObjectDragEnd = () => {
    setDraggingObject(null);
  };
  
  const handleTrashDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const objectId = e.dataTransfer.getData('objectId');
      if (objectId && activeFloor) {
          const newObjects = activeFloor.objects.filter(obj => obj.id !== objectId);
          setActiveFloor({...activeFloor, objects: newObjects});
          toast({ title: 'Object Deleted', description: 'The object has been removed from the map.' });
      }
      setDraggingObject(null);
  };

  const handleObjectClick = (obj: BookableObject) => {
    setSelectedObject(obj);
    setIsEditDialogOpen(true);
  };

  const handleUpdateObject = (updatedObject: BookableObject) => {
    if (activeFloor) {
        const newObjects = activeFloor.objects.map(obj => obj.id === updatedObject.id ? updatedObject : obj);
        setActiveFloor({...activeFloor, objects: newObjects});
        toast({ title: 'Object Updated', description: `Successfully updated ${updatedObject.name}.` });
    }
  };
  
  const handleAddCustomItem = (item: Omit<PaletteItem, 'icon'>) => {
    const newItem = { ...item, icon: Box, type: item.name.toLowerCase().replace(/\s/g, '-') };
    const updatedItems = [...paletteItems, newItem];
    setPaletteItems(updatedItems);
    
    const currentCustomItems = JSON.parse(localStorage.getItem('planwise-custom-items') || '[]');
    localStorage.setItem('planwise-custom-items', JSON.stringify([...currentCustomItems, {type: newItem.type, name: newItem.name}]));

    toast({ title: 'Custom Item Added', description: `${item.name} has been added to the palette.` });
  };


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 h-full flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
             {activeLocation && activeLocation.floors && activeLocation.floors.length > 1 && (
                <Select value={activeFloor?.id} onValueChange={(id) => setActiveFloor(activeLocation.floors.find(f => f.id === id) || null)}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a floor" />
                    </SelectTrigger>
                    <SelectContent>
                        {activeLocation.floors.map(floor => (
                            <SelectItem key={floor.id} value={floor.id}>{floor.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             )}
          </div>
          <div 
            ref={mapContainerRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative w-full aspect-[4/3] bg-muted/50 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors border-primary/20"
          >
            {activeFloor?.floorPlanUrl ? (
              <>
                <Image src={activeFloor.floorPlanUrl} layout="fill" objectFit="contain" alt="Floor plan" className="rounded-md p-2 pointer-events-none" />
                {activeFloor.objects.map((obj) => {
                  const Icon = getObjectIcon(obj.type, paletteItems);
                  return (
                    <button
                      key={obj.id}
                      draggable
                      onDragStart={(e) => handleObjectDragStart(e, obj)}
                      onDragEnd={handleObjectDragEnd}
                      onClick={() => handleObjectClick(obj)}
                      className={cn(
                        "absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-md cursor-grab active:cursor-grabbing group",
                         draggingObject?.id === obj.id && "opacity-50"
                      )}
                      style={{ left: `${obj.position.x}%`, top: `${obj.position.y}%` }}
                      aria-label={`Edit ${obj.name}`}
                    >
                      <Icon className="w-6 h-6 text-foreground transition-transform group-hover:scale-125" />
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        ${obj.price}
                      </div>
                    </button>
                  );
                })}
                {suggestions.map((s, i) => (
                  <button
                      key={i}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/30 backdrop-blur-sm shadow-md ring-2 ring-primary animate-pulse flex items-center justify-center"
                      style={{ left: `${s.x}%`, top: `${s.y}%` }}
                      onClick={() => handleAcceptSuggestion(s)}
                      title={`Accept suggestion (Confidence: ${Math.round(s.confidence * 100)}%)`}
                  >
                      <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                  </button>
                ))}
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <UploadCloud className="mx-auto h-12 w-12" />
                <p className="mt-2">Upload a floor plan to begin</p>
                <p className="text-xs">PNG, JPG, or SVG up to 5MB</p>
              </div>
            )}
             {draggingObject && (
                <div 
                    onDrop={handleTrashDrop}
                    onDragOver={handleDragOver}
                    className="absolute bottom-4 right-4 z-10 p-4 rounded-full bg-destructive/20 border-2 border-dashed border-destructive/50"
                >
                    <Trash2 className="h-8 w-8 text-destructive" />
                </div>
            )}
          </div>
          <div className="flex gap-2">
              <Button asChild variant="outline">
                  <label htmlFor="floor-plan-upload" className="cursor-pointer">
                      <UploadCloud className="mr-2 h-4 w-4" />
                      {activeFloor?.floorPlanUrl ? 'Change Plan' : 'Upload Plan'}
                  </label>
              </Button>
              <input id="floor-plan-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              <Button onClick={handleSaveMap} disabled={!activeFloor?.floorPlanUrl}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Map
              </Button>
              <Button variant="destructive" onClick={handleClear} disabled={!activeFloor || (activeFloor.objects.length === 0 && suggestions.length === 0)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
              </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <ObjectPalette paletteItems={paletteItems} onAddCustomItem={handleAddCustomItem} />
          <PlacementAssistant 
            floorPlanFile={floorPlanFile}
            onSuggestions={setSuggestions} 
          />
        </div>
      </div>
      
      <EditObjectDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        object={selectedObject}
        onSave={handleUpdateObject}
      />
    </>
  );
}
