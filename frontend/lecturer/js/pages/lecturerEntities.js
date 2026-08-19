/**
 * Lecturer Entities Configuration & Form Builders
 */

export const LECTURER_ENTITY_CONFIG = {
  staffResearch: {
    label: 'Đề tài NCKH Cá nhân',
    icon: '🔬',
    fields: [
      { name: 'ten_de_tai', label: 'Tên đề tài NCKH (*)', type: 'text', required: true },
      { name: 'nam_hoan_thanh', label: 'Năm hoàn thành (*)', type: 'number', required: true, default: () => new Date().getFullYear() },
      { name: 'cap_de_tai', label: 'Cấp đề tài', type: 'text', default: 'Đề tài Nghiên cứu cấp Cơ sở' },
      { name: 'trach_nhiem_tham_gia', label: 'Trách nhiệm tham gia', type: 'text', default: 'Chủ nhiệm đề tài' }
    ],
    getDisplayTitle: (item) => item.ten_de_tai,
    getDisplaySub: (item) => `Cấp: ${item.cap_de_tai || 'Cơ sở'} | Vai trò: ${item.trach_nhiem_tham_gia || 'Chủ nhiệm'} | Năm: ${item.nam_hoan_thanh}`
  },
  staffPapers: {
    label: 'Bài báo Khoa học Cá nhân',
    icon: '📝',
    fields: [
      { name: 'ten_bai_bao', label: 'Tên bài báo khoa học (*)', type: 'text', required: true },
      { name: 'nam_xuat_ban', label: 'Năm xuất bản (*)', type: 'number', required: true, default: () => new Date().getFullYear() },
      { name: 'danh_sach_tac_gia', label: 'Danh sách tác giả (*)', type: 'textarea', required: true, placeholder: 'VD: Nguyễn Nhứt Lam, Lê Phong Dụ, Trần Văn A' },
      { name: 'ten_tap_chi_hoi_nghi', label: 'Tên tạp chí / hội nghị khoa học', type: 'text', default: 'Hội nghị Khoa học' }
    ],
    getDisplayTitle: (item) => item.ten_bai_bao,
    getDisplaySub: (item) => `Tác giả: ${item.danh_sach_tac_gia} | Tạp chí/Hội nghị: ${item.ten_tap_chi_hoi_nghi} | Năm: ${item.nam_xuat_ban}`
  },
  staffProjects: {
    label: 'Dự án & Chuyển giao',
    icon: '⚙️',
    fields: [
      { name: 'ten_du_an', label: 'Tên dự án / chuyển giao (*)', type: 'text', required: true },
      { name: 'nam_thuc_hien', label: 'Năm thực hiện', type: 'text', placeholder: 'VD: 2023-2024' },
      { name: 'vai_tro', label: 'Vai trò', type: 'text', default: 'Chủ nhiệm' },
      { name: 'mo_ta', label: 'Mô tả dự án', type: 'textarea' }
    ],
    getDisplayTitle: (item) => item.ten_du_an,
    getDisplaySub: (item) => `Vai trò: ${item.vai_tro} | Năm: ${item.nam_thuc_hien}`
  },
  staffBooks: {
    label: 'Sách & Giáo trình',
    icon: '📚',
    fields: [
      { name: 'ten_sach_giao_trinh', label: 'Tên sách / giáo trình (*)', type: 'text', required: true },
      { name: 'nam_xuat_ban', label: 'Năm xuất bản (*)', type: 'number', required: true, default: () => new Date().getFullYear() },
      { name: 'nha_xuat_ban', label: 'Nhà xuất bản', type: 'text', default: 'NXB Đại học Trà Vinh' },
      { name: 'vai_tro', label: 'Vai trò', type: 'text', default: 'Tác giả' }
    ],
    getDisplayTitle: (item) => item.ten_sach_giao_trinh,
    getDisplaySub: (item) => `NXB: ${item.nha_xuat_ban} | Vai trò: ${item.vai_tro} | Năm: ${item.nam_xuat_ban}`
  },
  staffSupervisions: {
    label: 'Hướng dẫn NCKH',
    icon: '🎓',
    fields: [
      { name: 'ten_hoc_vien', label: 'Tên học viên / sinh viên hướng dẫn (*)', type: 'text', required: true },
      { name: 'ten_de_tai_huong_dan', label: 'Tên đề tài hướng dẫn (*)', type: 'text', required: true },
      { name: 'loai_hoc_vien', label: 'Loại học viên', type: 'select', options: [
          { value: 'sinh_vien_nckh', label: 'Sinh viên NCKH' },
          { value: 'hoc_vien_cao_hoc', label: 'Học viên Cao học' },
          { value: 'ncs', label: 'Nghiên cứu sinh (NCS)' }
        ]
      },
      { name: 'nam_bao_ve', label: 'Năm bảo vệ', type: 'number', placeholder: 'Nhập năm bảo vệ (nếu có)' }
    ],
    getDisplayTitle: (item) => `Hướng dẫn: ${item.ten_hoc_vien}`,
    getDisplaySub: (item) => `Đề tài: "${item.ten_de_tai_huong_dan}" | Năm bảo vệ: ${item.nam_bao_ve || 'Chưa bảo vệ'}`
  }
};

export function generateFormHtml(entityKey, data = {}) {
  const config = LECTURER_ENTITY_CONFIG[entityKey];
  if (!config) return '';

  return config.fields.map(f => {
    const val = data[f.name] !== undefined ? data[f.name] : (f.default ? (typeof f.default === 'function' ? f.default() : f.default) : '');
    
    if (f.type === 'textarea') {
      return `
        <div class="form-group">
          <label class="form-label">${f.label}</label>
          <textarea name="${f.name}" class="form-input" rows="3" ${f.required ? 'required' : ''} placeholder="${f.placeholder || ''}">${val}</textarea>
        </div>
      `;
    }
    
    if (f.type === 'select') {
      const opts = f.options.map(o => `<option value="${o.value}" ${String(o.value) === String(val) ? 'selected' : ''}>${o.label}</option>`).join('');
      return `
        <div class="form-group">
          <label class="form-label">${f.label}</label>
          <select name="${f.name}" class="form-input" ${f.required ? 'required' : ''}>
            ${opts}
          </select>
        </div>
      `;
    }
    
    return `
      <div class="form-group">
        <label class="form-label">${f.label}</label>
        <input type="${f.type}" name="${f.name}" class="form-input" value="${val}" ${f.required ? 'required' : ''} placeholder="${f.placeholder || ''}" />
      </div>
    `;
  }).join('');
}
