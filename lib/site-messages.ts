import type { AppLocale } from "@/lib/site-locale-constants";

export type SiteMessages = {
  nav: {
    businessTerms: string;
    contactUs: string;
    productsMenu: {
      trigger: string;
      pictureFrameMoldings: string;
      frameMachineryConsumables: string;
      finishedOtherProducts: string;
    };
  };
  language: {
    switcherAria: string;
    english: string;
    vietnamese: string;
  };
  stock: {
    inStock: string;
    lowStock: string;
    outStock: string;
  };
  productCard: {
    size: string;
    packing: string;
  };
  addToInquiryList: {
    add: string;
    added: string;
  };
  inquiryForm: {
    title: string;
    subtitle: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
  };
  inquiryDrawer: {
    title: string;
    subtitle: string;
    empty: string;
    noImage: string;
    size: string;
    packing: string;
    qty: string;
    decreaseQty: string;
    increaseQty: string;
    remove: string;
    clearAll: string;
    proceed: string;
    clearConfirm: string;
    closeList: string;
    closeDialog: string;
  };
  inquiryTrigger: {
    openLabel: string;
    openLabelWithCount: string;
  };
  home: {
    inStockSeriesTitle: string;
    inStockSeriesSubtitle: string;
    machineryTitle: string;
    machinerySubtitle: string;
    finishedTitle: string;
    finishedSubtitle: string;
    viewAllProducts: string;
    viewAllFinished: string;
    emptyProducts: string;
    emptyMachinery: string;
    emptyFinished: string;
    footerContact: string;
    chatZalo: string;
    chatWhatsapp: string;
  };
  products: {
    moreSeriesTitle: string;
    moreSeriesSubtitle: string;
    pictureMoldingsTitle: string;
    pictureMoldingsSubtitle: string;
    machineryTitle: string;
    machinerySubtitle: string;
    finishedTitle: string;
    finishedSubtitle: string;
    backToHome: string;
    empty: string;
    previous: string;
    next: string;
  };
};

const en: SiteMessages = {
  nav: {
    businessTerms: "Business Terms",
    contactUs: "Contact Us",
    productsMenu: {
      trigger: "Products",
      pictureFrameMoldings: "Picture Frame Moldings",
      frameMachineryConsumables: "Frame Machinery & Consumables",
      finishedOtherProducts: "Finished & Other Products",
    },
  },
  language: {
    switcherAria: "Site language",
    english: "English",
    vietnamese: "Tiếng Việt",
  },
  stock: {
    inStock: "In Stock",
    lowStock: "Low Stock",
    outStock: "Out of Stock",
  },
  productCard: {
    size: "Size:",
    packing: "Packing:",
  },
  addToInquiryList: {
    add: "Add to inquiry list",
    added: "Added to inquiry list",
  },
  inquiryForm: {
    title: "Quick Inquiry",
    subtitle: "Tell us your demand and get a factory quote in 12 hours.",
    namePlaceholder: "Your Name*",
    phonePlaceholder: "Contact ID / Number*",
    emailPlaceholder: "Email*",
    messagePlaceholder: "Your demand (model, quantity, destination)...",
    submit: "Send Inquiry",
    submitting: "Submitting...",
    success: "Thank you. We will get back to you within 12 hours.",
  },
  inquiryDrawer: {
    title: "Inquiry list",
    subtitle: "Add models here, then send one inquiry.",
    empty: "Your inquiry list is empty. Use “Add to inquiry list” on product cards.",
    noImage: "No img",
    size: "Size:",
    packing: "Packing:",
    qty: "Qty",
    decreaseQty: "Decrease quantity",
    increaseQty: "Increase quantity",
    remove: "Remove",
    clearAll: "Clear all",
    proceed: "Proceed to inquiry",
    clearConfirm: "Clear all items from your inquiry list?",
    closeList: "Close inquiry list",
    closeDialog: "Close",
  },
  inquiryTrigger: {
    openLabel: "Open inquiry list",
    openLabelWithCount: "Open inquiry list, {count} items",
  },
  home: {
    inStockSeriesTitle: "In-Stock Product Series",
    inStockSeriesSubtitle: "Catalog-ready models with stable supply for wholesale channels.",
    machineryTitle: "Frame Making Machinery & Consumables",
    machinerySubtitle: "More machinery and consumables for frame manufacturing workflows.",
    finishedTitle: "Finished Products & Other Products",
    finishedSubtitle: "Finished product lines and other wholesale-ready product options.",
    viewAllProducts: "View All Products",
    viewAllFinished: "View All — Finished & Other Products",
    emptyProducts:
      "No products yet. Add products in Admin under “Product management”.",
    emptyMachinery:
      "No machinery products yet. Add products in Admin with category Frame Making Machinery & Consumables.",
    emptyFinished:
      "No finished products yet. Add products in Admin with category Finished Products & Other Products.",
    footerContact: "Contact Leo for Bulk Wholesale Pricing.",
    chatZalo: "Chat on Zalo",
    chatWhatsapp: "Chat on WhatsApp",
  },
  products: {
    moreSeriesTitle: "More Product Series",
    moreSeriesSubtitle: "Browse complete in-stock models from Hikuada factory.",
    pictureMoldingsTitle: "Picture Frame Moldings",
    pictureMoldingsSubtitle: "Browse complete in-stock moldings from Hikuada factory.",
    machineryTitle: "Frame Machinery & Consumables",
    machinerySubtitle: "Browse machinery and consumables for frame manufacturing workflows.",
    finishedTitle: "Finished Products & Other Products",
    finishedSubtitle: "Finished product lines and other wholesale-ready product options.",
    backToHome: "Back to Home",
    empty: "No products yet. Add products in Admin under “Product management”.",
    previous: "Previous",
    next: "Next",
  },
};

const vi: SiteMessages = {
  nav: {
    businessTerms: "Điều khoản kinh doanh",
    contactUs: "Liên hệ",
    productsMenu: {
      trigger: "Sản phẩm",
      pictureFrameMoldings: "Phào khung ảnh (PS moldings)",
      frameMachineryConsumables: "Máy làm khung & vật tư tiêu hao",
      finishedOtherProducts: "Thành phẩm & sản phẩm khác",
    },
  },
  language: {
    switcherAria: "Ngôn ngữ trang",
    english: "English",
    vietnamese: "Tiếng Việt",
  },
  stock: {
    inStock: "Còn hàng",
    lowStock: "Sắp hết",
    outStock: "Hết hàng",
  },
  productCard: {
    size: "Kích thước:",
    packing: "Đóng gói:",
  },
  addToInquiryList: {
    add: "Thêm vào danh sách hỏi giá",
    added: "Đã thêm vào danh sách hỏi giá",
  },
  inquiryForm: {
    title: "Hỏi giá nhanh",
    subtitle: "Cho chúng tôi biết nhu cầu của bạn — báo giá xưởng trong 12 giờ.",
    namePlaceholder: "Họ tên*",
    phonePlaceholder: "Số điện thoại / ID liên hệ*",
    emailPlaceholder: "Email*",
    messagePlaceholder: "Nhu cầu (mã hàng, số lượng, điểm đến)...",
    submit: "Gửi yêu cầu",
    submitting: "Đang gửi...",
    success: "Cảm ơn bạn. Chúng tôi sẽ phản hồi trong vòng 12 giờ.",
  },
  inquiryDrawer: {
    title: "Danh sách hỏi giá",
    subtitle: "Thêm mã hàng tại đây, sau đó gửi một yêu cầu duy nhất.",
    empty: "Danh sách đang trống. Hãy dùng “Thêm vào danh sách hỏi giá” trên thẻ sản phẩm.",
    noImage: "Không ảnh",
    size: "Kích thước:",
    packing: "Đóng gói:",
    qty: "SL",
    decreaseQty: "Giảm số lượng",
    increaseQty: "Tăng số lượng",
    remove: "Xóa",
    clearAll: "Xóa tất cả",
    proceed: "Điền form hỏi giá",
    clearConfirm: "Xóa toàn bộ mục trong danh sách hỏi giá?",
    closeList: "Đóng danh sách hỏi giá",
    closeDialog: "Đóng",
  },
  inquiryTrigger: {
    openLabel: "Mở danh sách hỏi giá",
    openLabelWithCount: "Mở danh sách hỏi giá, {count} mục",
  },
  home: {
    inStockSeriesTitle: "Dòng hàng có sẵn",
    inStockSeriesSubtitle: "Mã trong catalogue, nguồn cung ổn định cho kênh bán sỉ.",
    machineryTitle: "Máy làm khung & vật tư tiêu hao",
    machinerySubtitle: "Thiết bị và vật tư phục vụ quy trình sản xuất khung.",
    finishedTitle: "Thành phẩm & sản phẩm khác",
    finishedSubtitle: "Dòng thành phẩm và hàng bán sỉ khác.",
    viewAllProducts: "Xem tất cả sản phẩm",
    viewAllFinished: "Xem tất cả — Thành phẩm & hàng khác",
    emptyProducts: "Chưa có dữ liệu sản phẩm. Vui lòng thêm sản phẩm trong Admin.",
    emptyMachinery:
      "Chưa có máy/vật tư. Thêm sản phẩm trong Admin với danh mục Máy làm khung & vật tư tiêu hao.",
    emptyFinished:
      "Chưa có thành phẩm. Thêm sản phẩm trong Admin với danh mục Thành phẩm & sản phẩm khác.",
    footerContact: "Liên hệ Leo để nhận báo giá bán sỉ số lượng lớn.",
    chatZalo: "Chat Zalo",
    chatWhatsapp: "Chat WhatsApp",
  },
  products: {
    moreSeriesTitle: "Thêm dòng sản phẩm",
    moreSeriesSubtitle: "Xem đầy đủ mã hàng có sẵn từ xưởng Hikuada.",
    pictureMoldingsTitle: "Phào khung ảnh",
    pictureMoldingsSubtitle: "Xem đầy đủ phào chỉ có sẵn từ xưởng Hikuada.",
    machineryTitle: "Máy & vật tư làm khung",
    machinerySubtitle: "Máy móc và vật tư phục vụ quy trình làm khung.",
    finishedTitle: "Thành phẩm & sản phẩm khác",
    finishedSubtitle: "Dòng thành phẩm và các lựa chọn bán sỉ khác.",
    backToHome: "Về trang chủ",
    empty: "Chưa có dữ liệu sản phẩm. Vui lòng thêm sản phẩm trong Admin.",
    previous: "Trước",
    next: "Tiếp",
  },
};

export const siteMessages: Record<AppLocale, SiteMessages> = { en, vi };

export function getSiteMessages(locale: AppLocale): SiteMessages {
  return siteMessages[locale];
}

export function displayStockStatus(raw: string | null, stock: SiteMessages["stock"]): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return stock.inStock;
  const n = trimmed.toLowerCase();
  if (n === "low stock") return stock.lowStock;
  if (n === "out stock" || n === "out of stock") return stock.outStock;
  if (n === "in stock") return stock.inStock;
  return trimmed;
}
