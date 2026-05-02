import type { Metadata } from "next";
import { BusinessTermsShell } from "@/components/business-terms-shell";

export const metadata: Metadata = {
  title: "Điều khoản kinh doanh & Hướng dẫn đặt hàng | Hikuada",
  description:
    "Điều khoản thương mại, quy trình đặt hàng và hướng dẫn thực tế dành cho khách hàng mua sỉ phào chỉ PS và sản phẩm liên quan từ Hikuada.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-28">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export default function BusinessTermsVietnamesePage() {
  return (
    <BusinessTermsShell
      kicker="Hikuada — Cung ứng bán sỉ"
      documentHeading="Điều khoản kinh doanh & Hướng dẫn đặt hàng"
      lastUpdatedLabel="Cập nhật lần cuối:"
      lastUpdatedIso="2026-05-02"
      lastUpdatedDisplay="2/5/2026"
      articleLang="vi"
      alternate={{
        href: "/business-terms",
        label: "Business Terms & Ordering Guide — English version",
      }}
    >
      <Section title="1. Mục đích và phạm vi">
        <p>
          Tài liệu này mô tả các nguyên tắc thương mại và thực hành đặt hàng tiêu biểu đối với khách hàng doanh nghiệp
          khi làm việc với Hikuada (“chúng tôi”) về phào chỉ khung ảnh PS, máy móc & vật tư tiêu hao, thành phẩm và các
          mặt hàng trong danh mục liên quan. Đây là tài liệu tham khảo thực tế cho báo giá, đơn đặt hàng và phối hợp
          hàng ngày.
        </p>
        <p>
          Trừ khi các bên đã ký thỏa thuận bằng văn bản riêng có hiệu lực thay thế rõ ràng, hướng dẫn này phản ánh cách
          chúng tôi thường hợp tác với khách mua sỉ và B2B. Từng giao dịch cụ thể vẫn chịu sự điều chỉnh của báo giá
          cuối cùng, xác nhận đơn hàng và hợp đồng đã thống nhất.
        </p>
      </Section>

      <Section title="2. Yêu cầu báo giá, thông số và báo giá">
        <p>
          Vui lòng gửi yêu cầu qua các kênh được nêu trên website (bao gồm danh sách báo giá và mục liên hệ). Để báo
          giá chính xác, chúng tôi cần thông tin rõ ràng như mã hàng, kích thước, màu hoặc bề mặt, khối lượng dự kiến
          theo năm, khu vực giao hàng và tiêu chuẩn/đóng gói áp dụng (nếu có).
        </p>
        <p>
          Báo giá thường được gửi bằng văn bản (email hoặc ứng dụng nhắn tin dùng cho công việc) và ghi rõ hiệu lực,
          loại tiền, đơn vị tính và các giả định (ví dụ điều kiện Incoterms®, quy cách đóng gói hoặc cơ sở thời gian
          giao hàng). Trừ khi có quy định khác, báo giá có hiệu lực ba mươi (30) ngày kể từ ngày phát hành.
        </p>
      </Section>

      <Section title="3. Đơn hàng và chấp nhận">
        <p>
          Đơn hàng ràng buộc được hình thành khi chúng tôi gửi xác nhận đơn hàng bằng văn bản đối với đơn đặt hàng hoặc
          chỉ dẫn bằng văn bản của Quý khách, hoặc khi chúng tôi bắt đầu thực hiện theo sự chấp thuận trước bằng văn
          bản của Quý khách. Yêu cầu miệng nên được xác nhận lại bằng văn bản để tránh hiểu nhầm.
        </p>
        <p>
          Quý khách có trách nhiệm kiểm tra mã hàng, số lượng, kích thước và chi tiết vận chuyển trên xác nhận đơn
          hàng. Mọi sai lệch vui lòng phản hồi trước khi lên lịch sản xuất hoặc giao hàng.
        </p>
      </Section>

      <Section title="4. Giá, loại tiền và thuế">
        <p>
          Giá được báo theo cơ sở ghi trong báo giá (ví dụ EXW, FOB hoặc CIF, tùy từng trường hợp). Trừ khi ghi rõ là
          đã bao gồm, giá không gồm thuế nhập khẩu, VAT hoặc các loại thuế tương tự, phí thông quan, phí ngân hàng và
          chi phí giao nội địa tại điểm đến — thông thường do người mua chịu trừ khi có thỏa thuận khác.
        </p>
        <p>
          Chúng tôi có thể điều chỉnh giá nếu có biến động trọng yếu về nguyên liệu, tỷ giá, cước vận tải tham chiếu
          hoặc chi phí quy định giữa thời điểm báo giá và xuất hàng, trong phạm vi hợp đồng cho phép hoặc được xác
          nhận lại bằng văn bản.
        </p>
      </Section>

      <Section title="5. Điều khoản thanh toán">
        <p>
          Cơ cấu thanh toán được thống nhất từng trường hợp và thể hiện trong báo giá hoặc hợp đồng. Với quan hệ bán
          sỉ mới, thông thường có tạm ứng trước sản xuất hoặc trước giao hàng và/hoặc số dư theo chứng từ vận chuyển,
          tùy đánh giá tín dụng và đặc thù đơn hàng.
        </p>
        <p>
          Thanh toán chỉ thực hiện vào tài khoản ngân hàng ghi trên hóa đơn của chúng tôi. Quyền sở hữu hàng hóa và rủi
          ro mất mát tuân theo điều kiện Incoterms® và điều khoản hợp đồng đã thỏa thuận.
        </p>
      </Section>

      <Section title="6. MOQ, đóng gói và nhãn">
        <p>
          Số lượng đặt hàng tối thiểu (MOQ), cấu trúc thùng trong/ngoài và nhãn mác theo báo giá hoặc bảng thông số
          sản phẩm. Nếu không ghi MOQ, chúng tôi sẽ tư vấn lô hàng kinh tế theo mã và bề mặt yêu cầu.
        </p>
        <p>
          Nhãn ngoài trung tính hoặc theo thương hiệu khách hàng có thể được xem xét tùy khả thi, thời gian giao và phí
          phát sinh (nếu có) theo thỏa thuận bằng văn bản.
        </p>
      </Section>

      <Section title="7. Thời gian giao hàng, sản xuất và lịch trình">
        <p>
          Thời gian giao hàng nêu là ước tính dựa trên năng lực và tình trạng nguyên vật liệu tại thời điểm xác nhận
          đơn hàng, không phải cam kết cứng trừ khi được xác nhận ràng buộc bằng văn bản cho một dòng hàng cụ thể.
        </p>
        <p>
          Thay đổi sau khi xác nhận đơn (bao gồm thông số, số lượng hoặc đóng gói) có thể ảnh hưởng đến tiến độ và giá
          và cần được thống nhất bằng văn bản.
        </p>
      </Section>

      <Section title="8. Vận chuyển, giao nhận và rủi ro">
        <p>
          Nghĩa vụ giao hàng, chuyển rủi ro và bảo hiểm theo điều kiện Incoterms® và điều khoản vận chuyển trong hợp
          đồng hoặc chứng từ. Nếu Quý khách tự book tải, vui lòng cung cấp chỉ dẫn kịp thời và tuân thủ mốc cắt máy mà
          chúng tôi thông báo.
        </p>
        <p>
          Giao hàng từng phần có thể được chấp nhận nếu đã thỏa thuận. Quý khách chịu trách nhiệm về thủ tục nhập khẩu,
          giấy phép và phù hợp pháp lý tại thị trường đích, trừ khi hợp đồng phân bổ khác.
        </p>
      </Section>

      <Section title="9. Tiêu chuẩn chất lượng, kiểm tra và khiếu nại">
        <p>
          Chúng tôi cung cấp hàng công nghiệp/đại lý theo thông số đã thỏa thuận, mẫu được hai bên phê duyệt, hoặc —
          nếu không có — theo dung sai tiêu chuẩn xưởng cho từng dòng sản phẩm.
        </p>
        <p>
          Khi nhận hàng, vui lòng kiểm tra tình trạng bao bì và — trong phạm vi khả thi — kiểm tra nhanh về số lượng
          và ngoại quan. Mọi thiếu hụt, hư hỏng vận chuyển hoặc lệch chất lượng nên được thông báo bằng văn bản kèm
          chứng cứ (ảnh, nhãn thùng) trong mười bốn (14) ngày kể từ ngày giao tại điểm đến đã thỏa thuận, trừ khi hợp
          đồng quy định khác.
        </p>
        <p>
          Biện pháp khắc phục có thể gồm sửa chữa, thay thế hoặc điều chỉnh thương mại phù hợp sự kiện và hợp đồng.
          Việc sử dụng, gia công tiếp hoặc tiêu thụ hàng có tranh chấp mà không có sự đồng ý trước của chúng tôi có thể
          ảnh hưởng đến xử lý khiếu nại.
        </p>
      </Section>

      <Section title="10. Thông tin catalogue và dung sai">
        <p>
          Hình ảnh website, bảng kỹ thuật và tài liệu marketing chỉ mang tính tham khảo. Sai lệch nhỏ về màu, kết cấu
          bề mặt hoặc kích thước giữa các lô có thể xảy ra do nguyên liệu và quy trình, trong giới hạn dung sai ngành
          được chấp nhận, trừ khi có thông số chặt hơn đã thỏa thuận và được tính giá tương ứng.
        </p>
      </Section>

      <Section title="11. Sở hữu trí tuệ và thương hiệu">
        <p>
          Nhãn hiệu, tên sản phẩm và tài sản marketing của Hikuada thuộc quyền sở hữu của chúng tôi hoặc bên cấp phép.
          Quý khách không được sử dụng theo cách gợi ý sai về nguồn gốc hoặc chứng nhận ngoài phạm vi đại lý/phân phối
          đã thỏa thuận bằng văn bản.
        </p>
      </Section>

      <Section title="12. Bất khả kháng">
        <p>
          Không bên nào chịu trách nhiệm về chậm trễ hoặc không thực hiện do sự kiện nằm ngoài kiểm soát hợp lý, bao
          gồm nhưng không giới hạn thiên tai, dịch bệnh, chiến tranh, trừng phạt, tranh chấp lao động, sự cố hạ tầng
          trọng yếu hoặc gián đoạn chuỗi cung ứng, với điều kiện bên bị ảnh hưởng thông báo kịp thời và nỗ lực hợp lý
          để giảm thiểu.
        </p>
      </Section>

      <Section title="13. Giới hạn trách nhiệm">
        <p>
          Trong giới hạn pháp luật áp dụng cho phép, tổng trách nhiệm phát sinh từ hoặc liên quan đến một đơn hàng cụ
          thể do hợp đồng bằng văn bản của đơn hàng đó điều chỉnh. Nếu không quy định số tiền, trách nhiệm giới hạn ở
          thiệt hại trực tiếp và không bao gồm thiệt hại gián tiếp, hệ quả hoặc mang tính phạt, trừ khi luật bắt buộc
          cấm loại trừ.
        </p>
      </Section>

      <Section title="14. Văn bản điều chỉnh và ngôn ngữ">
        <p>
          Nếu có mâu thuẫn giữa trang hướng dẫn này và hợp đồng đã ký, chấp nhận báo giá hoặc xác nhận đơn hàng, các
          văn bản sau cùng được ưu tiên. Trong giao dịch thường dùng tiếng Anh; nếu có văn bản song ngữ, thứ tự ưu tiên
          ngôn ngữ theo điều khoản ghi rõ trong đó.
        </p>
      </Section>

      <Section title="15. Cập nhật và liên hệ">
        <p>
          Chúng tôi có thể cập nhật trang này theo thời gian để phản ánh thay đổi vận hành hoặc quy định. Mục “Cập
          nhật lần cuối” phía trên cho biết phiên bản mới nhất.
        </p>
        <p>
          Để báo giá, lịch giao và hợp tác, vui lòng liên hệ qua các kênh trên trang chủ website trong phần Liên hệ,
          bao gồm WhatsApp và Zalo (nếu được niêm yết).
        </p>
      </Section>
    </BusinessTermsShell>
  );
}
