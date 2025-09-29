import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";

interface TripPlannerFormProps {
  onPlanTrip: (city: string, days: number, travelers: number) => void;
}

export const TripPlannerForm = ({ onPlanTrip }: TripPlannerFormProps) => {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onPlanTrip(city, days, travelers);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-[var(--shadow-card)] border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-foreground">
          Plan Your Yellowstone Adventure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Departure City
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="e.g., Los Angeles, CA"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="bg-background border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="days" className="text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Trip Duration (days)
            </Label>
            <Input
              id="days"
              type="number"
              min="1"
              max="14"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              required
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelers" className="text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Number of Travelers
            </Label>
            <Input
              id="travelers"
              type="number"
              min="1"
              max="20"
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
              required
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          <Button
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-primary-foreground transition-all duration-300"
            size="lg"
          >
            Calculate My Trip
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
