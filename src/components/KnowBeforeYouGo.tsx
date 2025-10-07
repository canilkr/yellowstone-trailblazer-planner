import { AlertTriangle, DollarSign, Shield, Backpack } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const KnowBeforeYouGo = () => {
  const essentials = [
    {
      icon: DollarSign,
      title: "Entrance Fees",
      items: [
        "Private vehicle: $35 (7 days)",
        "Motorcycle: $30 (7 days)",
        "Per person: $20 (7 days)",
        "Annual pass: $70 (best value)"
      ]
    },
    {
      icon: Shield,
      title: "Wildlife Safety",
      items: [
        "Stay 100+ yards from bears & wolves",
        "Stay 25+ yards from bison & elk",
        "Never feed or approach animals",
        "Carry bear spray on trails"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Thermal Area Safety",
      items: [
        "Stay on boardwalks & designated trails",
        "Water can be boiling temperature",
        "Ground may be unstable",
        "Keep children and pets close"
      ]
    },
    {
      icon: Backpack,
      title: "What to Pack",
      items: [
        "Layers for variable weather",
        "Sunscreen & sunglasses",
        "Reusable water bottle",
        "Binoculars for wildlife viewing"
      ]
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Know Before You Go
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Essential information for a safe and enjoyable visit
        </p>
        
        <Alert className="mb-8 max-w-3xl mx-auto border-primary/50 bg-primary/5">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Important:</strong> Cell service is limited throughout the park. Download maps and information before your visit. Be prepared for crowds during summer months and arrive early at popular attractions.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {essentials.map((essential, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-3">
                    <essential.icon className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg">{essential.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {essential.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
