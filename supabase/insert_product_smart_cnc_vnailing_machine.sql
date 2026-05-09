-- Smart CNC V-Nailing Machine — Frame Making Machinery & Consumables
-- 智能压角数控钉角机 — 分类: frame_machinery_consumables
-- Run in Supabase SQL Editor (or psql). Then upload product image in Admin → 产品管理.
-- image_url 留空，上线后在后台「修改图片」上传。

-- Requires: hikuada_products_detail_fields.sql (display_name, detail_specs columns).
insert into public.hikuada_products (
  model,
  display_name,
  category,
  sort_order,
  size,
  packing_spec,
  detail_specs,
  stock_status,
  stock_quantity,
  image_url,
  image_object_fit
) values (
  'HKD-SCNC-VNAIL',
  'Smart CNC V-Nailing Machine',
  'frame_machinery_consumables',
  50,
  E'675 × 655 × 1100 mm (L×W×H)\nApprox. 100 kg',
  'Standard configuration · Nailing: up to 10 nails per row · Stroke 120 mm · Height 85 mm · Air 0.6–0.8 MPa · Electric–pneumatic · PS / wood / PVC / MDF / plasterwood, etc.',
  null,
  'In Stock',
  null,
  null,
  'cover'
);
