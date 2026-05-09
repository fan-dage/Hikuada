-- One-off: fill marketing title + full specs for Smart CNC V-nailing machine (after hikuada_products_detail_fields.sql).
-- Run in Supabase SQL Editor. Adjust WHERE if your model code differs.

update public.hikuada_products
set
  display_name = 'Smart CNC V-Nailing Machine',
  detail_specs = $BODY$
【中文】
产品名称：智能压角数控钉角机
产品配置：标准配置
产品重量：约 100 kg
产品尺寸：675 × 655 × 1100 mm
控制钉位：10（最多一排可连续打十个钉）
切割行程：120 mm
切割高度：85 mm
适用气压：0.6–0.8 MPa
产品电源：电气混用
可切材质：PS发泡、软木、实木、硬木、PVC、密度板、石膏木等

【English】
Product name: Smart CNC V-Nailing Machine
Configuration: Standard configuration
Weight: Approx. 100 kg
Dimensions (L×W×H): 675 × 655 × 1100 mm
Nailing positions: 10 (up to 10 nails per row)
Cutting stroke: 120 mm
Cutting height: 85 mm
Air pressure: 0.6–0.8 MPa
Power supply: Electric–pneumatic hybrid
Compatible materials: PS foam, softwood, hardwood, PVC, MDF, plasterwood, etc.

【Tiếng Việt】
Tên sản phẩm: Máy đóng đinh góc CNC thông minh
Cấu hình: Cấu hình tiêu chuẩn
Trọng lượng: Khoảng 100 kg
Kích thước (Dài×Rộng×Cao): 675 × 655 × 1100 mm
Vị trí đóng đinh: 10 (tối đa 10 đinh mỗi hàng)
Hành trình cắt: 120 mm
Chiều cao cắt: 85 mm
Áp suất khí nén: 0,6–0,8 MPa
Nguồn điện: Kết hợp điện và khí nén
Vật liệu tương thích: Bọt PS, gỗ mềm, gỗ cứng, PVC, gỗ MDF, gỗ thạch cao, v.v.
$BODY$,
  size = E'675 × 655 × 1100 mm (L×W×H)\nApprox. 100 kg',
  packing_spec = 'Standard configuration · Nailing: up to 10 nails per row · Stroke 120 mm · Height 85 mm · Air 0.6–0.8 MPa · Electric–pneumatic · PS / wood / PVC / MDF / plasterwood, etc.'
where model = 'HKD-SCNC-VNAIL';
