











'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { BookableObject, ObjectType, Location, PaletteItem, Floor } from '@/lib/types';
import ObjectPalette from './ObjectPalette';
import PlacementAssistant from './PlacementAssistant';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2, Save, Edit, PlusCircle, Loader2, MousePointerClick, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '../ui/input';
import { Label } from '../ui/label';


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

const defaultObjectDimensions: Record<ObjectType, { width: number; height: number }> = {
    table: { width: 5, height: 5 },
    sunbed: { width: 8, height: 4 },
    workspace: { width: 4, height: 4 },
    boat: { width: 10, height: 5 },
    room: { width: 10, height: 10 },
};

const checkCollision = (objA: BookableObject, objB: BookableObject): boolean => {
    // AABB collision detection
    return (
        objA.position.x - objA.width / 2 < objB.position.x + objB.width / 2 &&
        objA.position.x + objA.width / 2 > objB.position.x - objB.width / 2 &&
        objA.position.y - objA.height / 2 < objB.position.y + objB.height / 2 &&
        objA.position.y + objA.height / 2 > objB.position.y - objB.height / 2
    );
};

type ResizingState = {
    handle: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    initialObject: BookableObject;
    initialMousePos: { x: number; y: number };
}

export default function MapEditor() {
  const [activeFloor, setActiveFloor] = useState<Floor | null>(null);
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedObject, setSelectedObject] = useState<BookableObject | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddFloorOpen, setIsAddFloorOpen] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');
  const [draggingObject, setDraggingObject] = useState<string | null>(null);
  const [resizingState, setResizingState] = useState<ResizingState | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [paletteItems, setPaletteItems] = useState<PaletteItem[]>(defaultPaletteItems);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const searchParams = useSearchParams();
  const locationId = searchParams.get('locationId');
  const [isUploading, setIsUploading] = useState(false);

  // Zoom and Pan state
  const [scale, setScale] = useState(1);
  const [translation, setTranslation] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });


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
  
  useEffect(() => {
    if (activeFloor?.floorPlanUrl) {
      setFloorPlanFile(null); 
    } else {
      setFloorPlanFile(null);
    }
  }, [activeFloor]);

  const getMapCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!mapContainerRef.current) return { x: 0, y: 0 };
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - translation.x) / scale;
    const y = (clientY - rect.top - translation.y) / scale;
    // Convert to percentage of map dimensions (assuming map is same as container for now)
    return {
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    };
  }, [scale, translation]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeFloor && activeLocation) {
      setIsUploading(true);
      toast({ title: 'Processing...', description: 'Your floor plan is being processed.' });

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;

        const updatedFloor: Floor = { ...activeFloor, floorPlanUrl: dataUrl };
        const updatedFloors = activeLocation.floors.map(f =>
          f.id === activeFloor.id ? updatedFloor : f
        );
        const updatedLocation: Location = { ...activeLocation, floors: updatedFloors };

        setActiveFloor(updatedFloor);
        updateActiveLocationAndSave(updatedLocation);
        setSuggestions([]); // Clear suggestions for the new floor plan

        toast({ title: 'Upload Successful!', description: 'Your new floor plan is now active.' });
        setIsUploading(false);
      };
      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not read the file.' });
        setIsUploading(false);
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
    
    const { x, y } = getMapCoordinates(e.clientX, e.clientY);
    
    let tempObject: BookableObject;
    let newObjects: BookableObject[];

    if (existingObjectId) {
        const originalObject = activeFloor.objects.find(obj => obj.id === existingObjectId);
        if (!originalObject) return;
        
        tempObject = { ...originalObject, position: { x, y } };

        for (const obj of activeFloor.objects) {
            if (obj.id !== existingObjectId && checkCollision(tempObject, obj)) {
                toast({ variant: 'destructive', title: 'Placement Error', description: 'Objects cannot overlap.' });
                return;
            }
        }
        newObjects = activeFloor.objects.map((obj) =>
            obj.id === existingObjectId ? tempObject : obj
        );
    } else if (type) {
        const dimensions = defaultObjectDimensions[type] || { width: 5, height: 5 };
        tempObject = {
            id: 'temp',
            name: '',
            type: type,
            description: '',
            price: 0,
            position: { x, y },
            status: 'Free',
            ...dimensions
        };

        for (const obj of activeFloor.objects) {
            if (checkCollision(tempObject, obj)) {
                toast({ variant: 'destructive', title: 'Placement Error', description: 'Objects cannot overlap.' });
                return;
            }
        }
      
        const newObject: BookableObject = {
            id: `${type}-${Date.now()}`,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${activeFloor.objects.filter(o => o.type === type).length + 1}`,
            type: type,
            description: `A new ${type}.`,
            price: 25,
            position: { x, y },
            status: 'Free',
            ...dimensions,
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
    const objectType: ObjectType = 'table'; 
    const dimensions = defaultObjectDimensions[objectType] || { width: 5, height: 5 };
    const newObject: BookableObject = {
      id: `${objectType}-${Date.now()}`,
      name: `${objectType.charAt(0).toUpperCase() + objectType.slice(1)} ${activeFloor.objects.filter(o => o.type === objectType).length + 1}`,
      type: objectType,
      description: 'Placed by AI assistant.',
      price: 20,
      position: { x: suggestion.x, y: suggestion.y },
      status: 'Free',
      ...dimensions
    };
    setActiveFloor({...activeFloor, objects: [...activeFloor.objects, newObject]});
    setSuggestions((prev) => prev.filter(s => s !== suggestion));
  };
  
  const updateActiveLocationAndSave = (newLocation: Location) => {
    setActiveLocation(newLocation);
    const localStorageKey = getLocalStorageKey(newLocation.id);
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(newLocation));
    } catch (error) {
      console.error('Failed to save map:', error);
    }
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
    updateActiveLocationAndSave(mapData);
    toast({ title: 'Map Saved!', description: `Your map for ${activeLocation.name} has been saved locally.` });
  };
  
  const handleObjectDragStart = (e: React.DragEvent<HTMLButtonElement>, obj: BookableObject) => {
    e.dataTransfer.setData('objectId', obj.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingObject(obj.id);
    setSelectedObject(obj);
  };
  
  const handleObjectDragEnd = () => {
    setDraggingObject(null);
  };

  const handleObjectClick = (e: React.MouseEvent, obj: BookableObject) => {
    e.stopPropagation(); // Prevent map click from firing
    setSelectedObject(obj);
  };

  const handleMapClick = (e: React.MouseEvent) => {
      if (e.target === mapContainerRef.current || e.target === mapContentRef.current) {
        setSelectedObject(null); // Deselect object when clicking on the map
      }
  };

  const handleOpenEditDialog = (obj: BookableObject) => {
    setSelectedObject(obj);
    setIsEditDialogOpen(true);
  };


  const handleUpdateObject = (updatedObject: BookableObject) => {
    if (activeFloor) {
        const newObjects = activeFloor.objects.map(obj => obj.id === updatedObject.id ? updatedObject : obj);
        setActiveFloor({...activeFloor, objects: newObjects});
    }
  };

  const handleFinalUpdateObject = (updatedObject: BookableObject) => {
    handleUpdateObject(updatedObject);
    toast({ title: 'Object Updated', description: `Successfully updated ${updatedObject.name}.` });
  };

   const handleDeleteObject = (objectId: string) => {
    if (activeFloor) {
        const newObjects = activeFloor.objects.filter(obj => obj.id !== objectId);
        setActiveFloor({...activeFloor, objects: newObjects});
        toast({ title: 'Object Deleted', description: 'The object has been removed from the map.' });
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
  
  const handleAddFloor = () => {
    if (!activeLocation || !newFloorName.trim()) {
        toast({variant: 'destructive', title: 'Floor name is required'});
        return;
    };
    const newFloor: Floor = {
        id: `floor-${Date.now()}`,
        name: newFloorName,
        floorPlanUrl: '',
        objects: [],
    };
    const updatedLocation = {
        ...activeLocation,
        floors: [...(activeLocation.floors || []), newFloor]
    };
    updateActiveLocationAndSave(updatedLocation);
    setActiveFloor(newFloor);
    setNewFloorName('');
    setIsAddFloorOpen(false);
    toast({title: 'Floor Added', description: `Successfully added ${newFloor.name}`});
  }

  const handleDeleteFloor = () => {
    if (!activeLocation || !activeFloor || !activeLocation.floors || activeLocation.floors.length <= 1) {
        toast({variant: 'destructive', title: 'Cannot Delete', description: 'You must have at least one floor.'});
        return;
    };
    const updatedFloors = activeLocation.floors.filter(f => f.id !== activeFloor.id);
    const updatedLocation = {
        ...activeLocation,
        floors: updatedFloors
    };
    updateActiveLocationAndSave(updatedLocation);
    setActiveFloor(updatedFloors[0] || null);
    toast({title: 'Floor Deleted'});
  }

  // Resizing logic
    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, obj: BookableObject, handle: ResizingState['handle']) => {
        e.stopPropagation();
        e.preventDefault();
        if (!mapContainerRef.current) return;

        const initialMousePos = getMapCoordinates(e.clientX, e.clientY);
        setResizingState({
            handle,
            initialObject: obj,
            initialMousePos,
        });
    };

    const handleWheelZoom = (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        const newScale = Math.max(0.1, Math.min(scale * zoomFactor, 5));
        
        const rect = mapContainerRef.current!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newTx = mouseX - (mouseX - translation.x) * zoomFactor;
        const newTy = mouseY - (mouseY - translation.y) * zoomFactor;

        setScale(newScale);
        setTranslation({ x: newTx, y: newTy });
      }
    };
    
    const handleZoomControls = (factor: 'in' | 'out' | 'reset') => {
        if(factor === 'reset') {
            setScale(1);
            setTranslation({ x: 0, y: 0 });
            return;
        }
        const zoomFactor = factor === 'in' ? 1.2 : 1 / 1.2;
        const newScale = Math.max(0.1, Math.min(scale * zoomFactor, 5));
        setScale(newScale);
    }
  
    // Pan logic
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isPanning) {
                e.preventDefault();
                mapContainerRef.current?.classList.add('cursor-grab');
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setIsPanning(false);
                mapContainerRef.current?.classList.remove('cursor-grab', 'cursor-grabbing');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isPanning]);


    const handleMouseDownForPan = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Only left-click
        if (e.nativeEvent.code === 'Space' || e.buttons === 4) { // Spacebar or middle mouse
            setIsPanning(true);
            setStartPanPosition({ x: e.clientX - translation.x, y: e.clientY - translation.y });
            mapContainerRef.current?.classList.add('cursor-grabbing');
        }
    };

    const handleMouseMoveForPanAndResize = useCallback((e: MouseEvent) => {
        if (isPanning) {
            const newTx = e.clientX - startPanPosition.x;
            const newTy = e.clientY - startPanPosition.y;
            setTranslation({ x: newTx, y: newTy });
        }
        
        if (!resizingState || !mapContainerRef.current || !activeFloor) return;
            
        const { initialObject, initialMousePos, handle } = resizingState;
        
        const currentMousePos = getMapCoordinates(e.clientX, e.clientY);
        const dx = (currentMousePos.x - initialMousePos.x);
        const dy = (currentMousePos.y - initialMousePos.y);
        
        let newWidth = initialObject.width;
        let newHeight = initialObject.height;
        let newX = initialObject.position.x;
        let newY = initialObject.position.y;

        if (handle.includes('right')) {
            newWidth = Math.max(1, initialObject.width + dx);
            newX = initialObject.position.x + dx / 2;
        } else if (handle.includes('left')) {
            newWidth = Math.max(1, initialObject.width - dx);
            newX = initialObject.position.x + dx / 2;
        }

        if (handle.includes('bottom')) {
            newHeight = Math.max(1, initialObject.height + dy);
            newY = initialObject.position.y + dy / 2;
        } else if (handle.includes('top')) {
            newHeight = Math.max(1, initialObject.height - dy);
            newY = initialObject.position.y + dy / 2;
        }
        
        const updatedObject = {
            ...initialObject,
            width: newWidth,
            height: newHeight,
            position: { x: newX, y: newY },
        };

        // Collision check
        let collision = false;
        for (const obj of activeFloor.objects) {
            if (obj.id !== updatedObject.id && checkCollision(updatedObject, obj)) {
                collision = true;
                break;
            }
        }

        if (!collision) {
            const newObjects = activeFloor.objects.map(obj => obj.id === updatedObject.id ? updatedObject : obj);
            setActiveFloor(prev => prev ? { ...prev, objects: newObjects } : null);
            setSelectedObject(updatedObject);
        }
    }, [isPanning, startPanPosition, resizingState, activeFloor, getMapCoordinates]);

    const handleMouseUp = useCallback(() => {
      setIsPanning(false);
      setResizingState(null);
      mapContainerRef.current?.classList.remove('cursor-grab', 'cursor-grabbing');
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMoveForPanAndResize);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMoveForPanAndResize);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMoveForPanAndResize, handleMouseUp]);


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 h-full flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
             {activeLocation && activeLocation.floors && activeLocation.floors.length > 0 && (
                <Select value={activeFloor?.id} onValueChange={(id) => setActiveFloor(activeLocation.floors.find(f => f.id === id) || null)}>
                    <SelectTrigger className="w-full sm:w-[280px]">
                        <SelectValue placeholder="Select a floor" />
                    </SelectTrigger>
                    <SelectContent>
                        {activeLocation.floors.map(floor => (
                            <SelectItem key={floor.id} value={floor.id}>{floor.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             )}
             <Button variant="outline" size="sm" onClick={() => setIsAddFloorOpen(true)}>
                <PlusCircle className="mr-2" />
                Add Floor
             </Button>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={!activeLocation || !activeLocation.floors || activeLocation.floors.length <= 1}>
                        <Trash2 className="mr-2" />
                        Delete Floor
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the floor plan and all its objects.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteFloor}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
          <div 
            ref={mapContainerRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleMapClick}
            onWheel={handleWheelZoom}
            onMouseDown={handleMouseDownForPan}
            className="relative w-full aspect-[4/3] bg-muted/50 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors border-primary/20 overflow-hidden"
          >
            <div 
              ref={mapContentRef}
              className="absolute top-0 left-0 w-full h-full" 
              style={{ 
                  transform: `translate(${translation.x}px, ${translation.y}px) scale(${scale})`,
                  transformOrigin: 'top left' 
              }}>
                {activeFloor?.floorPlanUrl ? (
                <>
                    <Image src={activeFloor.floorPlanUrl} layout="fill" objectFit="contain" alt="Floor plan" className="rounded-md p-2 pointer-events-none" />
                    {activeFloor.objects.map((obj) => {
                    const Icon = getObjectIcon(obj.type, paletteItems);
                    const isSelected = selectedObject?.id === obj.id;
                    return (
                        <div
                        key={obj.id}
                        onClick={(e) => handleObjectClick(e, obj)}
                        className={cn(
                            "absolute -translate-x-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm shadow-md cursor-grab active:cursor-grabbing group flex items-center justify-center rounded-md",
                            draggingObject === obj.id && "opacity-50",
                            isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        )}
                        style={{ 
                            left: `${obj.position.x}%`, 
                            top: `${obj.position.y}%`,
                            width: `${obj.width || 5}%`,
                            height: `${obj.height || 5}%`,
                        }}
                        >
                            <button
                            draggable
                            onDragStart={(e) => handleObjectDragStart(e, obj)}
                            onDragEnd={handleObjectDragEnd}
                            onDoubleClick={() => handleOpenEditDialog(obj)}
                            className="w-full h-full flex items-center justify-center"
                            aria-label={`Edit ${obj.name}`}
                            >
                                <Icon className="w-2/3 h-2/3 text-foreground transition-transform group-hover:scale-125" style={{ color: obj.color }} />
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {obj.name}
                                </div>
                            </button>

                            {isSelected && !resizingState && (
                                <>
                                    <div onMouseDown={(e) => handleResizeStart(e, obj, 'top-left')} className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-nwse-resize border-2 border-background" />
                                    <div onMouseDown={(e) => handleResizeStart(e, obj, 'top-right')} className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-nesw-resize border-2 border-background" />
                                    <div onMouseDown={(e) => handleResizeStart(e, obj, 'bottom-left')} className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-nesw-resize border-2 border-background" />
                                    <div onMouseDown={(e) => handleResizeStart(e, obj, 'bottom-right')} className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-nwse-resize border-2 border-background" />
                                    <Button size="icon" variant="secondary" className="absolute -top-3 -right-10 h-7 w-7" onClick={() => handleOpenEditDialog(obj)}><Edit /></Button>
                                </>
                            )}
                        </div>
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
                <div className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground">
                    <div>
                        <UploadCloud className="mx-auto h-12 w-12" />
                        <p className="mt-2">Upload a floor plan to begin</p>
                        <p className="text-xs">PNG, JPG, or SVG up to 5MB</p>
                    </div>
                </div>
                )}
            </div>

            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleZoomControls('out')}><ZoomOut /></Button>
                <Button variant="outline" size="icon" onClick={() => handleZoomControls('reset')}><Maximize /></Button>
                <Button variant="outline" size="icon" onClick={() => handleZoomControls('in')}><ZoomIn /></Button>
                <span className="p-2 bg-background/80 rounded-md text-xs font-mono">{Math.round(scale * 100)}%</span>
            </div>

             {isUploading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
          </div>
          <div className="flex gap-2">
              <Button asChild variant="outline" disabled={isUploading}>
                  <label htmlFor="floor-plan-upload" className="cursor-pointer">
                      {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                      {activeFloor?.floorPlanUrl ? 'Change Plan' : 'Upload Plan'}
                  </label>
              </Button>
              <input id="floor-plan-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              <Button onClick={handleSaveMap} disabled={!activeFloor?.floorPlanUrl}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Map
              </Button>
              <Button variant="destructive" onClick={handleClear} disabled={!activeFloor?.floorPlanUrl}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
              </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <ObjectPalette paletteItems={paletteItems} onAddCustomItem={handleAddCustomItem} />
          <PlacementAssistant 
            floorPlanUrl={activeFloor?.floorPlanUrl || null}
            onSuggestions={setSuggestions} 
            disabled={!activeFloor?.floorPlanUrl}
          />
        </div>
      </div>
      
      <EditObjectDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        object={selectedObject}
        onSave={handleFinalUpdateObject}
        onDelete={handleDeleteObject}
        onLiveUpdate={handleUpdateObject}
      />
      
      <AlertDialog open={isAddFloorOpen} onOpenChange={setIsAddFloorOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Add a New Floor</AlertDialogTitle>
            <AlertDialogDescription>
                Enter a name for the new floor or area in your location.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
                <Label htmlFor="new-floor-name">Floor Name</Label>
                <Input 
                    id="new-floor-name" 
                    value={newFloorName} 
                    onChange={(e) => setNewFloorName(e.target.value)}
                    placeholder="e.g., 'Rooftop Terrace'"
                />
            </div>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddFloor}>Add Floor</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
