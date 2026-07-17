import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
function PacienteDetalheDisabled() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: "/overview"
    });
  }, [navigate]);
  return null;
}
export {
  PacienteDetalheDisabled as component
};
