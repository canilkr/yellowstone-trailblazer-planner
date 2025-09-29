import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "es" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, arg?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    "header.title": "Yellowstone Adventure Planner",
    "header.subtitle": "Plan your perfect trip to America's first national park with personalized itineraries and budget estimates",
    
    // Trip Planner Form
    "form.title": "Plan Your Yellowstone Adventure",
    "form.city": "Departure City",
    "form.city.placeholder": "e.g., Los Angeles, CA",
    "form.startDate": "Start Date",
    "form.endDate": "End Date",
    "form.selectDate": "Select date",
    "form.days": "Trip Duration (days)",
    "form.travelers": "Number of Travelers",
    "form.submit": "Calculate My Trip",
    
    // Budget Overview
    "budget.title": "Estimated Budget",
    "budget.subtitle": "Your personalized cost breakdown",
    "budget.accommodation": "Accommodation",
    "budget.meals": "Meals & Food",
    "budget.activities": "Activities & Entrance",
    "budget.transportation": "Transportation",
    "budget.total": "Total Estimated Cost",
    "budget.perPerson": "per person",
    
    // Itinerary
    "itinerary.title": "Suggested {0}-Day Itinerary",
    "itinerary.subtitle": "Customized daily plans for your Yellowstone adventure",
    
    // Travel Tips
    "tips.title": "Essential Travel Tips",
    "tips.subtitle": "Make the most of your Yellowstone experience",
    "tips.wildlife": "Wildlife Safety",
    "tips.wildlife.desc": "Keep at least 100 yards from bears and wolves, 25 yards from other animals. Never feed wildlife.",
    "tips.weather": "Weather Preparedness",
    "tips.weather.desc": "Pack layers as temperatures vary greatly. Summer highs reach 80°F, but nights can drop to 40°F.",
    "tips.parking": "Parking & Transportation",
    "tips.parking.desc": "Arrive early at popular sites. Park only in designated areas. Consider shuttle services during peak season.",
    "tips.hydrothermal": "Hydrothermal Features",
    "tips.hydrothermal.desc": "Stay on boardwalks and designated trails. Water can be scalding hot and ground unstable.",
    
    // Photo Gallery
    "gallery.title": "Yellowstone Highlights",
    "gallery.subtitle": "Preview the natural wonders awaiting you",
    
    // Trip Notes
    "notes.title": "Trip Notes & Checklist",
    "notes.placeholder": "Add your travel notes, packing list, or important reminders here...",
    "notes.save": "Save Notes",
    "notes.saved": "Notes saved!",
    
    // Footer
    "footer.tagline": "Plan your dream Yellowstone adventure with confidence",
    "footer.rights": "© 2025 All rights reserved",
  },
  es: {
    // Header
    "header.title": "Planificador de Aventuras en Yellowstone",
    "header.subtitle": "Planifica tu viaje perfecto al primer parque nacional de América con itinerarios personalizados y estimaciones de presupuesto",
    
    // Trip Planner Form
    "form.title": "Planifica tu Aventura en Yellowstone",
    "form.city": "Ciudad de Salida",
    "form.city.placeholder": "ej., Los Ángeles, CA",
    "form.startDate": "Fecha de Inicio",
    "form.endDate": "Fecha de Fin",
    "form.selectDate": "Seleccionar fecha",
    "form.days": "Duración del Viaje (días)",
    "form.travelers": "Número de Viajeros",
    "form.submit": "Calcular mi Viaje",
    
    // Budget Overview
    "budget.title": "Presupuesto Estimado",
    "budget.subtitle": "Tu desglose de costos personalizado",
    "budget.accommodation": "Alojamiento",
    "budget.meals": "Comidas",
    "budget.activities": "Actividades y Entrada",
    "budget.transportation": "Transporte",
    "budget.total": "Costo Total Estimado",
    "budget.perPerson": "por persona",
    
    // Itinerary
    "itinerary.title": "Itinerario Sugerido de {0} Días",
    "itinerary.subtitle": "Planes diarios personalizados para tu aventura en Yellowstone",
    
    // Travel Tips
    "tips.title": "Consejos Esenciales de Viaje",
    "tips.subtitle": "Aprovecha al máximo tu experiencia en Yellowstone",
    "tips.wildlife": "Seguridad con Fauna",
    "tips.wildlife.desc": "Mantente al menos a 100 yardas de osos y lobos, 25 yardas de otros animales. Nunca alimentes fauna.",
    "tips.weather": "Preparación para el Clima",
    "tips.weather.desc": "Empaca capas ya que las temperaturas varían mucho. Los máximos de verano alcanzan 80°F, pero las noches pueden bajar a 40°F.",
    "tips.parking": "Estacionamiento y Transporte",
    "tips.parking.desc": "Llega temprano a los sitios populares. Estaciona solo en áreas designadas. Considera servicios de transporte en temporada alta.",
    "tips.hydrothermal": "Características Hidrotermales",
    "tips.hydrothermal.desc": "Permanece en pasarelas y senderos designados. El agua puede estar muy caliente y el suelo inestable.",
    
    // Photo Gallery
    "gallery.title": "Destacados de Yellowstone",
    "gallery.subtitle": "Vista previa de las maravillas naturales que te esperan",
    
    // Trip Notes
    "notes.title": "Notas de Viaje y Lista",
    "notes.placeholder": "Agrega tus notas de viaje, lista de equipaje o recordatorios importantes aquí...",
    "notes.save": "Guardar Notas",
    "notes.saved": "¡Notas guardadas!",
    
    // Footer
    "footer.tagline": "Planifica tu aventura soñada en Yellowstone con confianza",
    "footer.rights": "© 2025 Todos los derechos reservados",
  },
  fr: {
    // Header
    "header.title": "Planificateur d'Aventure à Yellowstone",
    "header.subtitle": "Planifiez votre voyage parfait vers le premier parc national d'Amérique avec des itinéraires personnalisés et des estimations budgétaires",
    
    // Trip Planner Form
    "form.title": "Planifiez votre Aventure à Yellowstone",
    "form.city": "Ville de Départ",
    "form.city.placeholder": "ex., Los Angeles, CA",
    "form.startDate": "Date de Début",
    "form.endDate": "Date de Fin",
    "form.selectDate": "Sélectionner la date",
    "form.days": "Durée du Voyage (jours)",
    "form.travelers": "Nombre de Voyageurs",
    "form.submit": "Calculer mon Voyage",
    
    // Budget Overview
    "budget.title": "Budget Estimé",
    "budget.subtitle": "Votre répartition des coûts personnalisée",
    "budget.accommodation": "Hébergement",
    "budget.meals": "Repas et Nourriture",
    "budget.activities": "Activités et Entrée",
    "budget.transportation": "Transport",
    "budget.total": "Coût Total Estimé",
    "budget.perPerson": "par personne",
    
    // Itinerary
    "itinerary.title": "Itinéraire Suggéré de {0} Jours",
    "itinerary.subtitle": "Plans quotidiens personnalisés pour votre aventure à Yellowstone",
    
    // Travel Tips
    "tips.title": "Conseils de Voyage Essentiels",
    "tips.subtitle": "Profitez au maximum de votre expérience à Yellowstone",
    "tips.wildlife": "Sécurité avec la Faune",
    "tips.wildlife.desc": "Restez à au moins 100 yards des ours et loups, 25 yards des autres animaux. Ne nourrissez jamais la faune.",
    "tips.weather": "Préparation Météo",
    "tips.weather.desc": "Emportez des couches car les températures varient beaucoup. Les maximums d'été atteignent 80°F, mais les nuits peuvent descendre à 40°F.",
    "tips.parking": "Stationnement et Transport",
    "tips.parking.desc": "Arrivez tôt aux sites populaires. Stationnez uniquement dans les zones désignées. Envisagez les services de navette en haute saison.",
    "tips.hydrothermal": "Caractéristiques Hydrothermales",
    "tips.hydrothermal.desc": "Restez sur les passerelles et sentiers désignés. L'eau peut être bouillante et le sol instable.",
    
    // Photo Gallery
    "gallery.title": "Points Forts de Yellowstone",
    "gallery.subtitle": "Aperçu des merveilles naturelles qui vous attendent",
    
    // Trip Notes
    "notes.title": "Notes de Voyage et Liste",
    "notes.placeholder": "Ajoutez vos notes de voyage, liste de bagages ou rappels importants ici...",
    "notes.save": "Sauvegarder les Notes",
    "notes.saved": "Notes sauvegardées!",
    
    // Footer
    "footer.tagline": "Planifiez l'aventure de vos rêves à Yellowstone en toute confiance",
    "footer.rights": "© 2025 Tous droits réservés",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, arg?: string): string => {
    let translation = translations[language][key] || translations.en[key] || key;
    if (arg) {
      translation = translation.replace("{0}", arg);
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
