-- ============================================================
-- Plano de contas: Maquiagem, Penteados, Pacotes
-- ============================================================
INSERT INTO public.plano_contas (tipo, nome, ativo, created_by)
SELECT 'RECEITA', nome_categoria, true, '62ed267a-991b-4ccb-a3e1-e3a9b687e4ec'
FROM (VALUES
  ('Maquiagem'),
  ('Penteados'),
  ('Pacotes')
) AS t(nome_categoria)
WHERE NOT EXISTS (
  SELECT 1 FROM public.plano_contas
  WHERE nome = t.nome_categoria AND tipo = 'RECEITA'
);

-- ============================================================
-- Vincula serviços ao plano de contas pela categoria
-- ============================================================
UPDATE public.services s
SET plano_contas_id = pc.id
FROM public.plano_contas pc
WHERE pc.tipo = 'RECEITA'
  AND s.user_id = '62ed267a-991b-4ccb-a3e1-e3a9b687e4ec'
  AND pc.nome = CASE s.category_group
    WHEN 'maquiagem' THEN 'Maquiagem'
    WHEN 'penteado'  THEN 'Penteados'
    WHEN 'pacotes'   THEN 'Pacotes'
    ELSE NULL
  END;
