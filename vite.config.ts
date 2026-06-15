import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify("https://otjzxrwuzkugpfwnyuox.supabase.co"),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90anp4cnd1emt1Z3Bmd255dW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTQxNTMsImV4cCI6MjA5NjAzMDE1M30.WXW2h_GiR75QxqFSLTDSC1wTjyjVEY-GzmybXfcdp5w"),
    },
  },
});