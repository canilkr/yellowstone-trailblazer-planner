import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Plane, Hotel, Car, Utensils, Ticket } from "lucide-react";

interface BudgetOverviewProps {
  city: string;
  days: number;
  travelers: number;
  startDate?: Date;
  endDate?: Date;
}

export const BudgetOverview = ({ city, days, travelers, startDate, endDate }: BudgetOverviewProps) => {
  // Calculate smart estimates based on destination and season
  const getSeasonalMultiplier = () => {
    if (!startDate) return 1.0;
    const month = startDate.getMonth();
    // Peak summer season (June-August)
    if (month >= 5 && month <= 7) return 1.3;
    // Shoulder season (May, September)
    if (month === 4 || month === 8) return 1.1;
    // Off-season discount
    return 0.9;
  };

  const seasonalMultiplier = getSeasonalMultiplier();
  
  // Smart price estimates
  const baseFlightPrice = 400;
  const baseHotelPerNight = 180;
  const baseCarPerDay = 60;

  // Calculate costs with seasonal pricing
  const flightPerPerson = Math.round(baseFlightPrice * seasonalMultiplier);
  const flightCost = flightPerPerson * travelers;
  const hotelPerNight = Math.round(baseHotelPerNight * seasonalMultiplier);
  const hotelTotal = hotelPerNight * days;
  const vehiclesNeeded = Math.ceil(travelers / 5);
  const carRental = Math.round(baseCarPerDay * days * seasonalMultiplier);
  
  // Food: $80 per person per day
  const foodPerDay = 80 * travelers;
  const foodTotal = foodPerDay * days;
  
  // Activities: $50 per person per day
  const activitiesPerDay = 50 * travelers;
  const activities = activitiesPerDay * days;
  
  // Park Entrance: Choose cheaper option between vehicle pass ($35/vehicle) or per-person pass ($20/person)
  const parkEntranceVehicle = 35 * vehiclesNeeded;
  const parkEntrancePerson = 20 * travelers;
  const parkEntrance = Math.min(parkEntranceVehicle, parkEntrancePerson);
  
  const totalCost = flightCost + hotelTotal + carRental + foodTotal + activities + parkEntrance;

  const budgetItems = [
    { 
      icon: Plane, 
      label: "Round-trip Flights", 
      amount: flightCost, 
      color: "text-accent",
      detail: `${travelers} ${travelers === 1 ? 'traveler' : 'travelers'} @ $${flightPerPerson}/person`
    },
    { 
      icon: Hotel, 
      label: "Accommodation", 
      amount: hotelTotal, 
      color: "text-primary", 
      detail: `${days} nights @ $${hotelPerNight}/night`
    },
    { 
      icon: Car, 
      label: "Car Rental", 
      amount: carRental, 
      color: "text-secondary", 
      detail: `${vehiclesNeeded} ${vehiclesNeeded === 1 ? 'vehicle' : 'vehicles'} × ${days} days`
    },
    { 
      icon: Utensils, 
      label: "Food & Dining", 
      amount: foodTotal, 
      color: "text-secondary-light", 
      detail: `${travelers} ${travelers === 1 ? 'person' : 'people'} × ${days} days @ $80/day`
    },
    { 
      icon: Ticket, 
      label: "Activities & Tours", 
      amount: activities, 
      color: "text-primary-light", 
      detail: `${travelers} ${travelers === 1 ? 'person' : 'people'} × ${days} days @ $50/day`
    },
    { 
      icon: DollarSign, 
      label: "Park Entrance Fee", 
      amount: parkEntrance, 
      color: "text-muted-foreground",
      detail: parkEntrance === parkEntranceVehicle ? `Vehicle pass (${vehiclesNeeded} ${vehiclesNeeded === 1 ? 'vehicle' : 'vehicles'})` : 'Per-person pass (better value)'
    },
  ];

  const getSeason = () => {
    if (!startDate) return 'Standard';
    const month = startDate.getMonth();
    if (month >= 5 && month <= 7) return 'Peak Summer';
    if (month === 4 || month === 8) return 'Shoulder';
    return 'Off-Season';
  };

  return (
    <Card className="w-full shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary-light/10">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" />
          Budget Overview for {days} Days
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Traveling to {city} • {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
          {startDate && <span className="ml-2">• {getSeason()} Season</span>}
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4" role="list" aria-label="Budget breakdown">
          {budgetItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-muted/30 transition-all duration-200 hover:scale-[1.01]" role="listitem">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    {item.detail && (
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    )}
                  </div>
                </div>
                <span className="font-semibold text-foreground" aria-label={`${item.label} cost: $${item.amount.toLocaleString()}`}>
                  ${item.amount.toLocaleString()}
                </span>
              </div>
            );
          })}
          
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/20 to-primary-light/20">
              <span className="text-lg font-bold text-foreground">Total Estimated Cost</span>
              <span className="text-2xl font-bold text-primary">
                ${totalCost.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Budget estimates with {getSeason().toLowerCase()} seasonal pricing. Actual costs may vary based on specific dates, availability, and booking timing.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
