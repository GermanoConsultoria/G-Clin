import { createFileRoute, Outlet, useNavigate, Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Stethoscope, LogOut, Calendar, Tag, LayoutDashboard, Search, FolderHeart, Clock, Briefcase, BookOpen, TrendingUp, TrendingDown, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import gtechLogo from "@/assets/g-tech-logo.png";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  if (loading || !user) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Carregando...</div>;
  }

  const navItems = [
    { to: "/overview", label: "Painel", icon: LayoutDashboard },
    { to: "/dashboard", label: "Agendamentos", icon: Calendar },
    { to: "/slots", label: "Horários livres", icon: Search },
    { to: "/hours", label: "Funcionamento", icon: Clock },
    { to: "/services", label: "Serviços", icon: Briefcase },
    { to: "/receivables", label: "A receber", icon: TrendingUp },
    { to: "/payables", label: "A pagar", icon: TrendingDown },
    { to: "/balance", label: "Balancete", icon: Scale },
    { to: "/chart-accounts", label: "Plano de contas", icon: BookOpen },
    { to: "/plans", label: "Convênios", icon: Tag },
    { to: "/categories", label: "Categorias", icon: FolderHeart },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/overview" className="flex items-center gap-2 font-display font-bold">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground">
              <Stethoscope className="h-4 w-4" />
            </div>
            G-Clin
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((n) => {
              const active = pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <n.icon className="h-4 w-4" /> <span className="hidden md:inline">{n.label}</span>
                </Link>
              );
            })}
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut().then(() => nav({ to: "/" }))}>
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto flex-1 px-6 py-8"><Outlet /></main>
      <footer className="border-t bg-card">
        <div className="container mx-auto flex flex-col items-center justify-center gap-3 px-6 py-6 sm:flex-row">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Desenvolvido por</span>
          <img src={gtechLogo} alt="G-Tech — desenvolvedor do sistema" className="h-12 w-12 rounded-lg shadow-[var(--shadow-soft)]" />
          <span className="font-display text-base font-bold tracking-wide">G-Tech</span>
        </div>
      </footer>
    </div>
  );
}
