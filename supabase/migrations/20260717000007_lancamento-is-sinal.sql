-- Marca lançamentos gerados por sinal (depósito antecipado) para distinção no financeiro

ALTER TABLE public.lancamento_financeiro
  ADD COLUMN IF NOT EXISTS is_sinal BOOLEAN NOT NULL DEFAULT FALSE;
