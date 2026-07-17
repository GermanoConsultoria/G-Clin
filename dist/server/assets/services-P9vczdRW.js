import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus, Briefcase, Sparkles, Clock, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { B as Button } from "./button-Cz8PAkJh.js";
import { I as Input } from "./input-DVeAuAgX.js";
import { T as Textarea } from "./textarea-CIfPmIKy.js";
import { S as Switch } from "./switch-A5YoPpdJ.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-Di_XHLVQ.js";
import { L as Label } from "./label-DOAnQvhy.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BMxB0edH.js";
import { u as useAuth, s as supabase } from "./router-OHh7bvQb.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-switch";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@supabase/supabase-js";
const CATEGORIAS_FALLBACK = [{
  id: "fb-1",
  value: "maquiagem",
  label: "Maquiagem",
  color_class: "bg-rose-100 text-rose-700 border-rose-200",
  sort_order: 1
}, {
  id: "fb-2",
  value: "penteado",
  label: "Penteados",
  color_class: "bg-violet-100 text-violet-700 border-violet-200",
  sort_order: 2
}, {
  id: "fb-3",
  value: "pacotes",
  label: "Pacotes",
  color_class: "bg-amber-100 text-amber-700 border-amber-200",
  sort_order: 3
}];
const CATEGORIA_PLANO_NOME = {
  sobrancelhas: "Sobrancelhas",
  micropigmentacao: "Micropigmentação",
  depilacao: "Depilação",
  facial: "Tratamento Facial",
  hof: "HOF"
};
const COR_OPTIONS = [{
  label: "Rosa",
  value: "bg-pink-100 text-pink-700 border-pink-200"
}, {
  label: "Roxo",
  value: "bg-purple-100 text-purple-700 border-purple-200"
}, {
  label: "Azul",
  value: "bg-blue-100 text-blue-700 border-blue-200"
}, {
  label: "Verde",
  value: "bg-emerald-100 text-emerald-700 border-emerald-200"
}, {
  label: "Âmbar",
  value: "bg-amber-100 text-amber-700 border-amber-200"
}, {
  label: "Neutro",
  value: "bg-muted text-muted-foreground"
}, {
  label: "Índigo",
  value: "bg-indigo-100 text-indigo-700 border-indigo-200"
}, {
  label: "Ciano",
  value: "bg-cyan-100 text-cyan-700 border-cyan-200"
}];
function slugify(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const empty = {
  name: "",
  description: "",
  price: "0",
  cost: "0",
  duration_minutes: "30",
  active: true,
  is_hof: false,
  category_group: "outros",
  plano_contas_id: ""
};
function Services() {
  const {
    user
  } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [planoContas, setPlanoContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openNewCat, setOpenNewCat] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);
  const [filtro, setFiltro] = useState("todos");
  const [catLabel, setCatLabel] = useState("");
  const [catCor, setCatCor] = useState(COR_OPTIONS[0].value);
  const [savingCat, setSavingCat] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const [svcRes, pcRes, catRes] = await Promise.all([supabase.from("services").select("*").order("category_group").order("name"), supabase.from("plano_contas").select("*").eq("tipo", "RECEITA").eq("ativo", true).order("nome"), supabase.from("service_categories").select("id,value,label,color_class,sort_order").order("sort_order").order("label")]);
      if (svcRes.error) console.error("[services] load services:", svcRes.error.message);
      if (pcRes.error) console.error("[services] load plano_contas:", pcRes.error.message);
      if (catRes.error) console.error("[services] load categories:", catRes.error.message);
      setItems(svcRes.data ?? []);
      setPlanoContas(pcRes.data ?? []);
      const dbCats = catRes.data ?? [];
      const dbValues = new Set(dbCats.map((c) => c.value));
      setCategories(dbCats.length > 0 ? [...dbCats, ...CATEGORIAS_FALLBACK.filter((fb) => !dbValues.has(fb.value))] : CATEGORIAS_FALLBACK);
    } catch (err) {
      console.error("[services] load unexpected:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) load();
  }, [user]);
  const CATEGORIA_LABEL = Object.fromEntries(categories.map((c) => [c.value, c.label]));
  const CATEGORIA_COR = Object.fromEntries(categories.map((c) => [c.value, c.color_class ?? "bg-muted text-muted-foreground"]));
  const save = async (e) => {
    e.preventDefault();
    if (!user) return;
    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      cost: Number(form.cost),
      duration_minutes: Number(form.duration_minutes),
      active: form.active,
      is_hof: form.is_hof,
      category_group: form.category_group || null,
      plano_contas_id: form.plano_contas_id || null
    };
    const {
      error
    } = editingId ? await supabase.from("services").update(payload).eq("id", editingId) : await supabase.from("services").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Serviço atualizado" : "Serviço cadastrado");
    setOpen(false);
    setForm(empty);
    setEditingId(null);
    load();
  };
  const saveCategory = async (e) => {
    e.preventDefault();
    if (!user || !catLabel.trim()) return;
    setSavingCat(true);
    const value = slugify(catLabel);
    if (!value) {
      toast.error("Nome inválido para categoria");
      setSavingCat(false);
      return;
    }
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.sort_order), 0);
    const {
      error
    } = await supabase.from("service_categories").insert({
      user_id: user.id,
      value,
      label: catLabel.trim(),
      color_class: catCor,
      sort_order: maxOrder + 1
    });
    setSavingCat(false);
    if (error) return toast.error(error.message);
    toast.success("Categoria criada!");
    setCatLabel("");
    setCatCor(COR_OPTIONS[0].value);
    setOpenNewCat(false);
    load();
  };
  const edit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      description: s.description ?? "",
      price: String(s.price),
      cost: String(s.cost),
      duration_minutes: String(s.duration_minutes),
      active: s.active,
      is_hof: s.is_hof,
      category_group: s.category_group ?? "outros",
      plano_contas_id: s.plano_contas_id ?? ""
    });
    setOpen(true);
  };
  const remove = async (id) => {
    if (!confirm("Excluir este serviço?")) return;
    const {
      error
    } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Serviço removido");
    load();
  };
  const toggleAtivo = async (s) => {
    await supabase.from("services").update({
      active: !s.active
    }).eq("id", s.id);
    load();
  };
  const margin = (s) => s.price > 0 ? ((s.price - s.cost) / s.price * 100).toFixed(1) : "—";
  const filtered = items.filter((s) => {
    if (filtro === "fixo") return !s.is_hof;
    if (filtro === "hof") return s.is_hof;
    return true;
  });
  const baseGrupos = categories.map((cat) => ({
    ...cat,
    services: filtered.filter((s) => s.category_group === cat.value)
  })).filter((g) => g.services.length > 0);
  const assignedIds = new Set(baseGrupos.flatMap((g) => g.services.map((s) => s.id)));
  const semCategoria = filtered.filter((s) => !assignedIds.has(s.id));
  const grupos = semCategoria.length > 0 ? [...baseGrupos, {
    id: "_sc",
    value: "_sc",
    label: "Sem categoria",
    color_class: "bg-muted text-muted-foreground",
    sort_order: 999,
    services: semCategoria
  }] : baseGrupos;
  const totalFixo = items.filter((s) => !s.is_hof && s.active).length;
  const totalHof = items.filter((s) => s.is_hof && s.active).length;
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold", children: "Serviços" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          totalFixo,
          " serviços com valor fixo · ",
          totalHof,
          " procedimentos HOF"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(Dialog, { open: openNewCat, onOpenChange: (o) => {
          setOpenNewCat(o);
          if (!o) {
            setCatLabel("");
            setCatCor(COR_OPTIONS[0].value);
          }
        }, children: [
          /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            " Nova categoria"
          ] }) }),
          /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-sm", children: [
            /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Nova categoria de serviço" }) }),
            /* @__PURE__ */ jsxs("form", { onSubmit: saveCategory, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Nome da categoria" }),
                /* @__PURE__ */ jsx(Input, { required: true, value: catLabel, onChange: (e) => setCatLabel(e.target.value), placeholder: "Ex: Limpeza de Pele" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Cor do badge" }),
                /* @__PURE__ */ jsxs(Select, { value: catCor, onValueChange: setCatCor, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: COR_OPTIONS.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.value, children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${c.value}`, children: c.label }) }, c.value)) })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Button, { type: "submit", disabled: savingCat, className: "w-full bg-[image:var(--gradient-hero)]", children: savingCat ? "Salvando..." : "Criar categoria" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: (o) => {
          setOpen(o);
          if (!o) {
            setForm(empty);
            setEditingId(null);
          }
        }, children: [
          /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "bg-[image:var(--gradient-hero)]", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            " Novo serviço"
          ] }) }),
          /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-md", children: [
            /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
              editingId ? "Editar" : "Novo",
              " serviço"
            ] }) }),
            /* @__PURE__ */ jsxs("form", { onSubmit: save, className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Nome" }),
                /* @__PURE__ */ jsx(Input, { required: true, value: form.name, onChange: (e) => setForm({
                  ...form,
                  name: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Descrição" }),
                /* @__PURE__ */ jsx(Textarea, { value: form.description, onChange: (e) => setForm({
                  ...form,
                  description: e.target.value
                }), rows: 2 })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Categoria" }),
                /* @__PURE__ */ jsxs(Select, { value: form.category_group, onValueChange: (v) => {
                  const nomePlano = CATEGORIA_PLANO_NOME[v];
                  const pcId = nomePlano ? planoContas.find((pc) => pc.nome === nomePlano)?.id ?? form.plano_contas_id : form.plano_contas_id;
                  setForm({
                    ...form,
                    category_group: v,
                    is_hof: v === "hof",
                    plano_contas_id: pcId || ""
                  });
                }, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.value, children: c.label }, c.value)) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { children: "Preço (R$)" }),
                  /* @__PURE__ */ jsx(Input, { type: "number", step: "0.01", value: form.price, onChange: (e) => setForm({
                    ...form,
                    price: e.target.value
                  }) }),
                  form.is_hof && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-amber-600", children: "HOF: deixe 0 se sob avaliação" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { children: "Custo (R$)" }),
                  /* @__PURE__ */ jsx(Input, { type: "number", step: "0.01", value: form.cost, onChange: (e) => setForm({
                    ...form,
                    cost: e.target.value
                  }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(Label, { children: "Duração (min)" }),
                  /* @__PURE__ */ jsx(Input, { type: "number", value: form.duration_minutes, onChange: (e) => setForm({
                    ...form,
                    duration_minutes: e.target.value
                  }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Categoria financeira (Plano de contas)" }),
                /* @__PURE__ */ jsxs(Select, { value: form.plano_contas_id || "none", onValueChange: (v) => setForm({
                  ...form,
                  plano_contas_id: v === "none" ? "" : v
                }), children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecione..." }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Nenhuma (usar padrão)" }),
                    planoContas.map((pc) => /* @__PURE__ */ jsx(SelectItem, { value: pc.id, children: pc.nome }, pc.id))
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Usada ao lançar automaticamente no financeiro ao concluir atendimentos." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Switch, { checked: form.active, onCheckedChange: (v) => setForm({
                    ...form,
                    active: v
                  }) }),
                  /* @__PURE__ */ jsx(Label, { children: "Ativo" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Switch, { checked: form.is_hof, onCheckedChange: (v) => setForm({
                    ...form,
                    is_hof: v,
                    category_group: v ? "hof" : form.category_group
                  }) }),
                  /* @__PURE__ */ jsx(Label, { className: "text-amber-700", children: "HOF" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full bg-[image:var(--gradient-hero)]", children: "Salvar" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 flex gap-2", children: [{
      key: "todos",
      label: `Todos (${items.length})`
    }, {
      key: "fixo",
      label: `Valor fixo (${items.filter((s) => !s.is_hof).length})`
    }, {
      key: "hof",
      label: `HOF (${items.filter((s) => s.is_hof).length})`
    }].map((f) => /* @__PURE__ */ jsx("button", { onClick: () => setFiltro(f.key), className: `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filtro === f.key ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground hover:text-foreground"}`, children: f.label }, f.key)) }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Carregando..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsx(Briefcase, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Nenhum serviço encontrado." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-6", children: grupos.map((grupo) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
        grupo.value === "hof" && /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-amber-500" }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-semibold", children: grupo.label }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "(",
          grupo.services.length,
          ")"
        ] }),
        grupo.value === "hof" && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 border border-amber-200", children: "Sob avaliação · R$ 150,00" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2", children: grupo.services.map((s) => /* @__PURE__ */ jsxs("div", { className: `rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] ${!s.active ? "opacity-60" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: s.name }),
              s.is_hof && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 border border-amber-200", children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
                " HOF"
              ] }),
              s.category_group && /* @__PURE__ */ jsx("span", { className: `rounded-full border px-2 py-0.5 text-xs ${CATEGORIA_COR[s.category_group] ?? "bg-muted text-muted-foreground"}`, children: CATEGORIA_LABEL[s.category_group] ?? s.category_group }),
              !s.active && /* @__PURE__ */ jsx("span", { className: "rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground", children: "Inativo" })
            ] }),
            s.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: s.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
              " ",
              s.duration_minutes,
              " min"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => toggleAtivo(s), title: s.active ? "Desativar" : "Ativar", children: /* @__PURE__ */ jsx("div", { className: `h-2 w-2 rounded-full ${s.active ? "bg-emerald-500" : "bg-muted-foreground"}` }) }),
            /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => edit(s), children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => remove(s.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-4 gap-2 text-center text-xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Preço" }),
            /* @__PURE__ */ jsx("div", { className: "font-semibold text-foreground", children: s.is_hof && Number(s.price) === 0 ? "Avaliação" : `R$ ${Number(s.price).toFixed(2)}` })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Custo" }),
            /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
              "R$ ",
              Number(s.cost).toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Margem" }),
            /* @__PURE__ */ jsxs("div", { className: `font-semibold ${Number(s.price) > 0 ? "text-primary" : "text-muted-foreground"}`, children: [
              margin(s),
              Number(s.price) > 0 ? "%" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted p-2", children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Duração" }),
            /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
              s.duration_minutes,
              "min"
            ] })
          ] })
        ] })
      ] }, s.id)) })
    ] }, grupo.value)) })
  ] });
}
export {
  Services as component
};
