import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Toaster as Toaster$1 } from "sonner";
import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function createSupabaseClient() {
  const SUPABASE_URL = "https://otjzxrwuzkugpfwnyuox.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90anp4cnd1emt1Z3Bmd255dW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTQxNTMsImV4cCI6MjA5NjAzMDE1M30.WXW2h_GiR75QxqFSLTDSC1wTjyjVEY-GzmybXfcdp5w";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const Ctx = createContext({ user: null, session: null, loading: true });
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return /* @__PURE__ */ jsx(Ctx.Provider, { value: { user: session?.user ?? null, session, loading }, children });
}
const useAuth = () => useContext(Ctx);
const appCss = "/assets/styles-D7H634YP.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Página não encontrada" }),
    /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90", children: "Voltar" })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold", children: "Algo deu errado" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
        children: "Tentar novamente"
      }
    )
  ] }) });
}
const Route$j = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "G-Clin" },
      { name: "description", content: "G-Clin: sistema de agendamentos e gestão para clínicas de estética." }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$j.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { richColors: true, position: "top-right" })
  ] }) });
}
const $$splitComponentImporter$i = () => import("./auth-Cu9PMJXV.js");
const Route$i = createFileRoute("/auth")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./agendar-Ddy6zRzr.js");
const Route$h = createFileRoute("/agendar")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./_app-Dv8ncuXz.js");
const Route$g = createFileRoute("/_app")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./index-fj81JIr1.js");
const Route$f = createFileRoute("/")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const {
      data
    } = await supabase.auth.getSession();
    if (data.session) throw redirect({
      to: "/dashboard"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./slots-Cr8xvDNr.js");
const Route$e = createFileRoute("/_app/slots")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./services-CWeVv8TK.js");
const Route$d = createFileRoute("/_app/services")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./receivables-pQvLNxK1.js");
const Route$c = createFileRoute("/_app/receivables")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./plans-pPmgORyz.js");
const Route$b = createFileRoute("/_app/plans")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./pending-payments-CCAjp41c.js");
const Route$a = createFileRoute("/_app/pending-payments")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./payables-Dgv_G_Vt.js");
const Route$9 = createFileRoute("/_app/payables")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./pacientes-Cj0g_4N0.js");
const Route$8 = createFileRoute("/_app/pacientes")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./overview-tPEIMKcx.js");
const Route$7 = createFileRoute("/_app/overview")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./hours-Cg0b9K98.js");
const Route$6 = createFileRoute("/_app/hours")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./dashboard-7Yn1lfIU.js");
const Route$5 = createFileRoute("/_app/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./chart-accounts-C-TMq0cP.js");
const Route$4 = createFileRoute("/_app/chart-accounts")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./categories-Fa3j4Fyj.js");
const Route$3 = createFileRoute("/_app/categories")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./balance-BZpO6c05.js");
const Route$2 = createFileRoute("/_app/balance")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./pacientes._pacienteId-CLmu0dJ1.js");
const Route$1 = createFileRoute("/_app/pacientes/$pacienteId")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./config.usuarios-D6_ICO6W.js");
const Route = createFileRoute("/_app/config/usuarios")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AuthRoute = Route$i.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$j
});
const AgendarRoute = Route$h.update({
  id: "/agendar",
  path: "/agendar",
  getParentRoute: () => Route$j
});
const AppRoute = Route$g.update({
  id: "/_app",
  getParentRoute: () => Route$j
});
const IndexRoute = Route$f.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$j
});
const AppSlotsRoute = Route$e.update({
  id: "/slots",
  path: "/slots",
  getParentRoute: () => AppRoute
});
const AppServicesRoute = Route$d.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => AppRoute
});
const AppReceivablesRoute = Route$c.update({
  id: "/receivables",
  path: "/receivables",
  getParentRoute: () => AppRoute
});
const AppPlansRoute = Route$b.update({
  id: "/plans",
  path: "/plans",
  getParentRoute: () => AppRoute
});
const AppPendingPaymentsRoute = Route$a.update({
  id: "/pending-payments",
  path: "/pending-payments",
  getParentRoute: () => AppRoute
});
const AppPayablesRoute = Route$9.update({
  id: "/payables",
  path: "/payables",
  getParentRoute: () => AppRoute
});
const AppPacientesRoute = Route$8.update({
  id: "/pacientes",
  path: "/pacientes",
  getParentRoute: () => AppRoute
});
const AppOverviewRoute = Route$7.update({
  id: "/overview",
  path: "/overview",
  getParentRoute: () => AppRoute
});
const AppHoursRoute = Route$6.update({
  id: "/hours",
  path: "/hours",
  getParentRoute: () => AppRoute
});
const AppDashboardRoute = Route$5.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AppRoute
});
const AppChartAccountsRoute = Route$4.update({
  id: "/chart-accounts",
  path: "/chart-accounts",
  getParentRoute: () => AppRoute
});
const AppCategoriesRoute = Route$3.update({
  id: "/categories",
  path: "/categories",
  getParentRoute: () => AppRoute
});
const AppBalanceRoute = Route$2.update({
  id: "/balance",
  path: "/balance",
  getParentRoute: () => AppRoute
});
const AppPacientesPacienteIdRoute = Route$1.update({
  id: "/$pacienteId",
  path: "/$pacienteId",
  getParentRoute: () => AppPacientesRoute
});
const AppConfigUsuariosRoute = Route.update({
  id: "/config/usuarios",
  path: "/config/usuarios",
  getParentRoute: () => AppRoute
});
const AppPacientesRouteChildren = {
  AppPacientesPacienteIdRoute
};
const AppPacientesRouteWithChildren = AppPacientesRoute._addFileChildren(
  AppPacientesRouteChildren
);
const AppRouteChildren = {
  AppBalanceRoute,
  AppCategoriesRoute,
  AppChartAccountsRoute,
  AppDashboardRoute,
  AppHoursRoute,
  AppOverviewRoute,
  AppPacientesRoute: AppPacientesRouteWithChildren,
  AppPayablesRoute,
  AppPendingPaymentsRoute,
  AppPlansRoute,
  AppReceivablesRoute,
  AppServicesRoute,
  AppSlotsRoute,
  AppConfigUsuariosRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AppRoute: AppRouteWithChildren,
  AgendarRoute,
  AuthRoute
};
const routeTree = Route$j._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router as r,
  supabase as s,
  useAuth as u
};
