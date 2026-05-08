import { createFileRoute, Outlet, useNavigate, Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Stethoscope, LogOut, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

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
    { to: "/dashboard", label: "Agendamentos", icon: Calendar },
    { to: "/plans", label: "Planos", icon: Tag },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-display font-bold">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground">
              <Stethoscope className="h-4 w-4" />
            </div>
            ClinicFlow
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
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut().then(() => nav({ to: "/" }))}>
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8"><Outlet /></main>
    </div>
  );
}
