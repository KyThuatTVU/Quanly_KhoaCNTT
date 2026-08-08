/**
 * ==========================================================================
 * FACULTY RESEARCH PAGE WEB COMPONENT
 * ==========================================================================
 * Renders the Scientific Research page sections (Directions, Active Topics,
 * Publications grouped by Year, Partner Logos, and Contact cards).
 * Uses dynamic fetch from ResearchService with clean fallback mockups.
 */

import { ResearchService } from '../services/researchService.js';

class ResearchPageComponent extends HTMLElement {
  constructor() {
    super();
    this.directions = [];
    this.topics = [];
    this.publications = [];
    this.contacts = [];
  }

  connectedCallback() {
    try {
      console.log('Khởi chạy <research-page-component>...');
      this.init();
    } catch (e) {
      console.error('Lỗi khởi chạy Research Page Component:', e);
    }
  }

  async init() {
    // Load all data from service
    const [directions, topics, publications, contacts] = await Promise.all([
      ResearchService.getResearchDirections(),
      ResearchService.getResearchTopics(),
      ResearchService.getScientificPublications(),
      ResearchService.getResearchContacts()
    ]);

    this.directions = directions;
    this.topics = topics;
    this.publications = publications;
    this.contacts = contacts;

    this.render();
  }

  /**
   * Return high-fidelity inline SVGs for international research groups
   */
  getResearchPartnerLogos() {
    return {
      irisa: `
        <svg viewBox="0 0 160 60" class="res-partner-svg">
          <path d="M20 45 L35 15 L50 45 L42 45 L35 28 L28 45 Z" fill="#023e8a"/>
          <circle cx="35" cy="18" r="4" fill="#00b4d8"/>
          <text x="65" y="38" font-family="'Montserrat', sans-serif" font-size="20" font-weight="900" fill="#0f2d59" letter-spacing="1px">IRISA</text>
          <text x="65" y="47" font-family="sans-serif" font-size="7" font-weight="700" fill="#64748b">UMR 6074</text>
        </svg>
      `,
      polytech: `
        <svg viewBox="0 0 160 60" class="res-partner-svg">
          <rect x="15" y="15" width="30" height="30" rx="4" fill="#0077b6"/>
          <path d="M22 25 L38 25 L30 38 Z" fill="#ffffff"/>
          <text x="54" y="34" font-family="'Montserrat', sans-serif" font-size="14" font-weight="900" fill="#0077b6" letter-spacing="0.5px">POLYTECH</text>
          <text x="54" y="44" font-family="'Montserrat', sans-serif" font-size="11" font-weight="800" fill="#64748b" letter-spacing="1px">NANTES</text>
        </svg>
      `,
      cril: `
        <svg viewBox="0 0 160 60" class="res-partner-svg">
          <circle cx="30" cy="30" r="16" fill="none" stroke="#7209b7" stroke-width="4.5"/>
          <line x1="30" y1="14" x2="30" y2="46" stroke="#f72585" stroke-width="3"/>
          <text x="58" y="39" font-family="'Montserrat', sans-serif" font-size="24" font-weight="900" fill="#7209b7" letter-spacing="1px">CRIL</text>
        </svg>
      `,
      cnrs: `
        <svg viewBox="0 0 160 60" class="res-partner-svg">
          <circle cx="30" cy="30" r="18" fill="#002d62"/>
          <text x="30" y="34.5" font-family="'Be Vietnam Pro', sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5px">cnrs</text>
          <text x="58" y="38" font-family="'Montserrat', sans-serif" font-size="18" font-weight="900" fill="#002d62" letter-spacing="1px">CNRS</text>
        </svg>
      `
    };
  }

  render() {
    // 1. Group publications by year
    const publicationsByYear = {};
    this.publications.forEach(pub => {
      const year = pub.nam_xuat_ban;
      if (!publicationsByYear[year]) {
        publicationsByYear[year] = [];
      }
      publicationsByYear[year].push(pub);
    });
    // Sort years descending
    const sortedYears = Object.keys(publicationsByYear).sort((a, b) => b - a);

    const partnerSVGs = this.getResearchPartnerLogos();

    this.innerHTML = `
      <!-- Research Main Banner (Full Width Background, centered container) -->
      <div class="res-banner">
        <div class="res-banner-container">
          <h1 class="res-banner-title">Nghiên Cứu Khoa Học</h1>
          <p class="res-banner-desc">
            Hoạt động nghiên cứu khoa học của Khoa Công nghệ thông tin - Trường Đại học Trà Vinh tập trung vào giải quyết các bài toán thực tiễn của địa phương và hội nhập các công bố khoa học quốc tế đỉnh cao.
          </p>
        </div>
      </div>

      <!-- Core Content (Centered at 1200px max width) -->
      <div class="res-content-wrapper">
        
        <!-- Section 1: Hướng nghiên cứu chính -->
        <section class="res-section">
          <h2 class="res-section-heading">Hướng Nghiên Cứu</h2>
          <div class="res-directions-grid">
            ${this.directions.map(dir => `
              <div class="res-direction-card-3d">
                <div class="res-dir-icon">🔬</div>
                <h3 class="res-dir-title">${dir.ten}</h3>
                <p class="res-dir-desc">${dir.mo_ta}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Section 2: Đề tài và dự án nghiên cứu đang thực hiện -->
        <section class="res-section">
          <h2 class="res-section-heading">Đề Tài Và Dự Án Nghiên Cứu</h2>
          <div class="res-topics-grid">
            ${this.topics.map(topic => `
              <div class="res-topic-card-3d">
                <div class="res-topic-tag">${topic.cap}</div>
                <h3 class="res-topic-title">${topic.ten_de_tai}</h3>
                <div class="res-topic-meta">
                  <p><strong>Chủ nhiệm:</strong> <span class="res-topic-owner">${topic.chu_nhiem_ten}</span></p>
                  <div class="res-topic-status-badge">
                    <span class="status-dot"></span>
                    <span>${topic.trang_thai}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Section 3: Công bố khoa học (Grouped by Year with horizontal lines) -->
        <section class="res-section">
          <h2 class="res-section-heading">Công Bố Khoa Học</h2>
          <div class="res-publications-timeline">
            ${sortedYears.map(year => `
              <div class="res-pub-year-group">
                <h3 class="res-pub-year-title">${year}</h3>
                <div class="res-pub-year-line"></div>
                <div class="res-pub-list">
                  ${publicationsByYear[year].map(pub => `
                    <div class="res-pub-card-3d">
                      <div class="res-pub-main">
                        <h4 class="res-pub-title">${pub.ten_bai_bao}</h4>
                        <p class="res-pub-authors-journal">
                          <span class="res-pub-authors">${pub.tac_gia}</span> 
                          <span class="res-pub-journal">${pub.ten_tap_chi_hoi_nghi}</span>
                        </p>
                        <button class="res-pub-abstract-btn" onclick="alert('Đang hiển thị nội dung tóm tắt của bài báo: \\n\\n${pub.ten_bai_bao}')">
                          <span>Abstract</span>
                        </button>
                      </div>
                      <div class="res-pub-badge-container">
                        <span class="res-pub-badge ${pub.loai_hinh_cong_bo === 'JOURNAL ARTICLE' ? 'badge-journal' : 'badge-conference'}">
                          ${pub.loai_hinh_cong_bo}
                        </span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Section 4: Hợp tác nghiên cứu -->
        <section class="res-section">
          <h2 class="res-section-heading">Hợp Tác Nghiên Cứu</h2>
          <p class="res-coop-desc">
            Khoa Công nghệ thông tin Đại học Trà Vinh hợp tác nghiên cứu, đào tạo học thuật và chuyển giao giải pháp kỹ thuật với nhiều viện nghiên cứu uy tín trong và ngoài nước.
          </p>
          <div class="res-coop-grid">
            <div class="res-coop-card-3d">${partnerSVGs.irisa}</div>
            <div class="res-coop-card-3d">${partnerSVGs.polytech}</div>
            <div class="res-coop-card-3d">${partnerSVGs.cril}</div>
            <div class="res-coop-card-3d">${partnerSVGs.cnrs}</div>
          </div>
        </section>

        <!-- Section 5: Đầu mối liên hệ nghiên cứu -->
        <section class="res-section" style="margin-bottom: 0;">
          <h2 class="res-section-heading">Liên Hệ Nghiên Cứu</h2>
          <div class="res-contact-grid">
            ${this.contacts.map(contact => `
              <div class="res-contact-card-3d">
                <h3 class="res-contact-name">${contact.ten_daidien}</h3>
                <p class="res-contact-role">${contact.chuc_vu_nhiem_vu}</p>
                <div class="res-contact-email-row">
                  <span class="email-icon">📧</span>
                  <a href="mailto:${contact.email}" class="res-contact-email-link">${contact.email}</a>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

      </div>
    `;
  }
}

// Register custom element
if (!customElements.get('research-page-component')) {
  customElements.define('research-page-component', ResearchPageComponent);
}
