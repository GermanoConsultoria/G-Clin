import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { B as Button } from "./button-TjZkfKyC.js";
import { I as Input } from "./input-C0QjszdI.js";
import { L as Label } from "./label-JU3yqRBo.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-fMRf3trd.js";
import { s as supabase } from "./router-C9Orusqq.js";
import { l as logoGabriela } from "./logo_gabriela-C_GDyDSZ.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-tabs";
import "@tanstack/react-query";
import "@supabase/supabase-js";
const gtechLogo = "/assets/g-tech-logo-Fxfqd9fw.png";
function AuthPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) nav({
        to: "/dashboard"
      });
    });
  }, [nav]);
  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    nav({
      to: "/dashboard"
    });
  };
  const signUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password.length < 8) {
      setLoading(false);
      return toast.error("A senha deve ter pelo menos 8 caracteres.");
    }
    const {
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("weak") || msg.includes("pwned")) return toast.error("Senha muito fraca. Use letras, números e símbolos.");
      if (msg.includes("already") || msg.includes("registered")) return toast.error("Este email já está cadastrado. Faça login.");
      return toast.error(error.message);
    }
    toast.success("Conta criada! Verifique seu email para confirmar.");
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex flex-col items-center justify-center bg-[#FAF6F1] p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md space-y-6", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsx("img", { src: logoGabriela, alt: "Gabriela Clínica de Estética", className: "h-24 w-24 rounded-full border-4 border-[#C8A56A] object-cover shadow-lg", style: {
        boxShadow: "0 4px 24px rgba(200,165,106,0.25)"
      } }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-8 w-8 place-items-center rounded-lg text-white", style: {
          background: "linear-gradient(135deg, #D8BC85 0%, #C8A56A 50%, #A87C3F 100%)"
        }, children: /* @__PURE__ */ jsx("img", { src: logoGabriela, alt: "", className: "h-6 w-6 rounded object-cover" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-display text-xl font-bold text-[#4B3A2A]", children: "G-Clin" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[#6E5A45]", children: "Gabriela Clínica de Estética" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-[#E7D5C1] bg-white p-6 shadow-sm", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "signin", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2 bg-[#F3E7D7]", children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "signin", className: "data-[state=active]:bg-[#C8A56A] data-[state=active]:text-white", children: "Entrar" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "signup", className: "data-[state=active]:bg-[#C8A56A] data-[state=active]:text-white", children: "Criar conta" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "signin", children: /* @__PURE__ */ jsxs("form", { onSubmit: signIn, className: "space-y-4 pt-4", children: [
        /* @__PURE__ */ jsx(Field, { label: "Email", type: "email", value: email, onChange: setEmail }),
        /* @__PURE__ */ jsx(Field, { label: "Senha", type: "password", value: password, onChange: setPassword }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, className: "w-full text-white font-semibold", style: {
          background: "linear-gradient(135deg, #D8BC85 0%, #C8A56A 50%, #A87C3F 100%)"
        }, children: loading ? "Entrando..." : "Entrar" })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "signup", children: /* @__PURE__ */ jsxs("form", { onSubmit: signUp, className: "space-y-4 pt-4", children: [
        /* @__PURE__ */ jsx(Field, { label: "Email", type: "email", value: email, onChange: setEmail }),
        /* @__PURE__ */ jsx(Field, { label: "Senha", type: "password", value: password, onChange: setPassword }),
        /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, className: "w-full text-white font-semibold", style: {
          background: "linear-gradient(135deg, #D8BC85 0%, #C8A56A 50%, #A87C3F 100%)"
        }, children: loading ? "Criando..." : "Criar conta" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 rounded-xl border border-[#E7D5C1] bg-white/60 p-4 text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-widest text-[#6E5A45]", children: "Desenvolvido por" }),
      /* @__PURE__ */ jsx("img", { src: gtechLogo, alt: "G-Tech", className: "h-14 w-14 rounded-lg shadow-sm" }),
      /* @__PURE__ */ jsx("span", { className: "font-display text-base font-bold tracking-wide text-[#4B3A2A]", children: "G-Tech" })
    ] })
  ] }) });
}
function Field({
  label,
  type,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsx(Label, { className: "text-[#4B3A2A]", children: label }),
    /* @__PURE__ */ jsx(Input, { type, value, onChange: (e) => onChange(e.target.value), required: true, minLength: type === "password" ? 8 : void 0, className: "border-[#E7D5C1] focus-visible:ring-[#C8A56A] bg-[#FAF6F1]" })
  ] });
}
export {
  AuthPage as component
};
