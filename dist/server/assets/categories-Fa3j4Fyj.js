import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
function CategoriesDisabled() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: "/overview"
    });
  }, [navigate]);
  return null;
}
export {
  CategoriesDisabled as component
};
