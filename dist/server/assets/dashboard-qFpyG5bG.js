import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, startOfMonth, endOfWeek, endOfMonth, addDays, subMonths, addMonths, isSameMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronRight, Check, Circle, Plus, List, Calendar, AlertTriangle, XCircle, CheckCircle2, Clock, Zap, Phone, MessageCircle, Pencil, Trash2, ChevronLeft } from "lucide-react";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-fMRf3trd.js";
import { toast } from "sonner";
import { B as Button } from "./button-TjZkfKyC.js";
import { I as Input } from "./input-C0QjszdI.js";
import { L as Label } from "./label-JU3yqRBo.js";
import { T as Textarea } from "./textarea-DSyJ1nlY.js";
import { S as Switch } from "./switch-CQ4rbtn8.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter, f as DialogDescription } from "./dialog-C2-Ghlxc.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-B91GfZkm.js";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { c as cn } from "./utils-H80jjgLf.js";
import { B as Badge } from "./badge-DyfXZgLs.js";
import { u as useAuth, s as supabase } from "./router-C9Orusqq.js";
import "@radix-ui/react-tabs";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "clsx";
import "tailwind-merge";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@supabase/supabase-js";
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const statusStyle = {
  agendado: {
    cls: "bg-warning/15 text-warning border-warning/30",
    icon: Clock,
    label: "Aguardando"
  },
  confirmado: {
    cls: "bg-success/15 text-success border-success/30",
    icon: CheckCircle2,
    label: "Confirmado"
  },
  concluido: {
    cls: "bg-muted text-muted-foreground",
    icon: CheckCircle2,
    label: "Concluído"
  },
  cancelado: {
    cls: "bg-destructive/15 text-destructive border-destructive/30",
    icon: XCircle,
    label: "Cancelado"
  },
  falta: {
    cls: "bg-orange-100 text-orange-700 border-orange-200",
    icon: AlertTriangle,
    label: "Falta"
  }
};
function generateAllSlots() {
  const slots = [];
  for (let h = 8; h < 19; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}
function getAvailableSlots(date, newDuration, existingAppts, services, editingId) {
  const allSlots = generateAllSlots();
  const busyIntervals = existingAppts.filter((a) => a.id !== editingId).map((a) => {
    const start = new Date(a.scheduled_at).getTime();
    const svc = services.find((s) => s.id === a.service_id);
    const duration = svc?.duration_minutes ?? 30;
    return {
      start,
      end: start + duration * 60 * 1e3
    };
  });
  return allSlots.filter((slot) => {
    const slotStart = (/* @__PURE__ */ new Date(`${date}T${slot}`)).getTime();
    const slotEnd = slotStart + newDuration * 60 * 1e3;
    return !busyIntervals.some((b) => slotStart < b.end && slotEnd > b.start);
  });
}
function buildWhatsappMsg(kind, opts) {
  const when = format(opts.scheduledAt, "EEEE, dd 'de' MMMM 'às' HH:mm", {
    locale: ptBR
  });
  const servico = opts.serviceName ? ` — *${opts.serviceName}*` : "";
  const regras = "\n\n⚠️ *Lembretes importantes:*\n• Não traga crianças ou animais\n• Em caso de falta, o próximo atendimento terá custo adicional";
  switch (kind) {
    case "agendamento":
      return `Olá, ${opts.clientName}! 👋

Seu agendamento${servico} foi confirmado para *${when}*. 🎉${regras}

Qualquer dúvida, é só responder esta mensagem!`;
    case "confirmacao":
      return `Olá, ${opts.clientName}! 😊

Passando para confirmar seu procedimento${servico} *amanhã*, *${when}*.

Por favor, confirme respondendo *SIM* ✅ ou *NÃO* ❌.${regras}`;
    case "lembrete":
      return `Olá, ${opts.clientName}! ⏰

Seu procedimento${servico} começa em *10 minutos* — *${when}*.

Estamos te esperando! 💛`;
    case "reagendamento":
      return `Olá, ${opts.clientName}! Precisamos *reagendar* seu procedimento${servico} que estava marcado para ${when}.

Por favor, entre em contato para escolher um novo horário. 📅`;
    case "antecipar": {
      const novo = opts.newSlot ? format(opts.newSlot, "EEEE, dd 'de' MMMM 'às' HH:mm", {
        locale: ptBR
      }) : when;
      return `Olá, ${opts.clientName}! 🎉 Surgiu uma *vaga antecipada* para *${novo}*.

Você manifestou interesse em antecipar. Se quiser este horário, responda *SIM* o quanto antes — vai para quem responder primeiro!`;
    }
  }
}
function whatsappLink(phone, message) {
  const digits = phone.replace(/\D/g, "");
  const full = digits.length <= 11 ? `55${digits}` : digits;
  return `https://wa.me/${full}?text=${encodeURIComponent(message)}`;
}
function Dashboard() {
  const {
    user
  } = useAuth();
  const [appts, setAppts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [anticipateFor, setAnticipateFor] = useState(null);
  const [concludingAppt, setConcludingAppt] = useState(null);
  const load = async () => {
    setLoading(true);
    const [{
      data: a
    }, {
      data: s
    }] = await Promise.all([supabase.from("appointments").select("*").order("scheduled_at", {
      ascending: true
    }), supabase.from("services").select("id, name, duration_minutes, price, is_hof").eq("active", true).order("name")]);
    setAppts(a ?? []);
    setServices(s ?? []);
    setLoading(false);
  };
  useEffect(() => {
    if (user) load();
  }, [user]);
  const onDelete = async (id) => {
    if (!confirm("Excluir este agendamento?")) return;
    const {
      error
    } = await supabase.from("appointments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Agendamento removido");
    load();
  };
  const sendWhats = (a, kind) => {
    const msg = buildWhatsappMsg(kind, {
      clientName: a.client_name,
      scheduledAt: new Date(a.scheduled_at),
      serviceName: a.service_name
    });
    window.open(whatsappLink(a.phone, msg), "_blank");
  };
  const updateStatus = async (a, status) => {
    if (status === "concluido") {
      setConcludingAppt(a);
      return;
    }
    const {
      error
    } = await supabase.from("appointments").update({
      status
    }).eq("id", a.id);
    if (error) return toast.error(error.message);
    if (status === "cancelado") setAnticipateFor({
      ...a,
      status
    });
    load();
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold", children: "Agendamentos" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          appts.length,
          " ",
          appts.length === 1 ? "procedimento" : "procedimentos",
          " no total"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: (o) => {
        setOpen(o);
        if (!o) setEditing(null);
      }, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          " Novo agendamento"
        ] }) }),
        /* @__PURE__ */ jsx(AppointmentDialog, { services, allAppts: appts, editing, onClose: () => {
          setOpen(false);
          setEditing(null);
        }, onSaved: () => {
          setOpen(false);
          setEditing(null);
          load();
        } })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Carregando..." }) : /* @__PURE__ */ jsxs(Tabs, { defaultValue: "list", className: "w-full", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "list", children: [
          /* @__PURE__ */ jsx(List, { className: "h-4 w-4 mr-1" }),
          " Lista"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "calendar", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 mr-1" }),
          " Calendário"
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "list", className: "mt-4", children: appts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-dashed bg-card p-12 text-center", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 font-display text-lg font-semibold", children: "Nenhum agendamento ainda" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: 'Clique em "Novo agendamento" para começar.' })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: appts.map((a) => {
        const date = new Date(a.scheduled_at);
        const s = statusStyle[a.status];
        const SIcon = s.icon;
        const svc = services.find((sv) => sv.id === a.service_id);
        return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxs("div", { className: "text-center leading-tight", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-medium uppercase", children: format(date, "MMM", {
                locale: ptBR
              }) }),
              /* @__PURE__ */ jsx("div", { className: "text-lg font-bold", children: format(date, "dd") })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-semibold", children: a.client_name }),
                /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: s.cls, children: [
                  /* @__PURE__ */ jsx(SIcon, { className: "mr-1 h-3 w-3" }),
                  " ",
                  s.label
                ] }),
                a.service_name && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "flex items-center gap-1", children: [
                  a.service_name,
                  svc && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5 text-muted-foreground", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                    svc.duration_minutes,
                    "min"
                  ] })
                ] }),
                a.wants_to_anticipate && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "border-primary/30 text-primary", children: [
                  /* @__PURE__ */ jsx(Zap, { className: "mr-1 h-3 w-3" }),
                  " Aceita antecipar"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx("span", { children: format(date, "EEEE, HH:mm", {
                  locale: ptBR
                }) }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
                  a.phone
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", className: "bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90", children: [
                /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }),
                " WhatsApp"
              ] }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => sendWhats(a, "agendamento"), children: "✅ Confirmação de agendamento" }),
                /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => sendWhats(a, "confirmacao"), children: "🔔 Lembrete 24h antes" }),
                /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => sendWhats(a, "lembrete"), children: "⏰ Lembrete 10 minutos antes" }),
                /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => sendWhats(a, "reagendamento"), children: "🔄 Reagendar" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Select, { value: a.status, onValueChange: (v) => updateStatus(a, v), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 w-40", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "agendado", children: "Aguardando" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "confirmado", children: "Confirmado" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "concluido", children: "Concluído" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "cancelado", children: "Cancelado" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "falta", children: "Falta" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
              setEditing(a);
              setOpen(true);
            }, children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => onDelete(a.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
          ] })
        ] }, a.id);
      }) }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "calendar", className: "mt-4", children: /* @__PURE__ */ jsx(CalendarView, { appts, services, onEdit: (a) => {
        setEditing(a);
        setOpen(true);
      } }) })
    ] }),
    /* @__PURE__ */ jsx(ConcludeDialog, { appt: concludingAppt, services, onClose: () => setConcludingAppt(null), onSaved: () => {
      setConcludingAppt(null);
      load();
    } }),
    /* @__PURE__ */ jsx(AnticipateDialog, { appts, canceled: anticipateFor, onClose: () => setAnticipateFor(null) })
  ] });
}
function ConcludeDialog({
  appt,
  services,
  onClose,
  onSaved
}) {
  const {
    user
  } = useAuth();
  const [valor, setValor] = useState("");
  const [saving, setSaving] = useState(false);
  const svc = services.find((s) => s.id === appt?.service_id);
  const isHof = svc?.is_hof ?? false;
  useEffect(() => {
    if (appt) {
      const found = services.find((s) => s.id === appt.service_id);
      setValor(found ? String(found.price) : "0");
    }
  }, [appt, services]);
  const handleConfirm = async () => {
    if (!appt || !user) return;
    setSaving(true);
    const {
      error: apptError
    } = await supabase.from("appointments").update({
      status: "concluido"
    }).eq("id", appt.id);
    if (apptError) {
      toast.error(apptError.message);
      setSaving(false);
      return;
    }
    const {
      error: recError
    } = await supabase.from("receivables").insert({
      user_id: user.id,
      description: appt.service_name ?? "Procedimento",
      client_name: appt.client_name,
      amount: Number(valor),
      due_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      service_id: appt.service_id ?? null,
      notes: `Agendamento concluído em ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")}`,
      status: "pendente"
    });
    if (recError) {
      toast.error(recError.message);
      setSaving(false);
      return;
    }
    toast.success("Procedimento concluído e lançado em A receber!");
    setSaving(false);
    onSaved();
  };
  return /* @__PURE__ */ jsx(Dialog, { open: !!appt, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-sm", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5 text-emerald-600" }),
      " Concluir procedimento"
    ] }) }),
    appt && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-muted/30 p-3 text-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: appt.client_name }),
        /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: appt.service_name ?? "Sem serviço" }),
        isHof && /* @__PURE__ */ jsx("div", { className: "mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700", children: "✨ Procedimento HOF — informe o valor cobrado" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { children: isHof ? "Valor cobrado (R$)" : "Confirmar valor (R$)" }),
        /* @__PURE__ */ jsx(Input, { type: "number", step: "0.01", min: "0", value: valor, onChange: (e) => setValor(e.target.value) }),
        !isHof && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Valor do serviço pré-preenchido. Ajuste se necessário." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", className: "flex-1", onClick: onClose, children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { className: "flex-1 bg-emerald-600 hover:bg-emerald-500 text-white", onClick: handleConfirm, disabled: saving || !valor || Number(valor) <= 0, children: saving ? "Salvando..." : "Concluir e lançar" })
      ] })
    ] })
  ] }) });
}
function AnticipateDialog({
  appts,
  canceled,
  onClose
}) {
  const candidates = useMemo(() => {
    if (!canceled) return [];
    const slot = new Date(canceled.scheduled_at);
    return appts.filter((x) => x.id !== canceled.id && x.wants_to_anticipate && x.status !== "cancelado" && x.status !== "concluido" && new Date(x.scheduled_at) > slot);
  }, [appts, canceled]);
  const send = (c) => {
    if (!canceled) return;
    const msg = buildWhatsappMsg("antecipar", {
      clientName: c.client_name,
      scheduledAt: new Date(c.scheduled_at),
      serviceName: c.service_name,
      newSlot: new Date(canceled.scheduled_at)
    });
    window.open(whatsappLink(c.phone, msg), "_blank");
  };
  return /* @__PURE__ */ jsx(Dialog, { open: !!canceled, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Zap, { className: "h-5 w-5 text-primary" }),
        " Oferecer vaga antecipada"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { children: canceled && /* @__PURE__ */ jsxs(Fragment, { children: [
        "Vaga liberada: ",
        /* @__PURE__ */ jsx("b", { children: format(new Date(canceled.scheduled_at), "EEEE, dd 'de' MMMM 'às' HH:mm", {
          locale: ptBR
        }) }),
        ". Quem responder SIM primeiro fica com o horário."
      ] }) })
    ] }),
    candidates.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "mx-auto mb-2 h-6 w-6" }),
      "Nenhum cliente futuro marcou que aceita antecipar."
    ] }) : /* @__PURE__ */ jsx("div", { className: "max-h-80 space-y-2 overflow-auto", children: candidates.map((c) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: c.client_name }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Atual: ",
          format(new Date(c.scheduled_at), "dd/MM HH:mm", {
            locale: ptBR
          }),
          " · ",
          c.phone
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", className: "bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90", onClick: () => send(c), children: [
        /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }),
        " Oferecer"
      ] })
    ] }, c.id)) }),
    /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: onClose, children: "Fechar" }) })
  ] }) });
}
function AppointmentDialog({
  services,
  allAppts,
  editing,
  onClose,
  onSaved
}) {
  const {
    user
  } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("none");
  const [type, setType] = useState("procedimento");
  const [date, setDate] = useState(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [anticipate, setAnticipate] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (editing) {
      const d = new Date(editing.scheduled_at);
      setName(editing.client_name);
      setPhone(editing.phone);
      setServiceId(editing.service_id ?? "none");
      setType(editing.type);
      setDate(format(d, "yyyy-MM-dd"));
      setTime(format(d, "HH:mm"));
      setNotes(editing.notes ?? "");
      setAnticipate(editing.wants_to_anticipate);
    } else {
      setName("");
      setPhone("");
      setServiceId("none");
      setType("procedimento");
      setDate(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
      setTime("");
      setNotes("");
      setAnticipate(false);
    }
  }, [editing]);
  const availableSlots = useMemo(() => {
    const selectedService = services.find((s) => s.id === serviceId);
    const duration = selectedService?.duration_minutes ?? 30;
    const dayAppts = allAppts.filter((a) => {
      const d = a.scheduled_at.slice(0, 10);
      return d === date && a.status !== "cancelado" && a.status !== "falta";
    });
    return getAvailableSlots(date, duration, dayAppts, services, editing?.id);
  }, [date, serviceId, allAppts, services, editing]);
  useEffect(() => {
    if (time && availableSlots.length > 0 && !availableSlots.includes(time)) {
      setTime("");
    }
  }, [availableSlots]);
  const resetForm = () => {
    setName("");
    setPhone("");
    setServiceId("none");
    setType("procedimento");
    setDate(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
    setTime("");
    setNotes("");
    setAnticipate(false);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!user || !time) return;
    setSaving(true);
    const scheduled_at = (/* @__PURE__ */ new Date(`${date}T${time}`)).toISOString();
    const service = services.find((s) => s.id === serviceId);
    const payload = {
      user_id: user.id,
      client_name: name,
      phone,
      service_id: serviceId === "none" ? null : serviceId,
      service_name: service?.name ?? null,
      type,
      scheduled_at,
      notes: notes || null,
      wants_to_anticipate: anticipate,
      extra_charge: false
    };
    const {
      error
    } = editing ? await supabase.from("appointments").update(payload).eq("id", editing.id) : await supabase.from("appointments").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Agendamento atualizado" : "Agendamento criado");
    resetForm();
    onSaved();
  };
  return /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: editing ? "Editar agendamento" : "Novo agendamento" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { children: "Nome do cliente" }),
        /* @__PURE__ */ jsx(Input, { value: name, onChange: (e) => setName(e.target.value), required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { children: "Telefone (WhatsApp)" }),
        /* @__PURE__ */ jsx(Input, { placeholder: "(11) 99999-9999", value: phone, onChange: (e) => setPhone(e.target.value.replace(/\D/g, "")), inputMode: "numeric", maxLength: 11, required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { children: "Data" }),
          /* @__PURE__ */ jsx(Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { children: "Tipo" }),
          /* @__PURE__ */ jsxs(Select, { value: type, onValueChange: (v) => setType(v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "procedimento", children: "Procedimento" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "avaliacao", children: "Avaliação" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "retorno", children: "Retorno" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "encaixe", children: "Encaixe" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { children: "Serviço" }),
        /* @__PURE__ */ jsxs(Select, { value: serviceId, onValueChange: setServiceId, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecione" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "Nenhum" }),
            services.map((s) => /* @__PURE__ */ jsxs(SelectItem, { value: s.id, children: [
              s.name,
              " (",
              s.duration_minutes,
              "min)"
            ] }, s.id))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxs(Label, { children: [
          "Horário disponível",
          availableSlots.length === 0 && /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs text-destructive font-normal", children: "— sem vagas neste dia" })
        ] }),
        availableSlots.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto rounded-xl border bg-muted/30 p-2", children: availableSlots.map((slot) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setTime(slot), className: `rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${time === slot ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:border-primary hover:text-primary"}`, children: slot }, slot)) }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed bg-muted/30 p-4 text-center text-xs text-muted-foreground", children: "Nenhum horário disponível para esta data e serviço. Escolha outra data." }),
        time && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Horário selecionado: ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-primary", children: time })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border bg-muted/30 p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm", children: "Aceita antecipar?" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Será notificado se surgir vaga antes." })
        ] }),
        /* @__PURE__ */ jsx(Switch, { checked: anticipate, onCheckedChange: setAnticipate })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { children: "Observações" }),
        /* @__PURE__ */ jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), rows: 2 })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: onClose, children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: saving || !time, className: "bg-[image:var(--gradient-hero)]", children: saving ? "Salvando..." : "Salvar" })
      ] })
    ] })
  ] });
}
function CalendarView({
  appts,
  services,
  onEdit
}) {
  const [cursor, setCursor] = useState(/* @__PURE__ */ new Date());
  const [selected, setSelected] = useState(/* @__PURE__ */ new Date());
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), {
      weekStartsOn: 0
    });
    const end = endOfWeek(endOfMonth(cursor), {
      weekStartsOn: 0
    });
    const arr = [];
    let d = start;
    while (d <= end) {
      arr.push(d);
      d = addDays(d, 1);
    }
    return arr;
  }, [cursor]);
  const byDay = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const a of appts) {
      const k = format(new Date(a.scheduled_at), "yyyy-MM-dd");
      const arr = map.get(k) ?? [];
      arr.push(a);
      map.set(k, arr);
    }
    return map;
  }, [appts]);
  const dayList = (byDay.get(format(selected, "yyyy-MM-dd")) ?? []).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-[1fr_360px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-semibold capitalize", children: format(cursor, "MMMM 'de' yyyy", {
          locale: ptBR
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => setCursor(subMonths(cursor, 1)), children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => {
            setCursor(/* @__PURE__ */ new Date());
            setSelected(/* @__PURE__ */ new Date());
          }, children: "Hoje" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => setCursor(addMonths(cursor, 1)), children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground", children: weekdays.map((w) => /* @__PURE__ */ jsx("div", { className: "py-1", children: w }, w)) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1", children: days.map((d) => {
        const key = format(d, "yyyy-MM-dd");
        const items = byDay.get(key) ?? [];
        const inMonth = isSameMonth(d, cursor);
        const isSel = isSameDay(d, selected);
        const isToday = isSameDay(d, /* @__PURE__ */ new Date());
        return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setSelected(d), className: `min-h-20 rounded-lg border p-1.5 text-left transition ${isSel ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"} ${!inMonth ? "opacity-40" : ""}`, children: [
          /* @__PURE__ */ jsx("div", { className: `text-xs font-semibold ${isToday ? "text-primary" : ""}`, children: format(d, "d") }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 space-y-0.5", children: [
            items.slice(0, 3).map((a) => {
              const s = statusStyle[a.status];
              return /* @__PURE__ */ jsxs("div", { className: `truncate rounded px-1 py-0.5 text-[10px] ${s.cls}`, children: [
                format(new Date(a.scheduled_at), "HH:mm"),
                " ",
                a.client_name
              ] }, a.id);
            }),
            items.length > 3 && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
              "+",
              items.length - 3,
              " mais"
            ] })
          ] })
        ] }, key);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-semibold capitalize", children: format(selected, "EEEE, dd 'de' MMMM", {
        locale: ptBR
      }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
        dayList.length,
        " ",
        dayList.length === 1 ? "agendamento" : "agendamentos"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: dayList.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground", children: "Nenhum agendamento neste dia." }) : dayList.map((a) => {
        const s = statusStyle[a.status];
        const SIcon = s.icon;
        const svc = services.find((sv) => sv.id === a.service_id);
        return /* @__PURE__ */ jsxs("button", { onClick: () => onEdit(a), className: "w-full rounded-lg border p-3 text-left hover:bg-muted/40", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
              format(new Date(a.scheduled_at), "HH:mm"),
              " · ",
              a.client_name
            ] }),
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: s.cls, children: [
              /* @__PURE__ */ jsx(SIcon, { className: "mr-1 h-3 w-3" }),
              s.label
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground", children: [
            a.service_name && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              a.service_name,
              svc && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                svc.duration_minutes,
                "min"
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { children: a.phone })
          ] })
        ] }, a.id);
      }) })
    ] })
  ] });
}
export {
  Dashboard as component
};
