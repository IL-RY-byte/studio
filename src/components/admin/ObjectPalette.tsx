'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { PaletteItem } from '@/lib/types';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import AddCustomObjectDialog from './AddCustomObjectDialog';

interface ObjectPaletteProps {
  paletteItems: PaletteItem[];
  onAddCustomItem: (item: Omit<PaletteItem, 'icon' | 'type'>) => void;
}

export default function ObjectPalette({ paletteItems, onAddCustomItem }: ObjectPaletteProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData('objectType', type);
  };

  return (
    <>
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
          <Button variant="outline" className="w-full mt-4" onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2" />
            Add Custom Object
          </Button>
        </CardContent>
      </Card>
      <AddCustomObjectDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={onAddCustomItem}
      />
    </>
  );
}
