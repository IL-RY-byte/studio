export type ObjectStatus = 'Free' | 'Reserved' | 'Occupied';

export type ObjectType = 'sunbed' | 'table' | 'workspace' | 'boat' | 'room';

export type BookableObject = {
  id: string;
  name: string;
  type: ObjectType;
  description: string;
  price: number;
  position: { x: number; y: number }; // position in percentage
  status: ObjectStatus;
};

export type Location = {
  id: string;
  name: string;
  floorPlanUrl: string;
  objects: BookableObject[];
};
