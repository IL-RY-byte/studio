import Header from "@/components/Header";
import Image from "next/image";

export default function ResortsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary w-fit">
                  For Resorts & Beaches
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Maximize Your Beachfront Revenue
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Allow guests to pre-book sunbeds, cabanas, and watersports equipment with a visual, interactive map of your property.
                </p>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Beach Resort"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                data-ai-hint="beach resort"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
