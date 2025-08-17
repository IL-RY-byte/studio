import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutGrid, BotMessageSquare, Map, Compass } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">PlanWise</span>
        </Link>
        <nav className="flex items-center gap-4">
           <Button asChild variant="ghost">
            <Link href="/map">
              <Map className="mr-2 h-4 w-4" />
              Demo
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/locations">
              <Compass className="mr-2 h-4 w-4" />
              Locations
            </Link>
          </Button>
        </nav>
        <div className="flex-1" />
        <nav className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/admin">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
