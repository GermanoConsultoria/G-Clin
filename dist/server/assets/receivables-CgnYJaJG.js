import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus, TrendingUp, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { B as Button } from "./button-TjZkfKyC.js";
import { I as Input } from "./input-C0QjszdI.js";
import { L as Label } from "./label-JU3yqRBo.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-C2-Ghlxc.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B91GfZkm.js";
import { T as Textarea } from "./textarea-DSyJ1nlY.js";
import { u as useAuth, s as supabase } from "./router-C9Orusqq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@supabase/supabase-js";
const empty = {
  description: "",
  client_name: "",
  amount: "0",
  due_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  account_id: "",
  service_id: "",
  notes: ""
};
function Receivables() {
  const {
    user
  } = useAuth();
  const [items, setItems] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const load = async () => {
    setLoading(true);
    const [{
      data: r
    }, {
      data: a
    }, {
      data: s
    }] = await Promise.all([supabase.from("receivables").select("*").order("due_date"), supabase.from("chart_accounts").select("id, name").eq("kind", "receita").order("name"), supabase.from("services").select("id, name, price").eq("active", true).order("name")]);
    setItems(r ?? []);
    setAccounts(a ?? []);
    setServices(s ?? []);
    setLoading(false);
  };
  useEffect(() => {
    if (user) load();
  }, [user]);
  const pickService = (id) => {
    const svc = services.find((s) => s.id === id);
    setForm({
      ...form,
      service_id: id,
      amount: svc ? String(svc.price ?? 0) : form.amount,
      description: svc && !form.description ? svc.name : form.description
    });
  };
  const add = async (e) => {
    e.preventDefault();
    if (!user) return;
    const {
      error
    } = await supabase.from("receivables").insert({
      user_id: user.id,
      description: form.description,
      client_name: form.client_name || null,
      amount: Number(form.amount),
      due_date: form.due_date,
      account_id: form.account_id || null,
      service_id: form.service_id || null,
      notes: form.notes || null
    });
    if (error) return toast.error(error.message);
    setForm(empty);
    setOpen(false);
    toast.success("Conta a receber criada");
    load();
  };
  const markPaid = async (id) => {
    const {
      error
    } = await supabase.from("receivables").update({
      status: "pago",
      received_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Recebido!");
    load();
  };
  const remove = async (id) => {
    if (!confirm("Excluir este lançamento?")) return;
    await supabase.from("receivables").delete().eq("id", id);
    load();
  };
  const total = items.filter((i) => i.status === "pendente").reduce((s, i) => s + Number(i.amount), 0);
  const statusColor = (s) => ({
    pendente: "bg-yellow-100 text-yellow-700",
    pago: "bg-emerald-100 text-emerald-700",
    atrasado: "bg-red-100 text-red-700",
    cancelado: "bg-muted text-muted-foreground"
  })[s] ?? "";
  const statusLabel = (s) => ({
    pendente: "Pendente",
    pago: "Recebido",
    atrasado: "Atrasado",
    cancelado: "Cancelado"
  })[s] ?? s;
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold", children: "Contas a receber" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "A receber: ",
          /* @__PURE__ */ jsxs("span", { className: "font-semibold text-emerald-600", children: [
            "R$ ",
            total.toFixed(2)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "bg-[image:var(--gradient-hero)]", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          " Nova conta"
        ] }) }),
        /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Nova conta a receber" }) }),
          /* @__PURE__ */ jsxs("form", { onSubmit: add, className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Serviço (opcional)" }),
              /* @__PURE__ */ jsxs(Select, { value: form.service_id, onValueChange: pickService, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecione um serviço" }) }),
                /* @__PURE__ */ jsx(SelectContent, { children: services.map((s) => /* @__PURE__ */ jsxs(SelectItem, { value: s.id, children: [
                  s.name,
                  " — R$ ",
                  Number(s.price ?? 0).toFixed(2)
                ] }, s.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Descrição" }),
              /* @__PURE__ */ jsx(Input, { required: true, value: form.description, onChange: (e) => setForm({
                ...form,
                description: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Cliente" }),
                /* @__PURE__ */ jsx(Input, { value: form.client_name, onChange: (e) => setForm({
                  ...form,
                  client_name: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Valor (R$)" }),
                /* @__PURE__ */ jsx(Input, { required: true, type: "number", step: "0.01", value: form.amount, onChange: (e) => setForm({
                  ...form,
                  amount: e.target.value
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Vencimento" }),
                /* @__PURE__ */ jsx(Input, { required: true, type: "date", value: form.due_date, onChange: (e) => setForm({
                  ...form,
                  due_date: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Conta" }),
                /* @__PURE__ */ jsxs(Select, { value: form.account_id, onValueChange: (v) => setForm({
                  ...form,
                  account_id: v
                }), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecione" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: accounts.map((a) => /* @__PURE__ */ jsx(SelectItem, { value: a.id, children: a.name }, a.id)) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Observações" }),
              /* @__PURE__ */ jsx(Textarea, { value: form.notes, onChange: (e) => setForm({
                ...form,
                notes: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full bg-[image:var(--gradient-hero)]", children: "Salvar" })
          ] })
        ] })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Carregando..." }) : items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsx(TrendingUp, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Nenhuma conta a receber." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: items.map((i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border bg-card px-4 py-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: i.description }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
          i.client_name && /* @__PURE__ */ jsxs("span", { children: [
            i.client_name,
            " · "
          ] }),
          "Vence ",
          new Date(i.due_date).toLocaleDateString("pt-BR")
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-semibold text-emerald-600", children: [
          "R$ ",
          Number(i.amount).toFixed(2)
        ] }),
        /* @__PURE__ */ jsx("span", { className: `rounded px-2 py-0.5 text-xs font-medium ${statusColor(i.status)}`, children: statusLabel(i.status) }),
        i.status === "pendente" && /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => markPaid(i.id), title: "Marcar como recebido", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-600" }) }),
        /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(i.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
      ] })
    ] }, i.id)) })
  ] });
}
export {
  Receivables as component
};
