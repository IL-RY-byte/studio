import Header from "@/components/Header";
import Image from "next/image";

export default function CoworkingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary w-fit">
                  For Coworking & Business Centers
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Modernize Your Workspace Bookings
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Enable members to book hot desks, dedicated offices, or meeting rooms in real-time with a dynamic map of your space.
                </p>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Coworking Space"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                data-ai-hint="coworking space"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
