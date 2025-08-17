'use client';

import type { FC } from 'react';
import type { BookableObject } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useToast } from "@/hooks/use-toast";
import React from 'react';
import { useRouter } from 'next/navigation';

interface BookingSheetProps {
  object: BookableObject | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const statusVariant: Record<BookableObject['status'], 'default' | 'destructive' | 'secondary'> = {
    Free: 'default',
    Reserved: 'secondary',
    Occupied: 'destructive'
};

const BookingSheet: FC<BookingSheetProps> = ({ object, isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  if (!object) return null;

  const handleBooking = () => {
    onOpenChange(false);
    toast({
        title: "Proceeding to Payment",
        description: `Booking ${object.name} for ${date?.toLocaleDateString()}.`,
    });
    router.push('/payment');
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader className="pr-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-headline">{object.name}</SheetTitle>
            <Badge variant={statusVariant[object.status]} className="capitalize">{object.status}</Badge>
          </div>
          <SheetDescription>{object.description}</SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-muted-foreground">Price</span>
            <span className="font-semibold text-primary">${object.price.toFixed(2)} / hour</span>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Select Date & Time</h3>
            <div className="flex justify-center rounded-md border">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
              />
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button type="button" size="lg" className="w-full" onClick={handleBooking}>
            Book and Pay
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BookingSheet;
