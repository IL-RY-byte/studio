import Header from '@/components/Header';
import InteractiveMap from '@/components/InteractiveMap';
import { restaurantLocation } from '@/lib/mock-data';

export default function MapPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <InteractiveMap location={restaurantLocation} />
      </main>
    </div>
  );
}
