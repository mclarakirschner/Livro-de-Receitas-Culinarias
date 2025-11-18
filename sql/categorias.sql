-- ===========================================================
-- TABELA: Categorias
-- ===========================================================
--uuid = universal unique identifier
create table if not exists categorias(
    id uuid constraint pk_categorias primary key 
            constraint df_categorias_id default gen_random_uuid(),
    descricao varchar(100) not null
            constraint uk_categorias_descricao unique
);    

-- Habilitar RLS - Row Level Security no Supabase
alter table categorias enable row level security;

-- Politica de leitura pública
create policy "Permitir leitura pública das categorias"
on categorias for select using (true);

-- Politica de bloqueio de alterações
create policy "Bloquear alterações nas categorias"
on categorias for all using (false) with check(false);
