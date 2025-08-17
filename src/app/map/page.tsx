import Header from '@/components/Header';
import MapView from '@/components/MapView';

export default function MapPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <MapView />
      </main>
    </div>
  );
}
