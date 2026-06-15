import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  format, eachMonthOfInterval,
  startOfMonth, endOfMonth, parseISO, isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar, CheckCircle2, XCircle, Clock,
  TrendingUp, TrendingDown, DollarSign, MessageCircle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { buildMessage, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/_app/overview")({ component: Overview });

type Appointment = {
  id: string;
  client_name: string;
  phone: string;
  status: "agendado" | "confirmado" | "concluido" | "cancelado" | "falta";
  service_name: string | null;
  type: "procedimento" | "avaliacao" | "retorno" | "encaixe";
  scheduled_at: string;
};

type Receivable = {
  id: string;
  amount: number;
  status: "pendente" | "pago" | "atrasado" | "cancelado";
  due_date: string;
};

type Payable = {
  id: string;
  amount: number;
  status: "pendente" | "pago" | "atrasado" | "cancelado";
  due_date: string;
};

type ServiceCost = {
  id: string;
  cost: number;
};

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusConfig = {
  agendado:  { label: "Aguardando", cls: "bg-purple-50 text-purple-700 border-purple-200" },
  confirmado: { label: "Confirmado", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  concluido: { label: "Concluído",  cls: "bg-gray-100 text-gray-600 border-gray-200" },
  cancelado: { label: "Cancelado",  cls: "bg-red-50 text-red-600 border-red-200" },
  falta:     { label: "Falta",      cls: "bg-red-50 text-red-600 border-red-200" },
} as const;

// ─── Componentes auxiliares ────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8 first:mt-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "default",
  progress,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "success" | "warning" | "danger";
  progress?: number;
}) {
  const toneMap = {
    default: { icon: "bg-primary/10 text-primary",     value: "text-foreground" },
    success: { icon: "bg-success/15 text-success",     value: "text-success" },
    warning: { icon: "bg-warning/15 text-warning",     value: "text-warning" },
    danger:  { icon: "bg-destructive/15 text-destructive", value: "text-destructive" },
  };
  const t = toneMap[tone];

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`grid h-8 w-8 place-items-center rounded-lg ${t.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className={`font-display text-3xl font-bold leading-none ${t.value}`}>
        {value}
      </div>
      {progress !== undefined && (
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function FinRow({
  label,
  value,
  tone = "default",
  bold,
}: {
  label: string;
  value: number;
  tone?: "success" | "warning" | "danger" | "default";
  bold?: boolean;
}) {
  const colorMap = {
    success: "text-success",
    warning: "text-warning",
    danger:  "text-destructive",
    default: "text-foreground",
  };
  return (
    <div className={`flex justify-between items-baseline py-2 border-b border-border last:border-0 ${bold ? "pt-3" : ""}`}>
      <span className={`text-sm ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
      <span className={`text-sm font-semibold ${colorMap[tone]} ${bold ? "text-base" : ""}`}>
        {formatBRL(value)}
      </span>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-card p-3 shadow-lg text-xs space-y-1">
      <div className="font-semibold text-foreground mb-1 capitalize">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{formatBRL(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────

function Overview() {
  const { user } = useAuth();

  const today = format(new Date(), "yyyy-MM-dd");
  const [from, setFrom] = useState("");
  const [to]            = [today];

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [receivables,  setReceivables]  = useState<Receivable[]>([]);
  const [payables,     setPayables]     = useState<Payable[]>([]);
  const [serviceCosts, setServiceCosts] = useState<ServiceCost[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase
        .from("appointments")
        .select("id, client_name, phone, status, service_name, type, scheduled_at")
        .order("scheduled_at", { ascending: true }),
      supabase
        .from("receivables")
        .select("id, amount, status, due_date")
        .lte("due_date", today),
      supabase
        .from("payables")
        .select("id, amount, status, due_date")
        .lte("due_date", today),
      supabase.from("services").select("id, cost"),
    ]).then(([{ data: a }, { data: r }, { data: p }, { data: s }]) => {
      const appts = (a as Appointment[]) ?? [];
      setAppointments(appts);
      if (appts.length > 0) {
        setFrom(appts[0].scheduled_at.slice(0, 10));
      } else {
        setFrom(format(new Date(), "yyyy-MM") + "-01");
      }
      setReceivables((r  as Receivable[])  ?? []);
      setPayables((p     as Payable[])     ?? []);
      setServiceCosts((s as ServiceCost[]) ?? []);
    });
  }, [user, from, to]);

  // ── Hoje ──────────────────────────────────────────────────────────────────
  const todayAppts = useMemo(
    () => appointments.filter((a) => isToday(parseISO(a.scheduled_at))),
    [appointments],
  );

  const todayStats = useMemo(() => {
    const total      = todayAppts.length;
    const concluidos = todayAppts.filter((a) => a.status === "concluido").length;
    const confirmados = todayAppts.filter((a) => a.status === "confirmado").length;
    const aguardando = todayAppts.filter((a) => a.status === "agendado").length;
    const problemas  = todayAppts.filter((a) => a.status === "cancelado" || a.status === "falta").length;
    const progresso  = total > 0 ? Math.round((concluidos / total) * 100) : 0;
    return { total, concluidos, confirmados, aguardando, problemas, progresso };
  }, [todayAppts]);

  // Próximos agendamentos de hoje que ainda não foram concluídos/cancelados
  const proximosHoje = useMemo(
    () =>
      todayAppts
        .filter((a) => a.status === "agendado" || a.status === "confirmado")
        .slice(0, 5),
    [todayAppts],
  );

  // ── Período ───────────────────────────────────────────────────────────────
  const periodoStats = useMemo(() => {
    const aReceber  = receivables.filter((r) => r.status === "pendente" || r.status === "atrasado").reduce((s, r) => s + Number(r.amount), 0);
    const recebido  = receivables.filter((r) => r.status === "pago").reduce((s, r) => s + Number(r.amount), 0);
    const aPagar    = payables.filter((p) => p.status === "pendente" || p.status === "atrasado").reduce((s, p) => s + Number(p.amount), 0);
    const pago      = payables.filter((p) => p.status === "pago").reduce((s, p) => s + Number(p.amount), 0);
    const saldo     = recebido - pago;
    const previsto  = (recebido + aReceber) - (pago + aPagar);
    return { aReceber, recebido, aPagar, pago, saldo, previsto };
  }, [receivables, payables]);

  // ── Gráfico mensal ────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (!from || !to) return [];
    const meses   = eachMonthOfInterval({ start: parseISO(from), end: parseISO(to) });
    const costMap = new Map(serviceCosts.map((s) => [s.id, Number(s.cost)]));

    return meses.map((mes) => {
      const label    = format(mes, "MMM/yy", { locale: ptBR });
      const mesStart = format(startOfMonth(mes), "yyyy-MM-dd");
      const mesEnd   = format(endOfMonth(mes),   "yyyy-MM-dd");

      const receita = receivables
        .filter((r) => r.status === "pago" && r.due_date >= mesStart && r.due_date <= mesEnd)
        .reduce((s, r) => s + Number(r.amount), 0);

      const custo = appointments
        .filter((a) => {
          const d = a.scheduled_at.slice(0, 10);
          return a.status === "concluido" && d >= mesStart && d <= mesEnd;
        })
        .reduce((s, a) => s + (costMap.get((a as any).service_id) ?? 0), 0);

      return {
        mes: label,
        Receita: parseFloat(receita.toFixed(2)),
        Custo:   parseFloat(custo.toFixed(2)),
        Lucro:   parseFloat((receita - custo).toFixed(2)),
      };
    });
  }, [appointments, receivables, serviceCosts, from, to]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Painel de informações</h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>

      </div>

      {/* ── Hoje em destaque ── */}
      <SectionTitle>Hoje em destaque</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Calendar}
          label="Agendamentos hoje"
          value={todayStats.total}
          tone="default"
          progress={todayStats.progresso}
          sub={`${todayStats.concluidos} de ${todayStats.total} concluídos`}
        />
        <KpiCard
          icon={CheckCircle2}
          label="Confirmados hoje"
          value={todayStats.confirmados}
          tone="success"
          sub={todayStats.total > 0 ? `${Math.round((todayStats.confirmados / todayStats.total) * 100)}% de confirmação` : "—"}
        />
        <KpiCard
          icon={Clock}
          label="Aguardando confirmação"
          value={todayStats.aguardando}
          tone="warning"
          sub={todayStats.aguardando > 0 ? "Enviar lembrete pelo WhatsApp" : "Todos responderam"}
        />
        <KpiCard
          icon={XCircle}
          label="Faltas / cancelados"
          value={todayStats.problemas}
          tone={todayStats.problemas > 0 ? "danger" : "default"}
          sub={todayStats.problemas === 0 ? "Nenhuma ocorrência" : undefined}
        />
      </div>

      {/* ── Próximos atendimentos ── */}
      {proximosHoje.length > 0 && (
        <>
          <SectionTitle>Próximos atendimentos de hoje</SectionTitle>
          <div className="flex flex-col gap-2">
            {proximosHoje.map((a) => {
              const cfg = statusConfig[a.status];
              const hora = format(parseISO(a.scheduled_at), "HH:mm");
              const msg = buildMessage({
                kind: "confirmacao",
                patientName: a.client_name,
                scheduledAt: parseISO(a.scheduled_at),
                type: a.type === "retorno" ? "retorno" : "consulta",
              });
              const link = whatsappLink(a.phone, msg);

              return (
                <div
                  key={a.id}
                  className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3 shadow-[var(--shadow-card)]"
                >
                  <span className="w-10 text-sm font-semibold text-primary shrink-0">{hora}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{a.client_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {a.service_name ?? "Sem serviço definido"}
                    </p>
                  </div>
                  <span className={`hidden sm:inline-flex text-xs px-2.5 py-0.5 rounded-full border font-medium shrink-0 ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                  {a.status === "agendado" && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Lembrete
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {proximosHoje.length === 0 && (
        <>
          <SectionTitle>Próximos atendimentos de hoje</SectionTitle>
          <div className="rounded-xl border bg-card px-4 py-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-card)]">
            Nenhum atendimento pendente para hoje.
          </div>
        </>
      )}

      {/* ── Resultado do período ── */}
      <SectionTitle>Resultado do período</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Gráfico */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-4">Resultado mensal</p>
          {chartData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              Sem dados no período.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                  formatter={(value) => (
                    <span style={{ color: "var(--color-foreground)" }}>{value}</span>
                  )}
                />
                <Bar dataKey="Receita" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Custo"   fill="var(--destructive)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Lucro"   fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Resumo financeiro */}
        <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold mb-2">Financeiro do período</p>
          <FinRow label="Receita recebida"  value={periodoStats.recebido} tone="success" />
          <FinRow label="A receber"         value={periodoStats.aReceber} tone="warning" />
          <FinRow label="Despesas pagas"    value={periodoStats.pago}     tone="danger"  />
          <FinRow label="A pagar"           value={periodoStats.aPagar}   tone="danger"  />
          <FinRow label="Saldo realizado"   value={periodoStats.saldo}    tone={periodoStats.saldo >= 0 ? "success" : "danger"} bold />
          <FinRow label="Resultado previsto" value={periodoStats.previsto} tone={periodoStats.previsto >= 0 ? "success" : "danger"} bold />
        </div>
      </div>
    </div>
  );
}