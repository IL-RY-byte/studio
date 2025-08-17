import Header from '@/components/Header';
import InteractiveMap from '@/components/InteractiveMap';
import { beachClubLocation } from '@/lib/mock-data';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <InteractiveMap location={beachClubLocation} />
      </main>
    </div>
  );
}
