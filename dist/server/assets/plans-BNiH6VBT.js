import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { B as Button } from "./button-TjZkfKyC.js";
import { I as Input } from "./input-C0QjszdI.js";
import { u as useAuth, s as supabase } from "./router-C9Orusqq.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@supabase/supabase-js";
function Plans() {
  const {
    user
  } = useAuth();
  const [plans, setPlans] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const {
      data
    } = await supabase.from("plans").select("id, name").order("name");
    setPlans(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    if (user) load();
  }, [user]);
  const add = async (e) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    const {
      error
    } = await supabase.from("plans").insert({
      user_id: user.id,
      name: name.trim()
    });
    if (error) return toast.error(error.message);
    setName("");
    toast.success("Plano adicionado");
    load();
  };
  const remove = async (id) => {
    const {
      error
    } = await supabase.from("plans").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Plano removido");
    load();
  };
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold", children: "Planos de saúde" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Cadastre os convênios atendidos pela clínica." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: add, className: "mb-6 flex gap-2", children: [
      /* @__PURE__ */ jsx(Input, { placeholder: "Ex: Unimed, Bradesco Saúde, Particular...", value: name, onChange: (e) => setName(e.target.value) }),
      /* @__PURE__ */ jsxs(Button, { type: "submit", className: "bg-[image:var(--gradient-hero)]", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Adicionar"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Carregando..." }) : plans.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsx(Tag, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Nenhum plano cadastrado ainda." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: plans.map((p) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border bg-card px-4 py-3 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: p.name })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => remove(p.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
    ] }, p.id)) })
  ] });
}
export {
  Plans as component
};
