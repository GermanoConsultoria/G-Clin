import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/pacientes/$pacienteId")({ component: PacienteDetalheDisabled });

function PacienteDetalheDisabled() {
  const navigate = useNavigate();
  useEffect(() => { navigate({ to: "/overview" }); }, [navigate]);
  return null;
}

/* MÓDULO DESATIVADO TEMPORARIAMENTE A PEDIDO DO CLIENTE (ver conversa de 16/07/2026) — código preservado para reativação futura.

O código original do PacienteDetalhe, incluindo a geração de PDF da ficha de avaliação,
está preservado aqui. Para reativar, basta descomentar todo este bloco e restaurar o
export const Route com o componente PacienteDetalhe.

Para reativar, refaça as importações necessárias e restaure:
  export const Route = createFileRoute("/_app/pacientes/$pacienteId")({ component: PacienteDetalhe });

O código completo estava no commit anterior ao 16/07/2026.

*/
