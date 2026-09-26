-- Add ownership to study documents
alter table public.study_documents
add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Recover ownership of existing documents from Supabase Storage.
-- storage.objects.owner_id is text, while study_documents.user_id is uuid.
update public.study_documents d
set user_id = o.owner_id::uuid
from storage.objects o
where o.bucket_id = 'study-documents'
  and o.name = d.file_url
  and d.user_id is null
  and o.owner_id is not null
  and o.owner_id ~ '^[0-9a-fA-F-]{36}$';

-- Existing documents that cannot be mapped to a Storage owner remain user_id = NULL.
-- They are intentionally hidden by the RLS policies below until ownership is known.

create index if not exists study_documents_user_id_idx
on public.study_documents(user_id);

grant select, insert, update, delete
on table public.study_documents
to authenticated;

grant select, insert, update, delete
on table public.document_chunks
to authenticated;

alter table public.study_documents enable row level security;
alter table public.document_chunks enable row level security;

drop policy if exists "authenticated_select_study_documents" on public.study_documents;
drop policy if exists "authenticated_insert_study_documents" on public.study_documents;
drop policy if exists "authenticated_update_study_documents" on public.study_documents;
drop policy if exists "authenticated_delete_study_documents" on public.study_documents;

drop policy if exists "authenticated_select_document_chunks" on public.document_chunks;
drop policy if exists "authenticated_insert_document_chunks" on public.document_chunks;
drop policy if exists "authenticated_update_document_chunks" on public.document_chunks;
drop policy if exists "authenticated_delete_document_chunks" on public.document_chunks;

create policy "users_select_own_study_documents"
on public.study_documents
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "users_insert_own_study_documents"
on public.study_documents
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "users_update_own_study_documents"
on public.study_documents
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "users_delete_own_study_documents"
on public.study_documents
for delete
to authenticated
using (user_id = (select auth.uid()));

create policy "users_select_own_document_chunks"
on public.document_chunks
for select
to authenticated
using (
  exists (
    select 1
    from public.study_documents d
    where d.id = document_chunks.document_id
      and d.user_id = (select auth.uid())
  )
);

create policy "users_insert_own_document_chunks"
on public.document_chunks
for insert
to authenticated
with check (
  exists (
    select 1
    from public.study_documents d
    where d.id = document_chunks.document_id
      and d.user_id = (select auth.uid())
  )
);

create policy "users_update_own_document_chunks"
on public.document_chunks
for update
to authenticated
using (
  exists (
    select 1
    from public.study_documents d
    where d.id = document_chunks.document_id
      and d.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.study_documents d
    where d.id = document_chunks.document_id
      and d.user_id = (select auth.uid())
  )
);

create policy "users_delete_own_document_chunks"
on public.document_chunks
for delete
to authenticated
using (
  exists (
    select 1
    from public.study_documents d
    where d.id = document_chunks.document_id
      and d.user_id = (select auth.uid())
  )
);

