import { Sun, Leaf, Snowflake, Flower } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BestTimeToVisit = () => {
  const seasons = [
    {
      icon: Sun,
      season: "Summer",
      months: "June - August",
      highlights: ["Warm weather perfect for hiking", "All park areas accessible", "Peak wildlife activity"],
      note: "Most crowded season - book early!"
    },
    {
      icon: Leaf,
      season: "Fall",
      months: "September - October",
      highlights: ["Beautiful autumn colors", "Fewer visitors", "Elk rutting season"],
      note: "Best for photographers"
    },
    {
      icon: Snowflake,
      season: "Winter",
      months: "November - February",
      highlights: ["Snowy wonderland scenery", "Unique snowmobile & snowcoach tours", "Steaming geysers in frost"],
      note: "Limited road access"
    },
    {
      icon: Flower,
      season: "Spring",
      months: "March - May",
      highlights: ["Baby animals everywhere", "Wildflowers blooming", "Great bear viewing"],
      note: "Variable weather conditions"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Best Time to Visit
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Each season offers unique experiences in Yellowstone
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasons.map((season, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <season.icon className="w-6 h-6 text-primary" />
                  <CardTitle className="text-xl">{season.season}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{season.months}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {season.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-sm flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-medium text-primary/80 italic">{season.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
