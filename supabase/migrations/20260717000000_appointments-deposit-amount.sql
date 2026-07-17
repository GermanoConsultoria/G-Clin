-- Adiciona campo de sinal (valor de entrada/depósito) nos agendamentos

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0;
