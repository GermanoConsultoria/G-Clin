-- ============================================================
-- Plano de contas: categorias de Despesa
-- ============================================================
INSERT INTO public.plano_contas (tipo, nome, ativo, created_by)
SELECT 'DESPESA', nome_categoria, true, '62ed267a-991b-4ccb-a3e1-e3a9b687e4ec'
FROM (VALUES
  ('Fixas'),
  ('Variáveis')
) AS t(nome_categoria)
WHERE NOT EXISTS (
  SELECT 1 FROM public.plano_contas
  WHERE nome = t.nome_categoria AND tipo = 'DESPESA'
);
