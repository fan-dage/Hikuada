import type { AppLocale } from "@/lib/site-locale-constants";
import { mapHowToOrderStepsForLocale } from "@/lib/how-to-order-steps-content";

export type SiteMessages = {
  nav: {
    aboutUs: string;
    businessTerms: string;
    contactUs: string;
    openMenuAria: string;
    mobileMenuTitle: string;
    closeMobileMenu: string;
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
  howToOrderPage: {
    metaTitle: string;
    metaDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    timelineTitle: string;
    steps: readonly {
      title: string;
      titleZh: string;
      titleVi: string;
      detailEn: string;
      detailVi: string;
      detailZh: string;
    }[];
    stepLangLabelZh: string;
    stepLangLabelEn: string;
    stepLangLabelVi: string;
    stepPanelClose: string;
    b2bTitle: string;
    fullTermsLink: string;
  };
  about: {
    metaTitle: string;
    metaDescription: string;
    kicker: string;
    heroTitle: string;
    heroSubtitle: string;
    introLead: string;
    introBody: string;
    strengthsTitle: string;
    strength1Title: string;
    strength1Body: string;
    strength2Title: string;
    strength2Body: string;
    strength3Title: string;
    strength3Body: string;
    contactTitle: string;
    contactLead: string;
    directLabel: string;
    factoryTitle: string;
    factoryAddress: string;
  };
};

const en: SiteMessages = {
  nav: {
    aboutUs: "About Us",
    businessTerms: "Business Terms",
    contactUs: "Contact Us",
    openMenuAria: "Open main menu",
    mobileMenuTitle: "Menu",
    closeMobileMenu: "Close",
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
  howToOrderPage: {
    metaTitle: "How to Order & Business Terms | Hikuada",
    metaDescription:
      "B2B order process, payment options, export packaging, and FCL shipping to Vietnam ports — Hikuada PS moldings factory.",
    heroTitle: "How to Order & Business Terms",
    heroSubtitle: "Factory-direct wholesale — from inquiry to container delivery.",
    timelineTitle: "Order process",
    steps: mapHowToOrderStepsForLocale("en"),
    stepLangLabelZh: "中文",
    stepLangLabelEn: "English",
    stepLangLabelVi: "Tiếng Việt",
    stepPanelClose: "收起 (Close)",
    b2bTitle: "B2B essentials",
    fullTermsLink: "View full legal business terms document",
  },
  about: {
    metaTitle: "About Us | Hikuada",
    metaDescription:
      "Hikuada — PS picture-frame moldings source factory in Shijiazhuang, Hebei, China. Factory-direct export, FCL wholesale, machinery and consumables.",
    kicker: "Hikuada — PS moldings & export manufacturing",
    heroTitle: "About Us",
    heroSubtitle: "Về chúng tôi",
    introLead:
      "Hikuada is a **source factory** for PS picture-frame moldings based in **Shijiazhuang, Hebei Province, China**. With many years of export experience, we focus on high-quality PS moldings, frame-making machinery, and consumables for professional wholesale buyers worldwide.",
    introBody:
      "We emphasize **shipping directly from our factory** and **competitive full-container (FCL) wholesale pricing** — stable supply, export-standard packing, and practical support for importers and distributors.",
    strengthsTitle: "Our strengths",
    strength1Title: "Source factory pricing",
    strength1Body:
      "Direct ex-factory pricing without unnecessary middle layers — transparent quotations for catalogue models and project volumes.",
    strength2Title: "High production capacity",
    strength2Body:
      "Stable output and disciplined QC workflows to support repeat orders, seasonal peaks, and mixed-SKU programmes for wholesale channels.",
    strength3Title: "Global logistics & FCL",
    strength3Body:
      "Sea freight coordination including **FCL (full container load)** shipments, documentation support, and alignment with common Incoterms® for international trade.",
    contactTitle: "Contact us",
    contactLead: "Reach our sales team directly or leave a message — we typically respond within 12 hours on business days.",
    directLabel: "Direct chat",
    factoryTitle: "Factory address",
    factoryAddress:
      "Tian Shan Science & Technology Park, Hi-Tech Industrial Development Zone, Xiangjiang Avenue 319, Yuhua District, Shijiazhuang, Hebei Province 050035, China.",
  },
};

const vi: SiteMessages = {
  nav: {
    aboutUs: "Về chúng tôi",
    businessTerms: "Điều khoản kinh doanh",
    contactUs: "Liên hệ",
    openMenuAria: "Mở menu điều hướng",
    mobileMenuTitle: "Menu",
    closeMobileMenu: "Đóng",
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
  howToOrderPage: {
    metaTitle: "Quy trình đặt hàng & Điều khoản kinh doanh | Hikuada",
    metaDescription:
      "Quy trình đặt hàng B2B, thanh toán, đóng gói xuất khẩu và vận chuyển FCL tới cảng Việt Nam — xưởng phào chỉ PS Hikuada.",
    heroTitle: "Quy trình đặt hàng & Điều khoản kinh doanh",
    heroSubtitle: "Bán sỉ trực tiếp từ xưởng — từ báo giá đến giao cont.",
    timelineTitle: "Quy trình đặt hàng",
    steps: mapHowToOrderStepsForLocale("vi"),
    stepLangLabelZh: "中文",
    stepLangLabelEn: "English",
    stepLangLabelVi: "Tiếng Việt",
    stepPanelClose: "Thu gọn (Đóng)",
    b2bTitle: "Thông tin cốt lõi B2B",
    fullTermsLink: "Xem văn bản điều khoản kinh doanh đầy đủ",
  },
  about: {
    metaTitle: "Về chúng tôi | Hikuada",
    metaDescription:
      "Hikuada — xưởng nguồn phào chỉ khung ảnh PS tại Thạch Gia Trang, Hà Bắc, Trung Quốc. Xuất xưởng trực tiếp, giá FCL bán sỉ, máy và vật tư.",
    kicker: "Hikuada — Phào chỉ PS & xuất khẩu",
    heroTitle: "Về chúng tôi",
    heroSubtitle: "About Us",
    introLead:
      "Hikuada là **xưởng nguồn** phào chỉ khung ảnh PS đặt tại **Thạch Gia Trang (Shijiazhuang), tỉnh Hà Bắc, Trung Quốc**. Với nhiều năm kinh nghiệm xuất khẩu, chúng tôi tập trung vào phào chỉ PS chất lượng cao, máy làm khung và vật tư tiêu hao cho kênh bán sỉ chuyên nghiệp toàn cầu.",
    introBody:
      "Chúng tôi nhấn mạnh **giao hàng trực tiếp từ nhà máy** và **giá bán sỉ cạnh tranh theo cont đầy (FCL)** — nguồn cung ổn định, đóng gói theo tiêu chuẩn xuất khẩu và hỗ trợ thực tế cho nhà nhập khẩu và nhà phân phối.",
    strengthsTitle: "Điểm mạnh cốt lõi",
    strength1Title: "Giá nguồn xưởng",
    strength1Body:
      "Báo giá trực tiếp từ xưởng, giảm lớp trung gian không cần thiết — minh bạch cho mã catalogue và đơn hàng dự án.",
    strength2Title: "Năng lực sản xuất cao",
    strength2Body:
      "Đầu ra ổn định và quy trình QC chặt chẽ để phục lặp đơn, cao điểm mùa vụ và chương trình SKU hỗn hợp cho kênh bán sỉ.",
    strength3Title: "Hậu cần toàn cầu & FCL",
    strength3Body:
      "Điều phối vận tải biển gồm **FCL (nguyên cont)**, hỗ trợ chứng từ và phù hợp các **Incoterms®** thông dụng trong thương mại quốc tế.",
    contactTitle: "Liên hệ",
    contactLead:
      "Liên hệ trực tiếp với bộ phận kinh doanh hoặc để lại tin nhắn — thường phản hồi trong vòng 12 giờ vào ngày làm việc.",
    directLabel: "Chat trực tiếp",
    factoryTitle: "Địa chỉ nhà máy",
    factoryAddress:
      "Công viên khoa học–công nghệ Thiên Sơn (Tian Shan Science & Technology Park), Khu phát triển công nghiệp công nghệ cao, số 319 đại lộ Tương Giang (Xiangjiang Ave), quận Du Hoa (Yuhua), Thạch Gia Trang, tỉnh Hà Bắc 050035, Trung Quốc.",
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
