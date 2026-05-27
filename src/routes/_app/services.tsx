import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Briefcase, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/services")({ component: Services });

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cost: number;
  duration_minutes: number;
  active: boolean;
};

const empty = { name: "", description: "", price: "0", cost: "0", duration_minutes: "30", active: true };

function Services() {
  const { user } = useAuth();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("services").select("*").order("name");
    setItems((data as Service[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      cost: Number(form.cost),
      duration_minutes: Number(form.duration_minutes),
      active: form.active,
    };
    const { error } = editingId
      ? await supabase.from("services").update(payload).eq("id", editingId)
      : await supabase.from("services").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Serviço atualizado" : "Serviço cadastrado");
    setOpen(false); setForm(empty); setEditingId(null); load();
  };

  const edit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      description: s.description ?? "",
      price: String(s.price),
      cost: String(s.cost),
      duration_minutes: String(s.duration_minutes),
      active: s.active,
    });
    setOpen(true);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removido"); load();
  };

  const margin = (s: Service) => s.price > 0 ? (((s.price - s.cost) / s.price) * 100).toFixed(1) : "0";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Serviços</h1>
          <p className="text-sm text-muted-foreground">Cadastro e precificação dos serviços oferecidos.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm(empty); setEditingId(null); } }}>
          <DialogTrigger asChild>
            <Button className="bg-[image:var(--gradient-hero)]"><Plus className="h-4 w-4" /> Novo serviço</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "Editar" : "Novo"} serviço</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-3">
              <div><Label>Nome</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Preço (R$)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div><Label>Custo (R$)</Label><Input type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
                <div><Label>Duração (min)</Label><Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} /></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} /><Label>Ativo</Label></div>
              <Button type="submit" className="w-full bg-[image:var(--gradient-hero)]">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <div className="text-muted-foreground">Carregando...</div> : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhum serviço cadastrado.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((s) => (
            <div key={s.id} className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{s.name}</span>
                    {!s.active && <span className="rounded bg-muted px-2 py-0.5 text-xs">Inativo</span>}
                  </div>
                  {s.description && <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => edit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded bg-muted p-2"><div className="text-muted-foreground">Preço</div><div className="font-semibold text-foreground">R$ {Number(s.price).toFixed(2)}</div></div>
                <div className="rounded bg-muted p-2"><div className="text-muted-foreground">Custo</div><div className="font-semibold">R$ {Number(s.cost).toFixed(2)}</div></div>
                <div className="rounded bg-muted p-2"><div className="text-muted-foreground">Margem</div><div className="font-semibold text-primary">{margin(s)}%</div></div>
                <div className="rounded bg-muted p-2"><div className="text-muted-foreground">Duração</div><div className="font-semibold">{s.duration_minutes}min</div></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
