import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, useLocation, Outlet, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Home, Calendar, Search, Clock, Briefcase, TrendingUp, TrendingDown, Scale, BookOpen, Users, Tag, FolderHeart, LogOut } from "lucide-react";
import { u as useAuth, s as supabase } from "./router-C9Orusqq.js";
import { l as logoGabriela } from "./logo_gabriela-C_GDyDSZ.js";
import "@tanstack/react-query";
import "sonner";
import "@supabase/supabase-js";
const mainNavItems = [{
  to: "/overview",
  label: "Painel",
  icon: Home
}, {
  to: "/dashboard",
  label: "Agendamentos",
  icon: Calendar
}, {
  to: "/slots",
  label: "Horários livres",
  icon: Search
}, {
  to: "/hours",
  label: "Funcionamento",
  icon: Clock
}, {
  to: "/services",
  label: "Serviços",
  icon: Briefcase
}];
const financeItems = [{
  to: "/receivables",
  label: "A receber",
  icon: TrendingUp
}, {
  to: "/payables",
  label: "A pagar",
  icon: TrendingDown
}, {
  to: "/balance",
  label: "Balancete",
  icon: Scale
}, {
  to: "/chart-accounts",
  label: "Plano de contas",
  icon: BookOpen
}];
const configItems = [{
  to: "/config/usuarios",
  label: "Usuários",
  icon: Users
}, {
  to: "/plans",
  label: "Convênios",
  icon: Tag
}, {
  to: "/categories",
  label: "Categorias",
  icon: FolderHeart
}];
function NavItem({
  item,
  pathname,
  isCollapsed,
  setMobileOpen
}) {
  const active = pathname.startsWith(item.to);
  return /* @__PURE__ */ jsxs(Link, { to: item.to, title: isCollapsed ? item.label : void 0, onClick: () => setMobileOpen(false), className: `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isCollapsed ? "justify-center" : "justify-start gap-3"} ${active ? "bg-[#C8A56A]/10 text-[#C8A56A]" : "text-gray-700 hover:bg-black/5"}`, children: [
    /* @__PURE__ */ jsx(item.icon, { className: `h-6 w-6 shrink-0 ${active ? "text-[#C8A56A]" : "text-[#A87C3F]"}` }),
    !isCollapsed && /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap", children: item.label })
  ] });
}
function AppLayout() {
  const {
    user,
    loading
  } = useAuth();
  const nav = useNavigate();
  const {
    pathname
  } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  useEffect(() => {
    if (!loading && !user) nav({
      to: "/auth"
    });
  }, [loading, user, nav]);
  if (loading || !user) {
    return /* @__PURE__ */ jsx("div", { className: "grid min-h-screen place-items-center text-muted-foreground", children: "Carregando..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-gray-50 font-sans overflow-hidden", children: [
    mobileOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity", onClick: () => setMobileOpen(false) }),
    /* @__PURE__ */ jsxs("aside", { className: `fixed inset-y-0 left-0 z-50 flex flex-col bg-[#FAF6F1] shadow-xl transition-all duration-300 ease-in-out lg:static
          ${mobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-72"}
        `, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex h-20 items-center justify-between px-4 border-b border-[#C8A56A]/10", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 overflow-hidden transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0 hidden lg:flex" : "opacity-100 w-auto"}`, children: [
          /* @__PURE__ */ jsx("img", { src: logoGabriela, alt: "Dra. Gabriela", className: "h-10 w-10 shrink-0 rounded-full border border-[#C8A56A] object-cover" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx("span", { className: "font-display text-sm font-bold text-[#A87C3F] whitespace-nowrap", children: "Dra. Gabriela" }) })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "hidden lg:flex p-2 rounded-md text-[#A87C3F] hover:bg-black/5 transition-colors mx-auto", onClick: () => setIsCollapsed(!isCollapsed), children: /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx("button", { className: "lg:hidden text-gray-400 hover:text-gray-600 p-2", onClick: () => setMobileOpen(false), children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-3 py-6 flex flex-col gap-2", children: [
        mainNavItems.map((item) => /* @__PURE__ */ jsx(NavItem, { item, pathname, isCollapsed, setMobileOpen }, item.to)),
        /* @__PURE__ */ jsx("div", { className: "my-2 border-t border-[#C8A56A]/20" }),
        !isCollapsed && /* @__PURE__ */ jsx("span", { className: "px-4 text-xs font-bold text-[#A87C3F]/60 uppercase tracking-wider mt-2 mb-1", children: "Finanças" }),
        financeItems.map((item) => /* @__PURE__ */ jsx(NavItem, { item, pathname, isCollapsed, setMobileOpen }, item.to)),
        /* @__PURE__ */ jsx("div", { className: "my-2 border-t border-[#C8A56A]/20" }),
        !isCollapsed && /* @__PURE__ */ jsx("span", { className: "px-4 text-xs font-bold text-[#A87C3F]/60 uppercase tracking-wider mt-2 mb-1", children: "Sistema" }),
        configItems.map((item) => /* @__PURE__ */ jsx(NavItem, { item, pathname, isCollapsed, setMobileOpen }, item.to))
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-[#C8A56A]/20 p-3", children: /* @__PURE__ */ jsxs("button", { onClick: () => supabase.auth.signOut().then(() => nav({
        to: "/"
      })), title: isCollapsed ? "Sair" : void 0, className: `flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 ${isCollapsed ? "justify-center" : "justify-start gap-3"}`, children: [
        /* @__PURE__ */ jsx(LogOut, { className: "h-6 w-6 shrink-0 text-red-500" }),
        !isCollapsed && /* @__PURE__ */ jsx("span", { children: "Sair" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col overflow-hidden h-screen", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 font-display font-bold text-[#A87C3F]", children: [
          /* @__PURE__ */ jsx("img", { src: logoGabriela, alt: "Dra. Gabriela", className: "h-9 w-9 rounded-full border border-[#C8A56A] object-cover" }),
          "Dra. Gabriela"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setMobileOpen(true), className: "rounded-md p-2 text-[#A87C3F] hover:bg-gray-100 transition-colors", children: /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" }) })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-auto bg-[#FBFBFA] p-6 lg:p-10 relative", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AppLayout as component
};
