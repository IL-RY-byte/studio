import Header from '@/components/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CreditCard className="mx-auto h-12 w-12 text-primary mb-4" />
                        <CardTitle className="text-2xl font-headline">Payment Gateway</CardTitle>
                        <CardDescription>
                            This is where the payment integration (e.g., Stripe, PayPal) would be.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">For this demo, we'll simulate a successful payment.</p>
                    </CardContent>
                    <CardFooter>
                         <Button asChild className="w-full">
                            <Link href="/admin/bookings">
                                <CheckCircle className="mr-2" />
                                Simulate Payment & View Bookings
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
