import Header from '@/components/Header';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <LandingPage />
      </main>
    </div>
  );
}
