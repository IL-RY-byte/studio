'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Bell, CreditCard, Bot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    return (
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-semibold text-2xl md:text-3xl font-headline">Settings</h1>
                <Button>
                    <Save className="mr-2" />
                    Save Changes
                </Button>
            </div>
            
            <div className="grid gap-6 max-w-4xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                           <CreditCard className="h-6 w-6 text-primary" />
                           <CardTitle>Payment Integrations</CardTitle>
                        </div>
                        <CardDescription>Connect your payment gateways to accept bookings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="stripe-key">Stripe Secret Key</Label>
                            <Input id="stripe-key" type="password" placeholder="sk_test_************************" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paypal-id">PayPal Client ID</Label>
                            <Input id="paypal-id" placeholder="AZ****************************************************************" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="yoomoney-key">YooMoney Secret Key</Label>
                            <Input id="yoomoney-key" type="password" placeholder="****************************************" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                       <div className="flex items-center gap-2">
                           <Bell className="h-6 w-6 text-primary" />
                           <CardTitle>Notification Settings</CardTitle>
                        </div>
                        <CardDescription>Configure how you and your customers receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="admin-email">Admin Email for Notifications</Label>
                            <Input id="admin-email" type="email" placeholder="admin@mybusiness.com" />
                        </div>
                        <Separator />
                         <div className="flex items-center gap-2">
                           <Bot className="h-5 w-5 text-muted-foreground" />
                           <h4 className="font-medium">Telegram Bot</h4>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telegram-token">Bot Token</Label>
                            <Input id="telegram-token" type="password" placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="telegram-chat-id">Chat ID</Label>
                            <Input id="telegram-chat-id" placeholder="-100123456789" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
