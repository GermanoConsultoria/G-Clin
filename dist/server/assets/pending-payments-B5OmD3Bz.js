import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useCallback, useEffect, useMemo } from "react";
import { AlertCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { C as Card, f as formatBRL } from "./format-BvmwmcSR.js";
import { B as Button } from "./button-Cz8PAkJh.js";
import { I as Input } from "./input-DVeAuAgX.js";
import { u as useAuth, s as supabase } from "./router-CBWW-jsc.js";
import { p as pagarLancamento } from "./financeiro.functions-BFmgeAUj.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@supabase/supabase-js";
function diasEmAberto(dtVencimento) {
  const venc = new Date(dtVencimento);
  venc.setHours(0, 0, 0, 0);
  const hoje = /* @__PURE__ */ new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.floor((hoje.getTime() - venc.getTime()) / (1e3 * 60 * 60 * 24));
}
function PendingPaymentsPage() {
  const {
    user
  } = useAuth();
  const [lancamentos, setLancamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalPagar, setModalPagar] = useState(null);
  const [dtPagamento, setDtPagamento] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");
  const [salvando, setSalvando] = useState(false);
  const carregar = useCallback(async () => {
    setCarregando(true);
    const {
      data,
      error
    } = await supabase.from("lancamento_financeiro").select("id, beneficiario, descricao, valor, dt_vencimento").eq("tipo", "RECEITA").eq("status", "PENDENTE").order("dt_vencimento", {
      ascending: true
    });
    if (error) toast.error(error.message);
    setLancamentos(data ?? []);
    setCarregando(false);
  }, []);
  useEffect(() => {
    if (user) carregar();
  }, [user, carregar]);
  const totalPendente = useMemo(() => lancamentos.reduce((s, l) => s + Number(l.valor), 0), [lancamentos]);
  const clientesUnicos = useMemo(() => new Set(lancamentos.map((l) => l.beneficiario ?? l.descricao)).size, [lancamentos]);
  const handleRegistrar = async () => {
    if (!modalPagar) return;
    setSalvando(true);
    try {
      await pagarLancamento({
        id: modalPagar,
        dt_pagamento: dtPagamento,
        forma_pagamento: formaPagamento
      });
      toast.success("Recebimento registrado com sucesso!");
      setModalPagar(null);
      carregar();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSalvando(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Pagamentos Pendentes" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Clientes com pagamentos em aberto." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-orange-100", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-orange-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Total Pendente" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-orange-600", children: formatBRL(totalPendente) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-yellow-100", children: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-yellow-600" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Clientes com Pendência" }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-yellow-600", children: clientesUnicos })
        ] })
      ] })
    ] }),
    carregando ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Carregando..." }) : lancamentos.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed bg-card p-12 text-center", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsx("h3", { className: "mt-4 font-display text-lg font-semibold", children: "Nenhum pagamento pendente" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Todos os lançamentos de receita estão em dia." })
    ] }) : /* @__PURE__ */ jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "border-b text-xs text-muted-foreground uppercase tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Cliente" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Procedimento" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Valor" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Vencimento" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: "Dias em aberto" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y", children: lancamentos.map((l) => {
        const dias = diasEmAberto(l.dt_vencimento);
        const dtFmt = new Date(l.dt_vencimento).toLocaleDateString("pt-BR", {
          timeZone: "UTC"
        });
        const corDias = dias > 30 ? "text-red-600 font-semibold" : dias > 7 ? "text-orange-600 font-medium" : "text-yellow-600";
        return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/30", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium", children: l.beneficiario ?? "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted-foreground", children: l.descricao }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right font-semibold text-orange-600", children: formatBRL(Number(l.valor)) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center text-muted-foreground", children: dtFmt }),
          /* @__PURE__ */ jsx("td", { className: `px-4 py-3 text-center ${corDias}`, children: dias <= 0 ? "Hoje" : `${dias} dia${dias !== 1 ? "s" : ""}` }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-500 text-white", onClick: () => {
            setModalPagar(l.id);
            setDtPagamento((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
            setFormaPagamento("DINHEIRO");
          }, children: "Registrar Recebimento" }) })
        ] }, l.id);
      }) })
    ] }) }) }),
    modalPagar && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60", children: /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: "Registrar Recebimento" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Data do Recebimento" }),
          /* @__PURE__ */ jsx(Input, { type: "date", value: dtPagamento, onChange: (e) => setDtPagamento(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Forma de Pagamento" }),
          /* @__PURE__ */ jsxs("select", { value: formaPagamento, onChange: (e) => setFormaPagamento(e.target.value), className: "w-full border rounded-md px-3 py-2 text-sm bg-background", children: [
            /* @__PURE__ */ jsx("option", { value: "DINHEIRO", children: "Dinheiro" }),
            /* @__PURE__ */ jsx("option", { value: "PIX", children: "PIX" }),
            /* @__PURE__ */ jsx("option", { value: "CARTAO_CREDITO", children: "Cartão de Crédito" }),
            /* @__PURE__ */ jsx("option", { value: "CARTAO_DEBITO", children: "Cartão de Débito" }),
            /* @__PURE__ */ jsx("option", { value: "CONVENIO", children: "Convênio" }),
            /* @__PURE__ */ jsx("option", { value: "OUTRO", children: "Outro" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", className: "flex-1", onClick: () => setModalPagar(null), children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { className: "flex-1 bg-emerald-600 hover:bg-emerald-500 text-white", onClick: handleRegistrar, disabled: salvando, children: salvando ? "Salvando..." : "Confirmar" })
      ] })
    ] }) })
  ] });
}
export {
  PendingPaymentsPage as component
};
