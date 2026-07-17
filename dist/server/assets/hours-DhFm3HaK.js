import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Clock } from "lucide-react";
import { B as Button } from "./button-Cz8PAkJh.js";
import { I as Input } from "./input-DVeAuAgX.js";
import { S as Switch } from "./switch-A5YoPpdJ.js";
import { L as Label } from "./label-DOAnQvhy.js";
import { u as useAuth, s as supabase } from "./router-C2wO3Uo9.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-switch";
import "@radix-ui/react-label";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@supabase/supabase-js";
const WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const defaultRow = (weekday) => ({
  weekday,
  is_open: weekday !== 0,
  open_time: "08:00",
  close_time: "18:00",
  break_start: "12:00",
  break_end: "13:00"
});
function HoursPage() {
  const {
    user
  } = useAuth();
  const [rows, setRows] = useState(WEEKDAYS.map((_, i) => defaultRow(i)));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const {
        data
      } = await supabase.from("business_hours").select("weekday,is_open,open_time,close_time,break_start,break_end").eq("user_id", user.id);
      if (data && data.length) {
        const merged = WEEKDAYS.map((_, i) => {
          const r = data.find((d) => d.weekday === i);
          return r ? {
            weekday: i,
            is_open: r.is_open,
            open_time: r.open_time.slice(0, 5),
            close_time: r.close_time.slice(0, 5),
            break_start: r.break_start ? r.break_start.slice(0, 5) : null,
            break_end: r.break_end ? r.break_end.slice(0, 5) : null
          } : defaultRow(i);
        });
        setRows(merged);
      }
      setLoading(false);
    })();
  }, [user]);
  const update = (i, patch) => {
    setRows((r) => r.map((row, idx) => idx === i ? {
      ...row,
      ...patch
    } : row));
  };
  const save = async () => {
    if (!user) return;
    setSaving(true);
    const payload = rows.map((r) => ({
      user_id: user.id,
      weekday: r.weekday,
      is_open: r.is_open,
      open_time: r.open_time,
      close_time: r.close_time,
      break_start: r.break_start || null,
      break_end: r.break_end || null
    }));
    const {
      error
    } = await supabase.from("business_hours").upsert(payload, {
      onConflict: "user_id,weekday"
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Horários salvos!");
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Carregando..." });
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold", children: "Horário de funcionamento" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Configure manualmente os horários da clínica em cada dia da semana." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: save, disabled: saving, className: "bg-[image:var(--gradient-hero)]", children: [
        /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
        " ",
        saving ? "Salvando..." : "Salvar"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: rows.map((row, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: WEEKDAYS[i] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: `open-${i}`, className: "text-xs text-muted-foreground", children: row.is_open ? "Aberto" : "Fechado" }),
          /* @__PURE__ */ jsx(Switch, { id: `open-${i}`, checked: row.is_open, onCheckedChange: (v) => update(i, {
            is_open: v
          }) })
        ] })
      ] }),
      row.is_open && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Abertura" }),
          /* @__PURE__ */ jsx(Input, { type: "time", value: row.open_time, onChange: (e) => update(i, {
            open_time: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Fechamento" }),
          /* @__PURE__ */ jsx(Input, { type: "time", value: row.close_time, onChange: (e) => update(i, {
            close_time: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Início do intervalo" }),
          /* @__PURE__ */ jsx(Input, { type: "time", value: row.break_start ?? "", onChange: (e) => update(i, {
            break_start: e.target.value || null
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Fim do intervalo" }),
          /* @__PURE__ */ jsx(Input, { type: "time", value: row.break_end ?? "", onChange: (e) => update(i, {
            break_end: e.target.value || null
          }) })
        ] })
      ] })
    ] }, i)) })
  ] });
}
export {
  HoursPage as component
};
