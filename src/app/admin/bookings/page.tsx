import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockBookings } from "@/lib/mock-data";
import { Trash2 } from "lucide-react";

export default function BookingsPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-4">
        <h1 className="font-semibold text-2xl md:text-3xl font-headline">Bookings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
          <CardDescription>An overview of all past and upcoming reservations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Object</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.objectName}</TableCell>
                  <TableCell>{booking.locationName}</TableCell>
                  <TableCell>{booking.bookingDate}</TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'Confirmed' ? 'default' : 'destructive'}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" disabled={booking.status === 'Cancelled'}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
