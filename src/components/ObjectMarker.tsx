'use client';

import type { FC } from 'react';
import type { BookableObject } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SunbedIcon, TableIcon, BoatIcon, WorkspaceIcon, RoomIcon, Box } from './icons';

interface ObjectMarkerProps {
  object: BookableObject;
  onClick: (object: BookableObject) => void;
}

const statusClasses: Record<BookableObject['status'], string> = {
  Free: 'ring-[hsl(var(--status-free))] hover:ring-2',
  Reserved: 'ring-[hsl(var(--status-reserved))] hover:ring-2',
  Occupied: 'ring-[hsl(var(--status-occupied))] cursor-not-allowed',
};

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

  return (
    <button
      onClick={() => isClickable && onClick(object)}
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary',
        'flex items-center justify-center bg-card/80 backdrop-blur-sm shadow-md ring-4',
        statusClasses[object.status],
        isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
      )}
      style={{ 
        left: `${object.position.x}%`, 
        top: `${object.position.y}%`,
        width: `${object.width}%`,
        height: `${object.height}%`,
      }}
      aria-label={`Select ${object.name}`}
    >
      <Icon className="w-6 h-6 text-foreground" />
    </button>
  );
};

export default ObjectMarker;
