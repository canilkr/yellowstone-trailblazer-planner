import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface TripPlannerFormProps {
  onPlanTrip: (city: string, days: number, travelers: number, startDate?: Date, endDate?: Date) => void;
}

export const TripPlannerForm = ({ onPlanTrip }: TripPlannerFormProps) => {
  const { t } = useLanguage();
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onPlanTrip(city, days, travelers, startDate, endDate);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-foreground">
          {t("form.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Trip planning form">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {t("form.city")}
            </Label>
            <Input
              id="city"
              type="text"
              placeholder={t("form.city.placeholder")}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="bg-background border-border focus:ring-primary transition-all duration-200 focus:scale-[1.02]"
              aria-required="true"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {t("form.startDate")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal transition-all duration-200",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : t("form.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {t("form.endDate")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal transition-all duration-200",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : t("form.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                    disabled={(date) => date < (startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="days" className="text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {t("form.days")}
            </Label>
            <Input
              id="days"
              type="number"
              min="1"
              max="14"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              required
              className="bg-background border-border focus:ring-primary transition-all duration-200 focus:scale-[1.02]"
              aria-required="true"
              aria-valuemin={1}
              aria-valuemax={14}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelers" className="text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {t("form.travelers")}
            </Label>
            <Input
              id="travelers"
              type="number"
              min="1"
              max="20"
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
              required
              className="bg-background border-border focus:ring-primary transition-all duration-200 focus:scale-[1.02]"
              aria-required="true"
              aria-valuemin={1}
              aria-valuemax={20}
            />
          </div>

          <Button
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            size="lg"
            aria-label="Calculate personalized trip plan"
          >
            {t("form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
