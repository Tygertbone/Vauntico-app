"use client";

import { useState } from "react";
import Head from "next/head";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Zap, Star, ArrowRight } from "lucide-react";
import vaunticoBanner from "../assets/vauntico_banner.webp";

const CreatorPassPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      icon: <Crown className="size-6 text-[var(--vauntico-gold)]" />,
      title: "Exclusive Access",
      description: "Get first access to all new vault releases and premium content",
    },
    {
      icon: <Sparkles className="size-6 text-[var(--vauntico-gold)]" />,
      title: "Founder Pricing",
      description: "Special discounts on all future products and services",
    },
    {
      icon: <Zap className="size-6 text-[var(--vauntico-gold)]" />,
      title: "Priority Support",
      description: "Direct access to our support team and community",
    },
    {
      icon: <Star className="size-6 text-[var(--vauntico-gold)]" />,
      title: "VIP Community",
      description: "Join our exclusive community of successful creators",
    },
  ];

  const handleJoinWaitlist = () => {
    setIsLoading(true);
    toast.loading("Redirecting to vaults...");
    window.location.href = "/vaults";
  };

  return (
    <>
      <Head>
        <title>Creator Pass | Vauntico</title>
        <meta
          name="description"
          content="Join the exclusive circle of creators with early access to Vauntico vaults, founder pricing, and VIP support."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl text-center">
            <div className="mb-8">
              <img
                src={vaunticoBanner}
                alt="Vauntico Creator Pass Banner"
                className="mx-auto mb-6 h-16 object-contain"
              />
            </div>

            <Badge className="mb-6 bg-[var(--vauntico-gold)] px-4 py-2 text-sm font-semibold text-white">
              Coming Soon
            </Badge>

            <h1 className="mb-6 text-balance text-4xl font-bold text-gray-900 md:text-6xl">
              Creator Pass
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-balance text-xl text-gray-600 md:text-2xl">
              Join the exclusive circle of creators who get first access to everything Vauntico.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-2 transition-all duration-300 hover:border-[var(--vauntico-gold)] hover:shadow-lg"
                >
                  <CardHeader className="pb-4 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full bg-[var(--vauntico-gold)] bg-opacity-10 p-3">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-4xl text-center">
            <Card className="border-0 bg-white shadow-2xl">
              <CardHeader className="pb-6 text-center">
                <CardTitle className="mb-4 text-3xl font-bold text-gray-900 text-balance">
                  Ready to Join the Inner Circle?
                </CardTitle>
                <p className="text-lg text-gray-600">
                  Be the first to know when Creator Pass launches. Join our VIP list for exclusive access.
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleJoinWaitlist}
                  disabled={isLoading}
                  className="vauntico-btn text-lg px-8 py-4 hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
                  aria-label="Join Creator Pass waitlist"
                >
                  {isLoading ? "Redirecting..." : "Join Waitlist"}
                  <ArrowRight className="ml-2 size-5" />
                </Button>
                <p className="mt-4 text-sm text-gray-500">No spam, ever. Unsubscribe anytime.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default CreatorPassPage;