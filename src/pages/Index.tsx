import { useState } from "react";
import { Mountain, User, BookmarkPlus, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { TripPlannerForm } from "@/components/TripPlannerForm";
import { BudgetOverview } from "@/components/BudgetOverview";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { TravelDetails } from "@/components/TravelDetails";
import { PhotoGallery } from "@/components/PhotoGallery";
import { TripNotes } from "@/components/TripNotes";
import { TravelTips } from "@/components/TravelTips";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SkipToContent } from "@/components/SkipToContent";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { TravelChatbot } from "@/components/TravelChatbot";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import heroImage from "@/assets/yellowstone-hero.jpg";

const Index = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [tripData, setTripData] = useState<{ 
    origin: string;
    city: string; 
    days: number; 
    travelers: number;
    startDate?: Date;
    endDate?: Date;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const handlePlanTrip = (origin: string, city: string, days: number, travelers: number, startDate?: Date, endDate?: Date) => {
    setTripData({ origin, city, days, travelers, startDate, endDate });
    // Smooth scroll to budget overview
    setTimeout(() => {
      document.getElementById("trip-overview")?.scrollIntoView({ behavior: "smooth" });
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
        destination: tripData.city,
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
              {t("header.title")}
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto drop-shadow-md">
            {t("header.subtitle")}
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
            {user && tripData.startDate && tripData.endDate && (
              <div className="flex justify-center">
                <Button onClick={handleSaveTrip} disabled={saving} size="lg">
                  <Save className="h-5 w-5 mr-2" />
                  {saving ? "Saving..." : "Save This Trip"}
                </Button>
              </div>
            )}
            
            <section>
              <BudgetOverview 
                origin={tripData.origin}
                city={tripData.city} 
                days={tripData.days} 
                travelers={tripData.travelers}
                startDate={tripData.startDate}
                endDate={tripData.endDate}
              />
            </section>

            <section>
              <TravelDetails
                origin={tripData.origin}
                city={tripData.city}
                startDate={tripData.startDate!}
                endDate={tripData.endDate!}
                travelers={tripData.travelers}
              />
            </section>

            <section>
              <ItineraryDisplay 
                days={tripData.days} 
                startDate={tripData.startDate}
              />
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
                {t("header.title")}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("footer.rights")}
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
