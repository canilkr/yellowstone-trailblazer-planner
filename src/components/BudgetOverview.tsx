import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Plane, Hotel, Car, Utensils, Ticket } from "lucide-react";

interface BudgetOverviewProps {
  city: string;
  days: number;
}

export const BudgetOverview = ({ city, days }: BudgetOverviewProps) => {
  // Dynamic pricing calculations
  const flightCost = 400 * 2; // Round trip for 2 people
  const hotelPerNight = 180;
  const hotelTotal = hotelPerNight * days;
  const carRental = 60 * days;
  const foodPerDay = 80 * 2; // For 2 people
  const foodTotal = foodPerDay * days;
  const activities = 100 * days;
  const parkEntrance = 35; // One-time fee
  
  const totalCost = flightCost + hotelTotal + carRental + foodTotal + activities + parkEntrance;

  const budgetItems = [
    { icon: Plane, label: "Round-trip Flights", amount: flightCost, color: "text-accent" },
    { icon: Hotel, label: "Accommodation", amount: hotelTotal, color: "text-primary", detail: `${days} nights @ $${hotelPerNight}/night` },
    { icon: Car, label: "Car Rental", amount: carRental, color: "text-secondary", detail: `${days} days @ $60/day` },
    { icon: Utensils, label: "Food & Dining", amount: foodTotal, color: "text-secondary-light", detail: `${days} days @ $${foodPerDay}/day` },
    { icon: Ticket, label: "Activities & Tours", amount: activities, color: "text-primary-light", detail: `Estimated $100/day` },
    { icon: DollarSign, label: "Park Entrance Fee", amount: parkEntrance, color: "text-muted-foreground" },
  ];

  return (
    <Card className="w-full shadow-[var(--shadow-card)] border-border/50">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary-light/10">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" />
          Budget Overview for {days} Days
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Traveling from {city} • 2 People
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {budgetItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    {item.detail && (
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    )}
                  </div>
                </div>
                <span className="font-semibold text-foreground">
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
              Prices are estimates for 2 people and may vary based on season and availability
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
