import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/chart-accounts")({ component: ChartAccounts });

type Account = { id: string; code: string; name: string; kind: "receita" | "despesa" };

function ChartAccounts() {
  const { user } = useAuth();
  const [items, setItems] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", name: "", kind: "receita" as "receita" | "despesa" });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("chart_accounts").select("id, code, name, kind").order("code");
    setItems((data as Account[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.code.trim() || !form.name.trim()) return;
    const { error } = await supabase.from("chart_accounts").insert({ user_id: user.id, ...form });
    if (error) return toast.error(error.message);
    setForm({ code: "", name: "", kind: form.kind }); toast.success("Conta adicionada"); load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("chart_accounts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removida"); load();
  };

  const receitas = items.filter((i) => i.kind === "receita");
  const despesas = items.filter((i) => i.kind === "despesa");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Plano de contas</h1>
        <p className="text-sm text-muted-foreground">Organize as categorias de receitas e despesas da clínica.</p>
      </div>

      <form onSubmit={add} className="mb-6 grid grid-cols-1 gap-2 md:grid-cols-[120px_1fr_160px_auto]">
        <div><Label className="text-xs">Código</Label><Input placeholder="1.1.01" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
        <div><Label className="text-xs">Nome</Label><Input placeholder="Consultas particulares" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div>
          <Label className="text-xs">Tipo</Label>
          <Select value={form.kind} onValueChange={(v: "receita" | "despesa") => setForm({ ...form, kind: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end"><Button type="submit" className="bg-[image:var(--gradient-hero)]"><Plus className="h-4 w-4" /></Button></div>
      </form>

      {loading ? <div className="text-muted-foreground">Carregando...</div> : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhuma conta cadastrada ainda.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {(["Receitas", "Despesas"] as const).map((title, idx) => {
            const list = idx === 0 ? receitas : despesas;
            const color = idx === 0 ? "text-emerald-600" : "text-red-600";
            return (
              <div key={title}>
                <h2 className={`mb-2 font-display text-lg font-semibold ${color}`}>{title}</h2>
                <div className="space-y-2">
                  {list.map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted-foreground">{a.code}</span>
                        <span className="text-sm">{a.name}</span>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => remove(a.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {list.length === 0 && <p className="text-xs text-muted-foreground">Vazio</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
