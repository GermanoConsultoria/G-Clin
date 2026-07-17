-- ============================================================
-- Categorias: Maquiagem e Penteado
-- ============================================================
INSERT INTO public.service_categories (user_id, value, label, color_class, sort_order)
VALUES
  ('c906ad02-7efe-4ea5-a2bc-978d5cd2c0df', 'maquiagem', 'Maquiagem', 'bg-rose-100 text-rose-700 border-rose-200',     7),
  ('c906ad02-7efe-4ea5-a2bc-978d5cd2c0df', 'penteado',  'Penteado',  'bg-violet-100 text-violet-700 border-violet-200', 8)
ON CONFLICT (user_id, value) DO NOTHING;

-- ============================================================
-- Serviços de Maquiagem e Penteado
-- ============================================================
INSERT INTO public.services (user_id, name, description, price, cost, duration_minutes, active, is_hof, category_group)
VALUES
  (
    'c906ad02-7efe-4ea5-a2bc-978d5cd2c0df',
    'Maquiagem Infantil',
    'Limpeza e hidratação da pele. Blush e corretivo. Olhos simples. Gloss ou batom.',
    55, 0, 45, true, false, 'maquiagem'
  ),
  (
    'c906ad02-7efe-4ea5-a2bc-978d5cd2c0df',
    'Maquiagem Express',
    'Pele completa. Olhos s/sombra (delineado gatinho ou esfumado). Cílios postiços. Gloss ou batom.',
    140, 0, 60, true, false, 'maquiagem'
  ),
  (
    'c906ad02-7efe-4ea5-a2bc-978d5cd2c0df',
    'Maquiagem Social',
    'Pele completa. Olhos com a técnica que preferir. Cílios postiços. Gloss ou batom.',
    200, 0, 90, true, false, 'maquiagem'
  ),
  (
    'c906ad02-7efe-4ea5-a2bc-978d5cd2c0df',
    'Penteado Express',
    'Escova lisa ou modelada. Baby liss ou ondas. Não incluso lavagem.',
    90, 0, 60, true, false, 'penteado'
  ),
  (
    'c906ad02-7efe-4ea5-a2bc-978d5cd2c0df',
    'Penteado Social',
    'Coques. Meio presos. Rabos. Não incluso lavagem.',
    200, 0, 90, true, false, 'penteado'
  ),
  (
    'c906ad02-7efe-4ea5-a2bc-978d5cd2c0df',
    'Penteado Simples',
    'Até 3 tranças simples. Twist laterais (torcidinho). Não inclui nenhuma preparação, como babyliss, escova, secagem ou fitagem.',
    55, 0, 45, true, false, 'penteado'
  );
