import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, ChevronDown, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateSlotsForDay, type BusinessHoursRow } from "@/lib/business-hours";
import logoGabriela from "@/assets/logo_gabriela.jpeg";

export const Route = createFileRoute("/agendar")({ component: AgendarPage });

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  is_hof: boolean;
  category_group: string | null;
};

type DayAppt = {
  scheduled_at: string;
  service_id: string | null;
};

const CATEGORIAS = [
  { value: "sobrancelhas",     label: "Sobrancelhas" },
  { value: "micropigmentacao", label: "Micropigmentação" },
  { value: "depilacao",        label: "Depilação" },
  { value: "facial",           label: "Tratamento Facial" },
  { value: "hof",              label: "HOF (Alto Valor)" },
  { value: "outros",           label: "Outros" },
];

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getSlots(
  date: string,
  duration: number,
  dayAppts: DayAppt[],
  services: Service[],
  bh: BusinessHoursRow | null,
): string[] {
  if (!bh) return [];
  const allSlots = generateSlotsForDay(bh, duration);
  const now = new Date();
  const isToday = date === format(now, "yyyy-MM-dd");

  const busy = dayAppts.map((a) => {
    const start = new Date(a.scheduled_at).getTime();
    const svc = services.find((s) => s.id === a.service_id);
    const dur = svc?.duration_minutes ?? 30;
    return { start, end: start + dur * 60 * 1000 };
  });

  return allSlots.filter((slot) => {
    const slotStart = new Date(`${date}T${slot}`).getTime();
    const slotEnd = slotStart + duration * 60 * 1000;
    if (isToday && slotStart <= now.getTime()) return false;
    return !busy.some((b) => slotStart < b.end && slotEnd > b.start);
  });
}

function AgendarPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHoursRow[]>([]);
  const [clinicUserId, setClinicUserId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState<string>("none");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [dayAppts, setDayAppts] = useState<DayAppt[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const [confirmed, setConfirmed] = useState<{
    name: string; service: string; date: string; time: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: svcs }, { data: bh }, { data: settings }] = await Promise.all([
        supabase.from("services").select("id,name,duration_minutes,price,is_hof,category_group").eq("active", true).order("category_group").order("name"),
        supabase.from("business_hours").select("weekday,is_open,open_time,close_time,break_start,break_end"),
        supabase.from("clinic_settings").select("user_id").limit(1).maybeSingle(),
      ]);
      setServices((svcs as Service[]) ?? []);
      setBusinessHours((bh as BusinessHoursRow[]) ?? []);
      setClinicUserId(settings?.user_id ?? null);
      setInitialLoading(false);
    })();
  }, []);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!date) { setDayAppts([]); setTime(""); return; }
    setLoadingSlots(true);
    supabase
      .from("appointments")
      .select("scheduled_at,service_id")
      .gte("scheduled_at", `${date}T00:00:00`)
      .lte("scheduled_at", `${date}T23:59:59`)
      .in("status", ["agendado", "confirmado", "concluido", "pendente_pagamento"])
      .then(({ data }) => {
        setDayAppts((data as DayAppt[]) ?? []);
        setTime("");
        setLoadingSlots(false);
      });
  }, [date]);

  const selectedService = serviceId !== "none" ? services.find((s) => s.id === serviceId) : null;

  const bhForDay = useMemo(() => {
    if (!date) return null;
    const dow = new Date(`${date}T00:00:00`).getDay();
    return businessHours.find((r) => r.weekday === dow) ?? null;
  }, [date, businessHours]);

  const availableSlots = useMemo(() => {
    if (!date) return [];
    const duration = selectedService?.duration_minutes ?? 30;
    return getSlots(date, duration, dayAppts, services, bhForDay);
  }, [date, bhForDay, selectedService, dayAppts, services]);

  const today = format(new Date(), "yyyy-MM-dd");

  const grupos = CATEGORIAS.map((cat) => ({
    ...cat,
    items: services.filter((s) => (s.category_group ?? "outros") === cat.value),
  })).filter((g) => g.items.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim())                            return setFormError("Preencha seu nome completo.");
    if (phone.replace(/\D/g, "").length < 10)   return setFormError("Preencha um telefone válido.");
    if (serviceId === "none")                    return setFormError("Selecione um serviço.");
    if (!date)                                   return setFormError("Selecione uma data.");
    if (!time)                                   return setFormError("Selecione um horário.");
    if (!clinicUserId)                           return setFormError("Não foi possível identificar a clínica. Tente novamente mais tarde.");

    setSaving(true);
    const svc = services.find((s) => s.id === serviceId);
    const { error } = await supabase.from("appointments").insert({
      user_id: clinicUserId,
      client_name: name.trim(),
      phone: phone.replace(/\D/g, ""),
      service_id: serviceId,
      service_name: svc?.name ?? null,
      scheduled_at: new Date(`${date}T${time}`).toISOString(),
      status: "agendado",
      type: "procedimento",
      wants_to_anticipate: false,
      extra_charge: false,
      notes: notes.trim() || null,
    });
    setSaving(false);

    if (error) return setFormError("Erro ao confirmar agendamento: " + error.message);

    setConfirmed({
      name: name.trim(),
      service: svc?.name ?? "Procedimento",
      date: format(new Date(`${date}T00:00:00`), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
      time,
    });
  };

  const resetForm = () => {
    setName(""); setPhone(""); setServiceId("none"); setDate(""); setTime(""); setNotes("");
    setFormError(null); setConfirmed(null); setDayAppts([]);
  };

  if (confirmed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF6F1] px-6 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#4B3A2A]">Agendamento confirmado!</h2>
          <p className="mt-2 text-sm text-[#6E5A45]">Obrigada pela preferência 🎉</p>

          <div className="mt-6 rounded-2xl border border-[#E7D5C1] bg-white p-5 text-left space-y-4">
            {[
              { label: "Nome",    value: confirmed.name },
              { label: "Serviço", value: confirmed.service },
              { label: "Data",    value: <span className="capitalize">{confirmed.date}</span> },
              { label: "Horário", value: confirmed.time },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-xs font-medium uppercase tracking-wider text-[#9B8575]">{label}</div>
                <div className="mt-0.5 text-sm font-semibold text-[#4B3A2A]">{value}</div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-[#6E5A45]">
            Em breve entraremos em contato pelo WhatsApp para confirmar seu agendamento.
          </p>

          <button
            onClick={resetForm}
            className="mt-6 w-full rounded-xl py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #D8BC85 0%, #C8A56A 50%, #A87C3F 100%)" }}
          >
            Fazer outro agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      <header className="flex flex-col items-center gap-4 px-6 pt-10 pb-8">
        <img
          src={logoGabriela}
          alt="Dra. Gabriela"
          className="h-20 w-20 rounded-full object-cover"
          style={{ border: "4px solid #C8A56A", boxShadow: "0 4px 20px rgba(200,165,106,0.3)" }}
        />
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-[#4B3A2A]">Agende seu procedimento</h1>
          <p className="mt-1 text-sm text-[#6E5A45]">Preencha os dados abaixo para realizar seu agendamento</p>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-16">
        <form onSubmit={handleSubmit} className="space-y-5">

          <Field label="Nome completo *">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="field-input"
            />
          </Field>

          <Field label="Telefone WhatsApp *">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              inputMode="numeric"
              className="field-input"
            />
          </Field>

          <Field label="Serviço *">
            {initialLoading ? (
              <div className="h-12 animate-pulse rounded-xl bg-[#F3E7D7]" />
            ) : (
              <div ref={dropRef} className="relative">
                <button
                  type="button"
                  onClick={() => setDropOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#E7D5C1] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#C8A56A] focus:ring-2 focus:ring-[#C8A56A]/20 transition"
                >
                  <span className={selectedService ? "text-[#4B3A2A]" : "text-[#9B8575]"}>
                    {selectedService ? selectedService.name : "Selecione um serviço..."}
                  </span>
                  <ChevronDown size={16} className={`text-[#A87C3F] transition-transform ${dropOpen ? "rotate-180" : ""}`} />
                </button>

                {dropOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-[#E7D5C1] bg-white shadow-2xl">
                    {grupos.map((grupo) => (
                      <div key={grupo.value}>
                        <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider" style={{ color: "#A87C3F" }}>
                          {grupo.label}
                        </div>
                        {grupo.items.map((svc) => (
                          <button
                            key={svc.id}
                            type="button"
                            onClick={() => { setServiceId(svc.id); setDropOpen(false); setTime(""); }}
                            className={`flex w-full items-center justify-between px-5 py-3 text-left text-sm transition hover:bg-[#FAF6F1] ${
                              serviceId === svc.id ? "bg-[#FAF6F1] font-semibold text-[#A87C3F]" : "text-[#4B3A2A]"
                            }`}
                          >
                            <span>{svc.name}</span>
                            <div className="flex shrink-0 items-center gap-3 text-xs text-[#9B8575]">
                              <span className="flex items-center gap-1"><Clock size={11} />{svc.duration_minutes}min</span>
                              <span>{svc.is_hof && Number(svc.price) === 0 ? "Sob avaliação" : `R$ ${Number(svc.price).toFixed(2)}`}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Field>

          <Field label="Data *">
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="field-input"
            />
          </Field>

          {date && (
            <Field
              label={
                <span>
                  Horário disponível *
                  {bhForDay && !bhForDay.is_open && (
                    <span className="ml-2 text-xs font-normal text-red-500">— dia fechado</span>
                  )}
                </span>
              }
            >
              {loadingSlots ? (
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-11 animate-pulse rounded-xl bg-[#F3E7D7]" />
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#E7D5C1] bg-white/60 p-6 text-center text-sm text-[#9B8575]">
                  {bhForDay && !bhForDay.is_open
                    ? "Este dia está fechado. Escolha outra data."
                    : "Nenhum horário disponível. Escolha outra data."}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`rounded-xl py-2.5 text-sm font-medium transition-all ${
                        time === slot
                          ? "text-white shadow-md"
                          : "border border-[#E7D5C1] bg-white text-[#4B3A2A] hover:border-[#C8A56A] hover:text-[#A87C3F]"
                      }`}
                      style={time === slot ? { background: "linear-gradient(135deg, #D8BC85 0%, #C8A56A 50%, #A87C3F 100%)" } : undefined}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </Field>
          )}

          <Field label={<span>Observações <span className="text-xs font-normal text-[#9B8575]">(opcional)</span></span>}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Alguma informação adicional para a Dra. Gabriela?"
              className="field-input resize-none"
            />
          </Field>

          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || initialLoading}
            className="w-full rounded-xl py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #D8BC85 0%, #C8A56A 50%, #A87C3F 100%)" }}
          >
            {saving ? "Confirmando..." : "Confirmar agendamento"}
          </button>
        </form>
      </main>

      <style>{`
        .field-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #E7D5C1;
          background: white;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input:focus {
          border-color: #C8A56A;
          box-shadow: 0 0 0 2px rgba(200,165,106,0.2);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#4B3A2A]">{label}</label>
      {children}
    </div>
  );
}
