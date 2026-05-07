-- Homepage hero overlay copy (text on top of banner carousel). Single row id = 1.
create table if not exists public.hikuada_banner_hero (
  id smallint primary key default 1 check (id = 1),
  badge_text text not null,
  headline text not null,
  subheading text not null,
  pill_tag_1 text not null default '',
  pill_tag_2 text not null default '',
  pill_tag_3 text not null default '',
  updated_at timestamptz not null default now()
);

comment on table public.hikuada_banner_hero is 'Hero headline/badge/pills over homepage banner; singleton row id=1';

insert into public.hikuada_banner_hero (id, badge_text, headline, subheading, pill_tag_1, pill_tag_2, pill_tag_3)
values (
  1,
  'PS MOLDINGS | FACTORY DIRECT',
  'Premium PS Moldings Factory Direct',
  'Specialized in Southeast Asia markets with Form E support and door-to-door double-clearance logistics.',
  'OEM/ODM Service',
  'Stable Output Capacity',
  'Export Standard Packing'
)
on conflict (id) do nothing;
