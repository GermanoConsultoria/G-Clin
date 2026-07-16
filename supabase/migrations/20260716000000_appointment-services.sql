-- ============================================================
-- Tabela appointment_services
-- Armazena snapshot de cada serviço vinculado a um agendamento,
-- permitindo múltiplos serviços por agendamento.
-- ============================================================

CREATE TABLE public.appointment_services (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id   UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id       UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name     TEXT,
  price            NUMERIC(12,2) NOT NULL DEFAULT 0,
  cost             NUMERIC(12,2) NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  is_hof           BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointment_services TO authenticated;
GRANT INSERT, SELECT ON public.appointment_services TO anon;
GRANT ALL ON public.appointment_services TO service_role;

-- Usuários autenticados gerenciam os registros dos seus próprios agendamentos
CREATE POLICY "clinic_manage_appointment_services"
  ON public.appointment_services
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = appointment_services.appointment_id
        AND a.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = appointment_services.appointment_id
        AND a.user_id = auth.uid()
    )
  );

-- Usuários anônimos podem inserir (agendamento público /agendar)
CREATE POLICY "anon_insert_appointment_services"
  ON public.appointment_services
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE INDEX idx_appointment_services_appointment
  ON public.appointment_services(appointment_id);
