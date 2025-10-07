import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SuggestedItineraries = () => {
  const itineraries = [
    {
      duration: "1 Day",
      title: "Park Highlights Loop",
      activities: [
        "Old Faithful Geyser Basin",
        "Grand Prismatic Spring overlook",
        "Canyon & Lower Falls viewpoint",
        "Hayden Valley wildlife viewing"
      ],
      badge: "Quick Visit"
    },
    {
      duration: "3 Days",
      title: "Balanced Explorer",
      activities: [
        "Upper & Lower Geyser Basins",
        "Grand Canyon of Yellowstone trails",
        "Lamar Valley wildlife safari",
        "Yellowstone Lake & West Thumb",
        "Norris Geyser Basin"
      ],
      badge: "Recommended"
    },
    {
      duration: "5-7 Days",
      title: "In-Depth Adventure",
      activities: [
        "All major geyser basins & hot springs",
        "Multiple canyon hikes & waterfalls",
        "Extended wildlife watching",
        "Backcountry hiking trails",
        "Yellowstone Lake boat tour",
        "Lesser-known thermal features"
      ],
      badge: "Complete Experience"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Suggested Itineraries
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Choose the perfect trip length for your Yellowstone adventure
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {itineraries.map((itinerary, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <CardTitle className="text-2xl">{itinerary.duration}</CardTitle>
                  </div>
                  <Badge variant="secondary">{itinerary.badge}</Badge>
                </div>
                <p className="font-semibold text-lg">{itinerary.title}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {itinerary.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary font-bold mr-2">✓</span>
                      <span className="text-sm">{activity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
