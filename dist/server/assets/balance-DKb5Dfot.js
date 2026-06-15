import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, Scale } from "lucide-react";
import { I as Input } from "./input-C0QjszdI.js";
import { L as Label } from "./label-JU3yqRBo.js";
import { u as useAuth, s as supabase } from "./router-C9Orusqq.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "class-variance-authority";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "sonner";
import "@supabase/supabase-js";
const today = /* @__PURE__ */ new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);
function Balance() {
  const {
    user
  } = useAuth();
  const [from, setFrom] = useState(firstDay);
  const [to, setTo] = useState(lastDay);
  const [receivables, setReceivables] = useState([]);
  const [payables, setPayables] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const [{
      data: r
    }, {
      data: p
    }, {
      data: a
    }] = await Promise.all([supabase.from("receivables").select("amount, status, due_date, account_id").gte("due_date", from).lte("due_date", to), supabase.from("payables").select("amount, status, due_date, account_id").gte("due_date", from).lte("due_date", to), supabase.from("chart_accounts").select("id, name, kind")]);
    setReceivables(r ?? []);
    setPayables(p ?? []);
    setAccounts(a ?? []);
    setLoading(false);
  };
  useEffect(() => {
    if (user) load();
  }, [user, from, to]);
  const totals = useMemo(() => {
    const recPago = receivables.filter((i) => i.status === "pago").reduce((s, i) => s + Number(i.amount), 0);
    const recPend = receivables.filter((i) => i.status === "pendente").reduce((s, i) => s + Number(i.amount), 0);
    const payPago = payables.filter((i) => i.status === "pago").reduce((s, i) => s + Number(i.amount), 0);
    const payPend = payables.filter((i) => i.status === "pendente").reduce((s, i) => s + Number(i.amount), 0);
    return {
      recPago,
      recPend,
      payPago,
      payPend,
      resultRealizado: recPago - payPago,
      resultPrevisto: recPago + recPend - (payPago + payPend)
    };
  }, [receivables, payables]);
  const byAccount = useMemo(() => {
    const groups = {};
    const acct = (id) => accounts.find((a) => a.id === id);
    receivables.forEach((r) => {
      const a = acct(r.account_id);
      const key = a?.id ?? "sem";
      groups[key] = groups[key] ?? {
        name: a?.name ?? "Sem categoria",
        kind: "receita",
        total: 0
      };
      groups[key].total += Number(r.amount);
    });
    payables.forEach((p) => {
      const a = acct(p.account_id);
      const key = (a?.id ?? "sem") + "-d";
      groups[key] = groups[key] ?? {
        name: a?.name ?? "Sem categoria",
        kind: "despesa",
        total: 0
      };
      groups[key].total += Number(p.amount);
    });
    return Object.values(groups);
  }, [receivables, payables, accounts]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold", children: "Balancete" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Resultado financeiro do período." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "De" }),
        /* @__PURE__ */ jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Até" }),
        /* @__PURE__ */ jsx(Input, { type: "date", value: to, onChange: (e) => setTo(e.target.value) })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Carregando..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 grid grid-cols-2 gap-4 md:grid-cols-4", children: [
        /* @__PURE__ */ jsx(Card, { icon: TrendingUp, label: "Receitas recebidas", value: totals.recPago, color: "text-emerald-600" }),
        /* @__PURE__ */ jsx(Card, { icon: TrendingUp, label: "A receber", value: totals.recPend, color: "text-emerald-500/70" }),
        /* @__PURE__ */ jsx(Card, { icon: TrendingDown, label: "Despesas pagas", value: totals.payPago, color: "text-red-600" }),
        /* @__PURE__ */ jsx(Card, { icon: TrendingDown, label: "A pagar", value: totals.payPend, color: "text-red-500/70" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" }),
            " Resultado realizado"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `mt-2 font-display text-3xl font-bold ${totals.resultRealizado >= 0 ? "text-emerald-600" : "text-destructive"}`, children: [
            "R$ ",
            totals.resultRealizado.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Scale, { className: "h-4 w-4" }),
            " Resultado previsto"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `mt-2 font-display text-3xl font-bold ${totals.resultPrevisto >= 0 ? "text-emerald-600" : "text-destructive"}`, children: [
            "R$ ",
            totals.resultPrevisto.toFixed(2)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-3 font-display text-xl font-semibold", children: "Por conta" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border bg-card", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 text-left text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Conta" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Tipo" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-right", children: "Total" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: byAccount.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, className: "px-4 py-6 text-center text-muted-foreground", children: "Sem lançamentos no período" }) }) : byAccount.map((g, i) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: g.name }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-2 capitalize", children: g.kind }),
            /* @__PURE__ */ jsxs("td", { className: `px-4 py-2 text-right font-semibold ${g.kind === "receita" ? "text-emerald-600" : "text-destructive"}`, children: [
              "R$ ",
              g.total.toFixed(2)
            ] })
          ] }, i)) })
        ] }) })
      ] })
    ] })
  ] });
}
function Card({
  icon: Icon,
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `mt-1 font-display text-xl font-bold ${color}`, children: [
      "R$ ",
      value.toFixed(2)
    ] })
  ] });
}
export {
  Balance as component
};
