import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Calendar, MessageCircle, ShieldCheck } from "lucide-react";
import { B as Button } from "./button-Cz8PAkJh.js";
import { l as logoGabriela } from "./logo-Dor8vgq3.js";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
function Landing() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("header", { className: "container mx-auto flex items-center justify-between px-6 py-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-display text-lg font-bold", children: [
        /* @__PURE__ */ jsx("img", { src: logoGabriela, alt: "G-Clin", className: "h-10 w-10 rounded-lg object-cover" }),
        "G-Clin"
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/auth", children: /* @__PURE__ */ jsx(Button, { variant: "ghost", children: "Entrar" }) })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "container mx-auto px-6 pb-24 pt-12 md:pt-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary", children: "Gestão clínica simplificada" }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-6 font-display text-4xl font-extrabold tracking-tight md:text-6xl", children: [
          "Agendamentos da sua clínica, ",
          /* @__PURE__ */ jsx("span", { className: "bg-[image:var(--gradient-hero)] bg-clip-text text-transparent", children: "conectados ao WhatsApp" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg text-muted-foreground", children: "Organize consultas e retornos, gerencie planos e envie confirmações pelo WhatsApp em um clique." }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-center gap-3", children: /* @__PURE__ */ jsx(Link, { to: "/auth", children: /* @__PURE__ */ jsx(Button, { size: "lg", className: "bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]", children: "Começar agora" }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mx-auto mt-20 grid max-w-5xl gap-5 md:grid-cols-3", children: [{
        icon: Calendar,
        t: "Agendamentos rápidos",
        d: "Cadastre paciente, horário, plano e tipo (consulta ou retorno) em segundos."
      }, {
        icon: MessageCircle,
        t: "WhatsApp em 1 clique",
        d: "Envie confirmação, lembrete 24h ou reagendamento direto pelo WhatsApp do paciente."
      }, {
        icon: ShieldCheck,
        t: "Seus dados protegidos",
        d: "Cada clínica acessa apenas seus próprios pacientes e agendamentos."
      }].map((f) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-[image:var(--gradient-card)] p-6 shadow-[var(--shadow-card)]", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(f.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 font-display text-lg font-bold", children: f.t }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: f.d })
      ] }, f.t)) })
    ] })
  ] });
}
export {
  Landing as component
};
