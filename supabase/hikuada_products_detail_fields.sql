-- Optional fields for product detail page (machinery long specs, marketing title).
alter table public.hikuada_products
  add column if not exists display_name text,
  add column if not exists detail_specs text;

comment on column public.hikuada_products.display_name is
  'Optional title on /products/[id] (e.g. Smart CNC V-Nailing Machine). Model stays as SKU.';
comment on column public.hikuada_products.detail_specs is
  'Optional multi-line specs for /products/[id]. When set, shown as main spec block instead of Size/Packing paragraphs.';
