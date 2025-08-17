
'use client';

import React, { useMemo } from 'react';
import type { Location } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Badge } from './ui/badge';
import { Clock, Coffee, Mail, MapPin, Phone, Wifi } from 'lucide-react';
import { Separator } from './ui/separator';

interface LiveAnalyticsProps {
  location: Location;
}

const COLORS: Record<string, string> = {
  Free: 'hsl(var(--status-free))',
  Reserved: 'hsl(var(--status-reserved))',
  Occupied: 'hsl(var(--status-occupied))',
};

export default function LiveAnalytics({ location }: LiveAnalyticsProps) {
  const analyticsData = useMemo(() => {
    const statusCounts = location.objects.reduce((acc, obj) => {
      acc[obj.status] = (acc[obj.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [location.objects]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{location.name}</CardTitle>
          <CardDescription>{location.description || 'Welcome to our venue. Click any available item on the map to make a booking.'}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
            {location.address && <div className="flex items-start gap-2"><MapPin className="text-muted-foreground mt-1" /><span>{location.address}</span></div>}
            {location.phone && <div className="flex items-center gap-2"><Phone className="text-muted-foreground" /><span>{location.phone}</span></div>}
            {location.email && <div className="flex items-center gap-2"><Mail className="text-muted-foreground" /><span>{location.email}</span></div>}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Cuisine & Specials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Coffee className="text-muted-foreground" />
            <span className="font-semibold">{location.cuisine}</span>
          </div>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            {location.specials?.map((special, i) => <li key={i}>{special}</li>)}
          </ul>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
            {location.amenities?.map((amenity, i) => (
                <Badge key={i} variant="outline">{amenity}</Badge>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
           {location.workingHours?.map((wh, i) => (
             <div key={i} className={`flex justify-between items-center ${wh.isClosed ? 'text-muted-foreground' : ''}`}>
               <span>{wh.days}</span>
               <span>{wh.isClosed ? 'Closed' : wh.hours}</span>
             </div>
           ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Status</CardTitle>
          <CardDescription>A real-time overview of object availability.</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData.length > 0 ? (
            <div className="w-full h-64">
                <PieChart width={350} height={250}>
                  <Pie
                    data={analyticsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                  />
                  <Legend />
                </PieChart>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No objects on the map to analyze.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
