import { useState, useRef } from "react";
import { Mountain, User, BookmarkPlus, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { WhyYellowstone } from "@/components/WhyYellowstone";
import { BestTimeToVisit } from "@/components/BestTimeToVisit";
import { TopAttractions } from "@/components/TopAttractions";
import { SuggestedItineraries } from "@/components/SuggestedItineraries";
import { WhereToStay } from "@/components/WhereToStay";
import { KnowBeforeYouGo } from "@/components/KnowBeforeYouGo";
import { TripPlannerForm } from "@/components/TripPlannerForm";
import { BudgetOverview } from "@/components/BudgetOverview";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { TravelDetails } from "@/components/TravelDetails";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SkipToContent } from "@/components/SkipToContent";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { TravelChatbot } from "@/components/TravelChatbot";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-grand-prismatic.jpg";

const Index = () => {
  const { user } = useAuth();
  const plannerRef = useRef<HTMLDivElement>(null);
  const [tripData, setTripData] = useState<{ 
    origin: string;
    days: number; 
    travelers: number;
    startDate?: Date;
    endDate?: Date;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const scrollToPlanner = () => {
    plannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePlanTrip = (origin: string, days: number, travelers: number, startDate?: Date, endDate?: Date) => {
    setTripData({ origin, days, travelers, startDate, endDate });
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById("trip-results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSaveTrip = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your trip",
        variant: "destructive",
      });
      return;
    }

    if (!tripData || !tripData.startDate || !tripData.endDate) {
      toast({
        title: "Invalid trip data",
        description: "Please make sure all trip details are filled",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.from("saved_trips").insert({
        user_id: user.id,
        destination: "Yellowstone National Park",
        start_date: tripData.startDate.toISOString().split('T')[0],
        end_date: tripData.endDate.toISOString().split('T')[0],
        days: tripData.days,
        travelers: tripData.travelers,
      });

      if (error) throw error;

      toast({
        title: "Trip saved!",
        description: "Your trip has been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save trip",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      <ThemeToggle />
      <LanguageSwitch />
      
      {/* Top Navigation */}
      <nav className="fixed top-4 right-20 z-50 flex gap-2">
        {user ? (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/saved-trips">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                My Trips
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </nav>
      
      {/* 1. Hero Section */}
      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden" role="banner">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Grand Prismatic Spring at Yellowstone National Park"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 animate-fade-in max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl mb-4">
            Plan Your Yellowstone Adventure
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 drop-shadow-lg">
            Your complete guide to exploring America's first national park
          </p>
          <Button onClick={scrollToPlanner} size="lg" className="text-lg px-8 py-6 rounded-full shadow-xl">
            Start Planning
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" tabIndex={-1}>
        {/* 2. Why Yellowstone Section */}
        <WhyYellowstone />

        {/* 3. Best Time to Visit Section */}
        <BestTimeToVisit />

        {/* 4. Top Attractions Section */}
        <TopAttractions />

        {/* 5. Suggested Itineraries Section */}
        <SuggestedItineraries />

        {/* 6. Where to Stay Section */}
        <WhereToStay />

        {/* 7. Know Before You Go Section */}
        <KnowBeforeYouGo />

        {/* 8. Interactive Map Section */}
        <section className="py-16 bg-secondary/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Interactive Park Map
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore Yellowstone's entrances, major loops, and attractions
            </p>
            <div className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg border">
              <iframe
                src="https://www.nps.gov/carto/app/index.html?appid=C4FF0FDE08A947E8A0A1C0428E8B1F12"
                className="w-full h-[600px]"
                title="Yellowstone National Park Map"
                loading="lazy"
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              <MapPin className="w-4 h-4 inline mr-1" />
              Official NPS interactive map - Zoom and explore different areas
            </p>
          </div>
        </section>

        {/* 9. Trip Planner & Final Call-to-Action */}
        <section ref={plannerRef} className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Planning Your Yellowstone Trip Today
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Customize your adventure with our trip planner - get personalized itineraries, budget estimates, and travel details
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <TripPlannerForm onPlanTrip={handlePlanTrip} />
            </div>

            {/* Trip Results - Shown after planning */}
            {tripData && (
              <div id="trip-results" className="mt-16 space-y-12 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                  <BudgetOverview 
                    origin={tripData.origin}
                    days={tripData.days} 
                    travelers={tripData.travelers}
                    startDate={tripData.startDate}
                    endDate={tripData.endDate}
                  />
                </div>

                <div className="max-w-4xl mx-auto">
                  <TravelDetails
                    origin={tripData.origin}
                    startDate={tripData.startDate!}
                    endDate={tripData.endDate!}
                    travelers={tripData.travelers}
                  />
                </div>

                <div className="max-w-4xl mx-auto">
                  <ItineraryDisplay 
                    days={tripData.days} 
                    startDate={tripData.startDate}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary/10 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Mountain className="w-6 h-6 text-primary" />
              <p className="text-lg font-bold text-foreground">
                Yellowstone Adventure Planner
              </p>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Plan your perfect trip to America's first national park with personalized itineraries and expert recommendations
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 Yellowstone Adventure Planner. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Travel Chatbot */}
      <TravelChatbot />
    </div>
  );
};

export default Index;
