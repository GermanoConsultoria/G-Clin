import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, MessageCircle, Trash2, Pencil, Calendar as CalendarIcon, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { buildMessage, whatsappLink, type MsgKind } from "@/lib/whatsapp";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

type Plan = { id: string; name: string };
type Appointment = {
  id: string;
  patient_name: string;
  phone: string;
  plan_id: string | null;
  plan_name: string | null;
  type: "consulta" | "retorno";
  scheduled_at: string;
  status: "agendado" | "confirmado" | "concluido" | "cancelado";
  notes: string | null;
};

const statusColors: Record<Appointment["status"], string> = {
  agendado: "bg-primary/10 text-primary border-primary/20",
  confirmado: "bg-success/15 text-success border-success/30",
  concluido: "bg-muted text-muted-foreground",
  cancelado: "bg-destructive/10 text-destructive border-destructive/20",
};

function Dashboard() {
  const { user } = useAuth();
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: a }, { data: p }] = await Promise.all([
      supabase.from("appointments").select("*").order("scheduled_at", { ascending: true }),
      supabase.from("plans").select("id, name").order("name"),
    ]);
    setAppts((a as Appointment[]) ?? []);
    setPlans((p as Plan[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Agendamento removido");
    load();
  };

  const sendWhats = (a: Appointment, kind: MsgKind) => {
    const msg = buildMessage({
      kind,
      patientName: a.patient_name,
      scheduledAt: new Date(a.scheduled_at),
      type: a.type,
      planName: a.plan_name,
    });
    window.open(whatsappLink(a.phone, msg), "_blank");
  };

  const updateStatus = async (id: string, status: Appointment["status"]) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Agendamentos</h1>
          <p className="text-sm text-muted-foreground">{appts.length} {appts.length === 1 ? "consulta" : "consultas"} no total</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]">
              <Plus className="h-4 w-4" /> Novo agendamento
            </Button>
          </DialogTrigger>
          <AppointmentDialog
            plans={plans}
            editing={editing}
            onClose={() => { setOpen(false); setEditing(null); }}
            onSaved={() => { setOpen(false); setEditing(null); load(); }}
          />
        </Dialog>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Carregando...</div>
      ) : appts.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
          <CalendarIcon className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 font-display text-lg font-semibold">Nenhum agendamento ainda</h3>
          <p className="mt-1 text-sm text-muted-foreground">Clique em "Novo agendamento" para começar.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {appts.map((a) => {
            const date = new Date(a.scheduled_at);
            return (
              <div key={a.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <div className="text-center leading-tight">
                      <div className="text-xs font-medium uppercase">{format(date, "MMM", { locale: ptBR })}</div>
                      <div className="text-lg font-bold">{format(date, "dd")}</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">{a.patient_name}</h3>
                      <Badge variant="outline" className={statusColors[a.status]}>{a.status}</Badge>
                      <Badge variant="secondary">{a.type === "retorno" ? "Retorno" : "Consulta"}</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{format(date, "EEEE, HH:mm", { locale: ptBR })}</span>
                      <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{a.phone}</span>
                      {a.plan_name && <span>Plano: {a.plan_name}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => sendWhats(a, "agendamento")}>Enviar agendamento</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => sendWhats(a, "confirmacao")}>Confirmar (24h antes)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => sendWhats(a, "reagendamento")}>Reagendar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v as Appointment["status"])}>
                    <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendado">Agendado</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(a); setOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(a.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AppointmentDialog({
  plans, editing, onClose, onSaved,
}: { plans: Plan[]; editing: Appointment | null; onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [planId, setPlanId] = useState<string>("none");
  const [type, setType] = useState<"consulta" | "retorno">("consulta");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      const d = new Date(editing.scheduled_at);
      setName(editing.patient_name);
      setPhone(editing.phone);
      setPlanId(editing.plan_id ?? "none");
      setType(editing.type);
      setDate(format(d, "yyyy-MM-dd"));
      setTime(format(d, "HH:mm"));
      setNotes(editing.notes ?? "");
    } else {
      setName(""); setPhone(""); setPlanId("none"); setType("consulta");
      setDate(format(new Date(), "yyyy-MM-dd")); setTime("09:00"); setNotes("");
    }
  }, [editing]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const scheduled_at = new Date(`${date}T${time}`).toISOString();
    const plan = plans.find((p) => p.id === planId);
    const payload = {
      user_id: user.id,
      patient_name: name,
      phone,
      plan_id: planId === "none" ? null : planId,
      plan_name: plan?.name ?? null,
      type,
      scheduled_at,
      notes: notes || null,
    };
    const { error } = editing
      ? await supabase.from("appointments").update(payload).eq("id", editing.id)
      : await supabase.from("appointments").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Agendamento atualizado" : "Agendamento criado");
    onSaved();
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{editing ? "Editar agendamento" : "Novo agendamento"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Nome do paciente</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>Telefone (WhatsApp)</Label>
          <Input placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Data</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Horário</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as "consulta" | "retorno")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="consulta">Consulta</SelectItem>
                <SelectItem value="retorno">Retorno</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Plano</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Particular / nenhum</SelectItem>
                {plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Observações</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving} className="bg-[image:var(--gradient-hero)]">
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
