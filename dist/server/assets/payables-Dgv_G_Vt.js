import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useAuth, s as supabase } from "./router-DGcmqzPd.js";
import { L as LancamentosView } from "./lancamentos-view-Cp2LRALb.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "sonner";
import "@supabase/supabase-js";
import "lucide-react";
import "./button-Cz8PAkJh.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "./input-DVeAuAgX.js";
import "./format-BvmwmcSR.js";
import "./table-DqYRHhQ4.js";
import "./financeiro.functions-_bh1PwmI.js";
import "./label-DOAnQvhy.js";
import "@radix-ui/react-label";
function ContasAPagarPage() {
  const {
    user
  } = useAuth();
  const [lancamentos, setLancamentos] = useState([]);
  const [planoContas, setPlanoContas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    if (!user) return;
    const hoje = /* @__PURE__ */ new Date();
    const inicio = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
    const fim = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate()}`;
    Promise.all([supabase.from("lancamento_financeiro").select("*, plano_contas(*), anexos:anexo_financeiro(*)").eq("tipo", "DESPESA").gte("dt_vencimento", `${inicio}T00:00:00.000Z`).lte("dt_vencimento", `${fim}T23:59:59.999Z`).order("dt_vencimento", {
      ascending: true
    }), supabase.from("plano_contas").select("*").eq("tipo", "DESPESA").eq("ativo", true).order("nome")]).then(([{
      data: l
    }, {
      data: p
    }]) => {
      setLancamentos(l ?? []);
      setPlanoContas(p ?? []);
      setCarregando(false);
    });
  }, [user]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Contas a Pagar" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Gerencie suas despesas e obrigações financeiras." })
    ] }),
    carregando ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Carregando..." }) : /* @__PURE__ */ jsx(LancamentosView, { lancamentos, planoContas, tipo: "DESPESA" })
  ] });
}
export {
  ContasAPagarPage as component
};
