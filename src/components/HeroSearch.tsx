import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Hotel, Package, Ship, Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const tabs = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "packages", label: "Packages", icon: Package },
  { id: "cruises", label: "Cruises", icon: Ship },
];

const HeroSearch = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/results?type=${activeTab}&from=${from}&to=${to}`);
  };

  return (
    <section className="relative overflow-hidden hero-gradient py-20 md:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-primary-foreground mb-4 leading-tight">
            Explore the World<br />
            <span className="opacity-80">Your Way</span>
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
            Search flights, hotels, packages and cruises. Find the best deals and start your adventure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Tabs */}
          <div className="flex justify-center gap-1 mb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-card text-foreground"
                      : "bg-primary-foreground/10 text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search form */}
          <div className="bg-card rounded-xl p-4 md:p-6 card-shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="From"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="To"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-9" />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Passengers" defaultValue="1 Adult" className="pl-9" />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full mt-4 h-12 text-base font-semibold gap-2">
              <Search className="h-5 w-5" />
              Search Trips
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSearch;
