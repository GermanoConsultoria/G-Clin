import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/hours")({ component: HoursPage });

const WEEKDAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

type Row = {
  weekday: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  break_start: string | null;
  break_end: string | null;
};

const defaultRow = (weekday: number): Row => ({
  weekday,
  is_open: weekday !== 0,
  open_time: "08:00",
  close_time: "18:00",
  break_start: "12:00",
  break_end: "13:00",
});

function HoursPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>(WEEKDAYS.map((_, i) => defaultRow(i)));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("business_hours")
        .select("weekday,is_open,open_time,close_time,break_start,break_end")
        .eq("user_id", user.id);
      if (data && data.length) {
        const merged = WEEKDAYS.map((_, i) => {
          const r = data.find((d: any) => d.weekday === i);
          return r
            ? {
                weekday: i,
                is_open: r.is_open,
                open_time: (r.open_time as string).slice(0, 5),
                close_time: (r.close_time as string).slice(0, 5),
                break_start: r.break_start ? (r.break_start as string).slice(0, 5) : null,
                break_end: r.break_end ? (r.break_end as string).slice(0, 5) : null,
              }
            : defaultRow(i);
        });
        setRows(merged);
      }
      setLoading(false);
    })();
  }, [user]);

  const update = (i: number, patch: Partial<Row>) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const payload = rows.map((r) => ({
      user_id: user.id,
      weekday: r.weekday,
      is_open: r.is_open,
      open_time: r.open_time,
      close_time: r.close_time,
      break_start: r.break_start || null,
      break_end: r.break_end || null,
    }));
    const { error } = await supabase
      .from("business_hours")
      .upsert(payload, { onConflict: "user_id,weekday" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Horários salvos!");
  };

  if (loading) return <div className="text-muted-foreground">Carregando...</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Horário de funcionamento</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure manualmente os horários da clínica em cada dia da semana.</p>
        </div>
        <Button onClick={save} disabled={saving} className="bg-[image:var(--gradient-hero)]">
          <Save className="mr-2 h-4 w-4" /> {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">{WEEKDAYS[i]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor={`open-${i}`} className="text-xs text-muted-foreground">
                  {row.is_open ? "Aberto" : "Fechado"}
                </Label>
                <Switch
                  id={`open-${i}`}
                  checked={row.is_open}
                  onCheckedChange={(v) => update(i, { is_open: v })}
                />
              </div>
            </div>

            {row.is_open && (
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div>
                  <Label className="text-xs">Abertura</Label>
                  <Input
                    type="time"
                    value={row.open_time}
                    onChange={(e) => update(i, { open_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Fechamento</Label>
                  <Input
                    type="time"
                    value={row.close_time}
                    onChange={(e) => update(i, { close_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Início do intervalo</Label>
                  <Input
                    type="time"
                    value={row.break_start ?? ""}
                    onChange={(e) => update(i, { break_start: e.target.value || null })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Fim do intervalo</Label>
                  <Input
                    type="time"
                    value={row.break_end ?? ""}
                    onChange={(e) => update(i, { break_end: e.target.value || null })}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
