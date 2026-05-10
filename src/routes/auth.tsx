import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import gtechLogo from "@/assets/g-tech-logo.png";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/dashboard" });
    });
  }, [nav]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    nav({ to: "/dashboard" });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password.length < 8) {
      setLoading(false);
      return toast.error("A senha deve ter pelo menos 8 caracteres.");
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("weak") || msg.includes("pwned")) {
        return toast.error("Senha muito fraca ou já vazada em outros sites. Escolha uma senha mais forte (ex: combine letras, números e símbolos).");
      }
      if (msg.includes("already") || msg.includes("registered")) {
        return toast.error("Este email já está cadastrado. Faça login.");
      }
      return toast.error(error.message);
    }
    toast.success("Conta criada! Verifique seu email para confirmar.");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-bold">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
            <Stethoscope className="h-5 w-5" />
          </div>
          G-Clin
        </Link>
        <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4 pt-4">
                <Field label="Email" type="email" value={email} onChange={setEmail} />
                <Field label="Senha" type="password" value={password} onChange={setPassword} />
                <Button type="submit" disabled={loading} className="w-full bg-[image:var(--gradient-hero)]">
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4 pt-4">
                <Field label="Email" type="email" value={email} onChange={setEmail} />
                <Field label="Senha" type="password" value={password} onChange={setPassword} />
                <Button type="submit" disabled={loading} className="w-full bg-[image:var(--gradient-hero)]">
                  {loading ? "Criando..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border bg-card/60 p-4 text-center shadow-[var(--shadow-card)]">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Desenvolvido por</span>
          <img src={gtechLogo} alt="G-Tech — desenvolvedor do sistema" className="h-16 w-16 rounded-lg shadow-[var(--shadow-soft)]" />
          <span className="font-display text-base font-bold tracking-wide">G-Tech</span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required minLength={type === "password" ? 8 : undefined} />
    </div>
  );
}
