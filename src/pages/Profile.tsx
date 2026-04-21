import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { eventPackages } from "@/lib/events-data";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { User, Heart, ShoppingBag, Settings, LogOut, MapPin, Calendar, Trophy, Flame, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"orders" | "favorites" | "settings">("orders");
  const { items: recentItems } = useRecentlyViewed();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("user_orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites-full", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("user_favorites").select("*").eq("user_id", user.id);
      return data || [];
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      return data;
    },
    enabled: !!user,
  });

  if (loading || !user) return null;

  const userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || "";

  const favPackages = favorites
    .filter((f) => f.item_type === "event")
    .map((f) => eventPackages.find((p) => p.id === f.item_id))
    .filter(Boolean);

  // Gamification
  const achievements = [
    { id: "first_order", label: locale === "pt" ? "Primeira Reserva" : "First Booking", icon: "🎯", unlocked: orders.length >= 1 },
    { id: "explorer", label: locale === "pt" ? "Explorador" : "Explorer", icon: "🧭", unlocked: recentItems.length >= 5 },
    { id: "collector", label: locale === "pt" ? "Colecionador" : "Collector", icon: "💎", unlocked: favorites.length >= 3 },
    { id: "globe_trotter", label: locale === "pt" ? "Globetrotter" : "Globe Trotter", icon: "🌍", unlocked: orders.length >= 3 },
  ];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const tabs = [
    { id: "orders" as const, label: locale === "pt" ? "Pedidos" : "Orders", icon: ShoppingBag },
    { id: "favorites" as const, label: locale === "pt" ? "Favoritos" : "Favorites", icon: Heart },
    { id: "settings" as const, label: locale === "pt" ? "Configurações" : "Settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <div className="hero-gradient py-12 text-center">
        <div className="container">
          <div className="flex flex-col items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="h-20 w-20 rounded-full border-4 border-primary-foreground/20 object-cover" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <User className="h-10 w-10 text-primary-foreground" />
              </div>
            )}
            <h1 className="font-display text-2xl font-bold text-primary-foreground">{userName}</h1>
            <p className="text-primary-foreground/70 text-sm">{user.email}</p>
            {/* Gamification badges inline */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 bg-primary-foreground/10 rounded-full px-3 py-1">
                <Trophy className="h-3.5 w-3.5 text-primary-foreground" />
                <span className="text-xs font-medium text-primary-foreground">{unlockedCount}/{achievements.length}</span>
              </div>
              <div className="flex items-center gap-1 bg-primary-foreground/10 rounded-full px-3 py-1">
                <Flame className="h-3.5 w-3.5 text-primary-foreground" />
                <span className="text-xs font-medium text-primary-foreground">{orders.length} {locale === "pt" ? "viagens" : "trips"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Achievements */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl p-4 text-center transition-all ${a.unlocked ? "bg-primary/10 border border-primary/20" : "bg-muted/50 opacity-50"}`}
            >
              <span className="text-2xl">{a.icon}</span>
              <p className="text-xs font-medium text-foreground mt-1">{a.label}</p>
              {a.unlocked && <Star className="h-3 w-3 text-primary mx-auto mt-1 fill-current" />}
            </motion.div>
          ))}
        </div>

        {/* Recently Viewed */}
        {recentItems.length > 0 && (
          <div className="mb-8">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">{locale === "pt" ? "Vistos Recentemente" : "Recently Viewed"}</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recentItems.slice(0, 6).map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={item.type === "destination" ? `/destination/${item.slug}` : item.type === "event" ? `/packages/${item.id}` : "/deals"}
                  className="shrink-0 w-32 group"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-1">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">{item.name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">{locale === "pt" ? "Nenhum pedido realizado ainda." : "No orders yet."}</p>
                <Link to="/packages"><Button className="mt-4">{t("cart.browsePackages")}</Button></Link>
              </div>
            ) : (
              orders.map((order, i) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-card card-shadow p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")}</p>
                      <p className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                        {order.status === "completed" ? (locale === "pt" ? "Concluído" : "Completed") : order.status === "pending" ? (locale === "pt" ? "Pendente" : "Pending") : order.status}
                      </Badge>
                      <span className="font-bold text-primary">R$ {Number(order.total_price).toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Favorites */}
        {activeTab === "favorites" && (
          <div>
            {favPackages.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">{locale === "pt" ? "Nenhum favorito adicionado ainda." : "No favorites yet."}</p>
                <Link to="/packages"><Button className="mt-4">{t("cart.browsePackages")}</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favPackages.map((pkg, i) => pkg && (
                  <motion.div key={pkg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow">
                    <Link to={`/packages/${pkg.id}`}>
                      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                        <img src={pkg.image} alt={locale === "pt" ? pkg.event : pkg.eventEn} className="w-full h-full object-cover" />
                        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">{pkg.badge}</Badge>
                      </div>
                    </Link>
                    <div className="p-4">
                      <h3 className="font-display font-bold text-card-foreground mb-1">{locale === "pt" ? pkg.event : pkg.eventEn}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {pkg.location}
                        <Calendar className="h-3 w-3 ml-2" /> {locale === "pt" ? pkg.date : pkg.dateEn}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">R$ {pkg.price.toLocaleString("pt-BR")}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="max-w-md space-y-6">
            <div className="rounded-xl bg-card card-shadow p-6 space-y-4">
              <h3 className="font-display font-bold text-card-foreground">{locale === "pt" ? "Informações da Conta" : "Account Info"}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{locale === "pt" ? "Nome" : "Name"}</span><span className="text-foreground">{userName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{user.email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{locale === "pt" ? "Membro desde" : "Member since"}</span><span className="text-foreground">{new Date(user.created_at).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US")}</span></div>
              </div>
            </div>
            <Button variant="destructive" onClick={handleSignOut} className="w-full gap-2"><LogOut className="h-4 w-4" />{t("nav.signOut")}</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
