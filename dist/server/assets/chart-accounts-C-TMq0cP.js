import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { s as supabase, u as useAuth } from "./router-DGcmqzPd.js";
import { useMutation } from "@tanstack/react-query";
import { Plus, ToggleRight, ToggleLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { B as Button } from "./button-Cz8PAkJh.js";
import { I as Input } from "./input-DVeAuAgX.js";
import { L as Label } from "./label-DOAnQvhy.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-Di_XHLVQ.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DqYRHhQ4.js";
import "@tanstack/react-router";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
async function listPlanoContas() {
  const { data, error } = await supabase.from("plano_contas").select("*").order("tipo").order("nome");
  if (error) throw new Error(error.message);
  return data ?? [];
}
async function listPlanoContasByTipo(tipo) {
  const { data, error } = await supabase.from("plano_contas").select("*").eq("tipo", tipo).eq("ativo", true).order("nome");
  if (error) throw new Error(error.message);
  return data ?? [];
}
async function criarPlanoContas(tipo, nome) {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from("plano_contas").insert({ tipo, nome: nome.trim(), created_by: user?.id });
  if (error) throw new Error(error.message);
  return { ok: true };
}
async function editarPlanoContas(id, tipo, nome) {
  const { error } = await supabase.from("plano_contas").update({ tipo, nome: nome.trim(), updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}
async function toggleAtivoPlanoContas(id) {
  const { data: conta, error: fetchError } = await supabase.from("plano_contas").select("ativo").eq("id", id).single();
  if (fetchError || !conta) throw new Error("Conta não encontrada.");
  const { error } = await supabase.from("plano_contas").update({ ativo: !conta.ativo, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}
async function excluirPlanoContas(id) {
  const { count, error: countError } = await supabase.from("lancamento_financeiro").select("*", { count: "exact", head: true }).eq("plano_contas_id", id);
  if (countError) throw new Error(countError.message);
  if (count && count > 0)
    throw new Error("Esta conta possui lançamentos e não pode ser excluída.");
  const { error } = await supabase.from("plano_contas").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}
const planoContas_functions = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  criarPlanoContas,
  editarPlanoContas,
  excluirPlanoContas,
  listPlanoContas,
  listPlanoContasByTipo,
  toggleAtivoPlanoContas
}, Symbol.toStringTag, { value: "Module" }));
function PlanoContasView({ contas: contasIniciais }) {
  const [contas, setContas] = useState(contasIniciais);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("DESPESA");
  const receitas = contas.filter((c) => c.tipo === "RECEITA");
  const despesas = contas.filter((c) => c.tipo === "DESPESA");
  const saveMut = useMutation({
    mutationFn: async () => {
      if (!nome.trim()) throw new Error("Nome é obrigatório.");
      if (editando) {
        await editarPlanoContas(editando.id, tipo, nome);
        setContas(
          (prev) => prev.map((c) => c.id === editando.id ? { ...c, nome, tipo } : c)
        );
        toast.success("Conta atualizada.");
      } else {
        await criarPlanoContas(tipo, nome);
        const novas = await (await Promise.resolve().then(() => planoContas_functions)).listPlanoContas();
        setContas(novas);
        toast.success("Conta criada.");
      }
      setOpen(false);
      setEditando(null);
      setNome("");
    },
    onError: (e) => toast.error(e.message)
  });
  const toggleMut = useMutation({
    mutationFn: async (id) => {
      await toggleAtivoPlanoContas(id);
      setContas(
        (prev) => prev.map((c) => c.id === id ? { ...c, ativo: !c.ativo } : c)
      );
    },
    onError: (e) => toast.error(e.message)
  });
  const excluirMut = useMutation({
    mutationFn: async (conta) => {
      if (!confirm(`Excluir a conta "${conta.nome}"?`)) return;
      await excluirPlanoContas(conta.id);
      setContas((prev) => prev.filter((c) => c.id !== conta.id));
      toast.success("Conta excluída.");
    },
    onError: (e) => toast.error(e.message)
  });
  function abrirNova() {
    setEditando(null);
    setNome("");
    setTipo("DESPESA");
    setOpen(true);
  }
  function abrirEditar(conta) {
    setEditando(conta);
    setNome(conta.nome);
    setTipo(conta.tipo);
    setOpen(true);
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { onClick: abrirNova, children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
      " Nova Conta"
    ] }) }),
    ["RECEITA", "DESPESA"].map((t) => {
      const lista = t === "RECEITA" ? receitas : despesas;
      return /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs(
          "h2",
          {
            className: `text-sm font-semibold uppercase tracking-wider mb-3 ${t === "RECEITA" ? "text-emerald-600" : "text-red-600"}`,
            children: [
              t === "RECEITA" ? "📈 Receitas" : "📉 Despesas",
              " (",
              lista.length,
              ")"
            ]
          }
        ),
        lista.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg", children: "Nenhuma conta cadastrada." }) : /* @__PURE__ */ jsx("div", { className: "rounded-md border overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableHead, { children: "Nome" }),
            /* @__PURE__ */ jsx(TableHead, { className: "text-center", children: "Status" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-24" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: lista.map((conta) => /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(
              TableCell,
              {
                className: `font-medium ${!conta.ativo ? "opacity-40 line-through" : ""}`,
                children: conta.nome
              }
            ),
            /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => toggleMut.mutate(conta.id),
                className: "text-muted-foreground hover:text-primary transition-colors",
                title: conta.ativo ? "Desativar" : "Ativar",
                children: conta.ativo ? /* @__PURE__ */ jsx(ToggleRight, { className: "h-5 w-5 text-primary" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "h-5 w-5" })
              }
            ) }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  onClick: () => abrirEditar(conta),
                  children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  onClick: () => excluirMut.mutate(conta),
                  children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" })
                }
              )
            ] }) })
          ] }, conta.id)) })
        ] }) })
      ] }, t);
    }),
    /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: editando ? "Editar Conta" : "Nova Conta" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Tipo" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: tipo,
              onChange: (e) => setTipo(e.target.value),
              className: "w-full mt-1 border rounded-md px-3 py-2 text-sm bg-background",
              children: [
                /* @__PURE__ */ jsx("option", { value: "RECEITA", children: "Receita" }),
                /* @__PURE__ */ jsx("option", { value: "DESPESA", children: "Despesa" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Nome da Conta" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              value: nome,
              onChange: (e) => setNome(e.target.value),
              placeholder: "Ex: Consultas particulares",
              autoFocus: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => saveMut.mutate(),
            disabled: !nome || saveMut.isPending,
            children: "Salvar"
          }
        )
      ] })
    ] }) })
  ] });
}
function PlanoContasPage() {
  const {
    user
  } = useAuth();
  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    if (!user) return;
    supabase.from("plano_contas").select("*").order("tipo").order("nome").then(({
      data
    }) => {
      setContas(data ?? []);
      setCarregando(false);
    });
  }, [user]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Plano de Contas" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Categorias para classificar receitas e despesas." })
    ] }),
    carregando ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Carregando..." }) : /* @__PURE__ */ jsx(PlanoContasView, { contas })
  ] });
}
export {
  PlanoContasPage as component
};
