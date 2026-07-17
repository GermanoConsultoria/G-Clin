import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./server-9u5VzPi5.js";
import { z } from "zod";
import { r as requireSupabaseAuth } from "./auth-middleware-5HXqSLz1.js";
import { createClient } from "@supabase/supabase-js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "./createMiddleware-BvN2ghIY.js";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function getServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
const modulosValidos = z.array(z.enum(["agendamentos", "servicos", "financeiro", "usuarios", "configuracoes"]));
const listUsuarios_createServerFn_handler = createServerRpc({
  id: "fa8b018d25091808e4557cd85750b8f301c3f468d03885c39366e0201ab2cad4",
  name: "listUsuarios",
  filename: "src/lib/usuarios.functions.ts"
}, (opts) => listUsuarios.__executeServer(opts));
const listUsuarios = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listUsuarios_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("profiles").select("*").order("full_name");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const criarUsuario_createServerFn_handler = createServerRpc({
  id: "6be9b074e1dc75034aadf509e0ecb0212a4834f104076be035564e1b5fbcb29e",
  name: "criarUsuario",
  filename: "src/lib/usuarios.functions.ts"
}, (opts) => criarUsuario.__executeServer(opts));
const criarUsuario = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email(),
  cargo: z.string().max(100).optional(),
  role: z.enum(["USER", "MANAGER", "OWNER"]).default("USER"),
  senha: z.string().min(6),
  modulos: modulosValidos.default([])
}).parse(d)).handler(criarUsuario_createServerFn_handler, async ({
  data
}) => {
  const admin = getServiceClient();
  const {
    data: user,
    error
  } = await admin.auth.admin.createUser({
    email: data.email,
    password: data.senha,
    email_confirm: true,
    user_metadata: {
      full_name: data.full_name,
      role: data.role
    }
  });
  if (error) throw new Error(error.message);
  if (!user.user) throw new Error("Falha ao criar usuário.");
  const {
    error: profileError
  } = await admin.from("profiles").update({
    full_name: data.full_name,
    cargo: data.cargo ?? null,
    role: data.role,
    modulos: data.modulos,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", user.user.id);
  if (profileError) throw new Error(profileError.message);
  return {
    ok: true,
    id: user.user.id
  };
});
const editarUsuario_createServerFn_handler = createServerRpc({
  id: "2e7d4de4d12e3a489f09a715dae30130e6bbefb367da9168dbad787a1b99e177",
  name: "editarUsuario",
  filename: "src/lib/usuarios.functions.ts"
}, (opts) => editarUsuario.__executeServer(opts));
const editarUsuario = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1).max(200),
  cargo: z.string().max(100).nullable().optional(),
  role: z.enum(["USER", "MANAGER", "OWNER"]),
  modulos: modulosValidos.default([])
}).parse(d)).handler(editarUsuario_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("profiles").update({
    full_name: data.full_name,
    cargo: data.cargo ?? null,
    role: data.role,
    modulos: data.modulos,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const toggleAtivoUsuario_createServerFn_handler = createServerRpc({
  id: "8de4718dddfb2e868007204d953b75e12394ef529404b76c21f4378e8276756a",
  name: "toggleAtivoUsuario",
  filename: "src/lib/usuarios.functions.ts"
}, (opts) => toggleAtivoUsuario.__executeServer(opts));
const toggleAtivoUsuario = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid()
}).parse(d)).handler(toggleAtivoUsuario_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: profile,
    error: fetchError
  } = await context.supabase.from("profiles").select("ativo").eq("id", data.id).single();
  if (fetchError || !profile) throw new Error("Usuário não encontrado.");
  const {
    error
  } = await context.supabase.from("profiles").update({
    ativo: !profile.ativo,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const alterarSenhaUsuario_createServerFn_handler = createServerRpc({
  id: "e85438eaa5d5896a10b1304167a57799001a3b6acf9fa48ae7972b9d7d96210e",
  name: "alterarSenhaUsuario",
  filename: "src/lib/usuarios.functions.ts"
}, (opts) => alterarSenhaUsuario.__executeServer(opts));
const alterarSenhaUsuario = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
  id: z.string().uuid(),
  nova_senha: z.string().min(6)
}).parse(d)).handler(alterarSenhaUsuario_createServerFn_handler, async ({
  data
}) => {
  const admin = getServiceClient();
  const {
    error
  } = await admin.auth.admin.updateUserById(data.id, {
    password: data.nova_senha
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  alterarSenhaUsuario_createServerFn_handler,
  criarUsuario_createServerFn_handler,
  editarUsuario_createServerFn_handler,
  listUsuarios_createServerFn_handler,
  toggleAtivoUsuario_createServerFn_handler
};
