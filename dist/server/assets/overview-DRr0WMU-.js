import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { format, isToday, parseISO, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BellRing, AlertCircle, Calendar, CheckCircle2, Clock, XCircle, MessageCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { u as useAuth, s as supabase } from "./router-OHh7bvQb.js";
import "@tanstack/react-query";
import "sonner";
import "@supabase/supabase-js";
function formatPhone(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 11) return `55${digits}`;
  return digits;
}
function buildMessage(opts) {
  const when = format(opts.scheduledAt, "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  const tipo = opts.type === "retorno" ? "retorno" : "consulta";
  const plano = opts.planName ? ` (${opts.planName})` : "";
  switch (opts.kind) {
    case "agendamento":
      return `Olá, ${opts.patientName}! 👋

Sua ${tipo}${plano} foi agendada para *${when}*.

Qualquer dúvida, é só responder esta mensagem.`;
    case "confirmacao":
      return `Olá, ${opts.patientName}! Lembrete da sua ${tipo}${plano} amanhã, *${when}*.

Por favor, confirme respondendo *SIM* ✅ ou *NÃO* ❌.`;
    case "reagendamento":
      return `Olá, ${opts.patientName}! Precisamos *reagendar* sua ${tipo}${plano} que estava marcada para ${when}.

Por favor, entre em contato para escolher um novo horário.`;
    case "antecipar": {
      const novo = opts.newSlot ? format(opts.newSlot, "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: ptBR }) : when;
      return `Olá, ${opts.patientName}! 🎉 Surgiu uma *vaga antecipada* para *${novo}*.

Você manifestou interesse em antecipar. Se quiser ficar com este horário, responda *SIM* o quanto antes — vai para quem responder primeiro!`;
    }
  }
}
function whatsappLink(phone, message) {
  return `https://wa.me/${formatPhone(phone)}?text=${encodeURIComponent(message)}`;
}
const formatBRL = (v) => v.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});
const statusConfig = {
  agendado: {
    label: "Aguardando",
    cls: "bg-purple-50 text-purple-700 border-purple-200"
  },
  confirmado: {
    label: "Confirmado",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  concluido: {
    label: "Concluído",
    cls: "bg-gray-100 text-gray-600 border-gray-200"
  },
  cancelado: {
    label: "Cancelado",
    cls: "bg-red-50 text-red-600 border-red-200"
  },
  falta: {
    label: "Falta",
    cls: "bg-red-50 text-red-600 border-red-200"
  },
  pendente_pagamento: {
    label: "Pend. Pagamento",
    cls: "bg-orange-50 text-orange-700 border-orange-200"
  }
};
function SectionTitle({
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4 mt-8 first:mt-0", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap", children }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 border-t border-border" })
  ] });
}
function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "default",
  progress
}) {
  const toneMap = {
    default: {
      icon: "bg-primary/10 text-primary",
      value: "text-foreground"
    },
    success: {
      icon: "bg-success/15 text-success",
      value: "text-success"
    },
    warning: {
      icon: "bg-warning/15 text-warning",
      value: "text-warning"
    },
    danger: {
      icon: "bg-destructive/15 text-destructive",
      value: "text-destructive"
    }
  };
  const t = toneMap[tone];
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("div", { className: `grid h-8 w-8 place-items-center rounded-lg ${t.icon}`, children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `font-display text-3xl font-bold leading-none ${t.value}`, children: value }),
    progress !== void 0 && /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-primary transition-all", style: {
      width: `${Math.min(progress, 100)}%`
    } }) }),
    sub && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: sub })
  ] });
}
function FinRow({
  label,
  value,
  tone = "default",
  bold
}) {
  const colorMap = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
    default: "text-foreground"
  };
  return /* @__PURE__ */ jsxs("div", { className: `flex justify-between items-baseline py-2 border-b border-border last:border-0 ${bold ? "pt-3" : ""}`, children: [
    /* @__PURE__ */ jsx("span", { className: `text-sm ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`, children: label }),
    /* @__PURE__ */ jsx("span", { className: `text-sm font-semibold ${colorMap[tone]} ${bold ? "text-base" : ""}`, children: formatBRL(value) })
  ] });
}
function CustomTooltip({
  active,
  payload,
  label
}) {
  if (!active || !payload?.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-card p-3 shadow-lg text-xs space-y-1", children: [
    /* @__PURE__ */ jsx("div", { className: "font-semibold text-foreground mb-1 capitalize", children: label }),
    payload.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full", style: {
        background: p.fill
      } }),
      /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
        p.name,
        ":"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatBRL(p.value) })
    ] }, p.name))
  ] });
}
function Overview() {
  const {
    user
  } = useAuth();
  const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
  const [from, setFrom] = useState("");
  const [to] = [today];
  const [appointments, setAppointments] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [qtdPendentes, setQtdPendentes] = useState(0);
  const carregarPendentes = async () => {
    const {
      count
    } = await supabase.from("lancamento_financeiro").select("*", {
      count: "exact",
      head: true
    }).eq("tipo", "RECEITA").eq("status", "PENDENTE");
    setQtdPendentes(count ?? 0);
  };
  useEffect(() => {
    if (!user) return;
    Promise.all([supabase.from("appointments").select("id, client_name, phone, status, service_name, type, scheduled_at").order("scheduled_at", {
      ascending: true
    }), supabase.from("lancamento_financeiro").select("id, tipo, valor, status, dt_vencimento").neq("status", "CANCELADO")]).then(([{
      data: a
    }, {
      data: l
    }]) => {
      const appts = a ?? [];
      setAppointments(appts);
      if (appts.length > 0) {
        setFrom(appts[0].scheduled_at.slice(0, 10));
      } else {
        setFrom(format(/* @__PURE__ */ new Date(), "yyyy-MM") + "-01");
      }
      setLancamentos(l ?? []);
    });
    carregarPendentes();
    const intervalo = setInterval(carregarPendentes, 6e4);
    return () => clearInterval(intervalo);
  }, [user]);
  const todayAppts = useMemo(() => appointments.filter((a) => isToday(parseISO(a.scheduled_at))), [appointments]);
  const todayStats = useMemo(() => {
    const total = todayAppts.length;
    const concluidos = todayAppts.filter((a) => a.status === "concluido").length;
    const confirmados = todayAppts.filter((a) => a.status === "confirmado" || a.status === "concluido").length;
    const aguardando = todayAppts.filter((a) => a.status === "agendado" || a.status === "pendente_pagamento").length;
    const problemas = todayAppts.filter((a) => a.status === "cancelado" || a.status === "falta").length;
    const progresso = total > 0 ? Math.round(concluidos / total * 100) : 0;
    return {
      total,
      concluidos,
      confirmados,
      aguardando,
      problemas,
      progresso
    };
  }, [todayAppts]);
  const proximosHoje = useMemo(() => todayAppts.filter((a) => a.status === "agendado" || a.status === "confirmado" || a.status === "pendente_pagamento").slice(0, 5), [todayAppts]);
  const periodoStats = useMemo(() => {
    const recebido = lancamentos.filter((l) => l.tipo === "RECEITA" && l.status === "PAGO").reduce((s, l) => s + Number(l.valor), 0);
    const aReceber = lancamentos.filter((l) => l.tipo === "RECEITA" && l.status === "PENDENTE").reduce((s, l) => s + Number(l.valor), 0);
    const pago = lancamentos.filter((l) => l.tipo === "DESPESA" && l.status === "PAGO").reduce((s, l) => s + Number(l.valor), 0);
    const aPagar = lancamentos.filter((l) => l.tipo === "DESPESA" && l.status === "PENDENTE").reduce((s, l) => s + Number(l.valor), 0);
    const saldo = recebido - pago;
    const previsto = recebido + aReceber - (pago + aPagar);
    return {
      aReceber,
      recebido,
      aPagar,
      pago,
      saldo,
      previsto
    };
  }, [lancamentos]);
  const chartData = useMemo(() => {
    if (!from || !to) return [];
    const meses = eachMonthOfInterval({
      start: parseISO(from),
      end: parseISO(to)
    });
    return meses.map((mes) => {
      const label = format(mes, "MMM/yy", {
        locale: ptBR
      });
      const mesStart = format(startOfMonth(mes), "yyyy-MM-dd");
      const mesEnd = format(endOfMonth(mes), "yyyy-MM-dd");
      const receita = lancamentos.filter((l) => l.tipo === "RECEITA" && l.status === "PAGO" && l.dt_vencimento.slice(0, 10) >= mesStart && l.dt_vencimento.slice(0, 10) <= mesEnd).reduce((s, l) => s + Number(l.valor), 0);
      const custo = lancamentos.filter((l) => l.tipo === "DESPESA" && l.status === "PAGO" && l.dt_vencimento.slice(0, 10) >= mesStart && l.dt_vencimento.slice(0, 10) <= mesEnd).reduce((s, l) => s + Number(l.valor), 0);
      return {
        mes: label,
        Receita: parseFloat(receita.toFixed(2)),
        Custo: parseFloat(custo.toFixed(2)),
        Lucro: parseFloat((receita - custo).toFixed(2))
      };
    });
  }, [lancamentos, from, to]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold", children: "Painel de informações" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: format(/* @__PURE__ */ new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", {
          locale: ptBR
        }) })
      ] }),
      qtdPendentes > 0 && /* @__PURE__ */ jsxs(Link, { to: "/pending-payments", className: "relative flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors", title: `${qtdPendentes} pagamento(s) pendente(s)`, children: [
        /* @__PURE__ */ jsx(BellRing, { className: "h-5 w-5 text-orange-600" }),
        /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white", children: qtdPendentes > 99 ? "99+" : qtdPendentes })
      ] })
    ] }),
    qtdPendentes > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 shrink-0 text-orange-500" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-orange-800", children: [
        "Você tem ",
        /* @__PURE__ */ jsxs("strong", { children: [
          qtdPendentes,
          " pagamento",
          qtdPendentes !== 1 ? "s" : "",
          " pendente",
          qtdPendentes !== 1 ? "s" : ""
        ] }),
        ".",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/pending-payments", className: "underline font-medium hover:text-orange-900", children: "Verifique os pagamentos pendentes." })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SectionTitle, { children: "Hoje em destaque" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(KpiCard, { icon: Calendar, label: "Agendamentos hoje", value: todayStats.total, tone: "default", progress: todayStats.progresso, sub: `${todayStats.concluidos} de ${todayStats.total} concluídos` }),
      /* @__PURE__ */ jsx(KpiCard, { icon: CheckCircle2, label: "Confirmados hoje", value: todayStats.confirmados, tone: "success", sub: todayStats.total > 0 ? `${Math.round(todayStats.confirmados / todayStats.total * 100)}% de confirmação` : "—" }),
      /* @__PURE__ */ jsx(KpiCard, { icon: Clock, label: "Aguardando confirmação", value: todayStats.aguardando, tone: "warning", sub: todayStats.aguardando > 0 ? "Enviar lembrete pelo WhatsApp" : "Todos responderam" }),
      /* @__PURE__ */ jsx(KpiCard, { icon: XCircle, label: "Faltas / cancelados", value: todayStats.problemas, tone: todayStats.problemas > 0 ? "danger" : "default", sub: todayStats.problemas === 0 ? "Nenhuma ocorrência" : void 0 })
    ] }),
    proximosHoje.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(SectionTitle, { children: "Próximos atendimentos de hoje" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: proximosHoje.map((a) => {
        const cfg = statusConfig[a.status];
        const hora = format(parseISO(a.scheduled_at), "HH:mm");
        const msg = buildMessage({
          kind: "confirmacao",
          patientName: a.client_name,
          scheduledAt: parseISO(a.scheduled_at),
          type: a.type === "retorno" ? "retorno" : "consulta"
        });
        const link = whatsappLink(a.phone, msg);
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-xl border bg-card px-4 py-3 shadow-[var(--shadow-card)]", children: [
          /* @__PURE__ */ jsx("span", { className: "w-10 text-sm font-semibold text-primary shrink-0", children: hora }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm truncate", children: a.client_name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: a.service_name ?? "Sem serviço definido" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: `hidden sm:inline-flex text-xs px-2.5 py-0.5 rounded-full border font-medium shrink-0 ${cfg.cls}`, children: cfg.label }),
          a.status === "agendado" && /* @__PURE__ */ jsxs("a", { href: link, target: "_blank", rel: "noopener noreferrer", className: "shrink-0 flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity", children: [
            /* @__PURE__ */ jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
            "Lembrete"
          ] })
        ] }, a.id);
      }) })
    ] }),
    proximosHoje.length === 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(SectionTitle, { children: "Próximos atendimentos de hoje" }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border bg-card px-4 py-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-card)]", children: "Nenhum atendimento pendente para hoje." })
    ] }),
    /* @__PURE__ */ jsx(SectionTitle, { children: "Resultado do período" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold mb-4", children: "Resultado mensal" }),
        chartData.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex h-48 items-center justify-center text-sm text-muted-foreground", children: "Sem dados no período." }) : /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 240, children: /* @__PURE__ */ jsxs(BarChart, { data: chartData, margin: {
          top: 4,
          right: 4,
          left: 4,
          bottom: 4
        }, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)", vertical: false }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "mes", tick: {
            fontSize: 11,
            fill: "var(--color-muted-foreground)"
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(YAxis, { tick: {
            fontSize: 10,
            fill: "var(--color-muted-foreground)"
          }, axisLine: false, tickLine: false, tickFormatter: (v) => `R$${(v / 1e3).toFixed(0)}k`, width: 48 }),
          /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {}) }),
          /* @__PURE__ */ jsx(Legend, { wrapperStyle: {
            fontSize: 11,
            paddingTop: 12
          }, formatter: (value) => /* @__PURE__ */ jsx("span", { style: {
            color: "var(--color-foreground)"
          }, children: value }) }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "Receita", fill: "var(--primary)", radius: [4, 4, 0, 0] }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "Custo", fill: "var(--destructive)", radius: [4, 4, 0, 0] }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "Lucro", fill: "var(--success)", radius: [4, 4, 0, 0] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)]", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold mb-2", children: "Financeiro do período" }),
        /* @__PURE__ */ jsx(FinRow, { label: "Receita recebida", value: periodoStats.recebido, tone: "success" }),
        /* @__PURE__ */ jsx(FinRow, { label: "A receber", value: periodoStats.aReceber, tone: "warning" }),
        /* @__PURE__ */ jsx(FinRow, { label: "Despesas pagas", value: periodoStats.pago, tone: "danger" }),
        /* @__PURE__ */ jsx(FinRow, { label: "A pagar", value: periodoStats.aPagar, tone: "danger" }),
        /* @__PURE__ */ jsx(FinRow, { label: "Saldo realizado", value: periodoStats.saldo, tone: periodoStats.saldo >= 0 ? "success" : "danger", bold: true }),
        /* @__PURE__ */ jsx(FinRow, { label: "Resultado previsto", value: periodoStats.previsto, tone: periodoStats.previsto >= 0 ? "success" : "danger", bold: true })
      ] })
    ] })
  ] });
}
export {
  Overview as component
};
