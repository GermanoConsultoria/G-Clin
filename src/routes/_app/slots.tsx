import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { addDays, format, isBefore, startOfDay, addMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/slots")({ component: Slots });

type Appt = { id: string; scheduled_at: string; status: string };

const ALL_TIMES = Array.from({ length: 22 }, (_, i) => {
  const h = 8 + Math.floor(i / 2);
  const m = (i % 2) * 30;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}); // 08:00 → 18:30 a cada 30min

function Slots() {
  const { user } = useAuth();
  const [appts, setAppts] = useState<Appt[]>([]);
  const [fromDate, setFromDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [days, setDays] = useState(14);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [slotMinutes] = useState(30);

  useEffect(() => {
    if (!user) return;
    const start = new Date(fromDate);
    const end = addDays(start, days);
    supabase
      .from("appointments")
      .select("id, scheduled_at, status")
      .gte("scheduled_at", start.toISOString())
      .lte("scheduled_at", end.toISOString())
      .then(({ data }) => setAppts((data as Appt[]) ?? []));
  }, [user, fromDate, days]);

  const busy = useMemo(() => {
    const set = new Set<string>();
    for (const a of appts) {
      if (a.status === "cancelado") continue;
      set.add(format(new Date(a.scheduled_at), "yyyy-MM-dd HH:mm"));
    }
    return set;
  }, [appts]);

  const free = useMemo(() => {
    const result: Date[] = [];
    const start = startOfDay(new Date(fromDate));
    const now = new Date();
    for (let d = 0; d < days; d++) {
      const day = addDays(start, d);
      for (const t of ALL_TIMES) {
        if (selectedTimes.length && !selectedTimes.includes(t)) continue;
        const [h, m] = t.split(":").map(Number);
        const slot = addMinutes(addMinutes(day, h * 60), m);
        if (isBefore(slot, now)) continue;
        const key = format(slot, "yyyy-MM-dd HH:mm");
        if (!busy.has(key)) result.push(slot);
      }
    }
    return result.slice(0, 60);
  }, [fromDate, days, busy, selectedTimes]);

  const toggleTime = (t: string) =>
    setSelectedTimes((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Encontrar horário</h1>
        <p className="text-sm text-muted-foreground">Localize o próximo dia/horário disponível, filtrando pelos horários que prefere.</p>
      </div>

      <div className="mb-6 grid gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-card)] md:grid-cols-3">
        <div className="space-y-1.5">
          <Label>A partir de</Label>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Janela (dias)</Label>
          <Input type="number" min={1} max={60} value={days} onChange={(e) => setDays(Number(e.target.value) || 14)} />
        </div>
        <div className="space-y-1.5">
          <Label>Slot</Label>
          <div className="flex h-10 items-center rounded-md border bg-muted/30 px-3 text-sm text-muted-foreground">{slotMinutes} min</div>
        </div>
        <div className="space-y-2 md:col-span-3">
          <Label>Horários preferidos (vazio = todos)</Label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TIMES.map((t) => {
              const on = selectedTimes.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTime(t)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    on ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              );
            })}
            {selectedTimes.length > 0 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedTimes([])}>
                Limpar
              </Button>
            )}
          </div>
        </div>
      </div>

      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
        <Search className="h-4 w-4" /> {free.length} {free.length === 1 ? "horário livre" : "horários livres"}
      </h2>

      {free.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
          Nenhum horário disponível com esses filtros.
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {free.map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border bg-card p-3 shadow-[var(--shadow-card)]">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold capitalize">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                  {format(s, "EEE, dd 'de' MMM", { locale: ptBR })}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {format(s, "HH:mm")}
                </div>
              </div>
              {i === 0 && <Badge className="bg-primary/10 text-primary">+ próximo</Badge>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
