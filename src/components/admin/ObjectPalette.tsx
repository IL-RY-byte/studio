'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SunbedIcon, TableIcon, BoatIcon, WorkspaceIcon, RoomIcon } from '../icons';
import type { ObjectType } from '@/lib/types';

const paletteItems: { type: ObjectType; name: string; icon: React.ElementType }[] = [
  { type: 'table', name: 'Table', icon: TableIcon },
  { type: 'sunbed', name: 'Sunbed', icon: SunbedIcon },
  { type: 'workspace', name: 'Workspace', icon: WorkspaceIcon },
  { type: 'boat', name: 'Boat/Jet Ski', icon: BoatIcon },
  { type: 'room', name: 'Room/House', icon: RoomIcon },
];

export default function ObjectPalette() {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: ObjectType) => {
    e.dataTransfer.setData('objectType', type);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Object Palette</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Drag an object onto the map.</p>
        <div className="grid grid-cols-2 gap-4">
          {paletteItems.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-grab active:cursor-grabbing transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="w-8 h-8 mb-2" />
              <span className="text-xs text-center">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
