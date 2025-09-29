import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MapPin, Clock, Star, Mountain } from "lucide-react";

interface ItineraryDisplayProps {
  days: number;
}

export const ItineraryDisplay = ({ days }: ItineraryDisplayProps) => {
  const generateDayItinerary = (day: number) => {
    const itineraries = [
      {
        title: "Grand Canyon & Old Faithful",
        activities: [
          { time: "8:00 AM", name: "Sunrise at Grand Canyon of Yellowstone", icon: Mountain },
          { time: "11:00 AM", name: "Old Faithful Geyser viewing", icon: Star },
          { time: "2:00 PM", name: "Upper Geyser Basin walk", icon: MapPin },
          { time: "5:00 PM", name: "Sunset at Fountain Paint Pot", icon: Clock },
        ],
      },
      {
        title: "Wildlife & Geothermal Wonders",
        activities: [
          { time: "7:00 AM", name: "Lamar Valley wildlife watching", icon: Mountain },
          { time: "11:00 AM", name: "Mammoth Hot Springs terraces", icon: Star },
          { time: "3:00 PM", name: "Norris Geyser Basin", icon: MapPin },
          { time: "6:00 PM", name: "Boiling River hot springs", icon: Clock },
        ],
      },
      {
        title: "Lakes & Waterfalls",
        activities: [
          { time: "8:00 AM", name: "Yellowstone Lake scenic drive", icon: Mountain },
          { time: "11:00 AM", name: "Lower Falls viewing platforms", icon: Star },
          { time: "2:00 PM", name: "Artist Point photo stop", icon: MapPin },
          { time: "5:00 PM", name: "Hayden Valley wildlife viewing", icon: Clock },
        ],
      },
      {
        title: "Hidden Gems & Scenic Routes",
        activities: [
          { time: "8:00 AM", name: "Grand Prismatic Spring overlook", icon: Mountain },
          { time: "11:00 AM", name: "Biscuit Basin boardwalk", icon: Star },
          { time: "2:00 PM", name: "West Thumb Geyser Basin", icon: MapPin },
          { time: "5:00 PM", name: "Lake overlook sunset", icon: Clock },
        ],
      },
    ];

    return itineraries[day % itineraries.length];
  };

  return (
    <Card className="w-full shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-secondary/20 to-secondary-light/20">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-6 h-6 text-secondary" />
          Suggested {days}-Day Itinerary
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Customized daily plans for your Yellowstone adventure
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <Accordion type="single" collapsible className="w-full space-y-2">
          {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
            const itinerary = generateDayItinerary(day - 1);
            return (
              <AccordionItem
                key={day}
                value={`day-${day}`}
                className="border border-border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 hover:bg-muted/50 hover:no-underline transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">{day}</span>
                    </div>
                    <span className="font-semibold text-foreground">{itinerary.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3 mt-2">
                    {itinerary.activities.map((activity, idx) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-lg bg-card hover:bg-muted/30 transition-all duration-200 hover:scale-[1.01]"
                          role="article"
                        >
                          <Icon className="w-5 h-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                {activity.time}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-foreground mt-1">
                              {activity.name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};
