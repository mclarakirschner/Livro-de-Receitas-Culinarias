-- ===========================================================
-- TABELA: receitas por usuário
-- ===========================================================
drop table receitas;
create table if not exists receitas (
  id uuid constraint pk_receitas primary key default gen_random_uuid(),

  user_id uuid constraint fk_receitas_user references auth.users on delete cascade 
               constraint df_receitas_user DEFAULT auth.uid(),
  categoria_id uuid constraint fk_receitas_categoria references categorias(id) on delete restrict,
  titulo varchar(200) not null,
  ingredientes text not null,
  preparo text not null,
  data_criacao date not null,
  created_at timestamp with time zone constraint df_receitas_created default timezone('utc'::text, now()),
  updated_at timestamp with time zone constraint df_receitas_updated default timezone('utc'::text, now())  
);

-- ===========================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ===========================================================
alter table receitas enable row level security;

-- 1. Política de Leitura (SELECT)
CREATE POLICY "Permitir SELECT apenas para o próprio usuário"
ON receitas
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Política de Criação (INSERT)
-- A segurança é garantida pela função DEFAULT (auth.uid()) e pelo token JWT.
CREATE POLICY "Permitir INSERT para usuários autenticados"
ON receitas
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Política de Atualização (UPDATE)
CREATE POLICY "Permitir UPDATE apenas para o próprio usuário"
ON receitas
FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Política de Exclusão (DELETE)
CREATE POLICY "Permitir DELETE apenas para o próprio usuário"
ON receitas
FOR DELETE
USING (auth.uid() = user_id);