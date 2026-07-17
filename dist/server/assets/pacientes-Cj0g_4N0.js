import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
function PacientesDisabled() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: "/overview"
    });
  }, [navigate]);
  return null;
}
export {
  PacientesDisabled as component
};
