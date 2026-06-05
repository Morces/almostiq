import { 
  Shirt, 
  Truck, 
  Calendar, 
  Sprout, 
  HardHat, 
  Sun, 
  Hotel, 
  Plane, 
  Car 
} from "lucide-react";

export interface IndustryConfig {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component
  promptPlaceholder: string;
  isSupported: boolean;
}

export const INDUSTRIES: IndustryConfig[] = [
  {
    id: "laundry",
    title: "Laundry",
    description: "Optimize clothes drying, collection schedules, and delivery logistics based on humidity and precipitation.",
    icon: Shirt,
    promptPlaceholder: "Should I hang the sheets to dry outdoors tomorrow?",
    isSupported: true,
  },
  {
    id: "logistics",
    title: "Logistics",
    description: "Route planning, speed limits, and cargo safety alerts based on high wind warnings and rain storms.",
    icon: Truck,
    promptPlaceholder: "Are wind speeds on Route 101 safe for double-trailers tomorrow morning?",
    isSupported: true,
  },
  {
    id: "events",
    title: "Outdoor Events",
    description: "Vendor coordination, venue covering, and safety planning for open-air concerts or sports meets.",
    icon: Calendar,
    promptPlaceholder: "Do we need overhead canopies for the 2 PM wedding ceremony?",
    isSupported: true,
  },
  {
    id: "agriculture",
    title: "Agriculture",
    description: "Pest control timing, irrigation optimization, and harvest schedules. (Coming Soon)",
    icon: Sprout,
    promptPlaceholder: "Is it a good day for pesticide spraying?",
    isSupported: false,
  },
  {
    id: "construction",
    title: "Construction",
    description: "Concrete pouring, crane operation scheduling, and foundation excavation warnings. (Coming Soon)",
    icon: HardHat,
    promptPlaceholder: "Can we safely operate tower cranes tomorrow afternoon?",
    isSupported: false,
  },
  {
    id: "solar",
    title: "Solar Energy",
    description: "Grid storage load balancing and panel cleaning efficiency optimization. (Coming Soon)",
    icon: Sun,
    promptPlaceholder: "What is the expected solar yield for the next 48 hours?",
    isSupported: false,
  },
  {
    id: "hospitality",
    title: "Hospitality",
    description: "Al fresco dining capacity planning and dynamic staffing. (Coming Soon)",
    icon: Hotel,
    promptPlaceholder: "Should we prepare the outdoor terrace for dinner service?",
    isSupported: false,
  },
  {
    id: "travel",
    title: "Travel & Tours",
    description: "Excursion cancellations and customized itinerary generation. (Coming Soon)",
    icon: Plane,
    promptPlaceholder: "Should we recommend alternative museum routes for our tour groups?",
    isSupported: false,
  },
  {
    id: "carwash",
    title: "Car Wash",
    description: "Dynamic pricing and operation hours adjustments. (Coming Soon)",
    icon: Car,
    promptPlaceholder: "Will tomorrow's clear skies drive up car wash demand?",
    isSupported: false,
  }
];

export const getIndustryById = (id: string) => {
  return INDUSTRIES.find(ind => ind.id === id);
};
