import { useState } from "react";
import { Mountain } from "lucide-react";
import { TripPlannerForm } from "@/components/TripPlannerForm";
import { BudgetOverview } from "@/components/BudgetOverview";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { PhotoGallery } from "@/components/PhotoGallery";
import { TripNotes } from "@/components/TripNotes";
import { TravelTips } from "@/components/TravelTips";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SkipToContent } from "@/components/SkipToContent";
import heroImage from "@/assets/yellowstone-hero.jpg";

const Index = () => {
  const [tripData, setTripData] = useState<{ city: string; days: number; travelers: number } | null>(null);

  const handlePlanTrip = (city: string, days: number, travelers: number) => {
    setTripData({ city, days, travelers });
    // Smooth scroll to budget overview
    setTimeout(() => {
      document.getElementById("trip-overview")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      <ThemeToggle />
      
      {/* Hero Section */}
      <header className="relative h-[70vh] flex items-center justify-center overflow-hidden" role="banner">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Yellowstone National Park"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background/90" />
        </div>
        
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mountain className="w-12 h-12 text-primary-foreground drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground drop-shadow-lg">
              Yellowstone Adventure Planner
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto drop-shadow-md">
            Plan your perfect trip to America's first national park with personalized itineraries and budget estimates
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-12 space-y-12 max-w-7xl" tabIndex={-1}>
        {/* Trip Planner Form */}
        <section className="animate-fade-in">
          <TripPlannerForm onPlanTrip={handlePlanTrip} />
        </section>

        {/* Trip Overview - Only shown after planning */}
        {tripData && (
          <div id="trip-overview" className="space-y-12 animate-fade-in">
            <section>
              <BudgetOverview city={tripData.city} days={tripData.days} travelers={tripData.travelers} />
            </section>

            <section>
              <ItineraryDisplay days={tripData.days} />
            </section>
          </div>
        )}

        {/* Travel Tips - Always visible */}
        <section className="animate-fade-in">
          <TravelTips />
        </section>

        {/* Photo Gallery */}
        <section className="animate-fade-in">
          <PhotoGallery />
        </section>

        {/* Trip Notes */}
        <section className="animate-fade-in">
          <TripNotes />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary/5 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Mountain className="w-5 h-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Yellowstone Adventure Planner
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Plan your dream Yellowstone adventure with confidence
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
