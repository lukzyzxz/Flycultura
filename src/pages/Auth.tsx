import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
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
  const { signIn, signUp, resetPassword } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getSchema = () => {
    const base = z.object({
      email: z
        .string()
        .min(1, t("auth.errorEmailRequired"))
        .email(t("auth.errorEmailInvalid")),
      password: z.string().optional(),
      fullName: z.string().optional(),
      confirmPassword: z.string().optional(),
    });

    if (mode === "reset") {
      return base;
    }

    if (mode === "signin") {
      return base.extend({
        password: z
          .string()
          .min(1, t("auth.errorPasswordRequired"))
          .min(6, t("auth.errorPasswordMin")),
      });
    }

    // signup
    return base
      .extend({
        fullName: z.string().min(1, t("auth.errorNameRequired")),
        password: z
          .string()
          .min(1, t("auth.errorPasswordRequired"))
          .min(6, t("auth.errorPasswordMin")),
        confirmPassword: z.string().min(1, t("auth.errorPasswordRequired")),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t("auth.errorPasswordsMismatch"),
        path: ["confirmPassword"],
      });
  };

  const form = useForm<{
    email: string;
    password: string;
    fullName: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(getSchema()),
    defaultValues: { email: "", password: "", fullName: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    form.clearErrors();
    form.reset({ email: form.getValues("email"), password: "", fullName: "", confirmPassword: "" });
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
        toast({ title: t("auth.signUpSuccess") });
        switchMode("signin");
      } else {
        const { error } = await signIn(values.email, values.password);
        if (error) throw error;
        navigate("/");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const PasswordToggle = ({
    visible,
    onToggle,
  }: {
    visible: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      tabIndex={-1}
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

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
            {mode === "reset"
              ? t("auth.resetPassword")
              : mode === "signup"
              ? t("auth.signUp")
              : t("auth.welcome")}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === "reset"
              ? t("auth.resetSub")
              : mode === "signup"
              ? t("auth.createSub")
              : t("auth.welcomeSub")}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {mode === "signup" && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input
                            placeholder={t("auth.fullName")}
                            className="pl-9"
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("auth.email")}
                          className="pl-9"
                          aria-invalid={!!fieldState.error}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode !== "reset" && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.password")}
                            className="pl-9 pr-10"
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                        </FormControl>
                        <PasswordToggle
                          visible={showPassword}
                          onToggle={() => setShowPassword((v) => !v)}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode === "signup" && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input
                            type={showConfirm ? "text" : "password"}
                            placeholder={t("auth.confirmPassword")}
                            className="pl-9 pr-10"
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                        </FormControl>
                        <PasswordToggle
                          visible={showConfirm}
                          onToggle={() => setShowConfirm((v) => !v)}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          </Form>

          <div className="mt-6 text-center space-y-2">
            {mode === "signin" && (
              <>
                <button
                  type="button"
                  onClick={() => switchMode("reset")}
                  className="text-sm text-primary hover:underline block mx-auto"
                >
                  {t("auth.forgotPassword")}
                </button>
                <p className="text-sm text-muted-foreground">
                  {t("auth.noAccount")}{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    {t("auth.signUp")}
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-sm text-muted-foreground">
                {t("auth.hasAccount")}{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="text-primary hover:underline font-medium"
                >
                  {t("auth.signIn")}
                </button>
              </p>
            )}
            {mode === "reset" && (
              <button
                type="button"
                onClick={() => switchMode("signin")}
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
