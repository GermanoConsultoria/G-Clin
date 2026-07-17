-- ============================================================
-- Reestrutura categorias: Maquiagem, Penteados, Pacotes
-- ============================================================

-- 1. Corrige label do penteado para plural
UPDATE public.service_categories
SET label = 'Penteados', sort_order = 2
WHERE user_id = '62ed267a-991b-4ccb-a3e1-e3a9b687e4ec'
  AND value = 'penteado';

-- 2. Ajusta sort_order do maquiagem
UPDATE public.service_categories
SET sort_order = 1
WHERE user_id = '62ed267a-991b-4ccb-a3e1-e3a9b687e4ec'
  AND value = 'maquiagem';

-- 3. Insere Pacotes (se ainda não existe)
INSERT INTO public.service_categories (user_id, value, label, color_class, sort_order)
VALUES ('62ed267a-991b-4ccb-a3e1-e3a9b687e4ec', 'pacotes', 'Pacotes', 'bg-amber-100 text-amber-700 border-amber-200', 3)
ON CONFLICT (user_id, value) DO NOTHING;

-- 4. Remove todas as outras categorias desta clínica
DELETE FROM public.service_categories
WHERE user_id = '62ed267a-991b-4ccb-a3e1-e3a9b687e4ec'
  AND value NOT IN ('maquiagem', 'penteado', 'pacotes');

-- 5. Desvincula serviços que estavam nas categorias removidas
UPDATE public.services
SET category_group = NULL
WHERE user_id = '62ed267a-991b-4ccb-a3e1-e3a9b687e4ec'
  AND category_group IS NOT NULL
  AND category_group NOT IN ('maquiagem', 'penteado', 'pacotes');
