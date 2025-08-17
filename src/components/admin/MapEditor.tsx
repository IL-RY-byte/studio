'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { BookableObject, ObjectType, Location } from '@/lib/types';
import ObjectPalette from './ObjectPalette';
import PlacementAssistant from './PlacementAssistant';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2, Save } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { SunbedIcon, TableIcon, BoatIcon, WorkspaceIcon, RoomIcon } from '../icons';

const ObjectIcons: Record<ObjectType, React.ElementType> = {
  sunbed: SunbedIcon,
  table: TableIcon,
  boat: BoatIcon,
  workspace: WorkspaceIcon,
  room: RoomIcon,
};

type Suggestion = {
    x: number;
    y: number;
    confidence: number;
};

const LOCAL_STORAGE_KEY = 'planwise-map-data';


export default function MapEditor() {
  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [floorPlanFile, setFloorPlanFile] = useState<File | null>(null);
  const [objects, setObjects] = useState<BookableObject[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData: Location = JSON.parse(savedData);
        setFloorPlan(parsedData.floorPlanUrl);
        setObjects(parsedData.objects);
        // We don't save the File object, but we need a placeholder for the URI for the assistant
        if(parsedData.floorPlanUrl){
            fetch(parsedData.floorPlanUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "saved-plan.png", { type: blob.type });
                    setFloorPlanFile(file);
                });
        }
      } catch (error) {
        console.error("Failed to parse saved map data:", error);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFloorPlanFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFloorPlan(event.target?.result as string);
        setObjects([]);
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
    if (!mapContainerRef.current) return;

    const type = e.dataTransfer.getData('objectType') as ObjectType;
    if (!type) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newObject: BookableObject = {
      id: `${type}-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${objects.filter(o => o.type === type).length + 1}`,
      type: type,
      description: `A new ${type}.`,
      price: 0,
      position: { x, y },
      status: 'Free',
    };
    setObjects((prev) => [...prev, newObject]);
    setSuggestions([]); // Clear suggestions after manual placement
  };

  const handleClear = () => {
    setObjects([]);
    setSuggestions([]);
    toast({ title: "Canvas Cleared", description: "All objects have been removed from the map." });
  };
  
  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    const objectType = 'sunbed'; // This should be dynamic based on what was requested
    const newObject: BookableObject = {
      id: `${objectType}-${Date.now()}`,
      name: `${objectType.charAt(0).toUpperCase() + objectType.slice(1)} ${objects.filter(o => o.type === objectType).length + 1}`,
      type: objectType,
      description: 'Placed by AI assistant.',
      price: 20,
      position: { x: suggestion.x, y: suggestion.y },
      status: 'Free',
    };
    setObjects((prev) => [...prev, newObject]);
    setSuggestions((prev) => prev.filter(s => s !== suggestion));
  };

  const handleSaveMap = () => {
    if (!floorPlan) {
      toast({ variant: 'destructive', title: 'Cannot Save', description: 'Please upload a floor plan first.' });
      return;
    }
    const mapData: Location = {
      id: 'custom-map-1',
      name: 'My Custom Venue',
      floorPlanUrl: floorPlan,
      objects,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapData));
      toast({ title: 'Map Saved!', description: 'Your map has been saved locally in your browser.' });
    } catch (error) {
      console.error('Failed to save map:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save the map.' });
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 h-full flex-1">
      <div className="flex flex-col gap-4">
        <div 
          ref={mapContainerRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            "relative w-full h-full min-h-[400px] bg-muted/50 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors",
            floorPlan ? 'border-primary/20' : 'border-muted-foreground/30'
          )}
        >
          {floorPlan ? (
            <>
              <Image src={floorPlan} layout="fill" objectFit="contain" alt="Floor plan" className="rounded-md" />
              {objects.map((obj) => {
                const Icon = ObjectIcons[obj.type] || TableIcon;
                return (
                  <div
                    key={obj.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-md cursor-move"
                    style={{ left: `${obj.position.x}%`, top: `${obj.position.y}%` }}
                  >
                    <Icon className="w-6 h-6 text-foreground" />
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
            <div className="text-center text-muted-foreground">
              <UploadCloud className="mx-auto h-12 w-12" />
              <p className="mt-2">Upload a floor plan to begin</p>
              <p className="text-xs">PNG, JPG, or SVG up to 5MB</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline">
                <label htmlFor="floor-plan-upload" className="cursor-pointer">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {floorPlan ? 'Change Plan' : 'Upload Plan'}
                </label>
            </Button>
            <input id="floor-plan-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            <Button onClick={handleSaveMap} disabled={!floorPlan}>
                <Save className="mr-2 h-4 w-4" />
                Save Map
            </Button>
            <Button variant="destructive" onClick={handleClear} disabled={objects.length === 0 && suggestions.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
            </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <ObjectPalette />
        <PlacementAssistant 
          floorPlanFile={floorPlanFile}
          onSuggestions={setSuggestions} 
        />
      </div>
    </div>
  );
}
