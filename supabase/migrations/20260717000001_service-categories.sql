-- ============================================================
-- Tabela service_categories
-- Categorias de serviço dinâmicas, editáveis pelo usuário.
-- SELECT liberado para anon porque agendar.tsx é página pública.
-- ============================================================

CREATE TABLE public.service_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  value       TEXT NOT NULL,
  label       TEXT NOT NULL,
  color_class TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, value)
);

ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.service_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_categories TO authenticated;
GRANT ALL ON public.service_categories TO service_role;

CREATE POLICY "public_read_service_categories"
  ON public.service_categories FOR SELECT TO anon USING (true);

CREATE POLICY "users_manage_own_service_categories"
  ON public.service_categories FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Seed: insere as 6 categorias padrão para cada perfil existente
INSERT INTO public.service_categories (user_id, value, label, color_class, sort_order)
SELECT p.id, c.value, c.label, c.color_class, c.sort_order
FROM public.profiles p
CROSS JOIN (VALUES
  ('sobrancelhas',     'Sobrancelhas',        'bg-pink-100 text-pink-700 border-pink-200',        1),
  ('micropigmentacao', 'Micropigmentação',    'bg-purple-100 text-purple-700 border-purple-200',  2),
  ('depilacao',        'Depilação',           'bg-blue-100 text-blue-700 border-blue-200',        3),
  ('facial',           'Tratamento Facial',   'bg-emerald-100 text-emerald-700 border-emerald-200',4),
  ('hof',              'HOF (Alto Valor)',    'bg-amber-100 text-amber-700 border-amber-200',     5),
  ('outros',           'Outros',              'bg-muted text-muted-foreground',                   6)
) AS c(value, label, color_class, sort_order)
ON CONFLICT (user_id, value) DO NOTHING;
