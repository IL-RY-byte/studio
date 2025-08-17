import Header from '@/components/Header';
import MapView from '@/components/MapView';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

export default function MapPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="relative w-full h-[calc(100vh-57px)] flex items-center justify-center">
              <Skeleton className="w-full h-full" />
              <p className="absolute text-lg text-muted-foreground">Loading Map...</p>
          </div>
        }>
          <MapView />
        </Suspense>
      </main>
    </div>
  );
}
