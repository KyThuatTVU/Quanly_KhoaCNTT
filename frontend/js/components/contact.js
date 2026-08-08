/**
 * ==========================================================================
 * FACULTY LEADERSHIP CONTACT WEB COMPONENT
 * ==========================================================================
 * Renders the Ban Lãnh Đạo Khoa contact section (5 leadership cards).
 * Statically coded for speed and reliability, preserving TVU identity.
 */

class CooperationContactComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  /**
   * Helper to render the circular avatar SVG
   */
  getAvatarSvg() {
    return `
      <svg viewBox="0 0 100 100" class="dean-avatar-svg">
        <circle cx="50" cy="50" r="45" fill="#f0f7ff" stroke="#00b4d8" stroke-width="2.5"/>
        <!-- Graduation cap silhouette -->
        <path d="M50 16 L80 28 L50 40 L20 28 Z" fill="#005691"/>
        <path d="M35 33 L35 50 C35 57, 65 57, 65 50 L65 33" fill="#005691"/>
        <rect x="73" y="27" width="2.5" height="16" rx="1" fill="#f37021"/>
        <circle cx="74.25" cy="43" r="3" fill="#f37021"/>
        <!-- Academic robe & tie silhouette -->
        <path d="M22 80 C22 66, 30 61, 50 61 C70 61, 78 66, 78 80 Z" fill="#0077b6"/>
        <path d="M50 61 L44 73 L50 85 L56 73 Z" fill="#ffffff"/>
        <path d="M48 73 L50 79 L52 73 Z" fill="#005691"/>
        <rect x="49" y="79" width="2" height="11" fill="#005691"/>
      </svg>
    `;
  }

  render() {
    const avatar = this.getAvatarSvg();

    this.innerHTML = `
      <!-- Deans/Leadership Contact Cards Section (Full Width background, content centered) -->
      <div class="deans-section">
        <div class="deans-container">
          <!-- Heading -->
          <h2 class="deans-heading">Ban Lãnh Đạo Khoa</h2>
          
          <!-- Leadership Cards Grid -->
          <div class="deans-grid">
            
            <!-- Card 1: TS. Nguyễn Nhứt Lam -->
            <div class="dean-card-3d-wrap">
              <div class="dean-card-3d dean-boss">
                <div class="dean-info">
                  <!-- Centered Avatar -->
                  <div class="dean-avatar-container">
                    <div class="dean-avatar-ring">${avatar}</div>
                  </div>

                  <!-- Centered Fields -->
                  <div class="dean-field">
                    <span class="field-label">Họ tên:</span>
                    <span class="field-val dean-name-highlight">TS. Nguyễn Nhứt Lam</span>
                  </div>
                  
                  <div class="dean-field">
                    <span class="field-label">Chức vụ:</span>
                    <span class="field-val">Trưởng khoa</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Số nội bộ:</span>
                    <span class="field-val">123</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Điện thoại:</span>
                    <span class="field-val">0919556441</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Email:</span>
                    <span class="field-val">
                      <a href="mailto:lamnn@tvu.edu.vn" class="dean-email-link-center">lamnn@tvu.edu.vn</a>
                    </span>
                  </div>
                </div>
                
                <div class="dean-card-footer-center">
                  <a href="#" class="dean-detail-btn-3d" onclick="event.preventDefault(); alert('Chức năng hiển thị lý lịch khoa học chi tiết của TS. Nguyễn Nhứt Lam đang được xây dựng.');">
                    <span>Xem chi tiết</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Card 2: TS. Thạch Kọng Saoane -->
            <div class="dean-card-3d-wrap">
              <div class="dean-card-3d dean-sub">
                <div class="dean-info">
                  <!-- Centered Avatar -->
                  <div class="dean-avatar-container">
                    <div class="dean-avatar-ring">${avatar}</div>
                  </div>

                  <!-- Centered Fields -->
                  <div class="dean-field">
                    <span class="field-label">Họ tên:</span>
                    <span class="field-val dean-name-highlight">TS. Thạch Kọng Saoane</span>
                  </div>
                  
                  <div class="dean-field">
                    <span class="field-label">Chức vụ:</span>
                    <span class="field-val">Phó Trưởng khoa</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Số nội bộ:</span>
                    <span class="field-val">123</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Điện thoại:</span>
                    <span class="field-val">0869847017</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Email:</span>
                    <span class="field-val">
                      <a href="mailto:oane@tvu.edu.vn" class="dean-email-link-center">oane@tvu.edu.vn</a>
                    </span>
                  </div>
                </div>
                
                <div class="dean-card-footer-center">
                  <a href="#" class="dean-detail-btn-3d" onclick="event.preventDefault(); alert('Chức năng hiển thị lý lịch khoa học chi tiết của TS. Thạch Kọng Saoane đang được xây dựng.');">
                    <span>Xem chi tiết</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Card 3: TS. Nguyễn Trần Diễm Hạnh -->
            <div class="dean-card-3d-wrap">
              <div class="dean-card-3d dean-sub">
                <div class="dean-info">
                  <!-- Centered Avatar -->
                  <div class="dean-avatar-container">
                    <div class="dean-avatar-ring">${avatar}</div>
                  </div>

                  <!-- Centered Fields -->
                  <div class="dean-field">
                    <span class="field-label">Họ tên:</span>
                    <span class="field-val dean-name-highlight">TS. Nguyễn Trần Diễm Hạnh</span>
                  </div>
                  
                  <div class="dean-field">
                    <span class="field-label">Chức vụ:</span>
                    <span class="field-val">Phó Trưởng khoa</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Số nội bộ:</span>
                    <span class="field-val">123</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Điện thoại:</span>
                    <span class="field-val">0842250996</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Email:</span>
                    <span class="field-val">
                      <a href="mailto:diemhanh_tvu@tvu.edu.vn" class="dean-email-link-center">diemhanh_tvu@tvu.edu.vn</a>
                    </span>
                  </div>
                </div>
                
                <div class="dean-card-footer-center">
                  <a href="#" class="dean-detail-btn-3d" onclick="event.preventDefault(); alert('Chức năng hiển thị lý lịch khoa học chi tiết của TS. Nguyễn Trần Diễm Hạnh đang được xây dựng.');">
                    <span>Xem chi tiết</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Card 4: Ths. Nguyễn Bá Nhiệm -->
            <div class="dean-card-3d-wrap">
              <div class="dean-card-3d dean-sub">
                <div class="dean-info">
                  <!-- Centered Avatar -->
                  <div class="dean-avatar-container">
                    <div class="dean-avatar-ring">${avatar}</div>
                  </div>

                  <!-- Centered Fields -->
                  <div class="dean-field">
                    <span class="field-label">Họ tên:</span>
                    <span class="field-val dean-name-highlight">Ths. Nguyễn Bá Nhiệm</span>
                  </div>
                  
                  <div class="dean-field">
                    <span class="field-label">Chức vụ:</span>
                    <span class="field-val">Phó Trưởng khoa</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Số nội bộ:</span>
                    <span class="field-val">168</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Điện thoại:</span>
                    <span class="field-val">0983303609</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Email:</span>
                    <span class="field-val">
                      <a href="mailto:nhiemnb@tvu.edu.vn" class="dean-email-link-center">nhiemnb@tvu.edu.vn</a>
                    </span>
                  </div>
                </div>
                
                <div class="dean-card-footer-center">
                  <a href="#" class="dean-detail-btn-3d" onclick="event.preventDefault(); alert('Chức năng hiển thị lý lịch khoa học chi tiết của Ths. Nguyễn Bá Nhiệm đang được xây dựng.');">
                    <span>Xem chi tiết</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Card 5: Ths. Lê Phong Dũ -->
            <div class="dean-card-3d-wrap">
              <div class="dean-card-3d dean-sub">
                <div class="dean-info">
                  <!-- Centered Avatar -->
                  <div class="dean-avatar-container">
                    <div class="dean-avatar-ring">${avatar}</div>
                  </div>

                  <!-- Centered Fields -->
                  <div class="dean-field">
                    <span class="field-label">Họ tên:</span>
                    <span class="field-val dean-name-highlight">Ths. Lê Phong Dũ</span>
                  </div>
                  
                  <div class="dean-field">
                    <span class="field-label">Chức vụ:</span>
                    <span class="field-val">Phó Trưởng khoa</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Số nội bộ:</span>
                    <span class="field-val">3853068</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Điện thoại:</span>
                    <span class="field-val">0914256578</span>
                  </div>

                  <div class="dean-field">
                    <span class="field-label">Email:</span>
                    <span class="field-val">
                      <a href="mailto:lpdu@tvu.edu.vn" class="dean-email-link-center">lpdu@tvu.edu.vn</a>
                    </span>
                  </div>
                </div>
                
                <div class="dean-card-footer-center">
                  <a href="#" class="dean-detail-btn-3d" onclick="event.preventDefault(); alert('Chức năng hiển thị lý lịch khoa học chi tiết của Ths. Lê Phong Dũ đang được xây dựng.');">
                    <span>Xem chi tiết</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }
}

// Define custom element
if (!customElements.get('cooperation-contact-component')) {
  customElements.define('cooperation-contact-component', CooperationContactComponent);
}
