-- Table grants required by Supabase Data API
grant select, insert, update, delete
on table public.study_documents
to authenticated;

grant select, insert, update, delete
on table public.document_chunks
to authenticated;

-- Keep RLS enabled
alter table public.study_documents enable row level security;
alter table public.document_chunks enable row level security;

-- study_documents policies
drop policy if exists "authenticated_select_study_documents" on public.study_documents;
drop policy if exists "authenticated_insert_study_documents" on public.study_documents;
drop policy if exists "authenticated_update_study_documents" on public.study_documents;
drop policy if exists "authenticated_delete_study_documents" on public.study_documents;

create policy "authenticated_select_study_documents"
on public.study_documents
for select
to authenticated
using (true);

create policy "authenticated_insert_study_documents"
on public.study_documents
for insert
to authenticated
with check (true);

create policy "authenticated_update_study_documents"
on public.study_documents
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_delete_study_documents"
on public.study_documents
for delete
to authenticated
using (true);

-- document_chunks policies
drop policy if exists "authenticated_select_document_chunks" on public.document_chunks;
drop policy if exists "authenticated_insert_document_chunks" on public.document_chunks;
drop policy if exists "authenticated_update_document_chunks" on public.document_chunks;
drop policy if exists "authenticated_delete_document_chunks" on public.document_chunks;

create policy "authenticated_select_document_chunks"
on public.document_chunks
for select
to authenticated
using (true);

create policy "authenticated_insert_document_chunks"
on public.document_chunks
for insert
to authenticated
with check (true);

create policy "authenticated_update_document_chunks"
on public.document_chunks
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_delete_document_chunks"
on public.document_chunks
for delete
to authenticated
using (true);
