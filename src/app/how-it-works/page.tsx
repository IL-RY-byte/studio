import Header from "@/components/Header";
import { UploadCloud, MousePointerClick, Save } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-muted/40">
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
                            <h3 className="text-xl font-bold text-center">1. Upload Your Floor Plan</h3>
                            <p className="text-muted-foreground text-center">
                            Start by uploading an image of your venue's layout. It can be a simple sketch or a detailed architectural drawing.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                <MousePointerClick className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-center">2. Design Your Space</h3>
                            <p className="text-muted-foreground text-center">
                            Use the drag-and-drop editor to place tables, chairs, and other objects. Use the AI assistant for smart layout suggestions.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                <Save className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-center">3. Save and Go Live</h3>
                            <p className="text-muted-foreground text-center">
                            Save your map, and it's instantly available for customers to view and make bookings. It's that simple!
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
  );
}
