import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Power, Plus, Pencil, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { B as Button } from "./button-Cz8PAkJh.js";
import { I as Input } from "./input-DVeAuAgX.js";
import { L as Label } from "./label-DOAnQvhy.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BMxB0edH.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-Di_XHLVQ.js";
import { u as useAuth, s as supabase } from "./router-CBWW-jsc.js";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "./server-Qa0G6HAO.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-D3IDpxJJ.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@supabase/supabase-js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./createMiddleware-BvN2ghIY.js";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const modulosValidos = z.array(z.enum(["agendamentos", "servicos", "financeiro", "usuarios", "configuracoes"]));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("fa8b018d25091808e4557cd85750b8f301c3f468d03885c39366e0201ab2cad4"));
const criarUsuario = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email(),
  cargo: z.string().max(100).optional(),
  role: z.enum(["USER", "MANAGER", "OWNER"]).default("USER"),
  senha: z.string().min(6),
  modulos: modulosValidos.default([])
}).parse(d)).handler(createSsrRpc("6be9b074e1dc75034aadf509e0ecb0212a4834f104076be035564e1b5fbcb29e"));
const editarUsuario = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1).max(200),
  cargo: z.string().max(100).nullable().optional(),
  role: z.enum(["USER", "MANAGER", "OWNER"]),
  modulos: modulosValidos.default([])
}).parse(d)).handler(createSsrRpc("2e7d4de4d12e3a489f09a715dae30130e6bbefb367da9168dbad787a1b99e177"));
const toggleAtivoUsuario = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(createSsrRpc("8de4718dddfb2e868007204d953b75e12394ef529404b76c21f4378e8276756a"));
const alterarSenhaUsuario = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  nova_senha: z.string().min(6)
}).parse(d)).handler(createSsrRpc("e85438eaa5d5896a10b1304167a57799001a3b6acf9fa48ae7972b9d7d96210e"));
const MODULOS_LABELS = {
  agendamentos: "Agendamentos",
  servicos: "Serviços",
  financeiro: "Financeiro",
  usuarios: "Usuários",
  configuracoes: "Configurações"
};
const ROLE_LABELS = {
  OWNER: "Administrador",
  MANAGER: "Gerente",
  USER: "Usuário"
};
const ROLE_COR = {
  OWNER: "bg-purple-100 text-purple-700 border-purple-200",
  MANAGER: "bg-blue-100 text-blue-700 border-blue-200",
  USER: "bg-gray-100 text-gray-600 border-gray-200"
};
const TODOS_MODULOS = Object.keys(MODULOS_LABELS);
function ModalCriarUsuario({
  onSuccess
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    cargo: "",
    senha: "",
    role: "USER",
    modulos: []
  });
  const toggleModulo = (m) => setForm((p) => ({
    ...p,
    modulos: p.modulos.includes(m) ? p.modulos.filter((x) => x !== m) : [...p.modulos, m]
  }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await criarUsuario({
        data: form
      });
      toast.success("Usuário criado com sucesso!");
      setOpen(false);
      setForm({
        full_name: "",
        email: "",
        cargo: "",
        senha: "",
        role: "USER",
        modulos: []
      });
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 mr-1" }),
      " Novo usuário"
    ] }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Criar usuário" }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Nome completo" }),
          /* @__PURE__ */ jsx(Input, { value: form.full_name, onChange: (e) => setForm({
            ...form,
            full_name: e.target.value
          }), required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Email" }),
          /* @__PURE__ */ jsx(Input, { type: "email", value: form.email, onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }), required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Cargo" }),
          /* @__PURE__ */ jsx(Input, { value: form.cargo, onChange: (e) => setForm({
            ...form,
            cargo: e.target.value
          }), placeholder: "Ex: Recepcionista" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Senha" }),
          /* @__PURE__ */ jsx(Input, { type: "password", value: form.senha, onChange: (e) => setForm({
            ...form,
            senha: e.target.value
          }), required: true, minLength: 6 })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Perfil" }),
          /* @__PURE__ */ jsxs(Select, { value: form.role, onValueChange: (v) => setForm({
            ...form,
            role: v
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(ROLE_LABELS).map(([k, v]) => /* @__PURE__ */ jsx(SelectItem, { value: k, children: v }, k)) })
          ] })
        ] }),
        form.role === "USER" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Módulos com acesso" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: TODOS_MODULOS.map((m) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.modulos.includes(m), onChange: () => toggleModulo(m), className: "rounded" }),
            MODULOS_LABELS[m]
          ] }, m)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", className: "flex-1", onClick: () => setOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "flex-1", disabled: loading, children: loading ? "Criando..." : "Criar usuário" })
        ] })
      ] })
    ] })
  ] });
}
function ModalEditarUsuario({
  usuario,
  onSuccess
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: usuario.full_name ?? "",
    cargo: usuario.cargo ?? "",
    role: usuario.role,
    modulos: usuario.modulos ?? []
  });
  const toggleModulo = (m) => setForm((p) => ({
    ...p,
    modulos: p.modulos.includes(m) ? p.modulos.filter((x) => x !== m) : [...p.modulos, m]
  }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await editarUsuario({
        data: {
          id: usuario.id,
          ...form
        }
      });
      toast.success("Usuário atualizado!");
      setOpen(false);
      onSuccess({
        ...usuario,
        ...form
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "p-1.5 text-muted-foreground hover:text-foreground transition-colors", title: "Editar", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Editar usuário" }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Nome completo" }),
          /* @__PURE__ */ jsx(Input, { value: form.full_name, onChange: (e) => setForm({
            ...form,
            full_name: e.target.value
          }), required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Cargo" }),
          /* @__PURE__ */ jsx(Input, { value: form.cargo, onChange: (e) => setForm({
            ...form,
            cargo: e.target.value
          }), placeholder: "Ex: Recepcionista" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Perfil" }),
          /* @__PURE__ */ jsxs(Select, { value: form.role, onValueChange: (v) => setForm({
            ...form,
            role: v
          }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: Object.entries(ROLE_LABELS).map(([k, v]) => /* @__PURE__ */ jsx(SelectItem, { value: k, children: v }, k)) })
          ] })
        ] }),
        form.role === "USER" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Módulos com acesso" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: TODOS_MODULOS.map((m) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.modulos.includes(m), onChange: () => toggleModulo(m), className: "rounded" }),
            MODULOS_LABELS[m]
          ] }, m)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", className: "flex-1", onClick: () => setOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "flex-1", disabled: loading, children: loading ? "Salvando..." : "Salvar" })
        ] })
      ] })
    ] })
  ] });
}
function ModalAlterarSenha({
  usuarioId
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [senha, setSenha] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await alterarSenhaUsuario({
        data: {
          id: usuarioId,
          nova_senha: senha
        }
      });
      toast.success("Senha alterada com sucesso!");
      setOpen(false);
      setSenha("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "p-1.5 text-muted-foreground hover:text-foreground transition-colors", title: "Alterar senha", children: /* @__PURE__ */ jsx(KeyRound, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Alterar senha" }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx(Label, { children: "Nova senha" }),
          /* @__PURE__ */ jsx(Input, { type: "password", value: senha, onChange: (e) => setSenha(e.target.value), required: true, minLength: 6 })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", className: "flex-1", onClick: () => setOpen(false), children: "Cancelar" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "flex-1", disabled: loading, children: loading ? "Salvando..." : "Alterar" })
        ] })
      ] })
    ] })
  ] });
}
function UsuariosPage() {
  const {
    user
  } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const carregar = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.from("profiles").select("*").order("full_name");
    if (error) toast.error(error.message);
    else setUsuarios(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    if (user) carregar();
  }, [user]);
  const handleToggleAtivo = async (id) => {
    try {
      await toggleAtivoUsuario({
        data: {
          id
        }
      });
      setUsuarios((prev) => prev.map((u) => u.id === id ? {
        ...u,
        ativo: !u.ativo
      } : u));
      toast.success("Status atualizado!");
    } catch (err) {
      toast.error(err.message);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Usuários e permissões" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          usuarios.length,
          " usuário",
          usuarios.length !== 1 ? "s" : "",
          " cadastrado",
          usuarios.length !== 1 ? "s" : "",
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx(ModalCriarUsuario, { onSuccess: carregar })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm", children: "Carregando..." }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 border-b", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "w-8 px-4 py-3" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-3 font-medium text-muted-foreground", children: "Nome" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-3 font-medium text-muted-foreground", children: "Cargo" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-3 font-medium text-muted-foreground", children: "Perfil" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-3 font-medium text-muted-foreground", children: "Módulos" }),
        /* @__PURE__ */ jsx("th", { className: "text-left px-6 py-3 font-medium text-muted-foreground", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "text-right px-6 py-3 font-medium text-muted-foreground", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y", children: [
        usuarios.map((u) => {
          const isExpanded = expandedId === u.id;
          const modulos = u.modulos ?? [];
          const isOwner = u.role === "OWNER";
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsx("button", { onClick: () => setExpandedId(isExpanded ? null : u.id), className: "text-muted-foreground hover:text-foreground transition-colors", children: isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }) }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0", children: (u.full_name ?? "?").substring(0, 2).toUpperCase() }),
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "font-medium", children: u.full_name ?? "—" }) })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-muted-foreground", children: u.cargo ?? "—" }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_COR[u.role] ?? "bg-gray-100 text-gray-600 border-gray-200"}`, children: ROLE_LABELS[u.role] ?? u.role }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: isOwner ? /* @__PURE__ */ jsx("span", { className: "text-xs text-emerald-600 font-medium", children: "Todos" }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: modulos.length === 0 ? "Nenhum" : `${modulos.length} módulo${modulos.length !== 1 ? "s" : ""}` }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${u.ativo ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`, children: u.ativo ? "Ativo" : "Inativo" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
                /* @__PURE__ */ jsx(ModalEditarUsuario, { usuario: u, onSuccess: (atualizado) => setUsuarios((prev) => prev.map((x) => x.id === atualizado.id ? atualizado : x)) }),
                /* @__PURE__ */ jsx(ModalAlterarSenha, { usuarioId: u.id }),
                /* @__PURE__ */ jsx("button", { onClick: () => handleToggleAtivo(u.id), className: `p-1.5 transition-colors ${u.ativo ? "text-muted-foreground hover:text-red-600" : "text-muted-foreground hover:text-emerald-600"}`, title: u.ativo ? "Desativar" : "Ativar", children: /* @__PURE__ */ jsx(Power, { className: "h-4 w-4" }) })
              ] }) })
            ] }, u.id),
            isExpanded && /* @__PURE__ */ jsx("tr", { className: "bg-muted/20", children: /* @__PURE__ */ jsxs("td", { colSpan: 7, className: "px-10 py-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Módulos com acesso" }),
              isOwner ? /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-600", children: "Administrador tem acesso a todos os módulos." }) : modulos.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nenhum módulo liberado." }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: modulos.map((m) => /* @__PURE__ */ jsx("span", { className: "inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20", children: MODULOS_LABELS[m] ?? m }, m)) })
            ] }) }, `${u.id}-modulos`)
          ] });
        }),
        usuarios.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "px-6 py-12 text-center text-muted-foreground", children: "Nenhum usuário cadastrado." }) })
      ] })
    ] }) })
  ] });
}
export {
  UsuariosPage as component
};
