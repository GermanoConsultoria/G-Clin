import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { u as useAuth, s as supabase } from "./router-OHh7bvQb.js";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { C as Card, f as formatBRL } from "./format-BvmwmcSR.js";
import { B as Button } from "./button-Cz8PAkJh.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "sonner";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const MESES_ABREV = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
function CardResumo({ label, valor, cor }) {
  return /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsx("p", { className: `text-xl font-bold mt-1 ${cor}`, children: formatBRL(valor) })
  ] });
}
const TooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-lg p-3 text-xs shadow-xl", children: [
    /* @__PURE__ */ jsx("p", { className: "font-semibold mb-2", children: label }),
    payload.map((p) => /* @__PURE__ */ jsxs("p", { style: { color: p.color }, children: [
      p.name,
      ": ",
      formatBRL(p.value)
    ] }, p.name))
  ] });
};
function SeletorMesBalancete({ onAplicar }) {
  const [aberto, setAberto] = useState(false);
  const [ano, setAno] = useState((/* @__PURE__ */ new Date()).getFullYear());
  const [mesSel, setMesSel] = useState((/* @__PURE__ */ new Date()).getMonth());
  const ref = useRef(null);
  useEffect(() => {
    function fechar(e) {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false);
    }
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, []);
  const label = `${MESES_ABREV[mesSel]} / ${ano}`;
  return /* @__PURE__ */ jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxs("button", { onClick: () => setAberto((v) => !v), className: "flex items-center gap-2 bg-background border rounded-lg px-3 py-2 text-sm hover:border-muted-foreground transition-colors", children: [
      label,
      " ",
      /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: "text-muted-foreground" })
    ] }),
    aberto && /* @__PURE__ */ jsxs("div", { className: "absolute top-full mt-1 left-0 z-50 bg-card border rounded-xl shadow-2xl p-3 w-56", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setAno((a) => a - 1), className: "p-1 text-muted-foreground hover:text-foreground transition-colors", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 15 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: ano }),
        /* @__PURE__ */ jsx("button", { onClick: () => setAno((a) => a + 1), className: "p-1 text-muted-foreground hover:text-foreground transition-colors", children: /* @__PURE__ */ jsx(ChevronRight, { size: 15 }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-1", children: MESES_ABREV.map((m, i) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setMesSel(i);
            const ini = `${ano}-${String(i + 1).padStart(2, "0")}-01`;
            const fim = `${ano}-${String(i + 1).padStart(2, "0")}-${new Date(ano, i + 1, 0).getDate()}`;
            onAplicar(ini, fim);
            setAberto(false);
          },
          className: `py-2 rounded-lg text-xs font-medium transition-colors ${mesSel === i ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`,
          children: m
        },
        m
      )) })
    ] })
  ] });
}
function TabelaConta({ titulo, itens, total, cor, lancamentosPorConta }) {
  const [contaAberta, setContaAberta] = useState(null);
  const statusLabel = {
    PAGO: { label: "Pago", cor: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    PENDENTE: { label: "Pendente", cor: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    CANCELADO: { label: "Cancelado", cor: "bg-gray-100 text-gray-600 border-gray-200" }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "px-4 py-3 border-b", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold", children: titulo }) }),
    itens.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-center text-muted-foreground text-sm py-8", children: "Nenhum lançamento no período." }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "text-muted-foreground text-xs uppercase", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2", children: "Conta" }),
        /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-2", children: "Total" }),
        /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-2", children: "%" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y", children: [
        [...itens].sort((a, b) => b.total - a.total).map((item) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(
            "tr",
            {
              className: "hover:bg-muted/50 cursor-pointer",
              onClick: () => setContaAberta(contaAberta === item.plano_contas_id ? null : item.plano_contas_id),
              children: [
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-2.5 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-muted-foreground text-xs transition-transform ${contaAberta === item.plano_contas_id ? "rotate-90" : ""}`, children: "▶" }),
                  item.nome
                ] }),
                /* @__PURE__ */ jsx("td", { className: `px-4 py-2.5 text-right font-medium ${cor}`, children: formatBRL(item.total) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5 text-right text-muted-foreground", children: total > 0 ? `${(item.total / total * 100).toFixed(1)}%` : "—" })
              ]
            },
            item.plano_contas_id
          ),
          contaAberta === item.plano_contas_id && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, className: "px-0 py-0 bg-muted/30", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-muted-foreground uppercase border-b", children: [
              /* @__PURE__ */ jsx("th", { className: "text-left px-8 py-2", children: "Descrição" }),
              /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-2", children: "Cliente" }),
              /* @__PURE__ */ jsx("th", { className: "text-center px-4 py-2", children: "Status" }),
              /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-2", children: "Vencimento" }),
              /* @__PURE__ */ jsx("th", { className: "text-right px-4 py-2", children: "Valor" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y", children: (lancamentosPorConta[item.plano_contas_id] ?? []).map((l, i) => {
              const s = statusLabel[l.status] ?? { label: l.status, cor: "bg-gray-100 text-gray-600 border-gray-200" };
              const dt = new Date(l.dt_vencimento).toLocaleDateString("pt-BR", { timeZone: "UTC" });
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/20", children: [
                /* @__PURE__ */ jsx("td", { className: "px-8 py-2 text-muted-foreground", children: l.descricao }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-muted-foreground", children: l.beneficiario ?? "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-center", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-0.5 rounded-full border text-[10px] font-semibold ${s.cor}`, children: s.label }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 text-right text-muted-foreground", children: dt }),
                /* @__PURE__ */ jsx("td", { className: `px-4 py-2 text-right font-medium ${cor}`, children: formatBRL(l.valor) })
              ] }, i);
            }) })
          ] }) }) }, `${item.plano_contas_id}-detalhe`)
        ] })),
        /* @__PURE__ */ jsxs("tr", { className: "border-t-2 font-semibold", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5", children: "Total" }),
          /* @__PURE__ */ jsx("td", { className: `px-4 py-2.5 text-right ${cor}`, children: formatBRL(total) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-2.5 text-right text-muted-foreground", children: "100%" })
        ] })
      ] })
    ] })
  ] });
}
function ContratosEncerrando({ contratos }) {
  function faixa(dias) {
    if (dias <= 30) return { bg: "bg-red-50", badge: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" };
    if (dias <= 60) return { bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" };
    return { bg: "bg-yellow-50", badge: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" };
  }
  return /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-orange-500 animate-pulse" }),
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold", children: "Contratos Encerrando em até 90 dias" }),
      /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs bg-muted border rounded-full px-2 py-0.5 text-muted-foreground", children: contratos.length })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "divide-y", children: contratos.map((c) => {
      const f = faixa(c.dias_restantes);
      const dtFormatada = (/* @__PURE__ */ new Date(c.dt_ultima_parcela + "T12:00:00")).toLocaleDateString("pt-BR");
      return /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between px-4 py-3 ${f.bg}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full shrink-0 ${f.dot}` }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: c.descricao || "(sem descrição)" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Última parcela: ",
              dtFormatada,
              " · ",
              c.parcelas_restantes,
              "/",
              c.total_parcelas,
              " parcelas restantes"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "shrink-0 ml-4", children: /* @__PURE__ */ jsx("span", { className: `text-xs font-bold px-2.5 py-1 rounded-full border ${f.badge}`, children: c.dias_restantes === 0 ? "Vence hoje" : `${c.dias_restantes} dias` }) })
      ] }, c.id);
    }) })
  ] });
}
function BalanceteView({ balancete: inicial, dataInicio, dataFim, onNavegar }) {
  const [balancete, setBalancete] = useState(inicial);
  const [modo, setModo] = useState("mes");
  const [anoSel, setAnoSel] = useState((/* @__PURE__ */ new Date()).getFullYear());
  const [periodoIni, setPeriodoIni] = useState(dataInicio);
  const [periodoFim, setPeriodoFim] = useState(dataFim);
  const [tipoGrafico, setTipoGrafico] = useState("barra");
  useEffect(() => {
    setBalancete(inicial);
  }, [inicial]);
  function navegar(ini, fim) {
    onNavegar(ini, fim);
  }
  function aplicarAno(ano) {
    setAnoSel(ano);
    navegar(`${ano}-01-01`, `${ano}-12-31`);
  }
  if (!balancete) {
    return /* @__PURE__ */ jsx("p", { className: "text-center text-muted-foreground py-12", children: "Erro ao carregar balancete." });
  }
  const b = balancete;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex rounded-lg border overflow-hidden", children: ["mes", "ano", "periodo"].map((m) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setModo(m);
            if (m === "ano") aplicarAno(anoSel);
          },
          className: `px-4 py-2 text-xs font-medium transition-colors ${modo === m ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted"}`,
          children: m === "mes" ? "Mês" : m === "ano" ? "Ano" : "Período"
        },
        m
      )) }),
      modo === "mes" && /* @__PURE__ */ jsx(SeletorMesBalancete, { onAplicar: navegar }),
      modo === "ano" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-background border rounded-lg overflow-hidden", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => aplicarAno(anoSel - 1), className: "px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 15 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold px-2 min-w-[3rem] text-center", children: anoSel }),
        /* @__PURE__ */ jsx("button", { onClick: () => aplicarAno(anoSel + 1), className: "px-2 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors", children: /* @__PURE__ */ jsx(ChevronRight, { size: 15 }) })
      ] }),
      modo === "periodo" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("input", { type: "date", value: periodoIni, onChange: (e) => setPeriodoIni(e.target.value), className: "bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: "até" }),
        /* @__PURE__ */ jsx("input", { type: "date", value: periodoFim, onChange: (e) => setPeriodoFim(e.target.value), className: "bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" }),
        /* @__PURE__ */ jsx(Button, { onClick: () => navegar(periodoIni, periodoFim), children: "Aplicar" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(CardResumo, { label: "Caixa", valor: Math.abs(b.caixa), cor: b.caixa >= 0 ? "text-emerald-600" : "text-red-600" }),
      /* @__PURE__ */ jsx(CardResumo, { label: "Receitas Recebidas", valor: b.receitas_pagas, cor: "text-emerald-600" }),
      /* @__PURE__ */ jsx(CardResumo, { label: "Despesas Pagas", valor: b.despesas_pagas, cor: "text-red-600" }),
      /* @__PURE__ */ jsx(CardResumo, { label: "A Receber", valor: b.a_receber, cor: "text-yellow-600" }),
      /* @__PURE__ */ jsx(CardResumo, { label: "A Pagar", valor: b.a_pagar, cor: "text-orange-600" }),
      /* @__PURE__ */ jsx(CardResumo, { label: "Resultado do Período", valor: Math.abs(b.resultado_periodo), cor: b.resultado_periodo >= 0 ? "text-emerald-600" : "text-red-600" })
    ] }),
    b.dados_mensais.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold", children: tipoGrafico === "pizza" ? "Distribuição do Período" : "Receitas × Despesas × Resultado por Mês" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: ["barra", "linha", "pizza"].map((t) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setTipoGrafico(t),
            className: `px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${tipoGrafico === t ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground hover:text-foreground"}`,
            children: t === "barra" ? "Barra" : t === "linha" ? "Linha" : "Pizza"
          },
          t
        )) })
      ] }),
      tipoGrafico === "barra" && /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(BarChart, { data: b.dados_mensais, margin: { top: 5, right: 10, left: 10, bottom: 5 }, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "mes", tick: { fontSize: 12 } }),
        /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11 }, tickFormatter: (v) => `R$${(v / 1e3).toFixed(1)}k` }),
        /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(TooltipCustom, {}) }),
        /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: 12 } }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "receitas", name: "Receitas", fill: "#10b981", radius: [4, 4, 0, 0] }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "despesas", name: "Despesas", fill: "#ef4444", radius: [4, 4, 0, 0] }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "resultado", name: "Resultado", fill: "#6366f1", radius: [4, 4, 0, 0] })
      ] }) }),
      tipoGrafico === "linha" && /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(LineChart, { data: b.dados_mensais, margin: { top: 5, right: 10, left: 10, bottom: 5 }, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "mes", tick: { fontSize: 12 } }),
        /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 11 }, tickFormatter: (v) => `R$${(v / 1e3).toFixed(1)}k` }),
        /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(TooltipCustom, {}) }),
        /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: 12 } }),
        /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "receitas", name: "Receitas", stroke: "#10b981", strokeWidth: 2, dot: { r: 4 } }),
        /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "despesas", name: "Despesas", stroke: "#ef4444", strokeWidth: 2, dot: { r: 4 } }),
        /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "resultado", name: "Resultado", stroke: "#6366f1", strokeWidth: 2, dot: { r: 4 } })
      ] }) }),
      tipoGrafico === "pizza" && (() => {
        const dadosPizza = [
          { name: "Receitas", value: b.receitas_pagas, color: "#10b981" },
          { name: "Despesas", value: b.despesas_pagas, color: "#ef4444" },
          ...b.resultado_periodo > 0 ? [{ name: "Resultado", value: b.resultado_periodo, color: "#6366f1" }] : []
        ].filter((d) => d.value > 0);
        const total = dadosPizza.reduce((s, d) => s + d.value, 0);
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsx(ResponsiveContainer, { width: "60%", height: 260, children: /* @__PURE__ */ jsxs(PieChart, { children: [
            /* @__PURE__ */ jsx(Pie, { data: dadosPizza, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 100, innerRadius: 50, children: dadosPizza.map((d, i) => /* @__PURE__ */ jsx(Cell, { fill: d.color }, i)) }),
            /* @__PURE__ */ jsx(Tooltip, { formatter: (v) => formatBRL(Number(v)) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 flex-1", children: dadosPizza.map((d) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full flex-shrink-0", style: { backgroundColor: d.color } }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: d.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", style: { color: d.color }, children: formatBRL(d.value) }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                total > 0 ? (d.value / total * 100).toFixed(1) : 0,
                "%"
              ] })
            ] })
          ] }, d.name)) })
        ] });
      })()
    ] }),
    b.contratos_encerrando.length > 0 && /* @__PURE__ */ jsx(ContratosEncerrando, { contratos: b.contratos_encerrando }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(TabelaConta, { titulo: "Receitas por Conta", itens: b.receitas_por_conta, total: b.receitas_pagas, cor: "text-emerald-600", lancamentosPorConta: b.lancamentos_por_conta }),
      /* @__PURE__ */ jsx(TabelaConta, { titulo: "Despesas por Conta", itens: b.despesas_por_conta, total: b.despesas_pagas, cor: "text-red-600", lancamentosPorConta: b.lancamentos_por_conta })
    ] })
  ] });
}
function BalancetePage() {
  const {
    user
  } = useAuth();
  const [balancete, setBalancete] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const hoje = /* @__PURE__ */ new Date();
  const inicio = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
  const fim = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate()}`;
  async function carregarBalancete(dataInicio, dataFim) {
    setCarregando(true);
    const [{
      data: noPeriodo
    }, {
      data: todosPagos
    }] = await Promise.all([supabase.from("lancamento_financeiro").select("*, plano_contas(id, nome)").neq("status", "CANCELADO").gte("dt_vencimento", `${dataInicio}T00:00:00.000Z`).lte("dt_vencimento", `${dataFim}T23:59:59.999Z`), supabase.from("lancamento_financeiro").select("tipo, valor").eq("status", "PAGO")]);
    const lancamentos = noPeriodo ?? [];
    const pagos = todosPagos ?? [];
    const receitas_pagas = lancamentos.filter((l) => l.tipo === "RECEITA" && l.status === "PAGO").reduce((s, l) => s + Number(l.valor), 0);
    const despesas_pagas = lancamentos.filter((l) => l.tipo === "DESPESA" && l.status === "PAGO").reduce((s, l) => s + Number(l.valor), 0);
    const resultado_periodo = receitas_pagas - despesas_pagas;
    const caixaReceitas = pagos.filter((l) => l.tipo === "RECEITA").reduce((s, l) => s + Number(l.valor), 0);
    const caixaDespesas = pagos.filter((l) => l.tipo === "DESPESA").reduce((s, l) => s + Number(l.valor), 0);
    const caixa = caixaReceitas - caixaDespesas;
    const a_receber = lancamentos.filter((l) => l.tipo === "RECEITA" && l.status === "PENDENTE").reduce((s, l) => s + Number(l.valor), 0);
    const a_pagar = lancamentos.filter((l) => l.tipo === "DESPESA" && l.status === "PENDENTE").reduce((s, l) => s + Number(l.valor), 0);
    const receitasPorConta = /* @__PURE__ */ new Map();
    const despesasPorConta = /* @__PURE__ */ new Map();
    const lancamentosPorConta = {};
    for (const l of lancamentos) {
      const pc = l.plano_contas;
      if (!pc) continue;
      if (!lancamentosPorConta[l.plano_contas_id]) lancamentosPorConta[l.plano_contas_id] = [];
      lancamentosPorConta[l.plano_contas_id].push({
        descricao: l.descricao,
        beneficiario: l.beneficiario ?? null,
        valor: Number(l.valor),
        status: l.status,
        dt_vencimento: l.dt_vencimento
      });
      if (l.status !== "PAGO") continue;
      const mapa = l.tipo === "RECEITA" ? receitasPorConta : despesasPorConta;
      const atual = mapa.get(l.plano_contas_id) ?? {
        nome: pc.nome,
        total: 0
      };
      mapa.set(l.plano_contas_id, {
        nome: pc.nome,
        total: atual.total + Number(l.valor)
      });
    }
    const mesesPtBR = {
      "01": "Jan",
      "02": "Fev",
      "03": "Mar",
      "04": "Abr",
      "05": "Mai",
      "06": "Jun",
      "07": "Jul",
      "08": "Ago",
      "09": "Set",
      "10": "Out",
      "11": "Nov",
      "12": "Dez"
    };
    const mesesMap = /* @__PURE__ */ new Map();
    for (const l of lancamentos) {
      if (l.status !== "PAGO") continue;
      const dt = new Date(l.dt_vencimento);
      const chave = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}`;
      const atual = mesesMap.get(chave) ?? {
        receitas: 0,
        despesas: 0
      };
      if (l.tipo === "RECEITA") atual.receitas += Number(l.valor);
      else atual.despesas += Number(l.valor);
      mesesMap.set(chave, atual);
    }
    const dados_mensais = Array.from(mesesMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([chave, v]) => {
      const [ano, mes] = chave.split("-");
      return {
        mes: `${mesesPtBR[mes]}/${ano.slice(2)}`,
        receitas: v.receitas,
        despesas: v.despesas,
        resultado: v.receitas - v.despesas
      };
    });
    const hojeD = /* @__PURE__ */ new Date();
    hojeD.setHours(0, 0, 0, 0);
    const {
      data: parcelasReceita
    } = await supabase.from("lancamento_financeiro").select("id, descricao, valor, dt_vencimento, numero_parcelas, parcela_atual, grupo_parcela_id, status").eq("tipo", "RECEITA").not("grupo_parcela_id", "is", null).in("status", ["PENDENTE", "PAGO"]);
    const gruposMap = /* @__PURE__ */ new Map();
    for (const p of parcelasReceita ?? []) {
      if (!p.grupo_parcela_id) continue;
      const arr = gruposMap.get(p.grupo_parcela_id) ?? [];
      arr.push(p);
      gruposMap.set(p.grupo_parcela_id, arr);
    }
    const contratos_encerrando = [];
    for (const [, parcelas] of gruposMap) {
      if (!parcelas || parcelas.length === 0) continue;
      const pendentes = parcelas.filter((p) => p.status === "PENDENTE");
      if (pendentes.length === 0) continue;
      const ultima = pendentes.sort((a, b) => new Date(b.dt_vencimento).getTime() - new Date(a.dt_vencimento).getTime())[0];
      const dtUltima = new Date(ultima.dt_vencimento);
      const diasRestantes = Math.ceil((dtUltima.getTime() - hojeD.getTime()) / (1e3 * 60 * 60 * 24));
      if (diasRestantes >= 0 && diasRestantes <= 90) {
        contratos_encerrando.push({
          id: ultima.id,
          descricao: ultima.descricao,
          valor: Number(ultima.valor),
          dt_ultima_parcela: ultima.dt_vencimento,
          dias_restantes: diasRestantes,
          parcelas_restantes: pendentes.length,
          total_parcelas: ultima.numero_parcelas ?? parcelas.length
        });
      }
    }
    setBalancete({
      receitas_pagas,
      despesas_pagas,
      resultado_periodo,
      caixa,
      a_receber,
      a_pagar,
      receitas_por_conta: Array.from(receitasPorConta.entries()).map(([plano_contas_id, v]) => ({
        plano_contas_id,
        ...v
      })),
      despesas_por_conta: Array.from(despesasPorConta.entries()).map(([plano_contas_id, v]) => ({
        plano_contas_id,
        ...v
      })),
      lancamentos_por_conta: lancamentosPorConta,
      dados_mensais,
      contratos_encerrando
    });
    setCarregando(false);
  }
  useEffect(() => {
    if (!user) return;
    carregarBalancete(inicio, fim);
  }, [user]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Balancete" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Resumo financeiro do período selecionado." })
    ] }),
    carregando ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Carregando..." }) : /* @__PURE__ */ jsx(BalanceteView, { balancete, dataInicio: inicio, dataFim: fim, onNavegar: carregarBalancete })
  ] });
}
export {
  BalancetePage as component
};
