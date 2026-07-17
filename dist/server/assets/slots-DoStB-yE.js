import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { format, addDays, addMinutes, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Calendar, Clock } from "lucide-react";
import { B as Button } from "./button-Cz8PAkJh.js";
import { I as Input } from "./input-DVeAuAgX.js";
import { L as Label } from "./label-DOAnQvhy.js";
import { B as Badge } from "./badge-B5fVHV-F.js";
import { toast } from "sonner";
import { u as useAuth, s as supabase } from "./router-C2wO3Uo9.js";
import { g as generateSlotsForDay } from "./business-hours-B8oOl374.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@supabase/supabase-js";
const ALL_TIMES = Array.from({
  length: 22
}, (_, i) => {
  const h = 8 + Math.floor(i / 2);
  const m = i % 2 * 30;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});
function Slots() {
  const {
    user
  } = useAuth();
  const [appts, setAppts] = useState([]);
  const [businessHours, setBusinessHours] = useState([]);
  const [fromDate, setFromDate] = useState(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
  const [days, setDays] = useState(14);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [slotMinutes] = useState(30);
  const [now, setNow] = useState(() => /* @__PURE__ */ new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!user) return;
    const start = /* @__PURE__ */ new Date(fromDate + "T00:00:00");
    const end = addDays(start, days);
    supabase.from("appointments").select("id, scheduled_at, status").gte("scheduled_at", start.toISOString()).lte("scheduled_at", end.toISOString()).then(({
      data
    }) => setAppts(data ?? []));
  }, [user, fromDate, days]);
  useEffect(() => {
    if (!user) return;
    supabase.from("business_hours").select("weekday,is_open,open_time,close_time,break_start,break_end").then(({
      data
    }) => setBusinessHours(data ?? []));
  }, [user]);
  const busy = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const a of appts) {
      if (a.status === "cancelado") continue;
      set.add(format(new Date(a.scheduled_at), "yyyy-MM-dd HH:mm"));
    }
    return set;
  }, [appts]);
  const free = useMemo(() => {
    const result = [];
    const start = /* @__PURE__ */ new Date(fromDate + "T00:00:00");
    const todayStr = format(now, "yyyy-MM-dd");
    for (let d = 0; d < days; d++) {
      const day = addDays(start, d);
      const dayStr = format(day, "yyyy-MM-dd");
      if (dayStr < todayStr) continue;
      const dow = day.getDay();
      const bh = businessHours.find((r) => r.weekday === dow);
      let timesForDay;
      if (bh) {
        if (!bh.is_open) continue;
        timesForDay = generateSlotsForDay(bh, slotMinutes);
      } else {
        timesForDay = ALL_TIMES;
      }
      for (const t of timesForDay) {
        if (selectedTimes.length && !selectedTimes.includes(t)) continue;
        const [h, m] = t.split(":").map(Number);
        const slot = addMinutes(day, h * 60 + m);
        const key = format(slot, "yyyy-MM-dd HH:mm");
        if (busy.has(key)) continue;
        const past = dayStr === todayStr && isBefore(slot, now);
        result.push({
          slot,
          past
        });
      }
    }
    return result.slice(0, 60);
  }, [fromDate, days, busy, selectedTimes, businessHours, slotMinutes, now]);
  const toggleTime = (t) => setSelectedTimes((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold", children: "Encontrar horário" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Localize o próximo dia/horário disponível, filtrando pelos horários que prefere." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 grid gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { children: "A partir de" }),
        /* @__PURE__ */ jsx(Input, { type: "date", value: fromDate, onChange: (e) => setFromDate(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { children: "Janela (dias)" }),
        /* @__PURE__ */ jsx(Input, { type: "number", min: 1, max: 60, value: days, onChange: (e) => setDays(Number(e.target.value) || 14) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { children: "Slot" }),
        /* @__PURE__ */ jsxs("div", { className: "flex h-10 items-center rounded-md border bg-muted/30 px-3 text-sm text-muted-foreground", children: [
          slotMinutes,
          " min"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 md:col-span-3", children: [
        /* @__PURE__ */ jsx(Label, { children: "Horários preferidos (vazio = todos)" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
          ALL_TIMES.map((t) => {
            const on = selectedTimes.includes(t);
            return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggleTime(t), className: `rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`, children: t }, t);
          }),
          selectedTimes.length > 0 && /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setSelectedTimes([]), children: "Limpar" })
        ] })
      ] })
    ] }),
    (() => {
      const availableCount = free.filter((f) => !f.past).length;
      const firstFreeIdx = free.findIndex((f) => !f.past);
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("h2", { className: "mb-3 flex items-center gap-2 font-display text-lg font-semibold", children: [
          /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
          " ",
          availableCount,
          " ",
          availableCount === 1 ? "horário livre" : "horários livres"
        ] }),
        free.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground", children: "Nenhum horário disponível com esses filtros." }) : /* @__PURE__ */ jsx("div", { className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3", children: free.map(({
          slot,
          past
        }, i) => /* @__PURE__ */ jsxs("div", { onClick: () => {
          if (past) toast.error("Este horário já passou e não pode ser agendado.");
        }, className: `flex items-center justify-between rounded-xl border p-3 shadow-[var(--shadow-card)] transition-opacity ${past ? "bg-gray-100 opacity-40 cursor-not-allowed" : "bg-card"}`, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 text-sm font-semibold capitalize ${past ? "text-gray-400" : ""}`, children: [
              /* @__PURE__ */ jsx(Calendar, { className: `h-3.5 w-3.5 ${past ? "text-gray-400" : "text-primary"}` }),
              format(slot, "EEE, dd 'de' MMM", {
                locale: ptBR
              })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
              " ",
              format(slot, "HH:mm")
            ] })
          ] }),
          i === firstFreeIdx && !past && /* @__PURE__ */ jsx(Badge, { className: "bg-primary/10 text-primary", children: "+ próximo" })
        ] }, i)) })
      ] });
    })()
  ] });
}
export {
  Slots as component
};
