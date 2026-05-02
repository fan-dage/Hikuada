-- Card thumbnail fit: cover (fill crop) vs contain (show full image with letterboxing).
alter table public.hikuada_products
  add column if not exists image_object_fit text not null default 'cover';

comment on column public.hikuada_products.image_object_fit is
  'cover = fill card crop; contain = show full image inside fixed card height';
