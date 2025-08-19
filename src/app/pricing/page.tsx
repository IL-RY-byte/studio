import Header from "@/components/Header";
import { Check } from "lucide-react";

export default function PricingPage() {
    const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'For individuals and small teams getting started.',
      features: ['Up to 10 objects', '1 location', 'Basic analytics', 'Community support'],
      cta: 'Get Started for Free',
      primary: false,
    },
    {
      name: 'Pro',
      price: '$49',
      description: 'For growing businesses that need more power and support.',
      features: [
        'Up to 100 objects',
        '5 locations',
        'Advanced analytics',
        'Email & chat support',
        'Custom branding',
      ],
      cta: 'Choose Pro',
      primary: true,
    },
    {
      name: 'Business',
      price: '$99',
      description: 'For established businesses that need advanced features.',
      features: [
        'Unlimited objects',
        'Unlimited locations',
        'Team management & roles',
        'API access & webhooks',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      primary: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted/40">
         <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                        Pricing Plans
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        Choose the plan that's right for your business.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {tiers.map((tier) => (
                        <div key={tier.name} className={`rounded-lg border bg-card text-card-foreground p-6 shadow-sm ${tier.primary ? 'border-primary' : ''}`}>
                            <h3 className="text-2xl font-bold">{tier.name}</h3>
                            <p className="mt-2 text-muted-foreground">{tier.description}</p>
                            <div className="mt-6">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                <span className="text-lg text-muted-foreground">/month</span>
                            </div>
                            <ul className="mt-6 space-y-4">
                                {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>{feature}</span>
                                </li>
                                ))}
                            </ul>
                            <button className={`w-full mt-8 py-2 px-4 rounded-md font-semibold ${tier.primary ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                {tier.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
         </section>
      </main>
    </div>
  );
}
