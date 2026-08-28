/**
 * Entity Forms Panel Module
 * Extracted from AdminApp.renderEntityPanel() + all entity form builders
 */

import { AdminApiService } from '../services/adminApiService.js';

export async function renderEntityPanel(container, entityKey) {
  container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--admin-text-muted);">Đang tải dữ liệu...</div>`;
  
  if (['staff', 'deans', 'lecturers', 'staffProfiles', 'staffResearch', 'staffPapers', 'staffProjects', 'staffBooks', 'staffSupervisions', 'lecturerAccounts'].includes(entityKey)) {
    try {
      this.staffList = await AdminApiService.getList('staff');
    } catch (err) {
      console.warn('Không thể nạp danh sách cán bộ để liên kết:', err);
      this.staffList = [];
    }
    try {
      this.staffGroupsList = await AdminApiService.getList('staffGroups');
    } catch (err) {
      console.warn('Không thể nạp danh sách nhóm nhân sự:', err);
      this.staffGroupsList = [];
    }
  }
   if (entityKey === 'undergradCareers' || entityKey === 'undergradStudentStats') {
    try {
      this.undergradProgramsList = await AdminApiService.getList('undergradPrograms');
    } catch (err) {
      console.warn('Không thể nạp danh sách ngành:', err);
      this.undergradProgramsList = [];
    }
  }
   let fetchKey = entityKey;
  if (entityKey === 'deans' || entityKey === 'lecturers') {
    fetchKey = 'staff';
  }
  const rawData = await AdminApiService.getList(fetchKey);
  if (entityKey === 'deans') {
    this.currentEntityData = rawData.filter(item => Number(item.nhom_id) === 1);
  } else if (entityKey === 'lecturers') {
    this.currentEntityData = rawData.filter(item => Number(item.nhom_id) === 2);
  } else if (entityKey === 'staffProfiles') {
    const profiles = rawData || [];
    this.currentEntityData = (this.staffList || []).map(staff => {
      const existingProfile = profiles.find(p => Number(p.nhan_vien_id) === Number(staff.id));
      if (existingProfile) {
        return {
          ...existingProfile,
          is_new_profile: false
        };
      } else {
        return {
          id: `new_${staff.id}`,
          nhan_vien_id: staff.id,
          email: staff.email,
          ngach_vien_chuc: staff.ngach_vien_chuc || 'Giảng viên',
          hoc_vi: staff.hoc_vi || 'Cử nhân',
          hoc_ham: staff.hoc_ham || '',
          don_vi_cong_tac: staff.don_vi_cong_tac || 'Khoa Công nghệ thông tin',
          linh_vuc_nghien_cuu: 'Chưa cập nhật',
          google_scholar_url: '#',
          orcid_url: '#',
          github_url: '#',
          website_ca_nhan: '#',
          ngay_cap_nhat: 'Chưa khởi tạo',
          is_new_profile: true
        };
      }
    });
  } else {
    this.currentEntityData = rawData;
  }
   let rowsHtml = '';
  if (this.currentEntityData.length === 0) {
    rowsHtml = `<tr><td colspan="6" style="text-align:center; color:var(--admin-text-muted); padding:30px;">Chưa có bản ghi nào trong danh mục này.</td></tr>`;
  } else {
    this.currentEntityData.forEach((item, idx) => {
      let displayTitle = '';
      let displaySub = '';
       switch (entityKey) {
        case 'staff':
        case 'deans':
        case 'lecturers':
          displayTitle = `[Cán bộ] ${item.ho_ten}`;
          displaySub = `Chức vụ: ${item.chuc_vu} | Học vị: ${item.hoc_vi} | Nhóm: ${item.nhom_id === 1 ? 'Lãnh đạo khoa' : 'Giảng viên & Trợ giảng'}`;
          break;
        case 'staffProfiles': {
          const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
          displayTitle = `[Hồ sơ cá nhân] ${staffName}`;
          displaySub = `Lĩnh vực: ${item.linh_vuc_nghien_cuu || 'Chưa cập nhật'}`;
          break;
        }
        case 'staffResearch': {
          const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
          displayTitle = `[NCKH - Cán bộ: ${staffName}] ${item.ten_de_tai}`;
          displaySub = `Cấp: ${item.cap_de_tai} | Vai trò: ${item.trach_nhiem_tham_gia} | Năm: ${item.nam_hoan_thanh}`;
          break;
        }
        case 'staffPapers': {
          const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
          displayTitle = `[Bài báo - Cán bộ: ${staffName}] ${item.ten_bai_bao}`;
          displaySub = `Tác giả: ${item.danh_sach_tac_gia} | Tạp chí/Hội nghị: ${item.ten_tap_chi_hoi_nghi} | Năm: ${item.nam_xuat_ban}`;
          break;
        }
        case 'staffProjects': {
          const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
          displayTitle = `[Dự án - Cán bộ: ${staffName}] ${item.ten_du_an}`;
          displaySub = `Vai trò: ${item.vai_tro} | Năm: ${item.nam_thuc_hien}`;
          break;
        }
        case 'staffBooks': {
          const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
          displayTitle = `[Sách/Giáo trình - Cán bộ: ${staffName}] ${item.ten_sach_giao_trinh}`;
          displaySub = `NXB: ${item.nha_xuat_ban} | Vai trò: ${item.vai_tro} | Năm: ${item.nam_xuat_ban}`;
          break;
        }
        case 'staffSupervisions': {
          const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
          const loaiLabel = item.loai_hoc_vien === 'ncs' ? 'NCS' : item.loai_hoc_vien === 'hoc_vien_cao_hoc' ? 'Cao học' : 'SV NCKH';
          displayTitle = `[HD NCKH - Cán bộ: ${staffName}] Hướng dẫn ${loaiLabel}: ${item.ten_hoc_vien}`;
          displaySub = `Đề tài: "${item.ten_de_tai_huong_dan}" | Năm bảo vệ: ${item.nam_bao_ve || 'Chưa bảo vệ'}`;
          break;
        }
        case 'students':
          displayTitle = `[🏆 ${item.chuyen_muc || 'Sinh viên tiêu biểu'}] ${item.ten_doi_ca_nhan}`;
          displaySub = `Ngành/Lớp: ${item.nganh_hoc} | GVHD: ${item.giang_vien_huong_dan || 'Không có'} <br><small><strong>Thành tích:</strong> ${item.thanh_tich}</small>`;
          break;
        case 'alumni':
          displayTitle = `[Cựu sinh viên tiêu biểu] ${item.ho_ten}`;
          displaySub = `Chức vụ: ${item.chuc_danh_cong_ty} <br><small><strong>Cảm nhận:</strong> ${item.trich_dan_cam_nhan}</small>`;
          break;
        case 'homepageAdmissions':
          displayTitle = `[Tuyển sinh] ${item.tieu_de_box}`;
          displaySub = `Tổ hợp: ${item.to_hop_xet_tuyen} | Mã AI: ${item.ma_nganh_ai} | Mã CS: ${item.ma_nganh_cs}`;
          break;
        case 'homepagePrograms':
          displayTitle = `[Chương trình nổi bật] [${item.badge_text || 'AUN-QA'}] ${item.ten_chuong_trinh}`;
          displaySub = `Kiểm định: ${item.nhan_kiem_dinh} | Mô tả: ${item.mo_ta_ngan}`;
          break;
        case 'infographics':
          displayTitle = `[Infographic] ${item.ten_infographic}`;
          displaySub = `File ảnh: ${item.file_anh_url} | File PDF: ${item.file_pdf_url || 'Không có'}`;
          break;
        case 'news':
          displayTitle = `[Tin tức - Hoạt động] ${item.tieu_de}`;
          displaySub = `Ngày đăng: ${item.ngay_dang} | Nhãn phụ: ${item.nhan_nho || 'Không có'}`;
          break;
        case 'researchProjects':
          displayTitle = `[NCKH Khoa - Cấp: ${item.cap}] ${item.ten_de_tai}`;
          displaySub = `Chủ nhiệm: ${item.chu_nhiem_ten} | Trạng thái: ${item.trang_thai}`;
          break;
        case 'researchPublications':
          displayTitle = `[Công bố khoa học Khoa] ${item.ten_bai_bao}`;
          displaySub = `Tác giả: ${item.tac_gia} | Loại: ${item.loai_hinh_cong_bo} | Năm: ${item.nam_xuat_ban}`;
          break;
        case 'undergradCurriculum':
          displayTitle = `[Lộ trình - Khối kiến thức] ${item.ten_khoi}`;
          displaySub = `Tín chỉ: ${item.so_tin_chi} | Ghi chú: ${item.ghi_chu_khoi}`;
          break;
        case 'undergradCourses':
          displayTitle = `[Học phần Công nghệ Cốt lõi] ${item.ten_hoc_phan}`;
          displaySub = `Mã học phần: ${item.ma_hoc_phan} | Số tín chỉ: ${item.so_tin_chi}`;
          break;
        case 'staffGroups':
          displayTitle = `[Nhóm nhân sự] ${item.ten_nhom}`;
          displaySub = `Slug: ${item.slug_nhom} | Thứ tự: ${item.thu_tu}`;
          break;
        case 'timeline':
          displayTitle = `[Mốc lịch sử: ${item.nam}] ${item.noi_dung ? item.noi_dung.replace(/<[^>]*>/g, '').substring(0, 60) + '...' : ''}`;
          displaySub = `Số QĐ: ${item.so_quyet_dinh || 'Không có'} | Ngày: ${item.ngay_cu_the || 'Chưa rõ'}`;
          break;
        case 'partners':
          displayTitle = `[Đối tác] ${item.ten_doi_tac}`;
          displaySub = `Hiển thị ở: ${item.hien_thi_o} | Thứ tự: ${item.thu_tu}`;
          break;
        case 'aboutDeansContact':
          displayTitle = `[Liên hệ BGK] ${item.ho_ten}`;
          displaySub = `Chức vụ: ${item.chuc_vu} | Thứ tự: ${item.thu_tu}`;
          break;
        case 'aboutUnitContact':
          displayTitle = `[Địa chỉ đơn vị] ${item.ten_don_vi}`;
          displaySub = `Trưởng đơn vị: ${item.truong_don_vi} | Điện thoại: ${item.dien_thoai}`;
          break;
        case 'researchDirections':
          displayTitle = `[Hướng nghiên cứu] ${item.ten}`;
          displaySub = `Mô tả: ${item.mo_ta || ''}`;
          break;
        case 'researchLabs':
          displayTitle = `[Phòng thí nghiệm] ${item.ten}`;
          displaySub = `Trưởng phòng: ${item.truong_phong} | Địa điểm: ${item.dia_diem}`;
          break;
        case 'researchContacts':
          displayTitle = `[Liên hệ NCKH] ${item.ten_daidien}`;
          displaySub = `Bộ phận: ${item.chuc_vu_nhiem_vu} | Email: ${item.email}`;
          break;
        case 'undergradPrograms':
          displayTitle = `[Ngành đào tạo] ${item.ten_nganh}`;
          displaySub = `Mã ngành: ${item.ma_nganh} | Danh hiệu: ${item.danh_hieu}`;
          break;
        case 'undergradMethods':
          displayTitle = `[Phương thức tuyển sinh] ${item.ten_phuong_thuc}`;
          displaySub = `Mã phương thức: ${item.ma_phuong_thuc} | Tổ hợp: ${item.danh_sach_to_hop}`;
          break;
        case 'undergradPlos':
          displayTitle = `[Chuẩn đầu ra PLO] ${item.ma_plo}`;
          displaySub = `Nội dung: ${item.noi_dung_plo ? item.noi_dung_plo.substring(0, 80) + '...' : ''}`;
          break;
        case 'undergradFaqs':
          displayTitle = `[Câu hỏi FAQ] ${item.cau_hoi}`;
          displaySub = `Câu trả lời: ${item.tra_loi ? item.tra_loi.substring(0, 80) + '...' : ''}`;
          break;
        case 'undergradCareers': {
          const loaiLabel = item.loai_thong_tin === 'moi_truong_cong_tac' ? '🏢 Môi trường công tác' : '💼 Vị trí đảm nhận';
          displayTitle = `[${loaiLabel}] ${item.noi_dung ? item.noi_dung.substring(0, 60) : '(chưa có nội dung)'}`;
          displaySub = `Thứ tự: ${item.thu_tu || 0} | Ngành ID: ${item.nganh_id}`;
          break;
        }
        case 'undergradStudentStats': {
          const nganhName = item.nganh_id === 2 ? 'AI' : 'CNTT';
          const tnStr = item.so_tot_nghiep > 0 ? `Tốt nghiệp: ${item.so_tot_nghiep}` : 'Chưa TN';
          displayTitle = `[${nganhName}] Khóa ${item.khoa} — ${item.so_sinh_vien} sinh viên`;
          displaySub = `${tnStr} | Đúng tiến độ: ${item.so_dung_tien_do} | Sớm: ${item.so_tot_nghiep_som} | Thứ tự: ${item.thu_tu}`;
          break;
        }
        case 'postgradNotices':
          displayTitle = `[Thông báo Sau ĐH] ${item.tieu_de_thong_bao}`;
          displaySub = `Hạn nộp: ${item.han_nop_ho_so} | Liên hệ: ${item.lien_he_tu_van}`;
          break;
        case 'postgradPhdStudents':
          displayTitle = `[Nghiên cứu sinh] ${item.ho_ten}`;
          displaySub = `Mã NCS: ${item.ma_ncs} | Hướng NC: ${item.huong_nghien_cuu}`;
          break;
        case 'postgradStats':
          displayTitle = `[Biểu đồ Thống kê] ${item.tieu_de_bieu_do}`;
          displaySub = `Cột mốc: ${item.moc_thoi_gian_tinh} | Dữ liệu: ${item.data_json}`;
          break;
        case 'sliders':
          displayTitle = `[Slide Banner] ${item.ten_slide}`;
          displaySub = `Liên kết: ${item.link_lien_ket} | Thứ tự: ${item.thu_tu}`;
          break;
        case 'lecturerAccounts': {
          const staffName = this.staffList.find(s => s.id === item.nhan_vien_id)?.ho_ten || `ID cán bộ: ${item.nhan_vien_id}`;
          displayTitle = `[Tài khoản Giảng viên] ${staffName}`;
          displaySub = `Email: ${item.email} | Trạng thái: ${item.trang_thai === 0 ? 'Bị khóa 🔒' : 'Hoạt động ✅'} | Đổi mật khẩu: ${item.phai_doi_mat_khau === 1 ? 'Bắt buộc đổi' : 'Đã đổi'}`;
          break;
        }
        default:
           displayTitle = item.ho_ten || item.ten_bai_bao || item.tieu_de || item.ten_de_tai || item.ten_nganh || item.ten_slide || item.ten || item.name || this.getFallbackTitle(entityKey, item);
          displaySub = item.chuc_vu || item.nam_hoan_thanh || item.ngay_dang || item.ma_tuyen_sinh || item.email || item.vai_tro || item.cap_de_tai || item.danh_sach_to_hop || '';
      }
       const matchedStaff = entityKey === 'lecturerAccounts' ? this.staffList.find(s => s.id === item.nhan_vien_id) : null;
      const rawImg = (matchedStaff ? matchedStaff.anh_ca_nhan_url : null) || item.anh_ca_nhan_url || item.hinh_anh_url || item.file_anh_url || item.logo_url || item.src_chinh || item.avatar_url || null;
      const img = this.formatAdminImgUrl(rawImg);
      
      rowsHtml += `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <div class="table-avatar-cell">
              ${img ? `<img src="${img}" class="table-img" onerror="this.style.display='none'">` : ''}
              <div>
                <div style="font-weight:600;">${displayTitle}</div>
                ${displaySub ? `<div style="font-size:0.78rem; color:var(--admin-text-muted);">${displaySub}</div>` : ''}
              </div>
            </div>
          </td>
          <td>${item.ngay_cap_nhat || item.ngay_tao || '2026-08-09'}</td>
          <td>
            ${(() => {
              if (entityKey === 'lecturerAccounts') {
                return item.trang_thai === 0 
                  ? '<span class="badge-status danger">Khóa</span>' 
                  : '<span class="badge-status success">Hoạt động</span>';
              }
              if (item.is_new_profile) {
                return '<span class="badge-status warning">Chưa tạo</span>';
              }
              return '<span class="badge-status success">Hoạt động</span>';
            })()}
          </td>
          <td>
            <div class="table-actions-cell">
              <button type="button" class="btn-icon-action edit" data-id="${item.id}" title="Chỉnh sửa">✏️</button>
              ${item.is_new_profile ? '' : `<button type="button" class="btn-icon-action delete" data-id="${item.id}" title="Xóa">🗑️</button>`}
            </div>
          </td>
        </tr>
      `;
    });
  }
   container.innerHTML = `
    <div class="dashboard-panel">
      <div class="section-toolbar">
        <div class="section-title-group">
          <h2>${this.getNavLabel(entityKey)}</h2>
          <p>Chỉnh sửa và cập nhật dữ liệu hiển thị trực tiếp trên trang chủ.</p>
        </div>
        <div class="toolbar-actions">
          <div class="search-input-box">
            <span class="search-icon-svg">🔍</span>
            <input type="text" id="adminSearchInput" placeholder="Tìm kiếm...">
          </div>
          <button type="button" class="btn-admin-primary" id="btnAddNewItem">
            <span>➕</span> Thêm mới
          </button>
        </div>
      </div>
       <div class="table-card">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 60px;">STT</th>
                <th>Tên / Tiêu đề chi tiết</th>
                <th>Ngày cập nhật</th>
                <th>Trạng thái</th>
                <th style="width: 110px;">Thao tác</th>
              </tr>
            </thead>
            <tbody id="adminTableBody">
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
   const addBtn = document.getElementById('btnAddNewItem');
  if (addBtn) addBtn.addEventListener('click', () => this.openModalForAdd(entityKey));
   const editBtns = container.querySelectorAll('.btn-icon-action.edit');
  editBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      this.openModalForEdit(entityKey, id);
    });
  });
   const deleteBtns = container.querySelectorAll('.btn-icon-action.delete');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      this.handleDeleteItem(entityKey, id);
    });
  });
   const searchInput = document.getElementById('adminSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const trs = container.querySelectorAll('#adminTableBody tr');
      trs.forEach(tr => {
        const text = tr.innerText.toLowerCase();
        tr.style.display = text.includes(query) ? '' : 'none';
      });
       // Debounce URL state synchronization on search query change
      this.debouncedSyncUrl();
    });
  }
}

export function updateOrderOptions(nhomId, currentStaffId, currentOrder) {
  const orderSelect = document.getElementById('field_thu_tu_trong_nhom');
  if (!orderSelect) return;
   // Tìm các vị trí đã bị cán bộ khác chiếm trong cùng nhóm (chỉ lấy các số từ 1 trở lên)
  const takenMap = {};
  (this.currentEntityData || [])
    .filter(item => String(item.nhom_id) === String(nhomId) && String(item.id) !== String(currentStaffId))
    .forEach(item => {
      const orderVal = Number(item.thu_tu_trong_nhom || 0);
      if (orderVal > 0) {
        takenMap[orderVal] = item.ho_ten;
      }
    });
   const isUnassigned = !currentOrder || Number(currentOrder) === 0;
  let optionsHtml = `<option value="0" ${isUnassigned ? 'selected' : ''}>-- Chọn thứ tự hiển thị (Chưa thiết lập) --</option>`;
   // Tạo danh sách từ thứ tự 1 đến 20
  for (let i = 1; i <= 20; i++) {
    const occupant = takenMap[i];
    const label = occupant ? `Thứ tự ${i} (Đang gán: ${occupant})` : `Thứ tự ${i}`;
    const selectedAttr = (!isUnassigned && Number(currentOrder) === i) ? 'selected' : '';
    optionsHtml += `<option value="${i}" ${selectedAttr}>${label}</option>`;
  }
   // Luôn đảm bảo giữ lại lựa chọn hiện tại của chính cán bộ này nếu nó lớn hơn 20
  if (currentOrder && Number(currentOrder) > 20) {
    const occupant = takenMap[Number(currentOrder)];
    const label = occupant ? `Thứ tự ${currentOrder} (Đang gán: ${occupant})` : `Thứ tự ${currentOrder}`;
    optionsHtml += `<option value="${currentOrder}" selected>${label}</option>`;
  }
   orderSelect.innerHTML = optionsHtml;
}

export function openModalForAdd(entityKey) {
  this.editingId = null;
  const modal = document.getElementById('adminModalOverlay');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalFormBody');
   if (titleEl) titleEl.textContent = `Thêm mới: ${this.getNavLabel(entityKey)}`;
  bodyEl.innerHTML = this.generateFormFields(entityKey, {});
   // Bind upload handlers AFTER HTML is injected so file inputs exist in DOM
  this.bindUploadHandlers();
  
  // Bind order options selector for staff
  if (['staff', 'deans', 'lecturers'].includes(entityKey)) {
    const nhomSelect = document.getElementById('field_nhom_id_select') || document.getElementById('field_nhom_id');
    const initialNhomId = nhomSelect ? nhomSelect.value : 1;
    this.updateOrderOptions(initialNhomId, null, null);
    
    if (nhomSelect) {
      nhomSelect.addEventListener('change', (e) => {
        this.updateOrderOptions(e.target.value, null, null);
      });
    }
  }
  
  // FIX: Xóa bản nháp cũ trước khi mở form Thêm mới.
  // Không được restore draft khi thêm mới để tránh dữ liệu cũ
  // hiện lại sau khi vừa lưu thành công.
  this.clearFormDraft(entityKey);
  
  // Capture clean (empty) state AFTER clearing draft so isFormDirty() works correctly
  this.captureInitialFormState();
   if (modal) modal.classList.remove('hidden');
  
  // Synchronize current modal add state to URL parameters
  this.syncUrlState();
}

export function openModalForEdit(entityKey, id) {
  this.editingId = id;
  const item = this.currentEntityData.find(i => String(i.id) === String(id));
  if (!item) return;
   const modal = document.getElementById('adminModalOverlay');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalFormBody');
   const itemTitle = item.ten_chi_so || item.ho_ten || item.ten_bai_bao || item.tieu_de || item.ten_de_tai || item.ten_nganh || item.ten_slide || item.ten || item.name || item.ten_nhom || item.ten_doi_tac || item.cau_hoi || item.tieu_de_thong_bao || item.tieu_de_bieu_do || item.ma_plo || this.getFallbackTitle(entityKey, item);
  if (titleEl) titleEl.textContent = `Chỉnh sửa: ${itemTitle}`;
  bodyEl.innerHTML = this.generateFormFields(entityKey, item);
   // Bind upload handlers AFTER HTML is injected so file inputs exist in DOM
  this.bindUploadHandlers();
   // Bind order options selector for staff
  if (['staff', 'deans', 'lecturers'].includes(entityKey)) {
    const nhomSelect = document.getElementById('field_nhom_id_select') || document.getElementById('field_nhom_id');
    const initialNhomId = nhomSelect ? nhomSelect.value : (item.nhom_id || 1);
    this.updateOrderOptions(initialNhomId, id, item.thu_tu_trong_nhom);
    
    if (nhomSelect) {
      nhomSelect.addEventListener('change', (e) => {
        this.updateOrderOptions(e.target.value, id, item.thu_tu_trong_nhom);
      });
    }
  }
   // Capture clean state BEFORE restoring form draft so we can compute formDirty accurately
  this.captureInitialFormState();
   this.restoreFormDraft(entityKey, item);
   if (modal) modal.classList.remove('hidden');
   // Synchronize current modal edit state to URL parameters
  this.syncUrlState();
}

export function closeModal() {
  if (this.isFormDirty()) {
    if (!confirm("Bạn có dữ liệu chưa được lưu. Bạn có chắc muốn rời khỏi trang?")) {
      return;
    }
  }
  const modal = document.getElementById('adminModalOverlay');
  if (modal) modal.classList.add('hidden');
  this.editingId = null;
  this.initialFormState = null;
  this.syncUrlState();
}
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
export function syncUrlState() {
  const params = new URLSearchParams(window.location.search);
  
  if (this.currentNav) {
    params.set('nav', this.currentNav);
  } else {
    params.delete('nav');
  }
  
  const searchInput = document.getElementById('adminSearchInput');
  if (searchInput && searchInput.value.trim() !== '') {
    params.set('search', searchInput.value.trim());
  } else {
    params.delete('search');
  }
  
  if (this.editingId) {
    params.set('edit', this.editingId);
    params.delete('add');
  } else {
    params.delete('edit');
  }
  
  const modal = document.getElementById('adminModalOverlay');
  const isAddOpen = modal && !modal.classList.contains('hidden') && !this.editingId;
  if (isAddOpen) {
    params.set('add', 'true');
    params.delete('edit');
  } else {
    params.delete('add');
  }
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', newUrl);
}

export function captureInitialFormState() {
  const container = document.getElementById('adminDynamicForm');
  if (!container) {
    this.initialFormState = null;
    return;
  }
  const state = {};
  const inputs = container.querySelectorAll('input:not([type="file"]), select, textarea');
  inputs.forEach(el => {
    if (el.name) state[el.name] = el.value;
  });
  this.initialFormState = JSON.stringify(state);
}

export function isFormDirty() {
  const container = document.getElementById('adminDynamicForm');
  if (!container || !this.initialFormState) return false;
  
  const currentState = {};
  const inputs = container.querySelectorAll('input:not([type="file"]), select, textarea');
  inputs.forEach(el => {
    if (el.name) currentState[el.name] = el.value;
  });
  
  return this.initialFormState !== JSON.stringify(currentState);
}
export function getDraftStorageKey(entityKey) {
  let tabId = sessionStorage.getItem('tabId');
  if (!tabId) {
    tabId = Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem('tabId', tabId);
  }
  const mode = this.editingId ? `edit-${this.editingId}` : `create-${tabId}`;
  return `admin-form-draft:${entityKey}:${mode}`;
}

export function saveFormDraft() {
  const container = document.getElementById('adminDynamicForm');
  if (!container || !this.currentNav || this.currentNav === 'dashboard') return;
   const draft = {};
  const inputs = container.querySelectorAll('input:not([type="file"]), select, textarea');
  inputs.forEach(el => {
    if (el.name) draft[el.name] = el.value;
  });
   localStorage.setItem(this.getDraftStorageKey(this.currentNav), JSON.stringify(draft));
}

export function restoreFormDraft(entityKey, sourceItem = null) {
  const container = document.getElementById('adminDynamicForm');
  if (!container) return;
   const stored = localStorage.getItem(this.getDraftStorageKey(entityKey));
  if (!stored) return;
   try {
    const draft = JSON.parse(stored);
    Object.entries(draft).forEach(([key, value]) => {
      const field = container.querySelector(`[name="${key}"]`);
      if (field && typeof field.value !== 'undefined') {
        field.value = value;
        
        const targetId = field.id;
        if (targetId) {
          const previewEl = document.getElementById(`preview_${targetId}`);
          if (previewEl) {
            previewEl.src = this.formatAdminImgUrl(value);
            previewEl.style.display = value ? 'block' : 'none';
          }
        }
      }
    });
     if (sourceItem && entityKey === 'staff' && sourceItem.anh_ca_nhan_url && !draft.anh_ca_nhan_url) {
      const avatarField = container.querySelector('[name="anh_ca_nhan_url"]');
      if (avatarField) {
        avatarField.value = sourceItem.anh_ca_nhan_url;
        const previewEl = document.getElementById('preview_field_anh_ca_nhan_url');
        if (previewEl) {
          previewEl.src = this.formatAdminImgUrl(sourceItem.anh_ca_nhan_url);
          previewEl.style.display = 'block';
        }
      }
    }
  } catch (err) {
    console.warn('Không thể khôi phục bản nháp form admin:', err);
  }
}

export function clearFormDraft(entityKey) {
  if (!entityKey || !this.currentNav || this.currentNav === 'dashboard') return;
  localStorage.removeItem(this.getDraftStorageKey(entityKey));
}
export function restoreUrlStateAndScroll() {
  const params = new URLSearchParams(window.location.search);
  
  // Restore search
  const searchParam = params.get('search');
  const searchInput = document.getElementById('adminSearchInput');
  if (searchParam && searchInput) {
    searchInput.value = searchParam;
    const query = searchParam.toLowerCase();
    const trs = document.querySelectorAll('#adminTableBody tr');
    trs.forEach(tr => {
      const text = tr.innerText.toLowerCase();
      tr.style.display = text.includes(query) ? '' : 'none';
    });
  }
   // Restore modal states
  const editParam = params.get('edit');
  const addParam = params.get('add');
  if (editParam) {
    this.openModalForEdit(this.currentNav, editParam);
  } else if (addParam === 'true') {
    this.openModalForAdd(this.currentNav);
  }
   // Restore scroll position
  const storedScrollY = sessionStorage.getItem('admin_scroll_y');
  if (storedScrollY) {
    setTimeout(() => {
      window.scrollTo(0, parseInt(storedScrollY, 10));
    }, 300);
  }
}

export function generateFormFields(entityKey, data) {
  const filterDefaultImg = (url) => {
    if (!url) return '';
    if (url.includes('default.jpg') || url.includes('default-user') || url.includes('default-avatar')) return '';
    return url;
  };
   const renderImageField = (label, name, value, fileInputId, targetId) => {
    const filteredVal = filterDefaultImg(value);
    return `
      <div class="form-group">
        <label>${label}</label>
        <input type="hidden" name="${name}" id="${targetId}" value="${filteredVal}">
        <div style="display: flex; gap: 8px; align-items: center;">
          <button type="button" class="btn-upload-label" data-file-input-id="${fileInputId}" style="background: var(--admin-primary); color: #fff; padding: 10px 14px; border-radius: var(--radius-md); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 600; margin: 0; box-shadow: var(--shadow-sm); transition: all 0.2s; border: 0;">
            📁 Chọn ảnh & Tải lên từ máy
          </button>
          <input type="file" id="${fileInputId}" class="local-image-uploader" data-target-id="${targetId}" accept="image/*" style="display: none;">
        </div>
        <div style="margin-top: 8px;">
          <img id="preview_${targetId}" src="${filteredVal ? this.formatAdminImgUrl(filteredVal) : ''}" style="max-width: 120px; max-height: 120px; border-radius: var(--radius-md); object-fit: cover; border: 1px solid var(--admin-card-border); ${filteredVal ? '' : 'display: none;'}" onerror="this.style.display='none'">
        </div>
      </div>
    `;
  };
   let html = ``;
   if (entityKey === 'staff' || entityKey === 'deans' || entityKey === 'lecturers') {
    const isDean = entityKey === 'deans';
    const isLecturer = entityKey === 'lecturers';
    const isEdit = !!data.id;
     if (isDean && !isEdit) {
      // Form bổ nhiệm Lãnh đạo khoa mới (chọn từ Giảng viên có sẵn)
      const lecturersList = (this.staffList || []).filter(s => Number(s.nhom_id) === 2);
      let lecturerOptions = '';
      if (lecturersList.length > 0) {
        lecturerOptions = lecturersList.map(s => 
          `<option value="${s.id}">${s.ho_ten} (${s.chuc_vu || 'Giảng viên'}, ${s.hoc_vi || 'Thạc sĩ'})</option>`
        ).join('');
      } else {
        lecturerOptions = '<option value="">-- Không có giảng viên khả dụng để bổ nhiệm --</option>';
      }
       html += `
        <input type="hidden" name="appoint_action" value="true">
        <input type="hidden" name="nhom_id" id="field_nhom_id" value="1">
        <div class="form-group">
          <label>Chọn Giảng viên bổ nhiệm làm Lãnh đạo (*)</label>
          <select name="appoint_nhan_vien_id" id="field_appoint_nhan_vien_id" required>
            ${lecturerOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Chức vụ Lãnh đạo mới (*)</label>
          <input type="text" name="chuc_vu" value="Phó Trưởng khoa" required placeholder="VD: Trưởng khoa, Phó Trưởng khoa">
        </div>
        <div class="form-group">
          <label>Thứ tự hiển thị trong Ban Lãnh đạo (*)</label>
          <select name="thu_tu_trong_nhom" id="field_thu_tu_trong_nhom" required>
            <!-- Tự động kết xuất động qua JS -->
          </select>
        </div>
      `;
    } else {
      // Form sửa hoặc thêm giảng viên/lãnh đạo bình thường
      html += `
        <input type="hidden" name="nhom_id" id="field_nhom_id" value="${isDean ? '1' : (isLecturer ? '2' : (data.nhom_id || '2'))}">
        <div class="form-group">
          <label>Họ và tên Giảng viên (*)</label>
          <input type="text" name="main_title" value="${data.ho_ten || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
        </div>
        <div class="form-group">
          <label>Chức vụ (*)</label>
          <input type="text" name="chuc_vu" value="${data.chuc_vu || ''}" required placeholder="VD: Trưởng khoa, Giảng viên">
        </div>
      `;
       if (!isDean && !isLecturer) {
        // Chỉ hiện Nhóm nhân sự nếu là entity 'staff' chung cũ
        html += `
          <div class="form-group">
            <label>Nhóm Nhân sự (*)</label>
            <select name="nhom_id" id="field_nhom_id_select" required>
              ${(() => {
                if (this.staffGroupsList && this.staffGroupsList.length > 0) {
                  const sorted = [...this.staffGroupsList].sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
                  return sorted.map(g => 
                    `<option value="${g.id}" ${String(g.id) === String(data.nhom_id || 2) ? 'selected' : ''}>${g.ten_nhom}</option>`
                  ).join('');
                }
                return `
                  <option value="1" ${data.nhom_id === 1 ? 'selected' : ''}>Ban Lãnh đạo Khoa</option>
                  <option value="2" ${data.nhom_id !== 1 ? 'selected' : ''}>Giảng viên & Trợ giảng</option>
                `;
              })()}
            </select>
          </div>
        `;
      }
       html += `
        <div class="form-group">
          <label>Thứ tự hiển thị trong nhóm (*)</label>
          <select name="thu_tu_trong_nhom" id="field_thu_tu_trong_nhom" required>
            <!-- Tự động kết xuất động qua JS -->
          </select>
        </div>
        <div class="form-group">
          <label>Học vị (*)</label>
          <select name="hoc_vi">
            <option value="Tiến sĩ" ${data.hoc_vi === 'Tiến sĩ' ? 'selected' : ''}>Tiến sĩ</option>
            <option value="Thạc sĩ" ${data.hoc_vi === 'Thạc sĩ' ? 'selected' : ''}>Thạc sĩ</option>
            <option value="Kỹ sư" ${data.hoc_vi === 'Kỹ sư' ? 'selected' : ''}>Kỹ sư</option>
            <option value="NCS" ${data.hoc_vi === 'NCS' ? 'selected' : ''}>Nghiên cứu sinh (NCS)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Ngạch viên chức</label>
          <input type="text" name="ngach_vien_chuc" value="${data.ngach_vien_chuc || 'Giảng viên'}" placeholder="Giảng viên chính / Giảng viên cao cấp">
        </div>
        <div class="form-group">
          <label>Email công vụ (@tvu.edu.vn)</label>
          <input type="email" name="email" value="${data.email || ''}" placeholder="lamnn@tvu.edu.vn">
        </div>
        <div class="form-group">
          <label>Đơn vị công tác chính</label>
          <input type="text" name="don_vi_cong_tac" value="${data.don_vi_cong_tac || 'Khoa Công nghệ thông tin'}" placeholder="VD: Khoa Công nghệ thông tin">
        </div>
        ${renderImageField('Ảnh đại diện (Tải lên từ máy)', 'anh_ca_nhan_url', data.anh_ca_nhan_url, 'upload_staff_avatar_input', 'field_anh_ca_nhan_url')}
        <div class="form-group">
          <label>Trạng thái hiển thị nhân sự (*)</label>
          <select name="an_hien" required>
            <option value="1" ${data.an_hien !== 0 ? 'selected' : ''}>Hiện trên Website</option>
            <option value="0" ${data.an_hien === 0 ? 'selected' : ''}>Ẩn khỏi Website</option>
          </select>
        </div>
        <div class="form-group">
          <label>Hiển thị Email cá nhân (*)</label>
          <select name="an_hien_email" required>
            <option value="1" ${data.an_hien_email !== 0 ? 'selected' : ''}>Hiện Email</option>
            <option value="0" ${data.an_hien_email === 0 ? 'selected' : ''}>Ẩn Email</option>
          </select>
        </div>
      `;
    }
  } else if (entityKey === 'staffProfiles') {
    let staffOptions = '';
    if (this.staffList && this.staffList.length > 0) {
      staffOptions = this.staffList.map(s => 
        `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
      ).join('');
    } else {
      staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
    }
     html += `
      <div class="form-group">
        <label>Liên kết Giảng viên (*)</label>
        <select name="nhan_vien_id" required>
          ${staffOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Email liên hệ (*)</label>
        <input type="email" name="email" value="${data.email || ''}" required placeholder="VD: giangvien@tvu.edu.vn">
      </div>
      <div class="form-group">
        <label>Học vị</label>
        <input type="text" name="hoc_vi" value="${data.hoc_vi || 'Thạc sĩ'}" placeholder="VD: Thạc sĩ, Tiến sĩ">
      </div>
      <div class="form-group">
        <label>Ngạch viên chức</label>
        <input type="text" name="ngach_vien_chuc" value="${data.ngach_vien_chuc || 'Giảng viên'}" placeholder="VD: Giảng viên, Giảng viên chính">
      </div>
      <div class="form-group">
        <label>Học hàm</label>
        <input type="text" name="hoc_ham" value="${data.hoc_ham || ''}" placeholder="VD: Giáo sư, Phó giáo sư (nếu có)">
      </div>
      <div class="form-group">
        <label>Đơn vị công tác</label>
        <input type="text" name="don_vi_cong_tac" value="${data.don_vi_cong_tac || 'Khoa Công nghệ thông tin, Trường Kỹ thuật và Công nghệ, Đại học Trà Vinh'}" placeholder="VD: Bộ môn Công nghệ thông tin">
      </div>
      <div class="form-group">
        <label>Lĩnh vực nghiên cứu</label>
        <textarea name="linh_vuc_nghien_cuu" rows="3" placeholder="Các hướng nghiên cứu chính...">${(() => {
          const raw = data.linh_vuc_nghien_cuu || '';
          return raw.split('||hide:')[0] || '';
        })()}</textarea>
      </div>
      <div class="form-group" style="margin-top: 6px; padding: 16px; border: 1px solid var(--admin-card-border); border-radius: var(--radius-md); background: rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 10px;">
        <label style="color: var(--admin-accent); font-weight: 700; margin-bottom: 2px;">👁️ Ẩn/Hiện Phần Nội Dung Trang Cá Nhân</label>
        ${(() => {
          const raw = data.linh_vuc_nghien_cuu || '';
          const hideConfig = raw.includes('||hide:') ? raw.split('||hide:')[1] : '';
          const hidden = hideConfig ? hideConfig.split(',') : [];
          return `
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: none; font-size: 0.88rem; cursor: pointer; color: var(--admin-text-main);">
              <input type="checkbox" id="hide_section_nckh" ${hidden.includes('nckh') ? 'checked' : ''} style="width: 16px; height: 16px; margin: 0; cursor: pointer;">
              Ẩn "ĐỀ TÀI NCKH CÁC CẤP"
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: none; font-size: 0.88rem; cursor: pointer; color: var(--admin-text-main);">
              <input type="checkbox" id="hide_section_project" ${hidden.includes('project') ? 'checked' : ''} style="width: 16px; height: 16px; margin: 0; cursor: pointer;">
              Ẩn "DỰ ÁN / PROJECT"
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: none; font-size: 0.88rem; cursor: pointer; color: var(--admin-text-main);">
              <input type="checkbox" id="hide_section_paper" ${hidden.includes('paper') ? 'checked' : ''} style="width: 16px; height: 16px; margin: 0; cursor: pointer;">
              Ẩn "BÀI BÁO KHOA HỌC"
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: none; font-size: 0.88rem; cursor: pointer; color: var(--admin-text-main);">
              <input type="checkbox" id="hide_section_book" ${hidden.includes('book') ? 'checked' : ''} style="width: 16px; height: 16px; margin: 0; cursor: pointer;">
              Ẩn "SÁCH VÀ GIÁO TRÌNH GIẢNG DẠY"
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; text-transform: none; font-size: 0.88rem; cursor: pointer; color: var(--admin-text-main);">
              <input type="checkbox" id="hide_section_supervision" ${hidden.includes('supervision') ? 'checked' : ''} style="width: 16px; height: 16px; margin: 0; cursor: pointer;">
              Ẩn "HƯỚNG DẪN NGHIÊN CỨU SINH, HỌC VIÊN..."
            </label>
          `;
        })()}
      </div>
      <div class="form-group">
        <label>Link Google Scholar</label>
        <input type="url" name="google_scholar_url" value="${data.google_scholar_url || ''}" placeholder="https://scholar.google.com/...">
      </div>
      <div class="form-group">
        <label>Link ORCID</label>
        <input type="url" name="orcid_url" value="${data.orcid_url || ''}" placeholder="https://orcid.org/...">
      </div>
      <div class="form-group">
        <label>Link Github</label>
        <input type="url" name="github_url" value="${data.github_url || ''}" placeholder="https://github.com/...">
      </div>
      <div class="form-group">
        <label>Website cá nhân</label>
        <input type="url" name="website_ca_nhan" value="${data.website_ca_nhan || ''}" placeholder="https://...">
      </div>
    `;
  } else if (entityKey === 'staffResearch') {
    let staffOptions = '';
    if (this.staffList && this.staffList.length > 0) {
      staffOptions = this.staffList.map(s => 
        `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
      ).join('');
    } else {
      staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
    }
    html += `
      <div class="form-group">
        <label>Giảng viên thực hiện (*)</label>
        <select name="nhan_vien_id" required>
          ${staffOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Tên đề tài NCKH (*)</label>
        <input type="text" name="main_title" value="${data.ten_de_tai || ''}" required placeholder="VD: Nghiên cứu xây dựng chatbot AI...">
      </div>
      <div class="form-group">
        <label>Năm hoàn thành (*)</label>
        <input type="number" name="sub_title" value="${data.nam_hoan_thanh || ''}" required placeholder="VD: 2024">
      </div>
      <div class="form-group">
        <label>Cấp đề tài</label>
        <input type="text" name="description" value="${data.cap_de_tai || 'Đề tài Nghiên cứu cấp Cơ sở'}" placeholder="VD: Đề tài cấp Bộ, Đề tài cấp Tỉnh">
      </div>
      <div class="form-group">
        <label>Trách nhiệm tham gia</label>
        <input type="text" name="trach_nhiem_tham_gia" value="${data.trach_nhiem_tham_gia || 'Chủ nhiệm đề tài'}" placeholder="VD: Chủ nhiệm đề tài, Thành viên...">
      </div>
    `;
  } else if (entityKey === 'staffPapers') {
    let staffOptions = '';
    if (this.staffList && this.staffList.length > 0) {
      staffOptions = this.staffList.map(s => 
        `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
      ).join('');
    } else {
      staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
    }
    html += `
      <div class="form-group">
        <label>Giảng viên công bố (*)</label>
        <select name="nhan_vien_id" required>
          ${staffOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Tên bài báo khoa học (*)</label>
        <input type="text" name="ten_bai_bao" value="${data.ten_bai_bao || ''}" required placeholder="VD: A Study on Deep Learning Applications in Agriculture">
      </div>
      <div class="form-group">
        <label>Năm xuất bản (*)</label>
        <input type="number" name="nam_xuat_ban" value="${data.nam_xuat_ban || new Date().getFullYear()}" required placeholder="VD: 2024">
      </div>
      <div class="form-group">
        <label>Danh sách tác giả (*)</label>
        <textarea name="danh_sach_tac_gia" rows="2" required placeholder="VD: Nguyễn Nhứt Lam, Lê Phong Dụ, Trần Văn A">${data.danh_sach_tac_gia || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Tên tạp chí / hội nghị khoa học</label>
        <input type="text" name="ten_tap_chi_hoi_nghi" value="${data.ten_tap_chi_hoi_nghi || 'Hội nghị Khoa học'}" placeholder="VD: SN Computer Science, IEEE Transactions">
      </div>
    `;
  } else if (entityKey === 'staffProjects') {
    let staffOptions = '';
    if (this.staffList && this.staffList.length > 0) {
      staffOptions = this.staffList.map(s => 
        `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
      ).join('');
    } else {
      staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
    }
    html += `
      <div class="form-group">
        <label>Giảng viên chủ trì (*)</label>
        <select name="nhan_vien_id" required>
          ${staffOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Tên dự án & Chuyển giao (*)</label>
        <input type="text" name="main_title" value="${data.ten_du_an || ''}" required placeholder="VD: Dự án tư vấn hệ thống IoT...">
      </div>
      <div class="form-group">
        <label>Khoảng thời gian thực hiện (*)</label>
        <input type="text" name="sub_title" value="${data.nam_thuc_hien || ''}" required placeholder="VD: 2023 - 2024">
      </div>
      <div class="form-group">
        <label>Vai trò</label>
        <input type="text" name="vai_tro" value="${data.vai_tro || 'Trưởng nhóm kỹ thuật'}" placeholder="VD: Trưởng nhóm giải pháp">
      </div>
      <div class="form-group">
        <label>Mô tả chi tiết dự án</label>
        <textarea name="description" rows="3" placeholder="Chi tiết chuyển giao...">${data.mo_ta || ''}</textarea>
      </div>
    `;
  } else if (entityKey === 'staffBooks') {
    let staffOptions = '';
    if (this.staffList && this.staffList.length > 0) {
      staffOptions = this.staffList.map(s => 
        `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
      ).join('');
    } else {
      staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
    }
    html += `
      <div class="form-group">
        <label>Giảng viên chủ biên/viết (*)</label>
        <select name="nhan_vien_id" required>
          ${staffOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Tên sách / Giáo trình (*)</label>
        <input type="text" name="main_title" value="${data.ten_sach_giao_trinh || ''}" required placeholder="VD: Giáo trình Cấu trúc dữ liệu...">
      </div>
      <div class="form-group">
        <label>Năm xuất bản (*)</label>
        <input type="number" name="sub_title" value="${data.nam_xuat_ban || ''}" required placeholder="VD: 2024">
      </div>
      <div class="form-group">
        <label>Nhà xuất bản</label>
        <input type="text" name="nha_xuat_ban" value="${data.nha_xuat_ban || 'NXB Đại học Trà Vinh'}" placeholder="VD: NXB Thông tin và Truyền thông">
      </div>
      <div class="form-group">
        <label>Vai trò</label>
        <input type="text" name="vai_tro" value="${data.vai_tro || 'Chủ biên'}" placeholder="VD: Tác giả chính, Chủ biên...">
      </div>
    `;
  } else if (entityKey === 'staffSupervisions') {
    let staffOptions = '';
    if (this.staffList && this.staffList.length > 0) {
      staffOptions = this.staffList.map(s => 
        `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
      ).join('');
    } else {
      staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
    }
    html += `
      <div class="form-group">
        <label>Giảng viên hướng dẫn (*)</label>
        <select name="nhan_vien_id" required>
          ${staffOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Tên học viên / sinh viên hướng dẫn (*)</label>
        <input type="text" name="main_title" value="${data.ten_hoc_vien || ''}" required placeholder="VD: Nguyễn Văn A">
      </div>
      <div class="form-group">
        <label>Phân loại bậc học (*)</label>
        <select name="loai_hoc_vien" required>
          <option value="sinh_vien_nckh" ${data.loai_hoc_vien === 'sinh_vien_nckh' ? 'selected' : ''}>Sinh viên NCKH</option>
          <option value="hoc_vien_cao_hoc" ${data.loai_hoc_vien === 'hoc_vien_cao_hoc' ? 'selected' : ''}>Học viên Cao học</option>
          <option value="ncs" ${data.loai_hoc_vien === 'ncs' ? 'selected' : ''}>Nghiên cứu sinh (NCS)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Tên đề tài hướng dẫn (*)</label>
        <textarea name="description" rows="2" required placeholder="VD: Nghiên cứu ứng dụng IoT...">${data.ten_de_tai_huong_dan || ''}</textarea>
      </div>
    `;
  } else if (entityKey === 'staffGroups') {
    html += `
      <div class="form-group">
        <label>Tên nhóm nhân sự (*)</label>
        <input type="text" name="main_title" value="${data.ten_nhom || ''}" required placeholder="VD: Lãnh đạo Khoa">
      </div>
      <div class="form-group">
        <label>Số thứ tự sắp xếp nhóm (*)</label>
        <input type="number" name="thu_tu" value="${data.thu_tu !== undefined ? data.thu_tu : 1}" required placeholder="VD: 1 cho Lãnh đạo, 2 cho Giảng viên">
      </div>
    `;
  } else if (entityKey === 'homepageHero') {
    html += `
      <div class="form-group">
        <label>Slogan tiếng Việt (*)</label>
        <input type="text" name="main_title" value="${data.slogan_vi || ''}" required placeholder="VD: Tri thức - Sáng tạo - Hội nhập">
      </div>
      <div class="form-group">
        <label>Slogan tiếng Anh</label>
        <input type="text" name="sub_title" value="${data.slogan_en || ''}" placeholder="VD: Knowledge - Creativity - Integration">
      </div>
      ${renderImageField('Ảnh Banner Hero (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_banner_url, 'upload_hero_banner_input', 'field_hero_banner_url')}
    `;
  } else if (entityKey === 'homepagePrograms') {
    html += `
      <div class="form-group">
        <label>Tên chương trình đào tạo (*)</label>
        <input type="text" name="main_title" value="${data.ten_chuong_trinh || ''}" required placeholder="VD: Kỹ sư Trí tuệ nhân tạo">
      </div>
      <div class="form-group">
        <label>Nhãn thẻ (Badge Text - VD: AUN-QA, HOT)</label>
        <input type="text" name="badge_text" value="${data.badge_text || ''}" placeholder="VD: HOT">
      </div>
      <div class="form-group">
        <label>Nhãn kiểm định (VD: Đạt chuẩn kiểm định AUN-QA)</label>
        <input type="text" name="nhan_kiem_dinh" value="${data.nhan_kiem_dinh || ''}" placeholder="VD: Đạt chuẩn kiểm định AUN-QA">
      </div>
      <div class="form-group">
        <label>Mô tả ngắn định hướng (*)</label>
        <textarea name="description" rows="3" required placeholder="Nhập mô tả định hướng của ngành...">${data.mo_ta_ngan || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Đường dẫn chi tiết (Link chi tiết)</label>
        <input type="text" name="link_chi_tiet" value="${data.link_chi_tiet || ''}" placeholder="VD: /undergraduate/cntt.html">
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'homepageAdmissions') {
    html += `
      <div class="form-group">
        <label>Tiêu đề Box Tuyển sinh (*)</label>
        <input type="text" name="main_title" value="${data.tieu_de_box || ''}" required placeholder="VD: 🎓 Tuyển sinh 2026">
      </div>
      <div class="form-group">
        <label>Mã ngành AI (*)</label>
        <input type="text" name="ma_nganh_ai" value="${data.ma_nganh_ai || '7480107'}" required>
      </div>
      <div class="form-group">
        <label>Mã ngành Khoa học Máy tính (*)</label>
        <input type="text" name="ma_nganh_cs" value="${data.ma_nganh_cs || '7480101'}" required>
      </div>
      <div class="form-group">
        <label>Tổ hợp xét tuyển (*)</label>
        <input type="text" name="to_hop_xet_tuyen" value="${data.to_hop_xet_tuyen || 'A00, A01, D01, D07'}" required placeholder="VD: A00, A01, D01">
      </div>
      <div class="form-group">
        <label>Điểm chuẩn 2025 ngành AI (*)</label>
        <input type="number" step="0.01" name="diem_chuan_2025_ai" value="${data.diem_chuan_2025_ai || 23.04}" required>
      </div>
      <div class="form-group">
        <label>Điểm chuẩn 2025 ngành KHMT (*)</label>
        <input type="number" step="0.01" name="diem_chuan_2025_cs" value="${data.diem_chuan_2025_cs || 23.07}" required>
      </div>
      <div class="form-group">
        <label>Chỉ tiêu 2026 ngành AI (*)</label>
        <input type="number" name="chi_tieu_2026_ai" value="${data.chi_tieu_2026_ai || 200}" required>
      </div>
      <div class="form-group">
        <label>Chỉ tiêu 2026 ngành KHMT (*)</label>
        <input type="number" name="chi_tieu_2026_cs" value="${data.chi_tieu_2026_cs || 83}" required>
      </div>
      <div class="form-group">
        <label>Kênh liên hệ hỗ trợ tuyển sinh (*)</label>
        <input type="text" name="lien_he_tuyen_sinh" value="${data.lien_he_tuyen_sinh || ''}" required placeholder="VD: Số điện thoại hoặc Website">
      </div>
      <div class="form-group">
        <label>Văn bản mô tả đầy đủ (*)</label>
        <textarea name="description" rows="4" required placeholder="Nhập văn bản mô tả đầy đủ tuyển sinh...">${data.noi_dung_day_du || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Trạng thái hiển thị (*)</label>
        <select name="an_hien" required>
          <option value="1" ${data.an_hien !== 0 ? 'selected' : ''}>Hiện trên Website</option>
          <option value="0" ${data.an_hien === 0 ? 'selected' : ''}>Ẩn khỏi Website</option>
        </select>
      </div>
    `;
  } else if (entityKey === 'homepageEvents') {
    html += `
      <div class="form-group">
        <label>Tiêu đề sự kiện (*)</label>
        <input type="text" name="main_title" value="${data.tieu_de_su_kien || ''}" required placeholder="VD: Hội thảo khoa học về Trí tuệ nhân tạo 2026">
      </div>
      <div class="form-group">
        <label>Ngày sự kiện (*)</label>
        <input type="text" name="sub_title" value="${data.ngay_su_kien || ''}" required placeholder="VD: 19-07-2026">
      </div>
      <div class="form-group">
        <label>Link chi tiết tin tức</label>
        <input type="text" name="link_chi_tiet" value="${data.link_chi_tiet || '#'}" placeholder="VD: /news/?slug=cita-2026">
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'sliders') {
    html += `
      <div class="form-group">
        <label>Tên Slide (*)</label>
        <input type="text" name="main_title" value="${data.ten_slide || ''}" required placeholder="VD: Chào mừng đến với Khoa CNTT">
      </div>
      <div class="form-group">
        <label>Link liên kết</label>
        <input type="text" name="sub_title" value="${data.link_lien_ket || '#'}" placeholder="VD: #programs-section">
      </div>
      ${renderImageField('Hình ảnh Slide (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_url, 'upload_slider_img_input', 'field_slider_image_url')}
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'infographics') {
    html += `
      <div class="form-group">
        <label>Tên Infographic (*)</label>
        <input type="text" name="main_title" value="${data.ten_infographic || ''}" required placeholder="VD: Đại học - Ngành Trí tuệ Nhân tạo">
      </div>
      <div class="form-group">
        <label>Link File PDF tải về</label>
        <input type="text" name="sub_title" value="${data.file_pdf_url || '#'}" placeholder="VD: assets/infographic/pdf_ttnt.pdf">
      </div>
      ${renderImageField('Hình ảnh Preview (Tải lên từ máy) (*)', 'image_url', data.file_anh_url, 'upload_infographic_img_input', 'field_infographic_image_url')}
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'stats') {
    html += `
      <div class="form-group">
        <label>Tên chỉ số (*)</label>
        <input type="text" name="main_title" value="${data.ten_chi_so || ''}" required placeholder="VD: Sinh viên đang theo học">
      </div>
      <div class="form-group">
        <label>Số liệu thống kê (*)</label>
        <input type="number" name="sub_title" value="${data.so_lieu_thong_ke || ''}" required placeholder="VD: 1200">
      </div>
      <div class="form-group">
        <label>Đơn vị (VD: +, %, người)</label>
        <input type="text" name="don_vi" value="${data.don_vi || ''}" placeholder="VD: +">
      </div>
      <div class="form-group">
        <label>Ghi chú thời gian</label>
        <input type="text" name="ghi_chu_thoi_gian" value="${data.ghi_chu_thoi_gian || ''}" placeholder="VD: Tính đến tháng 12/2025">
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'students') {
    html += `
      <div class="form-group">
        <label>Phân loại mục hiển thị (*)</label>
        <select name="chuyen_muc" required>
          <option value="Sinh viên tiêu biểu" ${data.chuyen_muc === 'Sinh viên tiêu biểu' ? 'selected' : ''}>🏆 Sinh viên tiêu biểu</option>
          <option value="Nghiên cứu khoa học sinh viên" ${data.chuyen_muc === 'Nghiên cứu khoa học sinh viên' ? 'selected' : ''}>🔬 Nghiên cứu khoa học sinh viên</option>
          <option value="Dự án AI nổi bật" ${data.chuyen_muc === 'Dự án AI nổi bật' ? 'selected' : ''}>🤖 Dự án AI nổi bật</option>
        </select>
      </div>
      <div class="form-group">
        <label>Tên Đội / Cá nhân (*)</label>
        <input type="text" name="main_title" value="${data.ten_doi_ca_nhan || ''}" required placeholder="VD: Đội CTU-LinguTechies">
      </div>
      <div class="form-group">
        <label>Ngành học / Lớp</label>
        <input type="text" name="sub_title" value="${data.nganh_hoc || ''}" placeholder="VD: Ngành Khoa học máy tính">
      </div>
      <div class="form-group">
        <label>Giảng viên hướng dẫn</label>
        <input type="text" name="giang_vien_huong_dan" value="${data.giang_vien_huong_dan || ''}" placeholder="VD: PGS. TS. Phạm Nguyên Khang">
      </div>
      <div class="form-group">
        <label>Thành tích đạt được (*)</label>
        <textarea name="description" rows="3" required placeholder="Nhập chi tiết thành tích...">${data.thanh_tich || ''}</textarea>
      </div>
      ${renderImageField('Hình ảnh đạt giải / Cá nhân (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_url, 'upload_student_img_input', 'field_student_image_url')}
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
      <div class="form-group">
        <label>Trạng thái hiển thị (*)</label>
        <select name="an_hien" required>
          <option value="1" ${data.an_hien !== 0 ? 'selected' : ''}>Hiện trên Website</option>
          <option value="0" ${data.an_hien === 0 ? 'selected' : ''}>Ẩn khỏi Website</option>
        </select>
      </div>
    `;
  } else if (entityKey === 'alumni') {
    html += `
      <div class="form-group">
        <label>Họ tên Cựu sinh viên (*)</label>
        <input type="text" name="main_title" value="${data.ho_ten || ''}" required placeholder="VD: Trần Hoàng Thảo Nguyên">
      </div>
      <div class="form-group">
        <label>Chức danh & Công ty công tác (*)</label>
        <input type="text" name="sub_title" value="${data.chuc_danh_cong_ty || ''}" required placeholder="VD: Data Engineer @ PTN Global">
      </div>
      <div class="form-group">
        <label>Trích dẫn cảm nghĩ (*)</label>
        <textarea name="description" rows="3" required placeholder="Nhập trích dẫn cảm nhận về Khoa...">${data.trich_dan_cam_nhan || ''}</textarea>
      </div>
      ${renderImageField('Hình ảnh đại diện (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_avatar_url, 'upload_alumni_img_input', 'field_alumni_image_url')}
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
      <div class="form-group">
        <label>Trạng thái hiển thị (*)</label>
        <select name="an_hien" required>
          <option value="1" ${data.an_hien !== 0 ? 'selected' : ''}>Hiện trên Website</option>
          <option value="0" ${data.an_hien === 0 ? 'selected' : ''}>Ẩn khỏi Website</option>
        </select>
      </div>
    `;
  } else if (entityKey === 'homepageGallery') {
    html += `
      <div class="form-group">
        <label>Tiêu đề ảnh (*)</label>
        <input type="text" name="main_title" value="${data.tieu_de_anh || ''}" required placeholder="VD: Lễ bảo vệ luận văn Thạc sĩ">
      </div>
      ${renderImageField('Hình ảnh hoạt động (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_url, 'upload_hpgallery_img_input', 'field_hpgallery_image_url')}
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'aboutOverview') {
    html += `
      <div class="form-group">
        <label>Tiêu đề chính (*)</label>
        <input type="text" name="main_title" value="${data.tieu_de || ''}" required placeholder="VD: KHOA CÔNG NGHỆ THÔNG TIN">
      </div>
      <div class="form-group">
        <label>Badge text (Chữ nhỏ phía trên) (*)</label>
        <input type="text" name="sub_title" value="${data.badge_text || ''}" required placeholder="VD: GIỚI THIỆU TỔNG QUAN">
      </div>
      <div class="form-group">
        <label>Nội dung giới thiệu chi tiết (*)</label>
        <textarea name="description" rows="5" required placeholder="Nhập nội dung...">${data.mo_ta_chi_tiet || ''}</textarea>
      </div>
      ${renderImageField('Hình ảnh tập thể (Tải lên từ máy) (*)', 'image_url', data.hinh_anh_tap_the_url, 'upload_overview_img_input', 'field_overview_image_url')}
      <div class="form-group">
        <label>Chú thích ảnh tập thể</label>
        <input type="text" name="caption_anh" value="${data.caption_anh || ''}" placeholder="VD: Tập thể giảng viên Khoa CNTT">
      </div>
    `;
  } else if (entityKey === 'aboutHighlights') {
    html += `
      <div class="form-group">
        <label>Tiêu đề highlight (*)</label>
        <input type="text" name="main_title" value="${data.tieu_de || ''}" required placeholder="VD: Chương trình đào tạo">
      </div>
      <div class="form-group">
        <label>Icon class (VD: graduation-cap, flask, share-2) (*)</label>
        <input type="text" name="sub_title" value="${data.icon_class || 'graduation-cap'}" required placeholder="VD: graduation-cap">
      </div>
      <div class="form-group">
        <label>Mô tả ngắn (*)</label>
        <textarea name="description" rows="3" required placeholder="Nhập mô tả điểm nổi bật...">${data.mo_ta || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'aboutMission') {
    html += `
      <div class="form-group">
        <label>Tiêu đề khối (*)</label>
        <input type="text" name="main_title" value="${data.tieu_de || ''}" required placeholder="VD: SỨ MỆNH">
      </div>
      <div class="form-group">
        <label>Phân loại (*)</label>
        <select name="loai" required>
          <option value="su_menh" ${data.loai === 'su_menh' ? 'selected' : ''}>Sứ mệnh (su_menh)</option>
          <option value="tam_nhin" ${data.loai === 'tam_nhin' ? 'selected' : ''}>Tầm nhìn (tam_nhin)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Nội dung chi tiết sứ mệnh/tầm nhìn (*)</label>
        <textarea name="description" rows="5" required placeholder="Nhập nội dung...">${data.noi_dung || ''}</textarea>
      </div>
    `;
  } else if (entityKey === 'timeline') {
    html += `
      <div class="form-group">
        <label>Năm cột mốc (*)</label>
        <input type="text" name="main_title" value="${data.nam || ''}" required placeholder="VD: 2001">
      </div>
      <div class="form-group">
        <label>Ngày cụ thể (nếu có)</label>
        <input type="date" name="ngay_cu_the" value="${data.ngay_cu_the || ''}">
      </div>
      <div class="form-group">
        <label>Số quyết định (nếu có)</label>
        <input type="text" name="so_quyet_dinh" value="${data.so_quyet_dinh || ''}" placeholder="VD: 112/QĐ-UBND">
      </div>
      <div class="form-group">
        <label>Nội dung sự kiện lịch sử (*)</label>
        <textarea name="description" rows="3" required placeholder="Nhập nội dung cột mốc...">${data.noi_dung || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'partners') {
    html += `
      <div class="form-group">
        <label>Tên đối tác (*)</label>
        <input type="text" name="main_title" value="${data.ten_doi_tac || ''}" required placeholder="VD: CNRS">
      </div>
      <div class="form-group">
        <label>Vị trí hiển thị (VD: gioi_thieu) (*)</label>
        <input type="text" name="hien_thi_o" value="${data.hien_thi_o || 'gioi_thieu'}" required placeholder="VD: gioi_thieu">
      </div>
      ${renderImageField('Logo đối tác (Tải lên từ máy) (*)', 'image_url', data.logo_url, 'upload_partner_logo_input', 'field_partner_logo_url')}
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'aboutDeansContact') {
    let staffOptions = '';
    if (Array.isArray(this.staffList)) {
      staffOptions = this.staffList.map(s => `<option value="${s.id}" ${data.nhan_vien_id === s.id ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`).join('');
    }
    html += `
      <div class="form-group">
        <label>Họ tên Ban Giám Khoa (*)</label>
        <input type="text" name="main_title" value="${data.ho_ten || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
      </div>
      <div class="form-group">
        <label>Chức vụ phụ trách (*)</label>
        <input type="text" name="sub_title" value="${data.chuc_vu_phu_trach || ''}" required placeholder="VD: Trưởng khoa - Phụ trách chung">
      </div>
      <div class="form-group">
        <label>Email liên hệ (*)</label>
        <input type="email" name="email" value="${data.email || ''}" required placeholder="VD: lamnn@tvu.edu.vn">
      </div>
      <div class="form-group">
        <label>Liên kết với tài khoản Nhân sự (Staff)</label>
        <select name="nhan_vien_id">
          <option value="">-- Chọn nhân sự liên kết (Nếu có) --</option>
          ${staffOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'aboutUnitContact') {
    html += `
      <div class="form-group">
        <label>Tên đơn vị (*)</label>
        <input type="text" name="main_title" value="${data.ten_don_vi || ''}" required placeholder="VD: Khoa Công nghệ thông tin">
      </div>
      <div class="form-group">
        <label>Trường trực thuộc (*)</label>
        <input type="text" name="sub_title" value="${data.truong_don_vi || ''}" required placeholder="VD: Trường Đại học Trà Vinh">
      </div>
      <div class="form-group">
        <label>Khu vực (*)</label>
        <input type="text" name="khu" value="${data.khu || 'Khu I'}" required>
      </div>
      <div class="form-group">
        <label>Đại học chủ quản (*)</label>
        <input type="text" name="dai_hoc" value="${data.dai_hoc || 'Đại học Trà Vinh'}" required>
      </div>
      <div class="form-group">
        <label>Số nhà, Đường (*)</label>
        <input type="text" name="dia_chi_duong" value="${data.dia_chi_duong || 'Số 126 Nguyễn Thiện Thành'}" required>
      </div>
      <div class="form-group">
        <label>Phường / Xã (*)</label>
        <input type="text" name="phuong" value="${data.phuong || 'Phường 5'}" required>
      </div>
      <div class="form-group">
        <label>Thành phố / Tỉnh (*)</label>
        <input type="text" name="thanh_pho" value="${data.thanh_pho || 'Thành phố Trà Vinh'}" required>
      </div>
      <div class="form-group">
        <label>Đường dẫn Facebook Fanpage</label>
        <input type="text" name="facebook_url" value="${data.facebook_url || ''}">
      </div>
      <div class="form-group">
        <label>Copyright text chân trang (*)</label>
        <input type="text" name="description" value="${data.copyright_text || ''}" required placeholder="VD: © 2026 Khoa Công nghệ thông tin - ĐHTV">
      </div>
    `;
  } else if (entityKey === 'researchDirections') {
    html += `
      <div class="form-group">
        <label>Tên hướng nghiên cứu (*)</label>
        <input type="text" name="main_title" value="${data.ten || ''}" required placeholder="VD: Khai phá dữ liệu và trí tuệ nhân tạo">
      </div>
      <div class="form-group">
        <label>Mô tả chi tiết (*)</label>
        <textarea name="description" rows="3" required placeholder="Nhập chi tiết hướng nghiên cứu...">${data.mo_ta || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'researchProjects') {
    html += `
      <div class="form-group">
        <label>Tên đề tài NCKH (*)</label>
        <input type="text" name="main_title" value="${data.ten_de_tai || ''}" required placeholder="VD: TVU-Bot: Trợ lý ảo...">
      </div>
      <div class="form-group">
        <label>Chủ nhiệm đề tài (*)</label>
        <input type="text" name="sub_title" value="${data.chu_nhiem_ten || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
      </div>
      <div class="form-group">
        <label>Cấp đề tài</label>
        <input type="text" name="description" value="${data.cap || 'Đề tài nghiên cứu cấp cơ sở'}" placeholder="VD: Đề tài cấp cơ sở, Đề tài cấp Bộ">
      </div>
      <div class="form-group">
        <label>Trạng thái đề tài (*)</label>
        <select name="trang_thai" required>
          <option value="Đang thực hiện" ${data.trang_thai === 'Đang thực hiện' ? 'selected' : ''}>Đang thực hiện</option>
          <option value="Đã hoàn thành" ${data.trang_thai === 'Đã hoàn thành' ? 'selected' : ''}>Đã hoàn thành</option>
        </select>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'researchPublications') {
    html += `
      <div class="form-group">
        <label>Tên bài báo khoa học (*)</label>
        <input type="text" name="main_title" value="${data.ten_bai_bao || ''}" required placeholder="VD: When Self-supervised Transformers Meet...">
      </div>
      <div class="form-group">
        <label>Năm xuất bản (*)</label>
        <input type="number" name="sub_title" value="${data.nam_xuat_ban || ''}" required placeholder="VD: 2026">
      </div>
      <div class="form-group">
        <label>Danh sách tác giả (*)</label>
        <textarea name="description" rows="2" required placeholder="VD: Nguyen, L. N. and Thach, K. S.">${data.tac_gia || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Loại hình công bố (*)</label>
        <select name="loai_hinh_cong_bo" required>
          <option value="JOURNAL ARTICLE" ${data.loai_hinh_cong_bo === 'JOURNAL ARTICLE' ? 'selected' : ''}>Tạp chí (Journal Article)</option>
          <option value="CONFERENCE PAPER" ${data.loai_hinh_cong_bo === 'CONFERENCE PAPER' ? 'selected' : ''}>Hội nghị (Conference Paper)</option>
          <option value="BOOK CHAPTER" ${data.loai_hinh_cong_bo === 'BOOK CHAPTER' ? 'selected' : ''}>Chương sách (Book Chapter)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Tên tạp chí / hội nghị khoa học (*)</label>
        <input type="text" name="ten_tap_chi_hoi_nghi" value="${data.ten_tap_chi_hoi_nghi || ''}" required placeholder="VD: SN Computer Science, Springer">
      </div>
      <div class="form-group">
        <label>BibTeX Key</label>
        <input type="text" name="bibtex_key" value="${data.bibtex_key || ''}" placeholder="VD: nguyen2026self">
      </div>
    `;
  } else if (entityKey === 'researchLabs') {
    let staffOptions = '';
    if (Array.isArray(this.staffList)) {
      staffOptions = this.staffList.map(s => `<option value="${s.id}" ${data.truong_phong_id === s.id ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`).join('');
    }
    html += `
      <div class="form-group">
        <label>Tên phòng thí nghiệm (*)</label>
        <input type="text" name="main_title" value="${data.ten || ''}" required placeholder="VD: Phòng Thí nghiệm Thị giác máy tính và Xử lý ảnh">
      </div>
      <div class="form-group">
        <label>Tên viết tắt (nếu có)</label>
        <input type="text" name="sub_title" value="${data.ten_viet_tat || ''}" placeholder="VD: CVIP">
      </div>
      <div class="form-group">
        <label>Tên Trưởng phòng thí nghiệm (Hiển thị text)</label>
        <input type="text" name="truong_phong_ten" value="${data.truong_phong_ten || ''}" placeholder="VD: TS. Nguyễn Nhứt Lam">
      </div>
      <div class="form-group">
        <label>Nhân sự liên kết Trưởng phòng (Staff Link)</label>
        <select name="truong_phong_id">
          <option value="">-- Chọn nhân sự liên kết --</option>
          ${staffOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Mô tả hoạt động của phòng thí nghiệm</label>
        <textarea name="description" rows="3" placeholder="Nhập mô tả hoạt động chính...">${data.mo_ta || ''}</textarea>
      </div>
      ${renderImageField('Hình ảnh hoạt động / Banner Lab (Tải lên từ máy)', 'image_url', data.hinh_anh_url, 'upload_lab_image_input', 'field_lab_image_url')}
    `;
  } else if (entityKey === 'researchContacts') {
    html += `
      <div class="form-group">
        <label>Tên đại diện (*)</label>
        <input type="text" name="main_title" value="${data.ten_daidien || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
      </div>
      <div class="form-group">
        <label>Chức vụ / Nhiệm vụ (*)</label>
        <input type="text" name="sub_title" value="${data.chuc_vu_nhiem_vu || ''}" required placeholder="VD: Trưởng nhóm Nghiên cứu Trí tuệ Nhân tạo (AILab-TVU)">
      </div>
      <div class="form-group">
        <label>Email liên hệ</label>
        <input type="email" name="email" value="${data.email || ''}" placeholder="VD: lamnn@tvu.edu.vn">
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'undergradPrograms') {
    html += `
      <div class="form-group">
        <label>Tên ngành (*)</label>
        <input type="text" name="main_title" value="${data.ten_nganh || ''}" required placeholder="VD: Công nghệ thông tin">
      </div>
      <div class="form-group">
        <label>Mã tuyển sinh (*)</label>
        <input type="text" name="sub_title" value="${data.ma_tuyen_sinh || ''}" required placeholder="VD: 7480201">
      </div>
      <div class="form-group">
        <label>Văn bằng tốt nghiệp (*)</label>
        <input type="text" name="van_bang_tot_nghiep" value="${data.van_bang_tot_nghiep || 'Kỹ sư'}" required placeholder="VD: Kỹ sư">
      </div>
      <div class="form-group">
        <label>Thời gian học (*)</label>
        <input type="text" name="thoi_gian_hoc" value="${data.thoi_gian_hoc || '4.5 Năm'}" required placeholder="VD: 4.5 Năm">
      </div>
      <div class="form-group">
        <label>Tổng số tín chỉ (*)</label>
        <input type="number" name="tong_so_tin_chi" value="${data.tong_so_tin_chi || 161}" required placeholder="VD: 161">
      </div>
      <div class="form-group">
        <label>Giới thiệu ngành (*)</label>
        <textarea name="gioi_thieu_nganh" rows="4" required placeholder="Mô tả tóm tắt giới thiệu ngành...">${data.gioi_thieu_nganh || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Cơ hội phát triển học tập & nghề nghiệp (*)</label>
        <textarea name="co_hoi_phat_trien" rows="4" required placeholder="Nhập cơ hội nghề nghiệp sau khi ra trường...">${data.co_hoi_phat_trien || ''}</textarea>
      </div>
    `;
  } else if (entityKey === 'undergradMethods' || entityKey === 'undergradCurriculum' || entityKey === 'undergradPlos' || entityKey === 'undergradCourses') {
    const isMethod = entityKey === 'undergradMethods';
    const isCurriculum = entityKey === 'undergradCurriculum';
    const isPlo = entityKey === 'undergradPlos';
    const isCourse = entityKey === 'undergradCourses';
     const programOptions = `
      <option value="1" ${String(data.nganh_id) === '1' ? 'selected' : ''}>Công nghệ thông tin (Kỹ sư)</option>
      <option value="2" ${String(data.nganh_id) === '2' ? 'selected' : ''}>Trí tuệ nhân tạo (Kỹ sư)</option>
    `;
     html += `
      <div class="form-group">
        <label>Liên kết với Ngành đào tạo (*)</label>
        <select name="nganh_id" required>
          ${programOptions}
        </select>
      </div>
    `;
     if (isMethod) {
      html += `
        <div class="form-group">
          <label>Tên phương thức xét tuyển (*)</label>
          <input type="text" name="main_title" value="${data.ten_phuong_thuc || ''}" required placeholder="VD: Xét tuyển học bạ THPT">
        </div>
        <div class="form-group">
          <label>Danh sách các tổ hợp môn (*)</label>
          <input type="text" name="sub_title" value="${data.danh_sach_to_hop || ''}" required placeholder="VD: A00, A01, C01, D07">
        </div>
      `;
    } else if (isCurriculum) {
      html += `
        <div class="form-group">
          <label>Tên khối kiến thức (*)</label>
          <input type="text" name="main_title" value="${data.ten_khoi || ''}" required placeholder="VD: Kiến thức Đại cương">
        </div>
        <div class="form-group">
          <label>Số tín chỉ (*)</label>
          <input type="number" name="sub_title" value="${data.so_tin_chi || 3}" required placeholder="VD: 56">
        </div>
        <div class="form-group">
          <label>Mô tả chi tiết khối kiến thức (*)</label>
          <textarea name="description" rows="3" required placeholder="Các học phần chính hoặc định hướng của khối...">${data.mo_ta_khoi || ''}</textarea>
        </div>
      `;
    } else if (isPlo) {
      html += `
        <div class="form-group">
          <label>Mã PLO (*)</label>
          <input type="text" name="main_title" value="${data.ma_plo || ''}" required placeholder="VD: PLO3">
        </div>
        <div class="form-group">
          <label>Nội dung chuẩn đầu ra PLO (*)</label>
          <textarea name="description" rows="3" required placeholder="Nhập nội dung chuẩn đầu ra...">${data.noi_dung_plo || ''}</textarea>
        </div>
      `;
    } else if (isCourse) {
      html += `
        <div class="form-group">
          <label>Tên học phần (*)</label>
          <input type="text" name="main_title" value="${data.ten_hoc_phan || ''}" required placeholder="VD: Phát triển ứng dụng Web">
        </div>
        <div class="form-group">
          <label>Mã học phần (*)</label>
          <input type="text" name="sub_title" value="${data.ma_hoc_phan || ''}" required placeholder="VD: CT294">
        </div>
        <div class="form-group">
          <label>Số tín chỉ (*)</label>
          <input type="number" name="so_tin_chi" value="${data.so_tin_chi || 3}" required>
        </div>
        <div class="form-group">
          <label>Năng lực hình thành sau học phần (*)</label>
          <textarea name="description" rows="3" required placeholder="VD: Thiết kế, xây dựng và triển khai ứng dụng web...">${data.nang_luc_hinh_thanh || ''}</textarea>
        </div>
      `;
    }
     if (isCurriculum) {
      html += `
        <div class="form-group">
          <label>Thứ tự hiển thị</label>
          <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
        </div>
      `;
    }
  } else if (entityKey === 'undergradFaqs') {
    html += `
      <div class="form-group">
        <label>Câu hỏi (*)</label>
        <input type="text" name="main_title" value="${data.cau_hoi || ''}" required placeholder="Nhập câu hỏi sinh viên...">
      </div>
      <div class="form-group">
        <label>Câu trả lời chi tiết (*)</label>
        <textarea name="description" rows="4" required placeholder="Nhập câu trả lời...">${data.tra_loi || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'undergradCareers') {
    html += `
      <div class="form-group">
        <label>Loại thông tin (*)</label>
        <select name="loai_thong_tin" required>
          <option value="vi_tri_dam_nhan" ${(data.loai_thong_tin || 'vi_tri_dam_nhan') === 'vi_tri_dam_nhan' ? 'selected' : ''}>💼 Vị trí đảm nhận tiêu biểu</option>
          <option value="moi_truong_cong_tac" ${data.loai_thong_tin === 'moi_truong_cong_tac' ? 'selected' : ''}>🏢 Môi trường công tác lí tưởng</option>
        </select>
        <small style="color:var(--admin-text-muted); margin-top:4px; display:block;">Chọn loại để phân nhóm hiển thị đúng mục trên trang người dùng.</small>
      </div>
      <div class="form-group">
        <label>Nội dung mô tả (*)</label>
        <textarea name="description" rows="3" required placeholder="VD: Kỹ sư phần mềm tại các doanh nghiệp công nghệ lớn, Lập trình viên AI/ML...">${data.noi_dung || ''}</textarea>
        <small style="color:var(--admin-text-muted); margin-top:4px; display:block;">Mỗi bản ghi là một mục trong danh sách. Mỗi dòng ngắn gọn (1–2 câu).</small>
      </div>
      <div class="form-group">
        <label>Ngành liên kết</label>
        <select name="nganh_id">
          ${(() => {
            if (this.undergradProgramsList && this.undergradProgramsList.length > 0) {
              return this.undergradProgramsList.map(p =>
                `<option value="${p.id}" ${String(p.id) === String(data.nganh_id || 1) ? 'selected' : ''}>${p.ten_nganh || p.ten_chuong_trinh || 'Ngành ' + p.id}</option>`
              ).join('');
            }
            return `<option value="1" ${(!data.nganh_id || data.nganh_id == 1) ? 'selected' : ''}>Công nghệ thông tin (mặc định)</option>
                    <option value="2" ${data.nganh_id == 2 ? 'selected' : ''}>Trí tuệ nhân tạo</option>`;
          })()}
        </select>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}" min="0">
      </div>
    `;
  } else if (entityKey === 'undergradStudentStats') {
    html += `
      <div class="form-group">
        <label>Ngành đào tạo (*)</label>
        <select name="nganh_id" required>
          ${(() => {
            if (this.undergradProgramsList && this.undergradProgramsList.length > 0) {
              return this.undergradProgramsList.map(p =>
                `<option value="${p.id}" ${String(p.id) === String(data.nganh_id || 1) ? 'selected' : ''}>${p.ten_nganh}</option>`
              ).join('');
            }
            return `<option value="1" ${(!data.nganh_id || data.nganh_id == 1) ? 'selected' : ''}>Công nghệ thông tin</option>
                    <option value="2" ${data.nganh_id == 2 ? 'selected' : ''}>Trí tuệ nhân tạo</option>`;
          })()}
        </select>
      </div>
      <div class="form-group">
        <label>Khóa (*)</label>
        <input type="text" name="khoa" value="${data.khoa || ''}" required placeholder="VD: K36, K37, ..., K52">
        <small style="color:var(--admin-text-muted); margin-top:4px; display:block;">Nhập tên khóa theo định dạng K + số (K36, K49...)</small>
      </div>
      <div class="form-row-2col">
        <div class="form-group">
          <label>Số SV nhập học (*)</label>
          <input type="number" name="so_sinh_vien" value="${data.so_sinh_vien || 0}" min="0" required>
        </div>
        <div class="form-group">
          <label>Tổng đã tốt nghiệp</label>
          <input type="number" name="so_tot_nghiep" value="${data.so_tot_nghiep || 0}" min="0">
          <small style="color:var(--admin-text-muted); margin-top:4px; display:block;">Để 0 nếu khóa chưa ra trường</small>
        </div>
        <div class="form-group">
          <label>TN đúng tiến độ</label>
          <input type="number" name="so_dung_tien_do" value="${data.so_dung_tien_do || 0}" min="0">
        </div>
        <div class="form-group">
          <label>TN sớm</label>
          <input type="number" name="so_tot_nghiep_som" value="${data.so_tot_nghiep_som || 0}" min="0">
        </div>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị (1=K36, 2=K37...)</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}" min="0">
      </div>
    `;
  } else if (entityKey === 'postgradNotices') {
    html += `
      <div class="form-group">
        <label>Tiêu đề thông báo tuyển sinh (*)</label>
        <input type="text" name="main_title" value="${data.tieu_de_thong_bao || ''}" required placeholder="VD: Thông báo tuyển sinh Thạc sĩ năm 2026">
      </div>
      <div class="form-group">
        <label>Link chi tiết thông báo (*)</label>
        <input type="text" name="sub_title" value="${data.link_chi_tiet || '#'}" required placeholder="VD: https://gs.tvu.edu.vn/... hoặc #">
      </div>
      <div class="form-group">
        <label>Thông tin liên hệ tư vấn</label>
        <textarea name="description" rows="2" placeholder="VD: Địa chỉ nộp hồ sơ, Số điện thoại...">${data.lien_he_tu_van || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'postgradPhdStudents') {
    html += `
      <div class="form-group">
        <label>Họ tên Nghiên cứu sinh (NCS) (*)</label>
        <input type="text" name="main_title" value="${data.ho_ten || ''}" required placeholder="VD: Bùi Xuân Tùng">
      </div>
      <div class="form-group">
        <label>Mã số NCS (*)</label>
        <input type="text" name="sub_title" value="${data.ma_ncs || ''}" required placeholder="VD: P2425004">
      </div>
      <div class="form-group">
        <label>Người hướng dẫn khoa học (*)</label>
        <input type="text" name="nguoi_huong_dan" value="${data.nguoi_huong_dan || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam, TS. Trần Việt Châu">
      </div>
      <div class="form-group">
        <label>Email liên hệ</label>
        <input type="email" name="email" value="${data.email || ''}" placeholder="VD: bxtung@tdu.edu.vn">
      </div>
      <div class="form-group">
        <label>Chức vụ & Cơ quan công tác</label>
        <input type="text" name="chuc_vu_co_quan" value="${data.chuc_vu_co_quan || ''}" placeholder="VD: Phó trưởng Bộ môn CNTT, Đại học Tây Đô">
      </div>
      <div class="form-group">
        <label>Số thứ tự hiển thị (VD: 01, 02)</label>
        <input type="text" name="stt" value="${data.stt || '01'}">
      </div>
      <div class="form-group">
        <label>Hướng nghiên cứu luận án (*)</label>
        <textarea name="description" rows="3" required placeholder="Tên đề tài hoặc hướng nghiên cứu của NCS...">${data.huong_nghien_cuu || ''}</textarea>
      </div>
      ${renderImageField('Ảnh đại diện NCS (Tải lên từ máy)', 'image_url', data.avatar_url, 'upload_phd_avatar_input', 'field_phd_avatar_url')}
      <div class="form-group">
        <label>Trạng thái hiển thị NCS (*)</label>
        <select name="an_hien" required>
          <option value="1" ${data.an_hien !== 0 ? 'selected' : ''}>Hiện trên Website</option>
          <option value="0" ${data.an_hien === 0 ? 'selected' : ''}>Ẩn khỏi Website</option>
        </select>
      </div>
      <div class="form-group">
        <label>Hiển thị Mã số NCS (*)</label>
        <select name="an_hien_ma_ncs" required>
          <option value="1" ${data.an_hien_ma_ncs !== 0 ? 'selected' : ''}>Hiện Mã số NCS</option>
          <option value="0" ${data.an_hien_ma_ncs === 0 ? 'selected' : ''}>Ẩn Mã số NCS</option>
        </select>
      </div>
      <div class="form-group">
        <label>Hiển thị Email NCS (*)</label>
        <select name="an_hien_email" required>
          <option value="1" ${data.an_hien_email !== 0 ? 'selected' : ''}>Hiện Email</option>
          <option value="0" ${data.an_hien_email === 0 ? 'selected' : ''}>Ẩn Email</option>
        </select>
      </div>
    `;
  } else if (entityKey === 'postgradStats') {
    html += `
      <div class="form-group">
        <label>Tiêu đề biểu đồ thống kê (*)</label>
        <input type="text" name="main_title" value="${data.tieu_de_bieu_do || ''}" required placeholder="VD: Biểu đồ tuyển sinh qua các năm">
      </div>
      <div class="form-group">
        <label>Mốc thời gian tính (*)</label>
        <input type="text" name="sub_title" value="${data.moc_thoi_gian_tinh || ''}" required placeholder="VD: 2022 - 2026">
      </div>
      <div class="form-group">
        <label>Cấu hình dữ liệu biểu đồ (JSON Config) (*)</label>
        <textarea name="chart_config_json" rows="6" required placeholder='VD: {"batches": ["K22", "K23"], "masterCounts": [9, 8], "phdCounts": [0, 0]}'>${typeof data.chart_config_json === 'object' ? JSON.stringify(data.chart_config_json, null, 2) : (data.chart_config_json || '')}</textarea>
      </div>
    `;
  } else if (entityKey === 'news') {
    html += `
      <div class="form-group">
        <label>Tiêu đề bài viết tin tức (*)</label>
        <input type="text" name="main_title" value="${data.tieu_de || ''}" required placeholder="VD: Tham dự hội thảo khoa học quốc tế CITA 2026">
      </div>
      <div class="form-group">
        <label>Ngày đăng (*)</label>
        <input type="date" name="sub_title" value="${data.ngay_dang ? data.ngay_dang.split('T')[0] : ''}" required>
      </div>
      <div class="form-group">
        <label>Nhãn lớn hiển thị ở góc ảnh (VD: 19-07-2026)</label>
        <input type="text" name="nhan_lon" value="${data.nhan_lon || ''}" placeholder="VD: 19-07-2026">
      </div>
      <div class="form-group">
        <label>Nhãn nhỏ / Địa điểm sự kiện (VD: Vịnh Hạ Long)</label>
        <input type="text" name="nhan_nho" value="${data.nhan_nho || 'Tin tức'}" placeholder="VD: Vịnh Hạ Long, Quảng Ninh">
      </div>
      <div class="form-group">
        <label>Liên kết chuyển hướng tùy chọn (Để trống nếu dùng trang chi tiết mặc định)</label>
        <input type="text" name="redirect_url" value="${data.redirect_url || ''}" placeholder="VD: https://tvu.edu.vn hoặc ../undergraduate/">
      </div>
      ${renderImageField('Hình ảnh chính bài viết (Tải lên từ máy) (*)', 'image_url', data.anh_chinh, 'upload_news_img_input', 'field_news_image_url')}
      <div class="form-group">
        <label>Tóm tắt ngắn bài viết</label>
        <textarea name="tom_tat" rows="2" placeholder="Nhập tóm tắt hiển thị ở card tin tức...">${data.tom_tat || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Nội dung chi tiết bài viết (HTML) (*)</label>
        <textarea name="description" rows="6" required placeholder="Nhập nội dung chi tiết bài viết (chấp nhận thẻ HTML)...">${data.noi_dung_html || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'gallery') {
    html += `
      <div class="form-group">
        <label>Tiêu đề ảnh (*)</label>
        <input type="text" name="main_title" value="${data.tieu_de || ''}" required placeholder="VD: Hoạt động ngoại khóa học tập">
      </div>
      <div class="form-group">
        <label>Danh mục phân loại (*)</label>
        <select name="danh_muc" required>
          <option value="Sự kiện" ${data.danh_muc === 'Sự kiện' ? 'selected' : ''}>Sự kiện</option>
          <option value="Hoạt động" ${data.danh_muc === 'Hoạt động' ? 'selected' : ''}>Hoạt động</option>
        </select>
      </div>
      ${renderImageField('Hình ảnh Album (Tải lên từ máy) (*)', 'image_url', data.anh_url, 'upload_gallery_img_input', 'field_gallery_image_url')}
      <div class="form-group">
        <label>Mô tả chi tiết ảnh</label>
        <textarea name="description" rows="2" placeholder="Nhập mô tả...">${data.mo_ta || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Thứ tự hiển thị</label>
        <input type="number" name="thu_tu" value="${data.thu_tu || 0}">
      </div>
    `;
  } else if (entityKey === 'adminAccounts') {
    html += `
      <div class="form-group">
        <label>Họ và tên Quản trị viên (*)</label>
        <input type="text" name="main_title" value="${data.ho_ten || ''}" required placeholder="VD: TS. Nguyễn Nhứt Lam">
      </div>
      <div class="form-group">
        <label>Email Google (*)</label>
        <input type="email" name="sub_title" value="${data.email || ''}" required placeholder="VD: lamnn@tvu.edu.vn">
      </div>
      <div class="form-group">
        <label>Google Subject ID (sub - từ Token OAuth) (*)</label>
        <input type="text" name="google_id" value="${data.google_id || ''}" required placeholder="Nhập ID Subject của tài khoản Google">
      </div>
      ${renderImageField('Ảnh đại diện Google (Avatar)', 'image_url', data.avatar_url, 'upload_admin_avatar_input', 'field_admin_avatar_url')}
      <div class="form-group">
        <label>Quyền hạn (*)</label>
        <select name="quyen_han" required>
          <option value="SUPER_ADMIN" ${data.quyen_han === 'SUPER_ADMIN' ? 'selected' : ''}>Quản trị viên cấp cao (SUPER_ADMIN)</option>
          <option value="STAFF_EDITOR" ${data.quyen_han === 'STAFF_EDITOR' ? 'selected' : ''}>Biên tập viên (STAFF_EDITOR)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Trạng thái tài khoản (*)</label>
        <select name="trang_thai" required>
          <option value="1" ${data.trang_thai !== 0 ? 'selected' : ''}>Đang hoạt động</option>
          <option value="0" ${data.trang_thai === 0 ? 'selected' : ''}>Bị khóa</option>
        </select>
      </div>
    `;
  } else if (entityKey === 'lecturerAccounts') {
    let staffOptions = '';
    if (this.staffList && this.staffList.length > 0) {
      staffOptions = this.staffList.map(s => 
        `<option value="${s.id}" ${String(s.id) === String(data.nhan_vien_id) ? 'selected' : ''}>${s.ho_ten} (${s.chuc_vu})</option>`
      ).join('');
    } else {
      staffOptions = `<option value="${data.nhan_vien_id || ''}">${data.nhan_vien_id ? 'Mã giảng viên #' + data.nhan_vien_id : 'Chọn giảng viên...'}</option>`;
    }
     html += `
      <div class="form-group">
        <label>Liên kết Giảng viên (*)</label>
        <select name="nhan_vien_id" required>
          ${staffOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Email đăng nhập (*)</label>
        <input type="email" name="email" value="${data.email || ''}" required placeholder="VD: lamnn@tvu.edu.vn">
      </div>
      <div class="form-group">
        <label>Mật khẩu ${data.id ? '(Để trống nếu giữ nguyên)' : '(*)'}</label>
        <input type="password" name="mat_khau" placeholder="${data.id ? 'Nhập mật khẩu mới nếu muốn đổi' : 'Nhập mật khẩu mặc định (VD: email)'}" ${data.id ? '' : 'required'}>
      </div>
      <div class="form-group">
        <label>Quyền hạn (*)</label>
        <select name="quyen_han" required>
          <option value="STAFF_EDITOR" ${data.quyen_han === 'STAFF_EDITOR' ? 'selected' : ''}>Biên tập viên Giảng viên (STAFF_EDITOR)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Trạng thái tài khoản (*)</label>
        <select name="trang_thai" required>
          <option value="1" ${data.trang_thai !== 0 ? 'selected' : ''}>Đang hoạt động (Active)</option>
          <option value="0" ${data.trang_thai === 0 ? 'selected' : ''}>Bị khóa (Blocked)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Yêu cầu đổi mật khẩu sau khi đăng nhập (*)</label>
        <select name="phai_doi_mat_khau" required>
          <option value="1" ${data.phai_doi_mat_khau !== 0 ? 'selected' : ''}>Bắt buộc đổi (First Login)</option>
          <option value="0" ${data.phai_doi_mat_khau === 0 ? 'selected' : ''}>Không yêu cầu</option>
        </select>
      </div>
    `;
  } else {
     const titleVal = data.ho_ten || data.ten_bai_bao || data.tieu_de || data.ten_de_tai || data.ten_nganh || data.ten_slide || data.ten || data.name || '';
    html += `
      <div class="form-group">
        <label>Tên / Tiêu đề chính (*)</label>
        <input type="text" name="main_title" value="${titleVal}" required placeholder="Nhập tiêu đề hoặc họ tên...">
      </div>
      <div class="form-group">
        <label>Thông tin phụ / Chức vụ / Ngày</label>
        <input type="text" name="sub_title" value="${data.chuc_vu || data.nam_hoan_thanh || data.ngay_dang || data.ma_tuyen_sinh || data.email || ''}" placeholder="Nhập thông tin phụ...">
      </div>
      ${renderImageField('Hình ảnh / Logo (Tải lên từ máy)', 'image_url', data.anh_ca_nhan_url || data.hinh_anh_url || data.file_anh_url || data.logo_url || data.src_chinh, 'upload_generic_image_input', 'field_image_url')}
      <div class="form-group">
        <label>Nội dung Chi tiết / Mô tả</label>
        <textarea name="description" rows="4" placeholder="Nhập chi tiết nội dung...">${data.mo_ta || data.noi_dung || data.linh_vuc_nghien_cuu || ''}</textarea>
      </div>
    `;
  }
   return html;
}