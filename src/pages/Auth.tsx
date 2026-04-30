// Auth page — sign in, sign up, password reset and Google OAuth
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Mail, Lock, User, Eye, EyeOff, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { AIRPORT_OPTIONS, setHomeAirport } from "@/lib/userOrigin";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type Mode = "signin" | "signup" | "reset";

const Auth = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signIn, signUp, resetPassword, user, loading: authLoading } = useAuth();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-redirect once authenticated (covers OAuth callback + email/password success).
  // Also pull the user's saved home_airport from their profile so the hero search
  // can pre-fill the "From" field with their preferred airport.
  useEffect(() => {
    console.log("[Auth page] state:", { authLoading, hasUser: !!user, email: user?.email });
    if (user) {
      (async () => {
        try {
          const { data } = await supabase
            .from("profiles")
            .select("home_airport")
            .eq("user_id", user.id)
            .maybeSingle();
          if (data?.home_airport) {
            setHomeAirport(data.home_airport);
          }
        } catch (e) {
          console.warn("[Auth page] could not load home_airport:", e);
        }
      })();
      const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/";
      console.log("[Auth page] redirecting to:", redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [user, authLoading, navigate]);

  const getSchema = () => {
    const base = z.object({
      email: z.string().min(1, t("auth.errorEmailRequired")).email(t("auth.errorEmailInvalid")),
      password: z.string().optional(),
      fullName: z.string().optional(),
      confirmPassword: z.string().optional(),
      homeAirport: z.string().optional(),
    });

    if (mode === "reset") return base;

    if (mode === "signin") {
      return base.extend({
        password: z.string().min(1, t("auth.errorPasswordRequired")).min(6, t("auth.errorPasswordMin")),
      });
    }

    return base
      .extend({
        fullName: z.string().min(1, t("auth.errorNameRequired")),
        password: z.string().min(1, t("auth.errorPasswordRequired")).min(6, t("auth.errorPasswordMin")),
        confirmPassword: z.string().min(1, t("auth.errorPasswordRequired")),
        homeAirport: z
          .string()
          .min(1, locale === "pt"
            ? "Selecione seu aeroporto mais próximo"
            : "Select your nearest airport"),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t("auth.errorPasswordsMismatch"),
        path: ["confirmPassword"],
      });
  };

  const form = useForm<{ email: string; password: string; fullName: string; confirmPassword: string; homeAirport: string }>({
    resolver: zodResolver(getSchema()),
    defaultValues: { email: "", password: "", fullName: "", confirmPassword: "", homeAirport: "" },
    mode: "onTouched",
  });

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    form.clearErrors();
    form.reset({ email: form.getValues("email"), password: "", fullName: "", confirmPassword: "", homeAirport: "" });
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (mode === "reset") {
        const { error } = await resetPassword(values.email);
        if (error) throw error;
        toast({ title: t("auth.resetSent") });
        switchMode("signin");
      } else if (mode === "signup") {
        const { error } = await signUp(values.email, values.password, values.fullName);
        if (error) throw error;
        // Persist chosen home airport locally so it's used immediately on next login,
        // and try to write it to the profile (will succeed once the user confirms email
        // and a profile row exists).
        if (values.homeAirport) {
          setHomeAirport(values.homeAirport);
          try {
            const { data: { user: newUser } } = await supabase.auth.getUser();
            if (newUser) {
              await supabase
                .from("profiles")
                .upsert(
                  { user_id: newUser.id, home_airport: values.homeAirport },
                  { onConflict: "user_id" },
                );
            }
          } catch (e) {
            console.warn("[Auth page] could not save home_airport to profile:", e);
          }
        }
        toast({ title: t("auth.signUpSuccess") });
        switchMode("signin");
      } else {
        console.log("[Auth page] signIn submit:", values.email);
        const { error } = await signIn(values.email, values.password);
        if (error) {
          console.error("[Auth page] signIn error:", error);
          throw error;
        }
        console.log("[Auth page] signIn ok, navigating now");
        const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/";
        navigate(redirectTo, { replace: true });
      }
    } catch (err: any) {
      console.error("[Auth page] submit caught:", err);
      toast({ title: "Erro ao entrar", description: err?.message || String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth`,
      });
      if (result.error) {
        toast({
          title: "Erro no login com Google",
          description: String(result.error),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      // If redirected, browser navigates away; if tokens returned, useEffect handles redirect
    } catch (err: any) {
      toast({
        title: "Erro no login com Google",
        description: err?.message || String(err),
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const PasswordToggle = ({ visible, onToggle }: { visible: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      tabIndex={-1}
      aria-label={
        visible
          ? (locale === "pt" ? "Ocultar senha" : "Hide password")
          : (locale === "pt" ? "Mostrar senha" : "Show password")
      }
      aria-pressed={visible}
    >
      {visible ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-center">
          <Plane className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
          <h2 className="font-display text-4xl font-bold text-primary-foreground mb-4">FlyCultura</h2>
          <p className="text-primary-foreground/70 text-lg max-w-md">
            {mode === "signup" ? t("auth.createSub") : t("auth.welcomeSub")}
          </p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Plane className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-gradient">FlyCultura</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {mode === "reset" ? t("auth.resetPassword") : mode === "signup" ? t("auth.signUp") : t("auth.welcome")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {mode === "reset" ? t("auth.resetSub") : mode === "signup" ? t("auth.createSub") : t("auth.welcomeSub")}
          </p>

          {mode !== "reset" && (
            <div className="mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 gap-3 font-medium"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {t("auth.googleSignIn")}
              </Button>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{t("auth.orContinueWith")}</span>
                </div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {mode === "signup" && (
                <FormField control={form.control} name="fullName" render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl><Input placeholder={t("auth.fullName")} className="pl-9" aria-invalid={!!fieldState.error} {...field} /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              <FormField control={form.control} name="email" render={({ field, fieldState }) => (
                <FormItem>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl><Input type="email" placeholder={t("auth.email")} className="pl-9" aria-invalid={!!fieldState.error} {...field} /></FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              {mode !== "reset" && (
                <FormField control={form.control} name="password" render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl><Input type={showPassword ? "text" : "password"} placeholder={t("auth.password")} className="pl-9 pr-10" aria-invalid={!!fieldState.error} {...field} /></FormControl>
                      <PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              {mode === "signup" && (
                <FormField control={form.control} name="confirmPassword" render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl><Input type={showConfirm ? "text" : "password"} placeholder={t("auth.confirmPassword")} className="pl-9 pr-10" aria-invalid={!!fieldState.error} {...field} /></FormControl>
                      <PasswordToggle visible={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              {mode === "signup" && (
                <FormField control={form.control} name="homeAirport" render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                      <FormControl>
                        <select
                          {...field}
                          aria-invalid={!!fieldState.error}
                          aria-label={locale === "pt" ? "Aeroporto mais próximo" : "Nearest airport"}
                          className={`flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${fieldState.error ? "border-destructive" : ""}`}
                        >
                          <option value="">
                            {locale === "pt" ? "Selecione seu aeroporto mais próximo" : "Select your nearest airport"}
                          </option>
                          {AIRPORT_OPTIONS.map((a) => (
                            <option key={a.code} value={a.code}>
                              {a.city} ({a.code})
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
              )}

              <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
                {loading ? "..." : mode === "reset" ? t("auth.sendReset") : mode === "signup" ? t("auth.signUpBtn") : t("auth.signInBtn")}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-2">
            {mode === "signin" && (
              <>
                <button type="button" onClick={() => switchMode("reset")} className="text-sm text-primary hover:underline block mx-auto">{t("auth.forgotPassword")}</button>
                <p className="text-sm text-muted-foreground">{t("auth.noAccount")}{" "}
                  <button type="button" onClick={() => switchMode("signup")} className="text-primary hover:underline font-medium">{t("auth.signUp")}</button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-sm text-muted-foreground">{t("auth.hasAccount")}{" "}
                <button type="button" onClick={() => switchMode("signin")} className="text-primary hover:underline font-medium">{t("auth.signIn")}</button>
              </p>
            )}
            {mode === "reset" && (
              <button type="button" onClick={() => switchMode("signin")} className="text-sm text-primary hover:underline">{t("auth.backToLogin")}</button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
