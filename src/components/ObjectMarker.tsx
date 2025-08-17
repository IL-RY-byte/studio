'use client';

import type { FC } from 'react';
import type { BookableObject } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SunbedIcon, TableIcon, BoatIcon, WorkspaceIcon, RoomIcon } from './icons';

interface ObjectMarkerProps {
  object: BookableObject;
  onClick: (object: BookableObject) => void;
}

const statusColors: Record<BookableObject['status'], string> = {
  Free: 'ring-green-500/70 hover:ring-green-500',
  Reserved: 'ring-yellow-500/70 hover:ring-yellow-500',
  Occupied: 'ring-red-500/70 cursor-not-allowed',
};

const ObjectIcons: Record<BookableObject['type'], React.ElementType> = {
  sunbed: SunbedIcon,
  table: TableIcon,
  boat: BoatIcon,
  workspace: WorkspaceIcon,
  room: RoomIcon,
};


const ObjectMarker: FC<ObjectMarkerProps> = ({ object, onClick }) => {
  const Icon = ObjectIcons[object.type] || TableIcon;
  const isClickable = object.status !== 'Occupied';

  return (
    <button
      onClick={() => isClickable && onClick(object)}
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary',
        'flex items-center justify-center bg-card/80 backdrop-blur-sm shadow-md ring-4',
        statusColors[object.status],
        isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
      )}
      style={{ left: `${object.position.x}%`, top: `${object.position.y}%` }}
      aria-label={`Select ${object.name}`}
    >
      <Icon className="w-6 h-6 text-foreground" />
    </button>
  );
};

export default ObjectMarker;
