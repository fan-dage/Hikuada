export type HowToOrderB2bBlockContent = {
  key: "payment" | "packaging" | "shipping";
  titleEn: string;
  titleZh: string;
  titleVi: string;
  bodyEn: string;
  bodyZh: string;
  bodyVi: string;
};

export const HOW_TO_ORDER_B2B_BLOCKS: readonly HowToOrderB2bBlockContent[] = [
  {
    key: "payment",
    titleEn: "Payment",
    titleZh: "支付方式",
    titleVi: "Thanh toán",
    bodyEn:
      "We **primarily** accept **T/T**, **L/C**, and **Western Union** for bulk **FCL** orders. We also support **PingPong** for secure **sample fees**.",
    bodyZh:
      "针对**整柜大货**，我们主要接受 **T/T**、**L/C** 及**西联汇款**结算。同时支持通过 **PingPong** 接收安全快速的**样品费**及**零星款项**。",
    bodyVi:
      "Chúng tôi **chủ yếu** chấp nhận **T/T**, **L/C** và **Western Union** cho các đơn hàng **FCL**. Ngoài ra còn hỗ trợ **PingPong** để thanh toán **nhanh chóng**.",
  },
  {
    key: "packaging",
    titleEn: "Packaging",
    titleZh: "包装标准",
    titleVi: "Đóng gói",
    bodyEn:
      "**Export-standard** packing and bracing to protect **PS moldings** during **long-distance international transit**.",
    bodyZh:
      "采用**出口标准包装**与**加固方案**，确保 **PS 线条**在长途跨国运输中免受**冲击**、**潮湿**及**损毁**。",
    bodyVi:
      "Đóng gói và gia cố theo **tiêu chuẩn xuất khẩu** để bảo vệ **phào chỉ PS** trong quá trình vận chuyển quốc tế **đường dài**.",
  },
  {
    key: "shipping",
    titleEn: "Shipping",
    titleZh: "物流运输",
    titleVi: "Vận chuyển",
    bodyEn:
      "We provide **Global FCL** sea freight to all **major international ports**, including **direct routes to Vietnam**.",
    bodyZh:
      "我们提供**全球整柜 (FCL)** 海运服务，覆盖**全球主要港口**，并拥有直达**越南**等地区的**优势特快航线**。",
    bodyVi:
      "Chúng tôi cung cấp dịch vụ vận tải biển **FCL** **toàn cầu** đến tất cả các **cảng lớn**, bao gồm các **tuyến đường trực tiếp** đến **Việt Nam**.",
  },
];
