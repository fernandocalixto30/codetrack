-- Execute no SQL Editor do Supabase do projeto CodeTrack.
-- Mantém a tabela clientes existente; cria apenas projetos e pagamentos.
create table if not exists public.projetos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cliente_id text not null,
  titulo text not null,
  descricao text,
  status text not null default 'Orçamento' check (status in ('Orçamento','Aguardando início','Em andamento','Em revisão','Concluído','Cancelado')),
  data_inicio date,
  data_entrega date,
  valor numeric(12,2) not null default 0 check (valor >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  projeto_id uuid not null references public.projetos(id) on delete cascade,
  valor numeric(12,2) not null check (valor > 0),
  data_vencimento date not null,
  data_pagamento date,
  status text not null default 'Pendente' check (status in ('Pendente','Pago')),
  observacao text,
  created_at timestamptz not null default now()
);
create index if not exists projetos_user_idx on public.projetos(user_id);
create index if not exists pagamentos_user_idx on public.pagamentos(user_id);
create index if not exists pagamentos_projeto_idx on public.pagamentos(projeto_id);
alter table public.projetos enable row level security;
alter table public.pagamentos enable row level security;
drop policy if exists "projetos_owner_all" on public.projetos;
create policy "projetos_owner_all" on public.projetos for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "pagamentos_owner_all" on public.pagamentos;
create policy "pagamentos_owner_all" on public.pagamentos for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
