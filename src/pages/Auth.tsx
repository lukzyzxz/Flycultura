import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

type Mode = "signin" | "signup" | "reset";

const Auth = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "reset") {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast({ title: t("auth.resetSent") });
        setMode("signin");
      } else if (mode === "signup") {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({ title: t("auth.signUpSuccess") });
        setMode("signin");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center"
        >
          <Plane className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
          <h2 className="font-display text-4xl font-bold text-primary-foreground mb-4">
            FlyCultura
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-md">
            {mode === "signup" ? t("auth.createSub") : t("auth.welcomeSub")}
          </p>
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Plane className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-gradient">FlyCultura</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {mode === "reset" ? t("auth.resetPassword") : mode === "signup" ? t("auth.signUp") : t("auth.welcome")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === "reset"
              ? t("auth.resetSub")
              : mode === "signup"
              ? t("auth.createSub")
              : t("auth.welcomeSub")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("auth.fullName")}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder={t("auth.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
            {mode !== "reset" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder={t("auth.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                  minLength={6}
                />
              </div>
            )}

            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading
                ? "..."
                : mode === "reset"
                ? t("auth.sendReset")
                : mode === "signup"
                ? t("auth.signUpBtn")
                : t("auth.signInBtn")}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {mode === "signin" && (
              <>
                <button
                  onClick={() => setMode("reset")}
                  className="text-sm text-primary hover:underline block mx-auto"
                >
                  {t("auth.forgotPassword")}
                </button>
                <p className="text-sm text-muted-foreground">
                  {t("auth.noAccount")}{" "}
                  <button onClick={() => setMode("signup")} className="text-primary hover:underline font-medium">
                    {t("auth.signUp")}
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-sm text-muted-foreground">
                {t("auth.hasAccount")}{" "}
                <button onClick={() => setMode("signin")} className="text-primary hover:underline font-medium">
                  {t("auth.signIn")}
                </button>
              </p>
            )}
            {mode === "reset" && (
              <button
                onClick={() => setMode("signin")}
                className="text-sm text-primary hover:underline"
              >
                {t("auth.backToLogin")}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
