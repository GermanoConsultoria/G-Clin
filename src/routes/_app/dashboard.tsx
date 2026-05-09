import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, MessageCircle, Trash2, Pencil, Calendar as CalendarIcon, Phone, Zap, AlertTriangle, CheckCircle2, XCircle, Clock, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { buildMessage, whatsappLink, type MsgKind } from "@/lib/whatsapp";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

type Plan = { id: string; name: string };
type Category = { id: string; name: string };
export type Appointment = {
  id: string;
  patient_name: string;
  phone: string;
  plan_id: string | null;
  plan_name: string | null;
  type: "consulta" | "retorno";
  scheduled_at: string;
  status: "agendado" | "confirmado" | "concluido" | "cancelado";
  notes: string | null;
  wants_to_anticipate: boolean;
  category: string | null;
};

const statusStyle: Record<Appointment["status"], { cls: string; icon: typeof Clock; label: string }> = {
  agendado: { cls: "bg-warning/15 text-warning border-warning/30", icon: Clock, label: "Aguardando" },
  confirmado: { cls: "bg-success/15 text-success border-success/30", icon: CheckCircle2, label: "Confirmado" },
  concluido: { cls: "bg-muted text-muted-foreground", icon: CheckCircle2, label: "Concluído" },
  cancelado: { cls: "bg-destructive/15 text-destructive border-destructive/30", icon: XCircle, label: "Cancelado" },
};

function Dashboard() {
  const { user } = useAuth();
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [anticipateFor, setAnticipateFor] = useState<Appointment | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: a }, { data: p }, { data: c }] = await Promise.all([
      supabase.from("appointments").select("*").order("scheduled_at", { ascending: true }),
      supabase.from("plans").select("id, name").order("name"),
      supabase.from("categories").select("id, name").order("name"),
    ]);
    setAppts((a as Appointment[]) ?? []);
    setPlans((p as Plan[]) ?? []);
    setCategories((c as Category[]) ?? []);
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

  const updateStatus = async (a: Appointment, status: Appointment["status"]) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", a.id);
    if (error) return toast.error(error.message);
    if (status === "cancelado") {
      // oferecer disparo para quem aceita antecipar
      setAnticipateFor({ ...a, status });
    }
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
            categories={categories}
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
            const s = statusStyle[a.status];
            const SIcon = s.icon;
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
                      <Badge variant="outline" className={s.cls}>
                        <SIcon className="mr-1 h-3 w-3" /> {s.label}
                      </Badge>
                      <Badge variant="secondary">{a.type === "retorno" ? "Retorno" : "Consulta"}</Badge>
                      {a.category && <Badge variant="outline">{a.category}</Badge>}
                      {a.wants_to_anticipate && (
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          <Zap className="mr-1 h-3 w-3" /> Aceita antecipar
                        </Badge>
                      )}
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
                  <Select value={a.status} onValueChange={(v) => updateStatus(a, v as Appointment["status"])}>
                    <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendado">Aguardando</SelectItem>
                      <SelectItem value="confirmado">Confirmado (sim)</SelectItem>
                      <SelectItem value="cancelado">Cancelado (não)</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
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

      <AnticipateDialog
        appts={appts}
        canceled={anticipateFor}
        onClose={() => setAnticipateFor(null)}
      />
    </div>
  );
}

function AnticipateDialog({
  appts, canceled, onClose,
}: { appts: Appointment[]; canceled: Appointment | null; onClose: () => void }) {
  const candidates = useMemo(() => {
    if (!canceled) return [];
    const slot = new Date(canceled.scheduled_at);
    return appts.filter(
      (x) =>
        x.id !== canceled.id &&
        x.wants_to_anticipate &&
        x.status !== "cancelado" &&
        x.status !== "concluido" &&
        new Date(x.scheduled_at) > slot,
    );
  }, [appts, canceled]);

  const send = (c: Appointment) => {
    if (!canceled) return;
    const msg = buildMessage({
      kind: "antecipar",
      patientName: c.patient_name,
      scheduledAt: new Date(c.scheduled_at),
      type: c.type,
      planName: c.plan_name,
      newSlot: new Date(canceled.scheduled_at),
    });
    window.open(whatsappLink(c.phone, msg), "_blank");
  };

  return (
    <Dialog open={!!canceled} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" /> Oferecer vaga antecipada
          </DialogTitle>
          <DialogDescription>
            {canceled && (
              <>Vaga liberada: <b>{format(new Date(canceled.scheduled_at), "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</b>.{" "}
              Quem responder *SIM* primeiro fica com o horário.</>
            )}
          </DialogDescription>
        </DialogHeader>
        {candidates.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
            Nenhum paciente futuro marcou que aceita antecipar.
          </div>
        ) : (
          <div className="max-h-80 space-y-2 overflow-auto">
            {candidates.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">{c.patient_name}</div>
                  <div className="text-xs text-muted-foreground">
                    Atual: {format(new Date(c.scheduled_at), "dd/MM HH:mm", { locale: ptBR })} · {c.phone}
                  </div>
                </div>
                <Button size="sm" className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90" onClick={() => send(c)}>
                  <MessageCircle className="h-4 w-4" /> Oferecer
                </Button>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AppointmentDialog({
  plans, categories, editing, onClose, onSaved,
}: { plans: Plan[]; categories: Category[]; editing: Appointment | null; onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [planId, setPlanId] = useState<string>("none");
  const [category, setCategory] = useState<string>("none");
  const [type, setType] = useState<"consulta" | "retorno">("consulta");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [anticipate, setAnticipate] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      const d = new Date(editing.scheduled_at);
      setName(editing.patient_name);
      setPhone(editing.phone);
      setPlanId(editing.plan_id ?? "none");
      setCategory(editing.category ?? "none");
      setType(editing.type);
      setDate(format(d, "yyyy-MM-dd"));
      setTime(format(d, "HH:mm"));
      setNotes(editing.notes ?? "");
      setAnticipate(editing.wants_to_anticipate);
    } else {
      setName(""); setPhone(""); setPlanId("none"); setCategory("none"); setType("consulta");
      setDate(format(new Date(), "yyyy-MM-dd")); setTime("09:00"); setNotes(""); setAnticipate(false);
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
      category: category === "none" ? null : category,
      type,
      scheduled_at,
      notes: notes || null,
      wants_to_anticipate: anticipate,
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
          <Label>Categoria do paciente</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="Ex: Gestante, Ginecologia" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem categoria</SelectItem>
              {categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {categories.length === 0 && (
            <p className="text-xs text-muted-foreground">Cadastre categorias na aba "Categorias" para selecionar aqui.</p>
          )}
        </div>
        <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-3">
          <div className="space-y-0.5">
            <Label className="text-sm">Aceita antecipar consulta?</Label>
            <p className="text-xs text-muted-foreground">Em caso de cancelamento de outro paciente, será notificado para pegar a vaga.</p>
          </div>
          <Switch checked={anticipate} onCheckedChange={setAnticipate} />
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
