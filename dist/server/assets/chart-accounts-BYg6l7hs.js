import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus, BookOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { B as Button } from "./button-TjZkfKyC.js";
import { I as Input } from "./input-C0QjszdI.js";
import { L as Label } from "./label-JU3yqRBo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B91GfZkm.js";
import { u as useAuth, s as supabase } from "./router-C9Orusqq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@supabase/supabase-js";
function ChartAccounts() {
  const {
    user
  } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    name: "",
    kind: "receita"
  });
  const load = async () => {
    setLoading(true);
    const {
      data
    } = await supabase.from("chart_accounts").select("id, code, name, kind").order("code");
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    if (user) load();
  }, [user]);
  const add = async (e) => {
    e.preventDefault();
    if (!user || !form.code.trim() || !form.name.trim()) return;
    const {
      error
    } = await supabase.from("chart_accounts").insert({
      user_id: user.id,
      ...form
    });
    if (error) return toast.error(error.message);
    setForm({
      code: "",
      name: "",
      kind: form.kind
    });
    toast.success("Conta adicionada");
    load();
  };
  const remove = async (id) => {
    const {
      error
    } = await supabase.from("chart_accounts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removida");
    load();
  };
  const receitas = items.filter((i) => i.kind === "receita");
  const despesas = items.filter((i) => i.kind === "despesa");
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold", children: "Plano de contas" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Organize as categorias de receitas e despesas da clínica." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: add, className: "mb-6 grid grid-cols-1 gap-2 md:grid-cols-[120px_1fr_160px_auto]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Código" }),
        /* @__PURE__ */ jsx(Input, { placeholder: "1.1.01", value: form.code, onChange: (e) => setForm({
          ...form,
          code: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Nome" }),
        /* @__PURE__ */ jsx(Input, { placeholder: "Consultas particulares", value: form.name, onChange: (e) => setForm({
          ...form,
          name: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Tipo" }),
        /* @__PURE__ */ jsxs(Select, { value: form.kind, onValueChange: (v) => setForm({
          ...form,
          kind: v
        }), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "receita", children: "Receita" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "despesa", children: "Despesa" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(Button, { type: "submit", className: "bg-[image:var(--gradient-hero)]", children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }) }) })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Carregando..." }) : items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsx(BookOpen, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Nenhuma conta cadastrada ainda." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2", children: ["Receitas", "Despesas"].map((title, idx) => {
      const list = idx === 0 ? receitas : despesas;
      const color = idx === 0 ? "text-emerald-600" : "text-red-600";
      return /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: `mb-2 font-display text-lg font-semibold ${color}`, children: title }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          list.map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border bg-card px-3 py-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-muted-foreground", children: a.code }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: a.name })
            ] }),
            /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(a.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
          ] }, a.id)),
          list.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Vazio" })
        ] })
      ] }, title);
    }) })
  ] });
}
export {
  ChartAccounts as component
};
