/**
 * ==========================================================================
 * FACULTY PARTNERS DATA SERVICE
 * ==========================================================================
 * Bridges the frontend UI partners grid with the backend database API.
 * Retrieves data from the /api/partners endpoint, matching the 'doi_tac_hop_tac_quoc_te' MySQL table.
 */

// API Endpoint (Change this when backend is ready)
const API_PARTNERS_URL = 'http://localhost:5000/api/v1/public/partners';

export const PartnerService = {
  /**
   * Fetch all international partner items from the database.
   * Resolves to a JSON array of partner logos or null if the API is offline.
   */
  async getPartners() {
    try {
      const response = await fetch(API_PARTNERS_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const data = result.data;
        // Filter for partners visible on "gioi_thieu" page and sort by 'thu_tu'
        return data
          .filter(item => item.hien_thi_o && item.hien_thi_o.includes('gioi_thieu'))
          .sort((a, b) => a.thu_tu - b.thu_tu);
      }
      throw new Error(result.error || 'Dữ liệu không hợp lệ');
    } catch (error) {
      console.warn('API /api/partners chưa sẵn sàng. Trình duyệt đang sử dụng mockup dữ liệu đối tác.', error.message);
      return null;
    }
  }
};

/*
=============================================================================
EXPECTED BACKEND API JSON RESPONSE CONTRACT (For 'doi_tac_hop_tac_quoc_te')
=============================================================================
Configure your backend `/api/partners` endpoint to return a JSON array matching 
the exact schema below.

[
  {
    "id": 1,
    "ten_doi_tac": "CNRS",
    "logo_url": "assets/images/partners/cnrs.png",
    "hien_thi_o": "gioi_thieu",
    "thu_tu": 1
  },
  {
    "id": 2,
    "ten_doi_tac": "FPT",
    "logo_url": "assets/images/partners/fpt.png",
    "hien_thi_o": "gioi_thieu",
    "thu_tu": 2
  },
  {
    "id": 3,
    "ten_doi_tac": "PTN Global",
    "logo_url": "assets/images/PTN_Logo-01-Khanh-Kieu.png",
    "hien_thi_o": "gioi_thieu",
    "thu_tu": 3
  },
  {
    "id": 4,
    "ten_doi_tac": "ULB",
    "logo_url": "assets/images/partners/ulb.png",
    "hien_thi_o": "gioi_thieu",
    "thu_tu": 4
  },
  {
    "id": 5,
    "ten_doi_tac": "VNPT",
    "logo_url": "assets/images/partners/vnpt.png",
    "hien_thi_o": "gioi_thieu",
    "thu_tu": 5
  },
  {
    "id": 6,
    "ten_doi_tac": "Inria",
    "logo_url": "assets/images/partners/inria.png",
    "hien_thi_o": "gioi_thieu",
    "thu_tu": 6
  }
]
*/
