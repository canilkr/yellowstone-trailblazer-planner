import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Package, CloudSun, Info } from "lucide-react";

export const TravelTips = () => {
  const tips = [
    {
      icon: Package,
      title: "Essential Packing",
      items: [
        "Layered clothing for variable weather",
        "Hiking boots and comfortable walking shoes",
        "Sunscreen, hat, and sunglasses",
        "Reusable water bottle",
        "Binoculars for wildlife viewing",
        "Camera and extra batteries",
      ],
    },
    {
      icon: CloudSun,
      title: "Best Visiting Times",
      items: [
        "Summer (June-August): Warmest weather, all roads open",
        "Spring (April-May): Wildlife active, fewer crowds",
        "Fall (September-October): Beautiful colors, pleasant temps",
        "Winter (November-March): Unique snow experiences, limited access",
      ],
    },
    {
      icon: Info,
      title: "Important Information",
      items: [
        "Park entrance fee: $35 per vehicle (7 days)",
        "Annual pass available for $70",
        "Cell service limited inside park",
        "Stay 100 yards from bears, 25 yards from other wildlife",
        "Never feed or approach wildlife",
        "Book lodging 6-12 months in advance",
      ],
    },
  ];

  return (
    <Card className="w-full shadow-[var(--shadow-card)] border-border/50">
      <CardHeader className="bg-gradient-to-r from-secondary-light/20 to-secondary/20">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-secondary" />
          Essential Travel Tips
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Important information for a safe and memorable trip
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-3 gap-6">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{tip.title}</h3>
                </div>
                <ul className="space-y-2">
                  {tip.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
