/**
 * Shared trilingual copy for /how-to-order timeline steps.
 * Rendered in how-to-order-timeline: primary by site locale + compact EN/中文/VI block.
 */
export type HowToOrderStepTrilingualSource = {
  titleEn: string;
  titleVi: string;
  leadEn: string;
  leadVi: string;
  detailEn: string;
  detailVi: string;
  detailZh: string;
};

export const HOW_TO_ORDER_STEPS_TRILINGUAL: readonly HowToOrderStepTrilingualSource[] = [
  {
    titleEn: "Inquiry",
    titleVi: "Gửi yêu cầu",
    leadEn: "SKUs, **FCL** volume, port & packing → **FOB/CIF** in **12 business hours**.",
    leadVi: "Mã hàng, **FCL**, cảng & đóng gói → **FOB/CIF** trong **12 giờ làm việc**.",
    detailEn:
      "Share catalogue SKUs, estimated **FCL** volume, discharge port, and packing notes. Our sales desk issues an **FOB/CIF** quotation within **12 business hours**.",
    detailVi:
      "Gửi mã sản phẩm, khối lượng dự kiến **FCL**, cảng dỡ hàng và yêu cầu đóng gói. Bộ phận kinh doanh phản hồi bằng bảng báo giá **FOB/CIF** trong vòng **12 giờ làm việc**.",
    detailZh:
      "请提供目录型号、预估**整柜（FCL）**货量、目的港及包装备注。销售团队将在**12 个工作小时内**发出正式报价单，并附带**装载建议**。",
  },
  {
    titleEn: "Samples",
    titleVi: "Mẫu sản phẩm",
    leadEn: "**Free** reference samples; courier **100%** credited on first **FCL** shipment.",
    leadVi: "Mẫu **miễn phí**; phí ship **khấu trừ 100%** đơn **FCL** đầu.",
    detailEn:
      "Reference samples are **free of charge**; courier cost is covered by the buyer and is **100% deductible** from your first **FCL** production shipment.",
    detailVi:
      "Mẫu tham chiếu **miễn phí**; phí chuyển phát do người mua thanh toán và sẽ được **khấu trừ 100%** vào đơn hàng **FCL** đầu tiên.",
    detailZh:
      "目录参考样品**免费提供**；快递费用由买家承担，该费用可在**首批正式大货订单**中**全额抵扣**。",
  },
  {
    titleEn: "Deposit",
    titleVi: "Đặt cọc",
    leadEn: "**30%** deposit after contract; balance on **QC**, before loading.",
    leadVi: "Cọc **30%** sau hợp đồng; cân đối theo **QC**, trước đóng cont.",
    detailEn:
      "Following contract alignment, a standard **30%** deposit triggers material preparation and production scheduling. Balance is invoiced against **QC** evidence prior to loading.",
    detailVi:
      "Sau khi ký hợp đồng, đặt cọc tiêu chuẩn **30%** để bắt đầu sản xuất. Phần còn lại thanh toán sau khi có **bằng chứng QC** và trước khi đóng container.",
    detailZh:
      "合同确认后支付 **30%** 标准定金以锁定排产与原料。尾款在生产完成并提供 **QC** 验货证据后、装柜前支付。",
  },
  {
    titleEn: "Quality check",
    titleVi: "Kiểm tra chất lượng",
    leadEn: "**Live video**, stills, loading records; **factory visits** welcome.",
    leadVi: "**Video** trực tiếp, ảnh, đóng cont; **chào đón** thăm xưởng.",
    detailEn:
      "We provide **live production-floor video**, high-resolution stills, and **container stuffing photos**. We also warmly welcome customers to visit our factory for **in-person inspections**.",
    detailVi:
      "Chúng tôi cung cấp **video trực tiếp tại xưởng**, ảnh kiểm tra độ nét cao và **ảnh đóng container**. Chào đón khách hàng đến trực tiếp nhà máy để **kiểm tra sản phẩm** và **tham quan**.",
    detailZh:
      "我们提供**生产现场视频**、**高清检货照片**及**装柜全程记录**。我们也诚挚欢迎客户**亲临工厂**进行现场验货与**实地考察**。",
  },
  {
    titleEn: "Shipment",
    titleVi: "Vận chuyển",
    leadEn: "**Full-stack FCL** sea freight to **Haiphong**, **HCMC** & global hubs.",
    leadVi: "**FCL** trọn gói tới **Hải Phòng**, **TP.HCM** và các cảng lớn.",
    detailEn:
      "We coordinate **full-stack FCL** ocean freight to major global hubs including **Haiphong** and **Ho Chi Minh City**. **Real-time vessel tracking** and documentation support included.",
    detailVi:
      "Điều phối vận tải đường biển **FCL** trọn gói đến các cảng lớn như **Hải Phòng**, **TP. Hồ Chí Minh**. **Theo dõi lịch trình tàu** và hỗ trợ chứng từ thời gian thực.",
    detailZh:
      "我们提供**整柜（FCL）**海运全流程协调，包括**订舱、报关及跟踪**。常运航线覆盖越南**海防港**、**胡志明港**及全球主要港口。",
  },
  {
    titleEn: "Delivery",
    titleVi: "Giao hàng",
    leadEn: "**B/L**, invoice, packing list & **Form E** after sailing.",
    leadVi: "**B/L**, hóa đơn, packing list & **Form E** sau khi tàu chạy.",
    detailEn:
      "Post-sailing, we issue a complete export pack: **B/L**, **Commercial Invoice**, **Packing List**, and **Form E** for specialized tax treatment in Vietnam.",
    detailVi:
      "Sau khi tàu chạy, chúng tôi gửi bộ chứng từ: **B/L**, **Hóa đơn**, **Phiếu đóng gói** và **Form E** giúp khách hàng hưởng **ưu đãi thuế nhập khẩu** tại Việt Nam.",
    detailZh:
      "开船后提供全套出口单据：**提单（B/L）**、**商业发票**、**装箱单**，并协助办理 **Form E（东盟原产地证）** 以实现**清关减税**。",
  },
];

export function mapHowToOrderStepsForLocale(
  locale: "en" | "vi",
): readonly {
  title: string;
  description: string;
  detailEn: string;
  detailVi: string;
  detailZh: string;
}[] {
  return HOW_TO_ORDER_STEPS_TRILINGUAL.map((s) =>
    locale === "vi"
      ? {
          title: s.titleVi,
          description: s.leadVi,
          detailEn: s.detailEn,
          detailVi: s.detailVi,
          detailZh: s.detailZh,
        }
      : {
          title: s.titleEn,
          description: s.leadEn,
          detailEn: s.detailEn,
          detailVi: s.detailVi,
          detailZh: s.detailZh,
        },
  );
}
