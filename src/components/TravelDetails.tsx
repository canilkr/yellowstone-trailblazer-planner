import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlightDetails } from "./FlightDetails";
import { HotelDetails } from "./HotelDetails";
import { CarRentalDetails } from "./CarRentalDetails";
import { Card } from "@/components/ui/card";

interface TravelDetailsProps {
  origin: string;
  startDate: Date;
  endDate: Date;
  travelers: number;
}

export function TravelDetails({ origin, startDate, endDate, travelers }: TravelDetailsProps) {
  return (
    <Card className="w-full">
      <Tabs defaultValue="flights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="cars">Car Rentals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flights" className="mt-6">
          <FlightDetails 
            origin={origin}
            destination="JAC"
            startDate={startDate}
            endDate={endDate}
            travelers={travelers}
          />
        </TabsContent>
        
        <TabsContent value="hotels" className="mt-6">
          <HotelDetails 
            startDate={startDate}
            endDate={endDate}
            travelers={travelers}
          />
        </TabsContent>
        
        <TabsContent value="cars" className="mt-6">
          <CarRentalDetails 
            startDate={startDate}
            endDate={endDate}
            travelers={travelers}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
