-- Smart CNC V-Nailing Machine — Frame Making Machinery & Consumables
-- 智能压角数控钉角机 — 分类: frame_machinery_consumables
-- Run in Supabase SQL Editor (or psql). Then upload product image in Admin → 产品管理.
-- image_url 留空，上线后在后台「修改图片」上传。

insert into public.hikuada_products (
  model,
  category,
  sort_order,
  size,
  packing_spec,
  stock_status,
  stock_quantity,
  image_url,
  image_object_fit
) values (
  'HKD-SCNC-VNAIL',
  'frame_machinery_consumables',
  50,
  '675×655×1100 mm (L×W×H) · Approx. 100 kg',
  'Standard configuration · Nailing: up to 10 nails per row · Cutting stroke: 120 mm · Cutting height: 85 mm · Air pressure: 0.6–0.8 MPa · Power: electric-pneumatic hybrid · Materials: PS foam, softwood, hardwood, PVC, MDF, plasterwood, etc.',
  'In Stock',
  null,
  null,
  'cover'
);
