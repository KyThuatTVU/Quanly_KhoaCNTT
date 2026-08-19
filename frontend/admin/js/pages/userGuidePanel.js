/**
 * User Guide Panel Module
 * Extracted from AdminApp.renderUserGuidePanel()
 */

export function renderUserGuidePanel(container, app) {
  container.innerHTML = `
      <div class="user-guide-panel" style="animation: modalFadeIn 0.3s ease; max-width: 900px; margin: 0 auto;">
        
        <!-- Welcome Card -->
        <div style="background: linear-gradient(135deg, var(--admin-primary), var(--admin-primary-hover)); color: #fff; border-radius: var(--radius-lg); padding: 30px; margin-bottom: 24px; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.15); display: flex; align-items: center; gap: 20px;">
          <div style="font-size: 3rem;">📖</div>
          <div>
            <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 8px;">Cổng hướng dẫn vận hành hệ thống</h3>
            <p style="font-size: 0.9rem; opacity: 0.9; line-height: 1.5;">Chào mừng bạn đến với trang tài liệu hướng dẫn quản trị Cổng thông tin SIT Portal. Dưới đây là các hướng dẫn chi tiết giúp bạn dễ dàng cập nhật thông tin và vận hành website Khoa CNTT TVU.</p>
          </div>
        </div>

        <!-- Guide Sections Grid -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Section 1 -->
          <details style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);" open>
            <summary style="font-size: 0.95rem; font-weight: 700; padding: 18px 24px; color: var(--admin-text-main); cursor: pointer; display: flex; align-items: center; justify-content: space-between; list-style: none; user-select: none;">
              <span>👥 1. Hướng dẫn Quản lý Nhân sự & Giảng viên</span>
              <span style="font-size: 0.8rem; color: var(--admin-primary);">[Bấm để thu gọn/mở rộng]</span>
            </summary>
            <div style="padding: 24px; border-top: 1px solid var(--admin-card-border); font-size: 0.9rem; color: var(--admin-text-main); line-height: 1.7; display: flex; flex-direction: column; gap: 14px;">
              <p>Hệ thống quản lý giảng viên bao gồm 2 phần chính: <strong>Hồ sơ Cán bộ cơ bản</strong> (trong mục <em>Cán bộ - Giảng viên</em>) và <strong>Trang cá nhân chi tiết</strong> (trong mục <em>Trang cá nhân chi tiết</em>).</p>
              
              <div style="background: rgba(0,0,0,0.02); padding: 16px; border-left: 4px solid var(--admin-primary); border-radius: 4px;">
                <strong>Các bước thêm giảng viên mới chuẩn chỉ:</strong>
                <ol style="margin-left: 20px; margin-top: 6px;">
                  <li>Bước 1: Vào mục <strong>Cán bộ - Giảng viên</strong> -> Click <strong>Thêm mới</strong> để nhập Họ tên, chức vụ, học vị, email và tải lên ảnh đại diện.</li>
                  <li>Bước 2: Vào mục <strong>Nhóm Nhân sự</strong> -> Kiểm tra xem các nhóm (Lãnh đạo khoa, Tổ bộ môn...) đã đúng thứ tự hiển thị chưa.</li>
                  <li>Bước 3: Vào mục <strong>Trang cá nhân chi tiết</strong> -> Nhấp <strong>Thêm mới</strong> và liên kết với tài khoản Giảng viên vừa tạo để khai báo các liên kết học thuật (Google Scholar, ORCID, Github, Lĩnh vực nghiên cứu).</li>
                </ol>
              </div>

              <div style="background: rgba(245, 158, 11, 0.05); padding: 16px; border-left: 4px solid var(--admin-accent); border-radius: 4px; color: var(--admin-text-main);">
                <strong>💡 Mẹo nhỏ ẩn/hiện danh mục ở trang cá nhân:</strong><br>
                Trong biểu mẫu sửa <em>Trang cá nhân chi tiết</em>, bạn có thể tích chọn vào các ô kiểm để <strong>Ẩn các phần Đề tài NCKH, Dự án, Bài báo, Sách hoặc Hướng dẫn sinh viên</strong> nếu giảng viên đó chưa có các thành tích này. Hệ thống sẽ tự động giấu các khối trống trên trang web public để tránh gây loãng thông tin.
              </div>
            </div>
          </details>

          <!-- Section 2 -->
          <details style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);">
            <summary style="font-size: 0.95rem; font-weight: 700; padding: 18px 24px; color: var(--admin-text-main); cursor: pointer; display: flex; align-items: center; justify-content: space-between; list-style: none; user-select: none;">
              <span>🖼️ 2. Hướng dẫn Banner Trang chủ & Carousel Sliders</span>
              <span style="font-size: 0.8rem; color: var(--admin-primary);">[Bấm để thu gọn/mở rộng]</span>
            </summary>
            <div style="padding: 24px; border-top: 1px solid var(--admin-card-border); font-size: 0.9rem; color: var(--admin-text-main); line-height: 1.7; display: flex; flex-direction: column; gap: 14px;">
              <p>Nội dung trang chủ định vị bộ mặt của Khoa FIT. Bạn có thể dễ dàng quản lý Slogan lớn, Carousel Banner chạy ngang và các số liệu thống kê ở khu vực này.</p>
              
              <ul style="margin-left: 20px; display: flex; flex-direction: column; gap: 8px;">
                <li><strong>Slogan lớn (Banner Hero)</strong>: Nằm tại mục <em>Banner Hero & Slogan</em>. Bạn chỉ cần sửa dòng tiêu đề chính và mô tả ngắn để cập nhật ngay khẩu hiệu đầu trang chủ.</li>
                <li><strong>Carousel Slider Banners</strong>: Nằm tại mục <em>Carousel Slider Banners</em>. Kích thước hình ảnh đề xuất là <strong>1920x800 pixel</strong> (tỷ lệ rộng), dung lượng nên nén dưới <strong>500KB</strong> để đảm bảo tốc độ tải trang tối ưu cho người dùng.</li>
                <li><strong>Số liệu Thống kê Counter</strong>: Cập nhật các con số ấn tượng như số lượng sinh viên, đề tài, giảng viên trong mục <em>Số liệu Thống kê Counter</em> để tự động chạy hiệu ứng đếm số tăng dần trên trang chủ.</li>
              </ul>
            </div>
          </details>

          <!-- Section 3 -->
          <details style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);">
            <summary style="font-size: 0.95rem; font-weight: 700; padding: 18px 24px; color: var(--admin-text-main); cursor: pointer; display: flex; align-items: center; justify-content: space-between; list-style: none; user-select: none;">
              <span>🔬 3. Hướng dẫn Nghiên cứu Khoa học & Đào tạo</span>
              <span style="font-size: 0.8rem; color: var(--admin-primary);">[Bấm để thu gọn/mở rộng]</span>
            </summary>
            <div style="padding: 24px; border-top: 1px solid var(--admin-card-border); font-size: 0.9rem; color: var(--admin-text-main); line-height: 1.7; display: flex; flex-direction: column; gap: 14px;">
              <p>Phần này hướng dẫn cập nhật thông tin Nghiên cứu khoa học chung của khoa và thông tin các Chương trình đào tạo:</p>
              
              <ul style="margin-left: 20px; display: flex; flex-direction: column; gap: 10px;">
                <li><strong>Đề tài NCKH các cấp của Khoa</strong>: Nhập trong mục <em>Đề tài NCKH các cấp</em> (thuộc nhóm NGHIÊN CỨU KHOA HỌC). Đây là các đề tài nghiên cứu chung cấp Bộ, cấp Tỉnh hoặc cơ sở do Khoa phụ trách.</li>
                <li><strong>Đề tài NCKH Cá nhân</strong>: Nhập trong mục <em>Đề tài NCKH Cá nhân</em> (thuộc nhóm NHÂN SỰ & GIẢNG VIÊN) để liên kết hiển thị riêng trên trang cá nhân của từng thầy/cô.</li>
                <li><strong>Ngành Đào tạo & FAQ</strong>: Khi tuyển sinh khóa mới, bạn có thể chỉnh sửa mô tả ngành nghề, phương thức xét tuyển và cập nhật danh sách các câu hỏi thường gặp trong nhóm <em>ĐÀO TẠO ĐẠI HỌC</em> để thí sinh dễ dàng tra cứu trực tuyến.</li>
              </ul>
            </div>
          </details>

          <!-- Section 4 -->
          <details style="background: var(--admin-card-bg); border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);">
            <summary style="font-size: 0.95rem; font-weight: 700; padding: 18px 24px; color: var(--admin-text-main); cursor: pointer; display: flex; align-items: center; justify-content: space-between; list-style: none; user-select: none;">
              <span>📰 4. Hướng dẫn Đăng tin tức & Hoạt động</span>
              <span style="font-size: 0.8rem; color: var(--admin-primary);">[Bấm để thu gọn/mở rộng]</span>
            </summary>
            <div style="padding: 24px; border-top: 1px solid var(--admin-card-border); font-size: 0.9rem; color: var(--admin-text-main); line-height: 1.7; display: flex; flex-direction: column; gap: 14px;">
              <p>Mục <strong>Tin tức & Truyền thông</strong> giúp bạn viết bài đăng hoạt động, thông báo đào tạo và quản lý kho ảnh Gallery chung của Khoa FIT.</p>
              
              <div style="background: rgba(0,0,0,0.02); padding: 16px; border-radius: 6px; border: 1px dashed var(--admin-card-border);">
                <strong>Lưu ý khi viết bài tin tức:</strong>
                <ul style="margin-left: 20px; margin-top: 6px;">
                  <li><strong>Hình ảnh đại diện bài viết (Thumbnail)</strong>: Nên chọn ảnh chất lượng rõ nét, định dạng JPG/PNG tỷ lệ ngang (16:9) để hiển thị đồng đều trên các lưới danh mục tin tức ở trang chủ.</li>
                  <li><strong>Nội dung bài viết</strong>: Bạn có thể nhập mã HTML cơ bản (như các thẻ tiêu đề '&lt;h3&gt;', thẻ xuống dòng '&lt;p&gt;', danh sách '&lt;ul&gt;', chữ đậm '&lt;strong&gt;') để trình bày văn bản bài viết phong phú và chuyên nghiệp.</li>
                </ul>
              </div>
            </div>
          </details>

        </div>

        <!-- Footer Note -->
        <div style="margin-top: 30px; text-align: center; font-size: 0.8rem; color: var(--admin-text-muted);">
          Bản quyền © 2026 Khoa Công nghệ Thông tin - Trường Đại học Trà Vinh (SIT TVU).<br>
          Mọi thắc mắc kỹ thuật xin vui lòng liên hệ Ban biên tập Portal hoặc Quản trị viên hệ thống.
        </div>

      </div>
    `;
}
