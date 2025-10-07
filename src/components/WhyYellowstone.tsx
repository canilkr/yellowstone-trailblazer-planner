import { Flame, PawPrint, Mountain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const WhyYellowstone = () => {
  const highlights = [
    {
      icon: Flame,
      title: "Iconic Geysers & Hot Springs",
      description: "Home to Old Faithful and over 500 geysers—more than anywhere else on Earth"
    },
    {
      icon: PawPrint,
      title: "Abundant Wildlife",
      description: "Spot bison, grizzly bears, wolves, elk, and eagles in their natural habitat"
    },
    {
      icon: Mountain,
      title: "Stunning Landscapes",
      description: "From dramatic canyons to pristine lakes and alpine meadows"
    }
  ];

  return (
    <section className="py-16 bg-secondary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Why Yellowstone?
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Experience America's first national park, where geothermal wonders meet pristine wilderness
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <highlight.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{highlight.title}</h3>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
