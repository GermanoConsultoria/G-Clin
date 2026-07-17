import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { X, Search, Plus, CheckCircle, XCircle, Trash2, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { B as Button } from "./button-Cz8PAkJh.js";
import { I as Input } from "./input-DVeAuAgX.js";
import { C as Card, f as formatBRL } from "./format-BvmwmcSR.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DqYRHhQ4.js";
import { e as editarLancamento, c as criarLancamento, p as pagarLancamento, a as cancelarLancamento, b as excluirLancamento, d as excluirGrupoParcelas, f as excluirEAvancarRecorrencia } from "./financeiro.functions-BFmgeAUj.js";
import { s as supabase } from "./router-CBWW-jsc.js";
import { L as Label } from "./label-DOAnQvhy.js";
function formatarMoeda(centavos) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
function ModalLancamento({
  tipo,
  planoContas,
  lancamento,
  onClose,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [aplicarATodos, setAplicarATodos] = useState(false);
  const [parcelas, setParcelas] = useState(lancamento?.numero_parcelas ?? 1);
  const [parcelasInput, setParcelasInput] = useState(
    String(lancamento?.numero_parcelas ?? 1)
  );
  const [recorrencia, setRecorrencia] = useState(
    lancamento?.recorrencia ?? "NAO"
  );
  const [valorCentavos, setValorCentavos] = useState(
    lancamento ? Math.round(Number(lancamento.valor) * 100) : 0
  );
  const [valorDisplay, setValorDisplay] = useState(
    lancamento ? formatarMoeda(Math.round(Number(lancamento.valor) * 100)) : ""
  );
  const [descricao, setDescricao] = useState(lancamento?.descricao ?? "");
  const [beneficiario, setBeneficiario] = useState(
    lancamento?.beneficiario ?? ""
  );
  const [dtVencimento, setDtVencimento] = useState(
    lancamento ? new Date(lancamento.dt_vencimento).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  const [numeroDocumento, setNumeroDocumento] = useState(
    lancamento?.numero_documento ?? ""
  );
  const [planoContasId, setPlanoContasId] = useState(
    lancamento?.plano_contas_id ?? ""
  );
  function handleValorChange(e) {
    const apenasDigitos = e.target.value.replace(/\D/g, "");
    const centavos = parseInt(apenasDigitos || "0", 10);
    setValorCentavos(centavos);
    setValorDisplay(centavos > 0 ? formatarMoeda(centavos) : "");
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!descricao.trim()) return toast.error("Descrição é obrigatória.");
    if (valorCentavos <= 0) return toast.error("Valor inválido.");
    if (!planoContasId) return toast.error("Categoria é obrigatória.");
    setLoading(true);
    try {
      if (lancamento) {
        await editarLancamento({
          id: lancamento.id,
          descricao: descricao.trim(),
          beneficiario: beneficiario.trim() || null,
          valor: valorCentavos / 100,
          dt_vencimento: dtVencimento,
          numero_documento: numeroDocumento.trim() || null,
          plano_contas_id: planoContasId,
          aplicar_a_todos: aplicarATodos
        });
        toast.success("Lançamento atualizado.");
      } else {
        await criarLancamento({
          tipo,
          descricao: descricao.trim(),
          beneficiario: beneficiario.trim() || null,
          valor: valorCentavos / 100,
          dt_vencimento: dtVencimento,
          numero_documento: numeroDocumento.trim() || null,
          plano_contas_id: planoContasId,
          recorrencia,
          numero_parcelas: parcelas
        });
        toast.success("Lançamento criado.");
      }
      onClose();
      onSuccess();
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setLoading(false);
    }
  }
  const labelTipo = tipo === "DESPESA" ? "Despesa" : "Receita";
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 border-b sticky top-0 bg-card", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold", children: [
        lancamento ? "Editar" : "Nova",
        " ",
        labelTipo
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "p-1 text-muted-foreground hover:text-foreground transition-colors",
          children: /* @__PURE__ */ jsx(X, { size: 20 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Descrição *" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            value: descricao,
            onChange: (e) => setDescricao(e.target.value),
            placeholder: tipo === "DESPESA" ? "Ex: Aluguel do consultório" : "Ex: Consulta particular",
            autoFocus: true
          }
        )
      ] }),
      tipo === "DESPESA" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { children: "Beneficiário" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            value: beneficiario,
            onChange: (e) => setBeneficiario(e.target.value),
            placeholder: "Ex: Fornecedor XYZ"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Valor *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              inputMode: "numeric",
              value: valorDisplay,
              onChange: handleValorChange,
              placeholder: "R$ 0,00"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Vencimento *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "date",
              value: dtVencimento,
              onChange: (e) => setDtVencimento(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Nº do Documento" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              value: numeroDocumento,
              onChange: (e) => setNumeroDocumento(e.target.value),
              placeholder: "Ex: NF-001"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Categoria *" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: planoContasId,
              onChange: (e) => setPlanoContasId(e.target.value),
              className: "w-full mt-1 border rounded-md px-3 py-2 text-sm bg-background",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecione..." }),
                planoContas.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.nome }, c.id))
              ]
            }
          )
        ] })
      ] }),
      !lancamento && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Recorrência" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: recorrencia,
                onChange: (e) => {
                  setRecorrencia(e.target.value);
                  if (e.target.value !== "NAO") setParcelas(1);
                },
                className: "w-full mt-1 border rounded-md px-3 py-2 text-sm bg-background",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "NAO", children: "Sem recorrência" }),
                  /* @__PURE__ */ jsx("option", { value: "DIARIAMENTE", children: "Diária" }),
                  /* @__PURE__ */ jsx("option", { value: "SEMANALMENTE", children: "Semanal" }),
                  /* @__PURE__ */ jsx("option", { value: "MENSALMENTE", children: "Mensal" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { children: [
              "Nº de Parcelas",
              parcelas > 1 && /* @__PURE__ */ jsxs("span", { className: "ml-1 text-primary text-xs", children: [
                "(gera ",
                parcelas,
                "x)"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 120,
                value: parcelasInput,
                disabled: recorrencia !== "NAO",
                onChange: (e) => {
                  setParcelasInput(e.target.value);
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v > 0) {
                    setParcelas(v);
                    if (v > 1) setRecorrencia("NAO");
                  }
                },
                onBlur: () => {
                  const v = parseInt(parcelasInput);
                  const final = isNaN(v) || v < 1 ? 1 : Math.min(v, 120);
                  setParcelas(final);
                  setParcelasInput(String(final));
                }
              }
            )
          ] })
        ] }),
        recorrencia !== "NAO" && /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2", children: "A cada pagamento, o próximo lançamento será criado automaticamente." }),
        recorrencia === "NAO" && parcelas > 1 && /* @__PURE__ */ jsxs("p", { className: "text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-2", children: [
          "Serão criados ",
          parcelas,
          " lançamentos com vencimentos mensais."
        ] })
      ] }),
      lancamento?.grupo_parcela_id && /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer select-none", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: aplicarATodos,
            onChange: (e) => setAplicarATodos(e.target.checked),
            className: "w-4 h-4 rounded"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
          "Aplicar alterações a todas as ",
          lancamento.numero_parcelas,
          "x parcelas do grupo"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: onClose, className: "flex-1", children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: loading,
            className: `flex-1 text-white ${tipo === "DESPESA" ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"}`,
            children: loading ? "Salvando..." : lancamento ? "Salvar Alterações" : `Criar ${labelTipo}`
          }
        )
      ] })
    ] })
  ] }) });
}
const STATUS_LABEL = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  CANCELADO: "Cancelado"
};
const STATUS_COR = {
  PENDENTE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAGO: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CANCELADO: "bg-gray-100 text-gray-600 border-gray-200"
};
const MESES_ABREV = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const FORMA_PAGAMENTO_LABEL = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  CARTAO_CREDITO: "Cartão Créd.",
  CARTAO_DEBITO: "Cartão Déb.",
  CONVENIO: "Convênio",
  OUTRO: "Outro"
};
function SeletorMes({ value, onChange }) {
  const [aberto, setAberto] = useState(false);
  const [ano, setAno] = useState(
    () => value === "TODOS" ? (/* @__PURE__ */ new Date()).getFullYear() : Number(value.split("-")[0])
  );
  const ref = useRef(null);
  useEffect(() => {
    if (value !== "TODOS") setAno(Number(value.split("-")[0]));
  }, [value]);
  useEffect(() => {
    function fechar(e) {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false);
    }
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, []);
  const label = value === "TODOS" ? "Todos os meses" : new Date(Number(value.split("-")[0]), Number(value.split("-")[1]) - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return /* @__PURE__ */ jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setAberto((v) => !v),
        className: "bg-background border rounded-lg px-3 py-2 text-sm flex items-center gap-2 whitespace-nowrap",
        children: [
          /* @__PURE__ */ jsx("span", { className: "capitalize", children: label }),
          /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: "text-muted-foreground" })
        ]
      }
    ),
    aberto && /* @__PURE__ */ jsxs("div", { className: "absolute top-full mt-1 left-0 z-50 bg-card border rounded-xl shadow-2xl p-3 w-56", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setAno((a) => a - 1), className: "p-1 text-muted-foreground hover:text-foreground rounded", children: /* @__PURE__ */ jsx(ChevronLeft, { size: 15 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: ano }),
        /* @__PURE__ */ jsx("button", { onClick: () => setAno((a) => a + 1), className: "p-1 text-muted-foreground hover:text-foreground rounded", children: /* @__PURE__ */ jsx(ChevronRight, { size: 15 }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-1", children: MESES_ABREV.map((m, i) => {
        const val = `${ano}-${String(i + 1).padStart(2, "0")}`;
        const ativo = value === val;
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              onChange(val);
              setAberto(false);
            },
            className: `py-2 rounded-lg text-xs font-medium transition-colors ${ativo ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`,
            children: m
          },
          m
        );
      }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            onChange("TODOS");
            setAberto(false);
          },
          className: `mt-2 w-full py-1.5 rounded-lg text-xs transition-colors ${value === "TODOS" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`,
          children: "Todos os meses"
        }
      )
    ] })
  ] });
}
function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}
function LancamentosView({ lancamentos: inicial, planoContas, tipo }) {
  const [lancamentos, setLancamentos] = useState(inicial);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalPagar, setModalPagar] = useState(null);
  const [dtPagamento, setDtPagamento] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [formaPagamento, setFormaPagamento] = useState("DINHEIRO");
  const [modalExcluirRecorrente, setModalExcluirRecorrente] = useState(null);
  const [modalExcluirGrupo, setModalExcluirGrupo] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS");
  const [filtroMes, setFiltroMes] = useState(() => {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const montado = useRef(false);
  const recarregar = useCallback(async () => {
    try {
      let query = supabase.from("lancamento_financeiro").select("*, plano_contas(*), anexos:anexo_financeiro(*)").eq("tipo", tipo).order("dt_vencimento", { ascending: true });
      if (filtroStatus !== "TODOS") query = query.eq("status", filtroStatus);
      if (filtroCategoria !== "TODAS") query = query.eq("plano_contas_id", filtroCategoria);
      if (filtroMes !== "TODOS") {
        const [ano, mes] = filtroMes.split("-");
        const ultimo = new Date(Number(ano), Number(mes), 0).getDate();
        query = query.gte("dt_vencimento", `${ano}-${mes}-01T00:00:00.000Z`).lte("dt_vencimento", `${ano}-${mes}-${String(ultimo).padStart(2, "0")}T23:59:59.999Z`);
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      setLancamentos(data ?? []);
    } catch {
      toast.error("Erro ao carregar lançamentos.");
    }
  }, [tipo, filtroMes, filtroStatus, filtroCategoria]);
  useEffect(() => {
    if (!montado.current) {
      montado.current = true;
      return;
    }
    recarregar();
  }, [recarregar]);
  const lancamentosFiltrados = useMemo(() => {
    if (!busca) return lancamentos;
    const q = busca.toLowerCase();
    return lancamentos.filter(
      (l) => l.descricao.toLowerCase().includes(q) || (l.beneficiario ?? "").toLowerCase().includes(q)
    );
  }, [lancamentos, busca]);
  const totalPendente = lancamentosFiltrados.filter((l) => l.status === "PENDENTE").reduce((s, l) => s + Number(l.valor), 0);
  const totalPago = lancamentosFiltrados.filter((l) => l.status === "PAGO").reduce((s, l) => s + Number(l.valor), 0);
  const hoje = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  function isVencido(l) {
    return l.status === "PENDENTE" && new Date(l.dt_vencimento) < new Date(hoje);
  }
  const pagarMut = useMutation({
    mutationFn: async () => {
      if (!modalPagar) return;
      await pagarLancamento({ id: modalPagar, dt_pagamento: dtPagamento, forma_pagamento: formaPagamento });
      const isRecorrente = lancamentos.find((l) => l.id === modalPagar)?.recorrencia !== "NAO";
      if (isRecorrente) {
        await recarregar();
      } else {
        setLancamentos(
          (prev) => prev.map((l) => l.id === modalPagar ? { ...l, status: "PAGO", dt_pagamento: dtPagamento, forma_pagamento: formaPagamento } : l)
        );
      }
      toast.success("Lançamento marcado como pago.");
      setModalPagar(null);
    },
    onError: (e) => toast.error(e.message)
  });
  const cancelarMut = useMutation({
    mutationFn: async (id) => {
      if (!confirm("Cancelar este lançamento?")) return;
      await cancelarLancamento({ id });
      setLancamentos((prev) => prev.map((l) => l.id === id ? { ...l, status: "CANCELADO" } : l));
      toast.success("Lançamento cancelado.");
    },
    onError: (e) => toast.error(e.message)
  });
  async function handleExcluir(l) {
    if (l.grupo_parcela_id) {
      setModalExcluirGrupo(l);
      return;
    }
    if (l.recorrencia !== "NAO") {
      setModalExcluirRecorrente(l.id);
      return;
    }
    if (!confirm("Excluir este lançamento permanentemente?")) return;
    try {
      await excluirLancamento({ id: l.id });
      setLancamentos((prev) => prev.filter((x) => x.id !== l.id));
      toast.success("Lançamento excluído.");
    } catch (e) {
      toast.error(e.message);
    }
  }
  const corPrincipal = tipo === "DESPESA" ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500";
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Pendente" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-yellow-600 mt-1", children: formatBRL(totalPendente) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: tipo === "DESPESA" ? "Pago" : "Recebido" }),
        /* @__PURE__ */ jsx("p", { className: `text-2xl font-bold mt-1 ${tipo === "DESPESA" ? "text-red-600" : "text-emerald-600"}`, children: formatBRL(totalPago) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx(Input, { value: busca, onChange: (e) => setBusca(e.target.value), placeholder: "Buscar por descrição ou beneficiário...", className: "pl-9" })
      ] }),
      /* @__PURE__ */ jsxs("select", { value: filtroCategoria, onChange: (e) => setFiltroCategoria(e.target.value), className: "border rounded-lg px-3 py-2 text-sm bg-background", children: [
        /* @__PURE__ */ jsx("option", { value: "TODAS", children: "Todas as categorias" }),
        planoContas.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.nome }, c.id))
      ] }),
      /* @__PURE__ */ jsx(SeletorMes, { value: filtroMes, onChange: setFiltroMes }),
      /* @__PURE__ */ jsxs("select", { value: filtroStatus, onChange: (e) => setFiltroStatus(e.target.value), className: "border rounded-lg px-3 py-2 text-sm bg-background", children: [
        /* @__PURE__ */ jsx("option", { value: "TODOS", children: "Todos" }),
        /* @__PURE__ */ jsx("option", { value: "PENDENTE", children: "Pendente" }),
        /* @__PURE__ */ jsx("option", { value: "PAGO", children: tipo === "DESPESA" ? "Pago" : "Recebido" }),
        /* @__PURE__ */ jsx("option", { value: "CANCELADO", children: "Cancelado" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: `${corPrincipal} text-white flex-shrink-0`, onClick: () => {
        setEditando(null);
        setShowModal(true);
      }, children: [
        /* @__PURE__ */ jsx(Plus, { size: 16, className: "mr-1" }),
        " ",
        tipo === "DESPESA" ? "Nova Despesa" : "Nova Receita"
      ] })
    ] }),
    lancamentosFiltrados.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-muted-foreground text-sm border border-dashed rounded-xl", children: "Nenhum lançamento encontrado." }) : /* @__PURE__ */ jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Descrição" }),
        tipo === "DESPESA" && /* @__PURE__ */ jsx(TableHead, { children: "Beneficiário" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Categoria" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Valor" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Vencimento" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Pagamento" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Nº Doc." }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, {})
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: lancamentosFiltrados.map((l) => /* @__PURE__ */ jsxs(
        TableRow,
        {
          onClick: () => {
            setEditando(l);
            setShowModal(true);
          },
          className: `cursor-pointer ${isVencido(l) ? "bg-red-50" : ""}`,
          children: [
            /* @__PURE__ */ jsxs(TableCell, { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: l.descricao }),
              l.numero_parcelas && l.numero_parcelas > 1 && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                l.parcela_atual,
                "/",
                l.numero_parcelas,
                "x"
              ] }),
              isVencido(l) && /* @__PURE__ */ jsx("div", { className: "text-xs text-red-600", children: "Vencido" })
            ] }),
            tipo === "DESPESA" && /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: l.beneficiario ?? "—" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: l.plano_contas.nome }),
            /* @__PURE__ */ jsx(TableCell, { className: `text-right font-semibold ${tipo === "DESPESA" ? "text-red-600" : "text-emerald-600"}`, children: formatBRL(Number(l.valor)) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: formatarData(l.dt_vencimento) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-center text-muted-foreground", children: l.dt_pagamento ? formatarData(l.dt_pagamento) : "—" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-center text-muted-foreground", children: l.numero_documento ?? "—" }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: `inline-flex px-2 py-0.5 rounded-full text-xs border ${STATUS_COR[l.status]}`, children: STATUS_LABEL[l.status] }),
              l.status === "PAGO" && l.forma_pagamento && /* @__PURE__ */ jsx("span", { className: "inline-flex px-1.5 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200", children: FORMA_PAGAMENTO_LABEL[l.forma_pagamento] ?? l.forma_pagamento })
            ] }) }),
            /* @__PURE__ */ jsx(TableCell, { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
              l.status === "PENDENTE" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  setModalPagar(l.id);
                  setDtPagamento((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
                  setFormaPagamento("DINHEIRO");
                }, className: "p-1.5 text-muted-foreground hover:text-emerald-600 transition-colors", title: "Registrar pagamento", children: /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => cancelarMut.mutate(l.id), className: "p-1.5 text-muted-foreground hover:text-yellow-600 transition-colors", title: "Cancelar", children: /* @__PURE__ */ jsx(XCircle, { size: 16 }) })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => handleExcluir(l), className: "p-1.5 text-muted-foreground hover:text-red-600 transition-colors", title: "Excluir", children: /* @__PURE__ */ jsx(Trash2, { size: 15 }) })
            ] }) })
          ]
        },
        l.id
      )) })
    ] }) }) }),
    showModal && /* @__PURE__ */ jsx(
      ModalLancamento,
      {
        tipo,
        planoContas,
        lancamento: editando ?? void 0,
        onClose: () => {
          setShowModal(false);
          setEditando(null);
        },
        onSuccess: recarregar
      }
    ),
    modalExcluirGrupo && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60", children: /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: "Excluir Parcela" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
          "Este lançamento faz parte de um grupo de ",
          /* @__PURE__ */ jsxs("strong", { children: [
            modalExcluirGrupo.numero_parcelas,
            "x parcelas"
          ] }),
          ". O que deseja excluir?"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: async () => {
              await excluirLancamento({ id: modalExcluirGrupo.id });
              setLancamentos((prev) => prev.filter((l) => l.id !== modalExcluirGrupo.id));
              toast.success("Parcela excluída.");
              setModalExcluirGrupo(null);
            },
            className: "w-full py-2.5 rounded-lg border text-sm font-medium text-left px-4 hover:bg-muted transition-colors",
            children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Só esta parcela" }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Parcela ",
                modalExcluirGrupo.parcela_atual,
                " de ",
                modalExcluirGrupo.numero_parcelas
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: async () => {
              await excluirGrupoParcelas({ grupo_parcela_id: modalExcluirGrupo.grupo_parcela_id });
              setLancamentos((prev) => prev.filter((l) => l.grupo_parcela_id !== modalExcluirGrupo.grupo_parcela_id));
              toast.success("Todas as parcelas excluídas.");
              setModalExcluirGrupo(null);
            },
            className: "w-full py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium text-left px-4 hover:bg-red-100 transition-colors",
            children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Todas as parcelas do grupo" }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-red-400 mt-0.5", children: [
                "Remove as ",
                modalExcluirGrupo.numero_parcelas,
                "x parcelas permanentemente"
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setModalExcluirGrupo(null), className: "w-full py-2 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors", children: "Cancelar" })
    ] }) }),
    modalExcluirRecorrente && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60", children: /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: "Lançamento Recorrente" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "O que deseja fazer com este lançamento?" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: async () => {
              await excluirEAvancarRecorrencia({ id: modalExcluirRecorrente });
              await recarregar();
              toast.success("Excluído. Próximo gerado.");
              setModalExcluirRecorrente(null);
            },
            className: "w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium text-left px-4 hover:opacity-90 transition-colors",
            children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Excluir só este" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs opacity-80 mt-0.5", children: "Remove este e gera o próximo automaticamente" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: async () => {
              await excluirLancamento({ id: modalExcluirRecorrente });
              setLancamentos((prev) => prev.filter((l) => l.id !== modalExcluirRecorrente));
              toast.success("Recorrência encerrada.");
              setModalExcluirRecorrente(null);
            },
            className: "w-full py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium text-left px-4 hover:bg-red-100 transition-colors",
            children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Cancelar a recorrência" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-red-400 mt-0.5", children: "Remove este e não cria mais nenhum" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => setModalExcluirRecorrente(null), className: "w-full py-2 rounded-lg border text-sm text-muted-foreground hover:bg-muted transition-colors", children: "Voltar" })
    ] }) }),
    modalPagar && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60", children: /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-6 w-full max-w-sm shadow-2xl", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold mb-4", children: tipo === "DESPESA" ? "Registrar Pagamento" : "Registrar Recebimento" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: [
            "Data do ",
            tipo === "DESPESA" ? "Pagamento" : "Recebimento"
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "date",
              value: dtPagamento,
              onChange: (e) => setDtPagamento(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Forma de Pagamento" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: formaPagamento,
              onChange: (e) => setFormaPagamento(e.target.value),
              className: "w-full border rounded-md px-3 py-2 text-sm bg-background",
              children: [
                /* @__PURE__ */ jsx("option", { value: "DINHEIRO", children: "Dinheiro" }),
                /* @__PURE__ */ jsx("option", { value: "PIX", children: "Pix" }),
                /* @__PURE__ */ jsx("option", { value: "CARTAO_CREDITO", children: "Cartão de Crédito" }),
                /* @__PURE__ */ jsx("option", { value: "CARTAO_DEBITO", children: "Cartão de Débito" }),
                /* @__PURE__ */ jsx("option", { value: "OUTRO", children: "Outro" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", className: "flex-1", onClick: () => setModalPagar(null), children: "Cancelar" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "flex-1 bg-emerald-600 hover:bg-emerald-500 text-white",
              onClick: () => pagarMut.mutate(),
              disabled: pagarMut.isPending,
              children: "Confirmar"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  LancamentosView as L
};
