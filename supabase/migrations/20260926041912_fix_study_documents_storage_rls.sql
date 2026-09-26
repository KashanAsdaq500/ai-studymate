drop policy if exists "study_documents_insert" on storage.objects;
drop policy if exists "study_documents_select" on storage.objects;

create policy "study_documents_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'study-documents'
);

create policy "study_documents_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'study-documents'
  and owner_id = (select auth.uid()::text)
);
