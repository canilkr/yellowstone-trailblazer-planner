import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Plane, Hotel, Car, Utensils, Ticket, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BudgetOverviewProps {
  city: string;
  days: number;
  travelers: number;
  startDate?: Date;
  endDate?: Date;
}

export const BudgetOverview = ({ city, days, travelers, startDate, endDate }: BudgetOverviewProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({
    flight: 400 * travelers,
    hotelPerNight: 180,
    carRental: 60 * days,
  });

  useEffect(() => {
    const fetchLivePrices = async () => {
      if (!startDate || !endDate) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Format dates for API
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        const depDate = formatDate(startDate);
        const retDate = formatDate(endDate);

        // Fetch flight prices
        const flightPromise = supabase.functions.invoke('get-flight-prices', {
          body: {
            origin: 'NYC', // Default origin
            destination: city.substring(0, 3).toUpperCase(), // Use first 3 letters as airport code
            departureDate: depDate,
            returnDate: retDate,
            travelers: travelers,
          },
        });

        // Fetch hotel prices
        const hotelPromise = supabase.functions.invoke('get-hotel-prices', {
          body: {
            cityCode: city.substring(0, 3).toUpperCase(),
            checkInDate: depDate,
            checkOutDate: retDate,
            adults: travelers,
          },
        });

        // Fetch car rental prices
        const carPromise = supabase.functions.invoke('get-car-rental-prices', {
          body: {
            pickupLocation: city.substring(0, 3).toUpperCase(),
            pickupDate: depDate,
            dropoffDate: retDate,
          },
        });

        const [flightRes, hotelRes, carRes] = await Promise.all([
          flightPromise,
          hotelPromise,
          carPromise,
        ]);

        // Update prices with live data or keep defaults
        setPrices({
          flight: flightRes.data?.price || 400 * travelers,
          hotelPerNight: hotelRes.data?.pricePerNight || 180,
          carRental: carRes.data?.totalPrice || 60 * days,
        });

      } catch (error) {
        console.error('Error fetching live prices:', error);
        toast({
          title: "Using estimated prices",
          description: "Could not fetch live pricing data. Showing estimates instead.",
          variant: "default",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLivePrices();
  }, [city, days, travelers, startDate, endDate, toast]);

  // Calculate costs using live or default prices
  const flightCost = prices.flight;
  const hotelTotal = prices.hotelPerNight * days;
  const vehiclesNeeded = Math.ceil(travelers / 5);
  const carRental = prices.carRental;
  
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
      detail: `${travelers} ${travelers === 1 ? 'traveler' : 'travelers'} @ $400/person`
    },
    { 
      icon: Hotel, 
      label: "Accommodation", 
      amount: hotelTotal, 
      color: "text-primary", 
      detail: `${days} nights @ $${Math.round(prices.hotelPerNight)}/night`
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

  return (
    <Card className="w-full shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary-light/10">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          {loading ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <DollarSign className="w-6 h-6 text-primary" />
          )}
          Budget Overview for {days} Days
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Traveling to {city} • {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
          {loading && <span className="ml-2 text-primary">(Fetching live prices...)</span>}
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
              {loading 
                ? "Fetching live pricing data..." 
                : "Prices include live data where available and estimates for other categories. Actual costs may vary based on season and availability."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
