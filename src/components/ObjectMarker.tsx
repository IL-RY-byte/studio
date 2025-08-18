
'use client';

import type { FC } from 'react';
import type { BookableObject } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SunbedIcon, TableIcon, BoatIcon, WorkspaceIcon, RoomIcon, Box } from './icons';

interface ObjectMarkerProps {
  object: BookableObject;
  onClick: (object: BookableObject) => void;
}

const getStatusColor = (object: BookableObject): string => {
    if (object.color) return object.color;
    switch(object.status) {
        case 'Free': return 'hsl(var(--status-free))';
        case 'Reserved': return 'hsl(var(--status-reserved))';
        case 'Occupied': return 'hsl(var(--status-occupied))';
        default: return 'hsl(var(--muted-foreground))';
    }
}

const ObjectIcons: Record<BookableObject['type'], React.ElementType> = {
  sunbed: SunbedIcon,
  table: TableIcon,
  boat: BoatIcon,
  workspace: WorkspaceIcon,
  room: RoomIcon,
};


const ObjectMarker: FC<ObjectMarkerProps> = ({ object, onClick }) => {
  const Icon = ObjectIcons[object.type] || Box;
  const isClickable = object.status !== 'Occupied';
  const color = getStatusColor(object);

  return (
    <button
      onClick={() => isClickable && onClick(object)}
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary',
        'flex items-center justify-center bg-card/80 backdrop-blur-sm shadow-md ring-4',
        isClickable ? 'cursor-pointer hover:ring-2' : 'cursor-not-allowed'
      )}
      style={{ 
        left: `${object.position.x}%`, 
        top: `${object.position.y}%`,
        width: `${object.width}%`,
        height: `${object.height}%`,
        ringColor: color,
      }}
      aria-label={`Select ${object.name}`}
    >
      <Icon className="w-6 h-6 text-foreground" style={{ color: object.color }} />
    </button>
  );
};

export default ObjectMarker;
