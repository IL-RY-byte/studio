'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shuffle, Smartphone, UploadCloud, Save, MousePointerClick } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Launch Bookings on Your Map in 10 Minutes
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Upload your venue plan, place objects, and start accepting payments in one click.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/admin">
                      Start Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/map">
                      Watch Demo
                    </Link>
                  </Button>
                </div>
              </div>
               <div className="mx-auto flex w-full items-center justify-center lg:order-last">
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/planwise-prmae.appspot.com/o/logoplanwise.png?alt=media&token=29273205-78e5-412e-a928-910e0a50bca2"
                  alt="Interactive Map"
                  width={600}
                  height={400}
                  className="rounded-xl shadow-2xl"
                  data-ai-hint="interactive map"
                />
               </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Key Benefits</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is packed with features to help you manage your space efficiently and provide an amazing customer experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-3 md:gap-12 lg:gap-16 mt-12">
              <div className="grid gap-1 text-center">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                    <Star className="h-8 w-8" />
                 </div>
                <h3 className="text-xl font-bold">Higher Revenue</h3>
                <p className="text-sm text-muted-foreground">
                    Maximize your space utilization and offer premium bookings to increase your income.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                    <Shuffle className="h-8 w-8" />
                 </div>
                <h3 className="text-xl font-bold">Real-Time Map</h3>
                <p className="text-sm text-muted-foreground">
                    Give customers a live view of your venue's availability, reducing manual coordination.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                    <Smartphone className="h-8 w-8" />
                 </div>
                <h3 className="text-xl font-bold">Online Payments & Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Securely accept pre-payments and automatically send confirmations to your customers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get your interactive venue map up and running in three simple steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-4">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <UploadCloud className="h-8 w-8" />
                 </div>
                <h3 className="text-xl font-bold text-center">1. Create Location</h3>
                <p className="text-muted-foreground text-center">
                  Start by uploading an image of your venue's layout. It can be a simple sketch or a detailed architectural drawing.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <MousePointerClick className="h-8 w-8" />
                 </div>
                <h3 className="text-xl font-bold text-center">2. Place Objects</h3>
                <p className="text-muted-foreground text-center">
                  Use the drag-and-drop editor to place tables, chairs, and other objects. Use the AI assistant for smart layout suggestions.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    <Save className="h-8 w-8" />
                 </div>
                <h3 className="text-xl font-bold text-center">3. Launch Bookings</h3>
                <p className="text-muted-foreground text-center">
                  Save your map, and it's instantly available for customers to view and make bookings. It's that simple!
                </p>
              </div>
            </div>
             <div className="flex justify-center flex-col gap-2 min-[400px]:flex-row mt-8">
                <Button asChild size="lg">
                    <Link href="/admin">
                        Start Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
