create or replace function public.match_document_chunks(
  query_embedding vector,
  match_count integer default 8
)
returns table(
  id uuid,
  document_id uuid,
  chunk_text text,
  chunk_index integer,
  similarity double precision
)
language sql
stable
as $function$
  select
    dc.id,
    dc.document_id,
    dc.chunk_text,
    dc.chunk_index,
    1 - (dc.embedding <=> query_embedding) as similarity
  from public.document_chunks dc
  inner join public.study_documents sd
    on sd.id = dc.document_id
  where dc.embedding is not null
    and sd.user_id = (select auth.uid())
  order by dc.embedding <=> query_embedding
  limit match_count;
$function$;
