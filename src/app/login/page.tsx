
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Loader2 } from 'lucide-react';

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: any;
    }
}

export default function LoginPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const setupRecaptcha = () => {
        if (typeof window !== 'undefined') {
            if (window.recaptchaVerifier) {
                // Clears the existing verifier if it's there.
                // This is to prevent errors on re-render.
                window.recaptchaVerifier.clear();
            }
            try {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': (response: any) => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber.
                    }
                });
            } catch (error) {
                console.error("RecaptchaVerifier initialization error:", error);
            }
        }
    };

    useEffect(() => {
        setupRecaptcha();
    }, []);


    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formattedPhoneNumber = `+${phoneNumber.replace(/\D/g, '')}`;
            
            // Ensure verifier is still valid
            if (!window.recaptchaVerifier) {
                setupRecaptcha(); // Try to set it up again
            }

            const verifier = window.recaptchaVerifier;
            if(!verifier) {
                toast({ variant: 'destructive', title: 'Error', description: 'Recaptcha not initialized. Please refresh.' });
                setIsLoading(false);
                return;
            }

            const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, verifier);
            window.confirmationResult = confirmationResult;
            setOtpSent(true);
            toast({ title: 'OTP Sent', description: 'An OTP has been sent to your phone number.' });
        } catch (error: any) {
            console.error(error);
             toast({ variant: 'destructive', title: 'Error sending OTP', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await window.confirmationResult.confirm(otp);
            const user = result.user;
            console.log('User signed in:', user);
            toast({ title: 'Success!', description: 'You have been successfully signed in.' });
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Invalid OTP. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-headline">
                            {otpSent ? 'Enter Verification Code' : 'Sign In with Phone'}
                        </CardTitle>
                        <CardDescription>
                            {otpSent ? `We sent a code to +${phoneNumber}` : 'Please enter your phone number to continue.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!otpSent ? (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <Input
                                    type="tel"
                                    placeholder="e.g. 11234567890"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send OTP
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                     {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Verify OTP
                                </Button>
                            </form>
                        )}
                        <div id="recaptcha-container" className="mt-4"></div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
