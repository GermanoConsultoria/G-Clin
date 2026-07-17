import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
function PlansDisabled() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: "/overview"
    });
  }, [navigate]);
  return null;
}
export {
  PlansDisabled as component
};
