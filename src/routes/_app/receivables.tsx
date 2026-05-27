import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, TrendingUp, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/receivables")({ component: Receivables });

type Opt = { id: string; name: string; price?: number };
type Receivable = {
  id: string; description: string; patient_name: string | null; amount: number;
  due_date: string; received_at: string | null; status: "pendente" | "pago" | "atrasado" | "cancelado";
  account_id: string | null; service_id: string | null; notes: string | null;
};

const empty = { description: "", patient_name: "", amount: "0", due_date: new Date().toISOString().slice(0, 10), account_id: "", service_id: "", notes: "" };

function Receivables() {
  const { user } = useAuth();
  const [items, setItems] = useState<Receivable[]>([]);
  const [accounts, setAccounts] = useState<Opt[]>([]);
  const [services, setServices] = useState<Opt[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    const [{ data: r }, { data: a }, { data: s }] = await Promise.all([
      supabase.from("receivables").select("*").order("due_date"),
      supabase.from("chart_accounts").select("id, name").eq("kind", "receita").order("name"),
      supabase.from("services").select("id, name, price").eq("active", true).order("name"),
    ]);
    setItems((r as Receivable[]) ?? []);
    setAccounts((a as Opt[]) ?? []);
    setServices((s as Opt[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const pickService = (id: string) => {
    const svc = services.find((s) => s.id === id);
    setForm({ ...form, service_id: id, amount: svc ? String(svc.price ?? 0) : form.amount, description: svc && !form.description ? svc.name : form.description });
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("receivables").insert({
      user_id: user.id,
      description: form.description, patient_name: form.patient_name || null,
      amount: Number(form.amount), due_date: form.due_date,
      account_id: form.account_id || null, service_id: form.service_id || null, notes: form.notes || null,
    });
    if (error) return toast.error(error.message);
    setForm(empty); setOpen(false); toast.success("Conta a receber criada"); load();
  };

  const markPaid = async (id: string) => {
    const { error } = await supabase.from("receivables").update({ status: "pago", received_at: new Date().toISOString().slice(0, 10) }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Recebido"); load();
  };

  const remove = async (id: string) => { await supabase.from("receivables").delete().eq("id", id); load(); };

  const total = items.filter((i) => i.status === "pendente").reduce((s, i) => s + Number(i.amount), 0);
  const statusColor = (s: string) => ({ pendente: "bg-yellow-100 text-yellow-700", pago: "bg-emerald-100 text-emerald-700", atrasado: "bg-red-100 text-red-700", cancelado: "bg-muted text-muted-foreground" }[s] || "");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Contas a receber</h1>
          <p className="text-sm text-muted-foreground">A receber: <span className="font-semibold text-emerald-600">R$ {total.toFixed(2)}</span></p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-[image:var(--gradient-hero)]"><Plus className="h-4 w-4" /> Nova conta</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova conta a receber</DialogTitle></DialogHeader>
            <form onSubmit={add} className="space-y-3">
              <div>
                <Label>Serviço (opcional)</Label>
                <Select value={form.service_id} onValueChange={pickService}>
                  <SelectTrigger><SelectValue placeholder="Selecione um serviço" /></SelectTrigger>
                  <SelectContent>{services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} — R$ {Number(s.price ?? 0).toFixed(2)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Descrição</Label><Input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Paciente</Label><Input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} /></div>
                <div><Label>Valor (R$)</Label><Input required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Vencimento</Label><Input required type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
                <div>
                  <Label>Conta</Label>
                  <Select value={form.account_id} onValueChange={(v) => setForm({ ...form, account_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{accounts.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Observações</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button type="submit" className="w-full bg-[image:var(--gradient-hero)]">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <div className="text-muted-foreground">Carregando...</div> : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
          <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Nenhuma conta a receber.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((i) => (
            <div key={i.id} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
              <div>
                <div className="font-medium">{i.description}</div>
                <div className="text-xs text-muted-foreground">{i.patient_name} · Vence {new Date(i.due_date).toLocaleDateString("pt-BR")}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-emerald-600">R$ {Number(i.amount).toFixed(2)}</span>
                <span className={`rounded px-2 py-0.5 text-xs ${statusColor(i.status)}`}>{i.status}</span>
                {i.status === "pendente" && <Button size="icon" variant="ghost" onClick={() => markPaid(i.id)} title="Marcar como recebido"><Check className="h-4 w-4 text-emerald-600" /></Button>}
                <Button size="icon" variant="ghost" onClick={() => remove(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
