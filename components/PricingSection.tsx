import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Zap, Mail, Star } from "lucide-react";

interface PricingSectionProps {
  onSubscribe: (priceId: string) => Promise<void>;
  isLoading?: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  onSubscribe,
  isLoading,
}) => {
  const features = [
    {
      icon: <Search className="w-8 h-8 mb-2 text-blue-500" />,
      title: "Find Hidden Opportunities",
      description:
        "Access exclusive job listings not found on traditional platforms",
    },
    {
      icon: <Zap className="w-8 h-8 mb-2 text-blue-500" />,
      title: "Early Access",
      description:
        "Get notified about new positions within 24 hours of posting",
    },
    {
      icon: <Mail className="w-8 h-8 mb-2 text-blue-500" />,
      title: "Daily Updates",
      description: "Receive curated job alerts directly in your inbox",
    },
  ];

  const plans = [
    {
      name: "Weekly",
      price: "$5",
      period: "week",
      highlight: false,
      priceId: process.env.NEXT_PUBLIC_WEEKLY_PRICE_ID || "",
    },
    {
      name: "Monthly",
      price: "$20",
      period: "month",
      highlight: true,
      priceId: process.env.NEXT_PUBLIC_MONTHLY_PRICE_ID || "",
    },
    {
      name: "Annual",
      price: "$80",
      period: "year",
      highlight: false,
      priceId: process.env.NEXT_PUBLIC_ANNUAL_PRICE_ID || "",
    },
  ];

  const handleSubscribeClick = async (priceId: string) => {
    try {
      await onSubscribe(priceId);
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to initiate checkout. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Pricing Cards */}
      <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col ${
              plan.highlight ? "border-blue-500 border-2" : ""
            }`}
          >
            <CardHeader>
              <h3 className="text-xl font-semibold text-center">{plan.name}</h3>
            </CardHeader>
            <CardContent className="flex-grow text-center">
              <div className="text-4xl font-bold mb-2">
                {plan.price}
                <span className="text-lg font-normal text-gray-600">
                  /{plan.period}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleSubscribeClick(plan.priceId)}
                disabled={isLoading}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Trust Badge */}
      <div className="flex flex-col items-center mt-12">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-gray-600">Trusted by 10,000+ professionals</p>
      </div>
    </div>
  );
};

export default PricingSection;
