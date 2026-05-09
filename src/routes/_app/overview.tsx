import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { Users, CheckCircle2, XCircle, Clock, Repeat, AlertCircle, Tag, FolderHeart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/overview")({ component: Overview });

type A = {
  id: string;
  status: "agendado" | "confirmado" | "concluido" | "cancelado";
  plan_name: string | null;
  category: string | null;
  scheduled_at: string;
  notes: string | null;
};

function Overview() {
  const { user } = useAuth();
  const [from, setFrom] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [to, setTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const [items, setItems] = useState<A[]>([]);

  useEffect(() => {
    if (!user) return;
    const start = new Date(`${from}T00:00:00`).toISOString();
    const end = new Date(`${to}T23:59:59`).toISOString();
    supabase
      .from("appointments")
      .select("id, status, plan_name, category, scheduled_at, notes")
      .gte("scheduled_at", start)
      .lte("scheduled_at", end)
      .then(({ data }) => setItems((data as A[]) ?? []));
  }, [user, from, to]);

  const stats = useMemo(() => {
    const total = items.length;
    const atendidos = items.filter((i) => i.status === "concluido").length;
    const confirmados = items.filter((i) => i.status === "confirmado").length;
    const cancelados = items.filter((i) => i.status === "cancelado").length;
    const aguardando = items.filter((i) => i.status === "agendado").length;
    const reagendamentos = items.filter((i) => (i.notes ?? "").toLowerCase().includes("reagend")).length;
    const semAgenda = cancelados; // pacientes que ficaram sem consulta no período
    const porPlano = group(items, (i) => i.plan_name ?? "Particular / sem plano");
    const porCategoria = group(items, (i) => i.category ?? "Sem categoria");
    return { total, atendidos, confirmados, cancelados, aguardando, reagendamentos, semAgenda, porPlano, porCategoria };
  }, [items]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Painel de informações</h1>
          <p className="text-sm text-muted-foreground">Indicadores do período selecionado.</p>
        </div>
        <div className="flex gap-2">
          <div className="space-y-1">
            <Label className="text-xs">De</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Até</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Total no período" value={stats.total} tone="primary" />
        <Kpi icon={CheckCircle2} label="Pacientes atendidos" value={stats.atendidos} tone="success" />
        <Kpi icon={CheckCircle2} label="Confirmados" value={stats.confirmados} tone="success" />
        <Kpi icon={Clock} label="Aguardando confirmação" value={stats.aguardando} tone="warning" />
        <Kpi icon={XCircle} label="Cancelados" value={stats.cancelados} tone="destructive" />
        <Kpi icon={Repeat} label="Reagendamentos" value={stats.reagendamentos} tone="primary" />
        <Kpi icon={AlertCircle} label="Ficaram sem consulta" value={stats.semAgenda} tone="destructive" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Breakdown title="Por plano" icon={Tag} data={stats.porPlano} total={stats.total} />
        <Breakdown title="Por categoria" icon={FolderHeart} data={stats.porCategoria} total={stats.total} />
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: number; tone: "primary" | "success" | "warning" | "destructive" }) {
  const map = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/15 text-destructive",
  } as const;
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`grid h-8 w-8 place-items-center rounded-lg ${map[tone]}`}><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}

function Breakdown({ title, icon: Icon, data, total }: { title: string; icon: typeof Tag; data: Map<string, number>; total: number }) {
  const rows = Array.from(data.entries()).sort((a, b) => b[1] - a[1]);
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem dados no período.</p>
      ) : (
        <div className="space-y-2">
          {rows.map(([k, v]) => {
            const pct = total ? Math.round((v / total) * 100) : 0;
            return (
              <div key={k}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{k}</span>
                  <span className="text-muted-foreground">{v} · {pct}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function group<T>(arr: T[], by: (x: T) => string) {
  const m = new Map<string, number>();
  for (const x of arr) m.set(by(x), (m.get(by(x)) ?? 0) + 1);
  return m;
}
