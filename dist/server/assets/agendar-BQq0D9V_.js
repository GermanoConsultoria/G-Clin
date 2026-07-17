import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, X, Plus, Clock, Zap, ChevronDown } from "lucide-react";
import { s as supabase } from "./router-CBWW-jsc.js";
import { g as generateSlotsForDay } from "./business-hours-B8oOl374.js";
import { l as logoGabriela } from "./logo-Dor8vgq3.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "sonner";
import "@supabase/supabase-js";
const CATEGORIAS_FALLBACK = [{
  value: "maquiagem",
  label: "Maquiagem"
}, {
  value: "penteado",
  label: "Penteados"
}, {
  value: "pacotes",
  label: "Pacotes"
}];
const GOLD = "linear-gradient(135deg, #AC9D8A 0%, #B5936E 50%, #83715D 100%)";
function formatPhone(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
function getSlotsForDisplay(date, duration, dayAppts, services, bh) {
  if (!bh || !bh.is_open) return [];
  const allSlots = generateSlotsForDay(bh, duration);
  const busy = dayAppts.map((a) => {
    const start = new Date(a.scheduled_at).getTime();
    const svc = services.find((s) => s.id === a.service_id);
    const dur = svc?.duration_minutes ?? 30;
    return {
      start,
      end: start + dur * 60 * 1e3
    };
  });
  return allSlots.filter((slot) => {
    const slotStart = (/* @__PURE__ */ new Date(`${date}T${slot}`)).getTime();
    const slotEnd = slotStart + duration * 60 * 1e3;
    return !busy.some((b) => slotStart < b.end && slotEnd > b.start);
  });
}
function isSlotPast(slot, date, now) {
  if (date !== format(now, "yyyy-MM-dd")) return false;
  return (/* @__PURE__ */ new Date(`${date}T${slot}`)).getTime() <= now.getTime();
}
function ServicePicker({
  services,
  grupos,
  value,
  onChange,
  placeholder = "Selecione um serviço..."
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const selected = value !== "none" ? services.find((s) => s.id === value) : null;
  return /* @__PURE__ */ jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setOpen((v) => !v), className: "flex w-full items-center justify-between rounded-md border border-[#D0C7B6] bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#B5936E] focus:ring-offset-2 transition", children: [
      /* @__PURE__ */ jsx("span", { className: selected ? "text-[#83715D]" : "text-[#AC9D8A]", children: selected ? selected.name : placeholder }),
      /* @__PURE__ */ jsx(ChevronDown, { size: 15, className: `text-[#AC9D8A] transition-transform duration-150 ${open ? "rotate-180" : ""}` })
    ] }),
    open && /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 top-full z-[200] mt-1 max-h-72 overflow-y-auto rounded-xl border border-[#D0C7B6] bg-white shadow-2xl", children: grupos.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-4 py-6 text-center text-sm text-[#AC9D8A]", children: "Nenhum serviço disponível" }) : grupos.map((grupo) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("button", { type: "button", className: "flex w-full cursor-default items-center px-3 py-2", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", style: {
        color: "#83715D"
      }, children: grupo.label }) }),
      grupo.items.map((svc) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => {
        onChange(svc.id);
        setOpen(false);
      }, className: `flex w-full items-center justify-between px-5 py-2.5 text-left text-sm transition-colors hover:bg-[#F8F0ED] ${value === svc.id ? "bg-[#F8F0ED] text-[#83715D]" : "text-[#83715D]"}`, children: [
        /* @__PURE__ */ jsx("span", { children: svc.name }),
        /* @__PURE__ */ jsxs("div", { className: "ml-2 flex shrink-0 items-center gap-2 text-xs text-[#AC9D8A]", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5", children: [
            /* @__PURE__ */ jsx(Clock, { size: 11 }),
            svc.duration_minutes,
            "min"
          ] }),
          /* @__PURE__ */ jsx("span", { children: svc.is_hof && Number(svc.price) === 0 ? "Sob avaliação" : `R$ ${Number(svc.price).toFixed(2)}` })
        ] })
      ] }, svc.id))
    ] }, grupo.value)) })
  ] });
}
function AgendarPage() {
  const clinicUserId = "c906ad02-7efe-4ea5-a2bc-978d5cd2c0df";
  const [services, setServices] = useState([]);
  const [businessHours, setBusinessHours] = useState([]);
  const [categorias, setCategorias] = useState(CATEGORIAS_FALLBACK);
  const [initialLoading, setInitialLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("none");
  const [extraServices, setExtraServices] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [anticipate, setAnticipate] = useState(false);
  const [notes, setNotes] = useState("");
  const [dayAppts, setDayAppts] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [now, setNow] = useState(() => /* @__PURE__ */ new Date());
  const [confirmed, setConfirmed] = useState(null);
  useEffect(() => {
    (async () => {
      const [{
        data: svcs,
        error: svcsErr
      }, {
        data: bh,
        error: bhErr
      }, {
        data: cats
      }] = await Promise.all([supabase.from("services").select("id,name,duration_minutes,price,is_hof,category_group").eq("active", true).order("category_group").order("name"), supabase.from("business_hours").select("weekday,is_open,open_time,close_time,break_start,break_end"), supabase.from("service_categories").select("value,label").order("sort_order").order("label")]);
      if (svcsErr) console.error("[agendar] services:", svcsErr.message);
      if (bhErr) console.error("[agendar] business_hours:", bhErr.message);
      setServices(svcs ?? []);
      setBusinessHours(bh ?? []);
      if (cats && cats.length > 0) setCategorias(cats);
      setInitialLoading(false);
    })();
  }, []);
  useEffect(() => {
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!date) {
      setDayAppts([]);
      setTime("");
      return;
    }
    setLoadingSlots(true);
    supabase.from("appointments").select("scheduled_at,service_id").gte("scheduled_at", `${date}T00:00:00`).lte("scheduled_at", `${date}T23:59:59`).in("status", ["agendado", "confirmado", "concluido", "pendente_pagamento"]).then(({
      data,
      error
    }) => {
      if (error) console.error("[agendar] appointments:", error.message);
      setDayAppts(data ?? []);
      setTime("");
      setLoadingSlots(false);
    });
  }, [date]);
  const addExtraService = () => setExtraServices((prev) => [...prev, "none"]);
  const removeExtraService = (idx) => setExtraServices((prev) => prev.filter((_, i) => i !== idx));
  const updateExtraService = (idx, id) => setExtraServices((prev) => prev.map((s, i) => i === idx ? id : s));
  const allSelectedServices = useMemo(() => {
    const ids = [serviceId, ...extraServices].filter((id) => id !== "none");
    return ids.map((id) => services.find((s) => s.id === id)).filter(Boolean);
  }, [serviceId, extraServices, services]);
  const totalDuration = useMemo(() => allSelectedServices.reduce((sum, s) => sum + s.duration_minutes, 0) || 30, [allSelectedServices]);
  const totalPrice = useMemo(() => allSelectedServices.reduce((sum, s) => sum + Number(s.price), 0), [allSelectedServices]);
  const bhForDay = useMemo(() => {
    if (!date) return null;
    const dow = (/* @__PURE__ */ new Date(`${date}T00:00:00`)).getDay();
    return businessHours.find((r) => r.weekday === dow) ?? null;
  }, [date, businessHours]);
  const slots = useMemo(() => {
    if (!date) return [];
    return getSlotsForDisplay(date, totalDuration, dayAppts, services, bhForDay);
  }, [date, bhForDay, totalDuration, dayAppts, services]);
  useEffect(() => {
    if (time && isSlotPast(time, date, now)) setTime("");
  }, [serviceId, extraServices]);
  const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
  const baseGrupos = categorias.map((cat) => ({
    ...cat,
    items: services.filter((s) => s.category_group === cat.value)
  })).filter((g) => g.items.length > 0);
  const assignedAgendar = new Set(baseGrupos.flatMap((g) => g.items.map((s) => s.id)));
  const semCatAgendar = services.filter((s) => !assignedAgendar.has(s.id));
  const grupos = semCatAgendar.length > 0 ? [...baseGrupos, {
    value: "_sc",
    label: "Outros serviços",
    items: semCatAgendar
  }] : baseGrupos;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) return setFormError("Preencha seu nome completo.");
    if (phone.replace(/\D/g, "").length < 10) return setFormError("Preencha um telefone válido.");
    if (serviceId === "none") return setFormError("Selecione ao menos um serviço.");
    if (!date) return setFormError("Selecione uma data.");
    if (!time) return setFormError("Selecione um horário.");
    if (isSlotPast(time, date, now)) return setFormError("Este horário já passou. Escolha outro.");
    setSaving(true);
    const serviceName = allSelectedServices.map((s) => s.name).join(" + ") || null;
    const {
      data: inserted,
      error
    } = await supabase.from("appointments").insert({
      user_id: clinicUserId,
      client_name: name.trim(),
      phone: phone.replace(/\D/g, ""),
      service_id: serviceId,
      service_name: serviceName,
      scheduled_at: (/* @__PURE__ */ new Date(`${date}T${time}`)).toISOString(),
      status: "agendado",
      type: "procedimento",
      wants_to_anticipate: anticipate,
      extra_charge: false,
      notes: notes.trim() || null
    }).select("id").single();
    if (error) {
      setSaving(false);
      return setFormError("Erro ao confirmar agendamento: " + error.message);
    }
    if (allSelectedServices.length > 0) {
      const {
        error: svcErr
      } = await supabase.from("appointment_services").insert(allSelectedServices.map((svc) => ({
        appointment_id: inserted.id,
        service_id: svc.id,
        service_name: svc.name,
        price: svc.price,
        cost: 0,
        duration_minutes: svc.duration_minutes,
        is_hof: svc.is_hof
      })));
      if (svcErr) console.error("[agendar] appointment_services:", svcErr.message);
    }
    setSaving(false);
    setConfirmed({
      name: name.trim(),
      services: allSelectedServices.map((s) => s.name),
      date: format(/* @__PURE__ */ new Date(`${date}T00:00:00`), "EEEE, dd 'de' MMMM 'de' yyyy", {
        locale: ptBR
      }),
      time,
      totalPrice
    });
  };
  const resetForm = () => {
    setName("");
    setPhone("");
    setServiceId("none");
    setExtraServices([]);
    setDate("");
    setTime("");
    setAnticipate(false);
    setNotes("");
    setFormError(null);
    setConfirmed(null);
    setDayAppts([]);
  };
  if (confirmed) {
    const hasPrice = confirmed.totalPrice > 0;
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen flex-col items-center justify-center bg-[#F8F0ED] px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-10 w-10 text-emerald-600" }) }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl font-bold text-[#83715D]", children: "Agendamento confirmado!" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-[#83715D]", children: "Obrigada pela preferência 🎉" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-[#D0C7B6] bg-white p-5 text-left space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-medium uppercase tracking-wider text-[#AC9D8A]", children: "Nome" }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-sm font-semibold text-[#83715D]", children: confirmed.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-medium uppercase tracking-wider text-[#AC9D8A]", children: confirmed.services.length > 1 ? "Serviços" : "Serviço" }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 space-y-0.5", children: confirmed.services.map((s, i) => /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-[#83715D]", children: s }, i)) }),
          hasPrice && /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-[#AC9D8A]", children: [
            "Total: ",
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-[#83715D]", children: [
              "R$ ",
              confirmed.totalPrice.toFixed(2)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-medium uppercase tracking-wider text-[#AC9D8A]", children: "Data" }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-sm font-semibold text-[#83715D] capitalize", children: confirmed.date })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-medium uppercase tracking-wider text-[#AC9D8A]", children: "Horário" }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-sm font-semibold text-[#83715D]", children: confirmed.time })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm text-[#83715D]", children: "Em breve entraremos em contato pelo WhatsApp para confirmar seu agendamento." }),
      /* @__PURE__ */ jsx("button", { onClick: resetForm, className: "mt-6 w-full rounded-xl py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90", style: {
        background: GOLD
      }, children: "Fazer outro agendamento" })
    ] }) });
  }
  const isDayClosed = !!bhForDay && !bhForDay.is_open;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#F8F0ED]", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex flex-col items-center gap-4 px-6 pt-10 pb-8", children: [
      /* @__PURE__ */ jsx("img", { src: logoGabriela, alt: "Dra. Tharine Souza", className: "h-20 w-20 rounded-full object-cover", style: {
        border: "4px solid #B5936E",
        boxShadow: "0 4px 20px rgba(200,165,106,0.3)"
      } }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl font-bold text-[#83715D]", children: "Agende seu procedimento" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[#83715D]", children: "Preencha os dados abaixo para realizar seu agendamento" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-[480px] px-4 pb-16", children: /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-[#D0C7B6] bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsx(Field, { label: "Nome completo *", children: /* @__PURE__ */ jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Seu nome completo", className: "fi" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Telefone WhatsApp *", children: /* @__PURE__ */ jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(formatPhone(e.target.value)), placeholder: "(11) 99999-9999", inputMode: "numeric", className: "fi" }) }),
      /* @__PURE__ */ jsx(Field, { label: "Serviço(s) *", children: initialLoading ? /* @__PURE__ */ jsx("div", { className: "h-11 animate-pulse rounded-lg bg-[#EDE0D4]" }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(ServicePicker, { services, grupos, value: serviceId, onChange: (id) => {
          setServiceId(id);
          setTime("");
        } }),
        extraServices.map((eid, idx) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(ServicePicker, { services, grupos, value: eid, onChange: (id) => {
            updateExtraService(idx, id);
            setTime("");
          }, placeholder: "Selecione serviço adicional..." }) }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
            removeExtraService(idx);
            setTime("");
          }, className: "flex h-[38px] w-9 shrink-0 items-center justify-center rounded-md border border-[#D0C7B6] text-[#AC9D8A] transition-colors hover:border-red-300 hover:text-red-500", "aria-label": "Remover serviço", children: /* @__PURE__ */ jsx(X, { size: 14 }) })
        ] }, idx)),
        serviceId !== "none" && /* @__PURE__ */ jsxs("button", { type: "button", onClick: addExtraService, className: "flex items-center gap-1.5 text-xs font-medium text-[#B5936E] transition-colors hover:text-[#83715D]", children: [
          /* @__PURE__ */ jsx(Plus, { size: 13 }),
          " Adicionar outro serviço"
        ] }),
        allSelectedServices.length > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-[#D0C7B6] bg-[#F8F0ED] px-3 py-2 text-xs text-[#83715D]", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Clock, { size: 11 }),
            " ",
            totalDuration,
            "min no total"
          ] }),
          totalPrice > 0 && /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
            "R$ ",
            totalPrice.toFixed(2)
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Data *", children: /* @__PURE__ */ jsx("input", { type: "date", value: date, min: today, onChange: (e) => setDate(e.target.value), className: "fi" }) }),
      date && /* @__PURE__ */ jsxs(Field, { label: /* @__PURE__ */ jsxs("span", { children: [
        "Horário disponível *",
        isDayClosed && /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs font-normal text-red-500", children: "— dia fechado" }),
        !isDayClosed && slots.length === 0 && !loadingSlots && /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs font-normal text-red-500", children: "— sem vagas" })
      ] }), children: [
        loadingSlots ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-1.5 rounded-xl border bg-[#F8F0ED] p-2", children: Array.from({
          length: 10
        }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-8 animate-pulse rounded-lg bg-[#EDE0D4]" }, i)) }) : isDayClosed || slots.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-[#D0C7B6] bg-[#F8F0ED] p-4 text-center text-xs text-[#AC9D8A]", children: isDayClosed ? "Este dia está fechado. Escolha outra data." : "Nenhum horário disponível para esta data. Escolha outra data." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto rounded-xl border border-[#D0C7B6] bg-[#F8F0ED] p-2", children: slots.map((slot) => {
          const past = isSlotPast(slot, date, now);
          return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
            if (past) return;
            setTime(slot);
          }, className: `rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${past ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 opacity-40" : time === slot ? "text-white" : "border border-[#D0C7B6] bg-white text-[#83715D] hover:border-[#B5936E] hover:text-[#83715D]"}`, style: !past && time === slot ? {
            background: GOLD
          } : void 0, children: slot }, slot);
        }) }),
        time && !isSlotPast(time, date, now) && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-[#AC9D8A]", children: [
          "Selecionado: ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-[#83715D]", children: time })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border border-[#D0C7B6] bg-[#F8F0ED] p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-sm font-medium text-[#83715D]", children: [
            /* @__PURE__ */ jsx(Zap, { size: 14, className: "text-[#83715D]" }),
            " Aceita antecipar?"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-[#AC9D8A]", children: "Será avisado se surgir uma vaga antes." })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", role: "switch", "aria-checked": anticipate, onClick: () => setAnticipate((v) => !v), className: "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#B5936E] focus:ring-offset-2", style: {
          background: anticipate ? "#83715D" : "#D0C7B6"
        }, children: /* @__PURE__ */ jsx("span", { className: "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform", style: {
          transform: anticipate ? "translateX(1.25rem)" : "translateX(0)"
        } }) })
      ] }),
      /* @__PURE__ */ jsx(Field, { label: /* @__PURE__ */ jsxs("span", { children: [
        "Observações ",
        /* @__PURE__ */ jsx("span", { className: "text-xs font-normal text-[#AC9D8A]", children: "(opcional)" })
      ] }), children: /* @__PURE__ */ jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, placeholder: "Alguma informação adicional para a Dra. Tharine Souza?", className: "fi resize-none" }) }),
      formError && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700", children: formError }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: saving || initialLoading, className: "w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60", style: {
        background: GOLD
      }, children: saving ? "Confirmando..." : "Confirmar agendamento" })
    ] }) }) }),
    /* @__PURE__ */ jsx("style", { children: `
        .fi {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #D0C7B6;
          background: white;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.5;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          color: #83715D;
        }
        .fi::placeholder { color: #AC9D8A; }
        .fi:focus {
          border-color: #B5936E;
          box-shadow: 0 0 0 2px rgba(200,165,106,0.2);
        }
      ` })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#83715D]", children: label }),
    children
  ] });
}
export {
  AgendarPage as component
};
