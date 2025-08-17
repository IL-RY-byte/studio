
export type ObjectStatus = 'Free' | 'Reserved' | 'Occupied';

export type ObjectType = 'sunbed' | 'table' | 'workspace' | 'boat' | 'room' | string;

export type BookableObject = {
  id: string;
  name: string;
  type: ObjectType;
  description: string;
  price: number;
  position: { x: number; y: number }; // position in percentage
  status: ObjectStatus;
};

export type Floor = {
  id: string;
  name: string;
  floorPlanUrl: string;
  objects: BookableObject[];
};

export type Location = {
  id: string;
  name: string;
  description?: string;
  floors: Floor[];
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  cuisine?: string;
  specials?: string[];
  amenities?: string[];
  workingHours?: {
    days: string;
    hours: string;
    isClosed?: boolean;
  }[];
  coverImageUrl?: string;
  gallery?: string[];
};

export type Booking = {
    id: string;
    objectName: string;
    locationName: string;
    customerName: string;
    bookingDate: string;
    status: 'Confirmed' | 'Cancelled';
}

export type PaletteItem = {
  type: ObjectType;
  name: string;
  icon: React.ElementType;
};
