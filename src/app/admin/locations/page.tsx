import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { beachClubLocation, restaurantLocation, coworkingLocation } from "@/lib/mock-data";
import type { Location } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

const locations: Location[] = [restaurantLocation, beachClubLocation, coworkingLocation];

export default function LocationsPage() {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-semibold text-2xl md:text-3xl font-headline">Locations</h1>
                <Button>
                    <PlusCircle className="mr-2" />
                    Add New Location
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {locations.map((location) => (
                    <Card key={location.id}>
                        <CardHeader>
                            <div className="aspect-[4/3] relative mb-4">
                                <Image
                                    src={location.floorPlanUrl}
                                    alt={`${location.name} Floor Plan`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                />
                            </div>
                            <CardTitle>{location.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{location.objects.length} objects</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/editor">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                            <Button variant="destructive" size="sm" disabled>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    );
}
