-- ==========================================================
-- FIT TVU DATABASE DUMP FOR VPS (fit_tvu_db)
-- Generated: 2026-08-28T19:26:44.617Z
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: quanly_khoacntt_tvu
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cau_truc_khoi_kien_thuc`
--

DROP TABLE IF EXISTS `cau_truc_khoi_kien_thuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cau_truc_khoi_kien_thuc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nganh_id` int(11) NOT NULL COMMENT 'FK ngành đại học',
  `ten_khoi` varchar(200) NOT NULL COMMENT 'Kiến thức Đại cương, Cơ sở ngành, Chuyên ngành',
  `so_tin_chi` int(11) NOT NULL COMMENT 'Số tín chỉ của khối (56, 46, 59)',
  `mo_ta_khoi` text NOT NULL COMMENT 'Nội dung các môn học thuộc khối',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_khoikienthuc_nganh` (`nganh_id`),
  CONSTRAINT `fk_khoikienthuc_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lộ trình 3 khối kiến thức đào tạo đại học';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cau_truc_khoi_kien_thuc`
--

LOCK TABLES `cau_truc_khoi_kien_thuc` WRITE;
/*!40000 ALTER TABLE `cau_truc_khoi_kien_thuc` DISABLE KEYS */;
INSERT INTO `cau_truc_khoi_kien_thuc` (`id`, `nganh_id`, `ten_khoi`, `so_tin_chi`, `mo_ta_khoi`, `thu_tu`) VALUES (1,1,'Kiến thức Giáo dục đại cương',46,'Bao gồm các học phần lý luận chính trị, toán học giải tích, đại số tuyến tính, vật lý đại cương, ngoại ngữ và giáo dục thể chất làm nền tảng phát triển tư duy.',1),(2,1,'Kiến thức Cơ sở ngành',56,'Bao gồm các học phần cốt lõi như Lập trình hướng đối tượng, Cấu trúc dữ liệu & Giải thuật, Hệ điều hành, Cơ sở dữ liệu, Kiến trúc máy tính và Mạng máy tính.',2),(3,1,'Kiến thức Chuyên ngành',59,'Bao gồm các học phần nâng cao: Phát triển ứng dụng Web, Công nghệ phần mềm, An toàn thông tin, Điện toán đám mây và Đồ án tốt nghiệp kỹ sư.',3),(4,2,'Kiến thức Giáo dục đại cương (AI)',46,'Bao gồm các học phần đại cương cơ bản kết hợp toán cao cấp chuyên biệt phục vụ khoa học dữ liệu và học máy (Xác suất thống kê, Giải tích số).',1),(5,2,'Kiến thức Cơ sở ngành (AI)',56,'Bao gồm các học phần: Nhập môn Trí tuệ nhân tạo, Cấu trúc dữ liệu giải thuật, Học máy cơ bản, Cơ sở dữ liệu lớn (Big Data) và Python chuyên sâu.',2),(6,2,'Kiến thức Chuyên ngành (AI)',59,'Bao gồm các học phần: Học sâu (Deep Learning), Thị giác máy tính, Xử lý ngôn ngữ tự nhiên, Robot học thông minh và Đồ án tốt nghiệp chuyên ngành AI.',3);
/*!40000 ALTER TABLE `cau_truc_khoi_kien_thuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chuan_dau_ra_plo`
--

DROP TABLE IF EXISTS `chuan_dau_ra_plo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chuan_dau_ra_plo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nganh_id` int(11) NOT NULL COMMENT 'FK ngành đại học',
  `ma_plo` varchar(20) NOT NULL COMMENT 'PLO3, PLO5, PLO6...',
  `noi_dung_plo` text NOT NULL COMMENT 'Nội dung năng lực chuẩn đầu ra',
  PRIMARY KEY (`id`),
  KEY `fk_plo_nganh` (`nganh_id`),
  CONSTRAINT `fk_plo_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chuẩn đầu ra PLOs tiêu biểu của ngành';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuan_dau_ra_plo`
--

LOCK TABLES `chuan_dau_ra_plo` WRITE;
/*!40000 ALTER TABLE `chuan_dau_ra_plo` DISABLE KEYS */;
INSERT INTO `chuan_dau_ra_plo` (`id`, `nganh_id`, `ma_plo`, `noi_dung_plo`) VALUES (1,1,'PLO1','Vận dụng kiến thức cơ bản về khoa học tự nhiên, khoa học xã hội, khoa học chính trị và pháp luật để giải quyết các vấn đề liên quan đến chuyên ngành.'),(2,1,'PLO2','Kết hợp kiến thức chuyên môn để giải quyết các vấn đề trong lĩnh vực Công nghệ thông tin.'),(3,1,'PLO3','Phân tích các vấn đề tính toán phức tạp và xác định giải pháp dựa trên các nguyên lý của máy tính và Công nghệ thông tin.'),(4,1,'PLO4','Đánh giá, thiết kế, cài đặt và triển khai các giải pháp CNTT đáp ứng yêu cầu thực tế.'),(5,1,'PLO5','Lựa chọn, phát triển, áp dụng, tích hợp và quản trị an toàn các hệ thống CNTT nhằm đáp ứng mục tiêu của người dùng.'),(6,1,'PLO6','Sử dụng tiếng Anh trong soạn thảo, đọc tài liệu và giao tiếp, đạt bậc 3/6 theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam.'),(7,1,'PLO7','Phối hợp tốt các kỹ năng trình bày và giao tiếp trong môi trường nghề nghiệp.'),(8,1,'PLO8','Làm việc nhóm hiệu quả với vai trò thành viên hoặc người lãnh đạo nhóm.'),(9,1,'PLO9','Thực hiện trách nhiệm nghề nghiệp, đưa ra đánh giá chuyên môn dựa trên chuẩn mực đạo đức và pháp luật.'),(10,1,'PLO10','Nhận thức và thực hiện việc học tập suốt đời, chủ động cập nhật kiến thức và phát triển chuyên môn.');
/*!40000 ALTER TABLE `chuan_dau_ra_plo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chuong_trinh_dao_tao_dai_hoc`
--

DROP TABLE IF EXISTS `chuong_trinh_dao_tao_dai_hoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chuong_trinh_dao_tao_dai_hoc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_nganh` varchar(300) NOT NULL COMMENT 'Khoa học máy tính / Trí tuệ nhân tạo',
  `ma_tuyen_sinh` varchar(50) NOT NULL COMMENT '7480101 / 7480107',
  `van_bang_tot_nghiep` varchar(100) NOT NULL DEFAULT 'Kỹ sư',
  `thoi_gian_hoc` varchar(50) NOT NULL DEFAULT '4.5 Năm',
  `tong_so_tin_chi` int(11) NOT NULL DEFAULT 161 COMMENT 'Tổng số tín chỉ',
  `gioi_thieu_nganh` text NOT NULL COMMENT 'Mô tả tổng quan ngành học',
  `co_hoi_phat_trien` text NOT NULL COMMENT 'Khả năng ứng dụng sau tốt nghiệp',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông tin tổng quan ngành đào tạo Đại học';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuong_trinh_dao_tao_dai_hoc`
--

LOCK TABLES `chuong_trinh_dao_tao_dai_hoc` WRITE;
/*!40000 ALTER TABLE `chuong_trinh_dao_tao_dai_hoc` DISABLE KEYS */;
INSERT INTO `chuong_trinh_dao_tao_dai_hoc` (`id`, `ten_nganh`, `ma_tuyen_sinh`, `van_bang_tot_nghiep`, `thoi_gian_hoc`, `tong_so_tin_chi`, `gioi_thieu_nganh`, `co_hoi_phat_trien`) VALUES (1,'Công nghệ Thông tin','7480201','Kỹ sư','4 Năm',150,'Ngành Công nghệ thông tin tại Trường Đại học Trà Vinh được đào tạo theo định hướng ứng dụng, trang bị cho sinh viên kiến thức nền tảng và chuyên môn về lập trình, cơ sở dữ liệu, mạng máy tính, hệ thống thông tin, công nghệ phần mềm và các công nghệ hiện đại. Chương trình chú trọng phát triển khả năng tư duy, giải quyết vấn đề, thực hành nghề nghiệp và thích ứng với sự phát triển của công nghệ trong thời đại chuyển đổi số.\n','Sau khi tốt nghiệp, sinh viên có thể tiếp tục học tập ở bậc sau đại học, tham gia các hoạt động nghiên cứu khoa học và phát triển chuyên môn trong các lĩnh vực Công nghệ thông tin.\n\nVề nghề nghiệp, sinh viên có thể làm việc tại các doanh nghiệp và tổ chức có nhu cầu ứng dụng CNTT với nhiều vị trí như lập trình viên, kỹ sư phần mềm, phát triển ứng dụng web và di động, quản trị cơ sở dữ liệu, quản trị hệ thống và mạng, phân tích và phát triển hệ thống thông tin, tư vấn và triển khai giải pháp CNTT. Sinh viên cũng có thể làm việc tại các công ty sản xuất và gia công phần mềm trong và ngoài nước, tham gia giảng dạy sau khi đáp ứng các yêu cầu nghiệp vụ, hoặc khởi nghiệp trong lĩnh vực công nghệ thông tin.\n'),(2,'Trí tuệ nhân tạo','7480207','Kỹ sư','4 Năm',148,'Ngành Trí tuệ nhân tạo tại Khoa CNTT TVU, đào tạo từ 2025.','Cơ hội nghề nghiệp trong AI, Machine Learning rộng mở.'),(3,'Công nghệ Nông nghiệp ','7519002','Kỹ sư','4.0 Năm',147,'','');
/*!40000 ALTER TABLE `chuong_trinh_dao_tao_dai_hoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `co_hoi_nghe_nghiep`
--

DROP TABLE IF EXISTS `co_hoi_nghe_nghiep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `co_hoi_nghe_nghiep` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nganh_id` int(11) NOT NULL COMMENT 'FK ngành đại học',
  `loai_thong_tin` enum('vi_tri_dam_nhan','moi_truong_cong_tac') NOT NULL,
  `noi_dung` text NOT NULL COMMENT 'Mô tả vị trí hoặc môi trường công tác',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_nghenghiep_nganh` (`nganh_id`),
  CONSTRAINT `fk_nghenghiep_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vị trí việc làm và môi trường công tác sau tốt nghiệp';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `co_hoi_nghe_nghiep`
--

LOCK TABLES `co_hoi_nghe_nghiep` WRITE;
/*!40000 ALTER TABLE `co_hoi_nghe_nghiep` DISABLE KEYS */;
INSERT INTO `co_hoi_nghe_nghiep` (`id`, `nganh_id`, `loai_thong_tin`, `noi_dung`, `thu_tu`) VALUES (1,1,'vi_tri_dam_nhan','Kỹ sư phần mềm (Software Engineer)\nLập trình viên Backend / Frontend / Full-stack / Mobile\nKỹ sư kiểm thử và đảm bảo chất lượng phần mềm\nQuản trị hệ thống (System Administrator)\nQuản trị Website\nQuản trị cơ sở dữ liệu (Database Administrator)\nChuyên gia dữ liệu (Data Scientist)\nChuyên viên nghiên cứu và phát triển CNTT (R&D)\nChuyên viên CNTT tại các cơ quan, tổ chức\nChuyên viên tư vấn, kinh doanh và hỗ trợ kỹ thuật CNTT\nGiảng viên ngành CNTT khi đáp ứng yêu cầu chuyên môn, nghiệp vụ.',0),(2,1,'moi_truong_cong_tac','Công ty phát triển và gia công phần mềm.\nDoanh nghiệp công nghệ và các công ty IT.\nDoanh nghiệp, ngân hàng, trường học và tổ chức có bộ phận CNTT.\nCông ty tư vấn và triển khai giải pháp CNTT.\nCông ty cung cấp dịch vụ mạng, hệ thống và cơ sở dữ liệu.\nViện nghiên cứu, trường đại học và cơ sở giáo dục.\nCác cơ quan nhà nước có nhu cầu ứng dụng CNTT.\nMôi trường startup và khởi nghiệp công nghệ',0);
/*!40000 ALTER TABLE `co_hoi_nghe_nghiep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cong_bo_khoa_hoc`
--

DROP TABLE IF EXISTS `cong_bo_khoa_hoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cong_bo_khoa_hoc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bibtex_key` varchar(200) DEFAULT NULL COMMENT 'Citation key BibTeX',
  `nam_xuat_ban` year(4) NOT NULL COMMENT 'Năm công bố (2026, 2025, 2024...)',
  `ten_bai_bao` varchar(1000) NOT NULL COMMENT 'Tiêu đề bài báo',
  `loai_hinh_cong_bo` varchar(100) NOT NULL COMMENT 'Conference Paper, Journal Article',
  `tac_gia` text NOT NULL COMMENT 'Danh sách tác giả',
  `ten_tap_chi_hoi_nghi` varchar(500) NOT NULL COMMENT 'SN Computer Science, FAIR...',
  `bibtex_raw` text DEFAULT NULL COMMENT 'Chuỗi BibTeX thô',
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bibtex_key` (`bibtex_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục công bố khoa học (BibTeX Citrus Plugin)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cong_bo_khoa_hoc`
--

LOCK TABLES `cong_bo_khoa_hoc` WRITE;
/*!40000 ALTER TABLE `cong_bo_khoa_hoc` DISABLE KEYS */;
/*!40000 ALTER TABLE `cong_bo_khoa_hoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuu_sinh_vien_tieu_bieu`
--

DROP TABLE IF EXISTS `cuu_sinh_vien_tieu_bieu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cuu_sinh_vien_tieu_bieu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(200) NOT NULL COMMENT 'Họ tên cựu sinh viên',
  `chuc_danh_cong_ty` varchar(300) NOT NULL COMMENT 'Vị trí công tác & Tên công ty',
  `trich_dan_cam_nhan` text NOT NULL COMMENT 'Trích dẫn phát biểu cảm nhận',
  `hinh_anh_avatar_url` varchar(500) DEFAULT NULL COMMENT 'Ảnh đại diện cựu SV',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  `an_hien` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Gương mặt cựu sinh viên tiêu biểu';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuu_sinh_vien_tieu_bieu`
--

LOCK TABLES `cuu_sinh_vien_tieu_bieu` WRITE;
/*!40000 ALTER TABLE `cuu_sinh_vien_tieu_bieu` DISABLE KEYS */;
INSERT INTO `cuu_sinh_vien_tieu_bieu` (`id`, `ho_ten`, `chuc_danh_cong_ty`, `trich_dan_cam_nhan`, `hinh_anh_avatar_url`, `thu_tu`, `an_hien`) VALUES (1,'Huỳnh Sa Quang',' Phó Giám đốc VNPT Châu Thành','Sự kiện còn có sự tham gia đặc biệt của các cựu sinh viên thành đạt trong vai trò Ban Giám khảo. Nổi bật là anh Huỳnh Sa Quang, Phó Giám đốc VNPT Châu Thành, người đã mang về giải thưởng Olympic quốc gia đầu tiên cho TVU vào năm 2011. Chia sẻ với các thí sinh, Anh nhắn nhủ: “Hãy kiên trì và cẩn trọng trong từng dòng code, vì mỗi bài toán là một cơ hội để các bạn trưởng thành.” ','assets/images/uploads/upload-1786647637016-190714041.jpg',0,1),(2,'Nguyễn Huỳnh Kỹ Thuật ','Sinh viên lớp DA22TTC','Sáng ngày 21/4/2026, tại Hội trường B71.101, Trung tâm Học liệu và Hỗ trợ Học thuật, Đại học Trà Vinh tổ chức Lễ Khai mạc Ngày Sách và Văn hóa đọc Việt Nam năm 2026\nChương trình là dịp để lan tỏa sâu rộng giá trị của sách, khơi dậy niềm yêu thích đọc sách trong cán bộ, giảng viên và sinh viên; đồng thời góp phần xây dựng môi trường học tập năng động, nhân văn và bền vững trong nhà trường.\nĐiểm nhấn của chương trình là phần trao giải Cuộc thi “Thiết kế Poster Văn hóa đọc” và Cuộc thi “Thiết kế mô hình Văn hóa đọc thu nhỏ”. Trong đó, Đoàn trường Kỹ thuật và Công nghệ vinh dự đạt giải Khuyến khích Cuộc thi “Thiết kế Poster Văn hóa đọc” và giải Nhì Cuộc thi “Thiết kế mô hình Văn hóa đọc thu nhỏ”.\nĐây không chỉ là sân chơi sáng tạo dành cho sinh viên mà còn là nơi những ý tưởng đẹp về sách, tri thức, thói quen đọc và tinh thần học tập được thể hiện sinh động, gần gũi và đầy sức lan tỏa.','assets/images/uploads/upload-1787940964673-928749024.jpg',0,1),(3,'Lâm Tinh Tú','Sinh viên lớp DA22TTCD','✍️CUỘC THI OLYMPIC CÁC MÔN KHOA HỌC MÁC-LÊNIN, TƯ TƯỞNG HỒ CHÍ MINH 2026 ✍️\n☀️Sáng ngày 27/05/2026, Cuộc thi Olympic các môn khoa học Mác-Lênin, Tư tưởng Hồ Chí Minh do Đại học Trà Vinh tổ chức diễn ra với không khí sôi nổi và năng động giữa các đơn vị trực thuộc.\n👥Đến với cuộc thi, Đoàn trường KT&CN với 1 đội dự thi gồm các bạn trẻ năng động và tự tin đến từ các chuyên ngành khác nhau thuộc khối kỹ thuật. Cuộc thi diễn ra với không khí phấn khởi, đầy nghiêm túc nhưng cũng không kém phần duyên dáng, vui tươi.\n🥉Chung cuộc, đội thi KT&CN xuất sắc giành giải Ba và học tập được nhiều bài học bổ ích. Xin chúc mừng đội thi và chúc các bạn luôn năng lượng và nhiệt huyết! 🥳','assets/images/uploads/upload-1787941068719-584967674.jpg',0,1);
/*!40000 ALTER TABLE `cuu_sinh_vien_tieu_bieu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `danh_sach_nghien_cuu_sinh`
--

DROP TABLE IF EXISTS `danh_sach_nghien_cuu_sinh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `danh_sach_nghien_cuu_sinh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stt` varchar(10) NOT NULL COMMENT '01, 02...',
  `ho_ten` varchar(200) NOT NULL COMMENT 'Họ tên Nghiên cứu sinh',
  `chuc_vu_co_quan` varchar(300) NOT NULL COMMENT 'Chức vụ và Đơn vị công tác',
  `email` varchar(200) NOT NULL COMMENT 'Email cá nhân NCS',
  `avatar_url` varchar(500) DEFAULT NULL COMMENT 'Ảnh đại diện NCS',
  `google_scholar_url` varchar(500) DEFAULT NULL COMMENT 'Link Google Scholar nếu có',
  `ma_ncs` varchar(50) NOT NULL COMMENT 'Mã số NCS (P2425004, P2426001...)',
  `huong_nghien_cuu` text NOT NULL COMMENT 'Tên đề tài luận án / Hướng nghiên cứu',
  `nguoi_huong_dan` varchar(300) NOT NULL COMMENT 'Cán bộ hướng dẫn khoa học',
  `trang_thai` varchar(100) NOT NULL DEFAULT 'Đang học',
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  `an_hien` tinyint(1) NOT NULL DEFAULT 1,
  `an_hien_ma_ncs` tinyint(1) NOT NULL DEFAULT 1,
  `an_hien_email` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_ncs` (`ma_ncs`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách 7 Nghiên cứu sinh Tiến sĩ KHMT';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danh_sach_nghien_cuu_sinh`
--

LOCK TABLES `danh_sach_nghien_cuu_sinh` WRITE;
/*!40000 ALTER TABLE `danh_sach_nghien_cuu_sinh` DISABLE KEYS */;
INSERT INTO `danh_sach_nghien_cuu_sinh` (`id`, `stt`, `ho_ten`, `chuc_vu_co_quan`, `email`, `avatar_url`, `google_scholar_url`, `ma_ncs`, `huong_nghien_cuu`, `nguoi_huong_dan`, `trang_thai`, `ngay_tao`, `an_hien`, `an_hien_ma_ncs`, `an_hien_email`) VALUES (1,'01','Lê Phong Dũ','Trường Đại học Trà Vinh','ncs@tvu.edu.vn','assets/images/default-avatar.png',NULL,'1','','Ban Giám Khoa','Đang học','2026-08-19 01:19:32',1,0,1),(2,'01','Nguyễn Ngọc Đan Thanh','Trường Đại học Trà Vinh','ncs@tvu.edu.vn','assets/images/default-avatar.png',NULL,'2','','Ban Giám Khoa','Đang học','2026-08-19 01:19:52',1,0,1),(3,'01','Nguyễn Bá Nhiệm','Trường Đại học Trà Vinh','ncs@tvu.edu.vn','assets/images/default-avatar.png',NULL,'3','','Ban Giám Khoa','Đang học','2026-08-19 01:20:06',1,0,1);
/*!40000 ALTER TABLE `danh_sach_nghien_cuu_sinh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `de_tai_nghien_cuu`
--

DROP TABLE IF EXISTS `de_tai_nghien_cuu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `de_tai_nghien_cuu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_de_tai` varchar(500) NOT NULL COMMENT 'Tên đề tài (CICTBot, AFF, MINDA, PATUS...)',
  `cap` varchar(100) NOT NULL DEFAULT 'Đề tài nghiên cứu cấp cơ sở',
  `chu_nhiem_id` int(11) DEFAULT NULL COMMENT 'FK tới nhan_vien nếu có',
  `chu_nhiem_ten` varchar(200) NOT NULL COMMENT 'Họ tên Chủ nhiệm đề tài',
  `trang_thai` varchar(100) NOT NULL DEFAULT 'Đang thực hiện',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_detainckh_nhanvien` (`chu_nhiem_id`),
  CONSTRAINT `fk_detainckh_nhanvien` FOREIGN KEY (`chu_nhiem_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đề tài NCKH cấp cơ sở của khoa';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `de_tai_nghien_cuu`
--

LOCK TABLES `de_tai_nghien_cuu` WRITE;
/*!40000 ALTER TABLE `de_tai_nghien_cuu` DISABLE KEYS */;
INSERT INTO `de_tai_nghien_cuu` (`id`, `ten_de_tai`, `cap`, `chu_nhiem_id`, `chu_nhiem_ten`, `trang_thai`, `thu_tu`) VALUES (1,'Nghiên cứu xây dựng chatbot AI tư vấn tuyển sinh TVU','Đề tài cấp cơ sở',NULL,'TS. Nguyễn Nhứt Lam','Đang thực hiện',1),(2,'Ứng dụng IoT trong quản lý phòng học thông minh','Đề tài cấp cơ sở',NULL,'ThS. Lê Phong Dũ','Đã hoàn thành',2);
/*!40000 ALTER TABLE `de_tai_nghien_cuu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dinh_huong_nghien_cuu_chuyen_nganh`
--

DROP TABLE IF EXISTS `dinh_huong_nghien_cuu_chuyen_nganh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dinh_huong_nghien_cuu_chuyen_nganh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nganh_id` int(11) NOT NULL COMMENT 'FK ngành đại học',
  `ten_dinh_huong` varchar(255) NOT NULL COMMENT 'Khám phá tri thức & khai mỏ dữ liệu / Đồ họa & thị giác',
  PRIMARY KEY (`id`),
  KEY `fk_dinhhuong_nganh` (`nganh_id`),
  CONSTRAINT `fk_dinhhuong_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Định hướng nghiên cứu chuyên ngành đại học';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dinh_huong_nghien_cuu_chuyen_nganh`
--

LOCK TABLES `dinh_huong_nghien_cuu_chuyen_nganh` WRITE;
/*!40000 ALTER TABLE `dinh_huong_nghien_cuu_chuyen_nganh` DISABLE KEYS */;
INSERT INTO `dinh_huong_nghien_cuu_chuyen_nganh` (`id`, `nganh_id`, `ten_dinh_huong`) VALUES (1,1,'Công nghệ phần mềm & Hệ thống thông tin'),(2,1,'Mạng máy tính & An toàn thông tin'),(3,2,'Học máy nâng cao & Thị giác máy tính'),(4,2,'Xử lý ngôn ngữ tự nhiên & Khai phá dữ liệu');
/*!40000 ALTER TABLE `dinh_huong_nghien_cuu_chuyen_nganh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doi_tac_hop_tac_quoc_te`
--

DROP TABLE IF EXISTS `doi_tac_hop_tac_quoc_te`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doi_tac_hop_tac_quoc_te` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_doi_tac` varchar(200) NOT NULL COMMENT 'CNRS, FPT, PTN, ULB, VNPT, INRIA, IRISA...',
  `logo_url` varchar(500) NOT NULL COMMENT 'URL file logo',
  `hien_thi_o` set('gioi_thieu','nckh') NOT NULL DEFAULT 'gioi_thieu',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logo danh sách đối tác hợp tác quốc tế';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doi_tac_hop_tac_quoc_te`
--

LOCK TABLES `doi_tac_hop_tac_quoc_te` WRITE;
/*!40000 ALTER TABLE `doi_tac_hop_tac_quoc_te` DISABLE KEYS */;
INSERT INTO `doi_tac_hop_tac_quoc_te` (`id`, `ten_doi_tac`, `logo_url`, `hien_thi_o`, `thu_tu`) VALUES (1,'FPT Software','assets/images/uploads/upload-1787942793858-945630115.webp','gioi_thieu',1),(2,'TMA Solutions','assets/images/uploads/upload-1787942850060-235563999.webp','gioi_thieu',2),(3,'VNPT Trà Vinh','assets/images/uploads/upload-1787942866313-484342064.webp','gioi_thieu',3);
/*!40000 ALTER TABLE `doi_tac_hop_tac_quoc_te` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq_dai_hoc`
--

DROP TABLE IF EXISTS `faq_dai_hoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faq_dai_hoc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cau_hoi` text NOT NULL COMMENT 'Tiêu đề câu hỏi',
  `tra_loi` text NOT NULL COMMENT 'Nội dung trả lời chi tiết',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='FAQ câu hỏi thường gặp trang đào tạo đại học';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq_dai_hoc`
--

LOCK TABLES `faq_dai_hoc` WRITE;
/*!40000 ALTER TABLE `faq_dai_hoc` DISABLE KEYS */;
INSERT INTO `faq_dai_hoc` (`id`, `cau_hoi`, `tra_loi`, `thu_tu`) VALUES (1,'1. Ngành Công nghệ thông tin tại TVU đào tạo những gì?','Ngành đào tạo kiến thức về lập trình, cơ sở dữ liệu, mạng máy tính, công nghệ phần mềm, trí tuệ nhân tạo, hệ thống thông tin và các công nghệ CNTT hiện đại.',0),(2,'2. Thời gian đào tạo ngành CNTT là bao lâu?','Thời gian đào tạo chương trình chính quy khoảng 4 năm, tùy chương trình và khóa đào tạo.',0),(3,'3. Tốt nghiệp ngành CNTT được cấp bằng gì?','Sinh viên hoàn thành chương trình đào tạo được cấp bằng Kỹ sư Công nghệ thông tin.',0),(4,'4. Ngành CNTT có khó không?','Ngành yêu cầu khả năng tư duy logic, giải quyết vấn đề và thực hành lập trình. Sinh viên không cần biết lập trình trước nhưng cần chủ động học tập và thực hành thường xuyên.',0),(5,'5. Sinh viên CNTT có những cơ hội nghề nghiệp nào?','Có thể làm lập trình viên, kỹ sư phần mềm, phát triển Web/Mobile, quản trị cơ sở dữ liệu, quản trị hệ thống và mạng, phân tích hệ thống, kiểm thử phần mềm hoặc làm việc trong lĩnh vực AI và dữ liệu.',0),(6,'6. Sinh viên có được tham gia nghiên cứu khoa học không?','Có. Sinh viên có thể tham gia các đề tài nghiên cứu khoa học, cuộc thi công nghệ, dự án thực tế và các hoạt động học thuật cùng giảng viên.',0),(7,'7. Sau khi tốt nghiệp có thể học tiếp không?','Có. Sinh viên có thể tiếp tục học cao học và phát triển chuyên môn trong các lĩnh vực Công nghệ thông tin và các lĩnh vực liên quan.',0),(8,'8. Ngành CNTT có phù hợp với nữ không?','Có. Ngành CNTT không giới hạn giới tính. Điều quan trọng là khả năng tư duy, sự kiên trì và niềm yêu thích công nghệ.',0),(9,'9. Học CNTT có cần giỏi tiếng Anh không?','Tiếng Anh rất quan trọng vì phần lớn tài liệu, công nghệ và công cụ lập trình được cập nhật bằng tiếng Anh. Sinh viên nên chủ động rèn luyện tiếng Anh chuyên ngành trong quá trình học.',0),(10,'10. Sinh viên CNTT có cơ hội làm việc tại doanh nghiệp không?','Có. Sinh viên có thể tham gia thực tập, dự án thực tế và tìm kiếm cơ hội việc làm tại các doanh nghiệp phần mềm, doanh nghiệp công nghệ và các tổ chức có nhu cầu về CNTT.',0);
/*!40000 ALTER TABLE `faq_dai_hoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(200) DEFAULT NULL COMMENT 'Tiêu đề bức ảnh',
  `mo_ta` text DEFAULT NULL,
  `anh_url` varchar(500) NOT NULL COMMENT 'URL file ảnh',
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `danh_muc` varchar(100) DEFAULT 'Sự kiện' COMMENT 'Sự kiện, Nghiên cứu, Sinh hoạt',
  `ngay_chup` date DEFAULT NULL,
  `alt` varchar(300) DEFAULT NULL,
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thư viện ảnh chung toàn hệ thống';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
INSERT INTO `gallery` (`id`, `tieu_de`, `mo_ta`, `anh_url`, `thumbnail_url`, `danh_muc`, `ngay_chup`, `alt`, `ngay_tao`) VALUES (1,'Hội thảo AI Quốc tế 2026','Ảnh lưu niệm các giáo sư tham dự hội thảo khoa học.','assets/images/gallery/gallery1.jpg','assets/images/gallery/gallery1.jpg','Sự kiện','2026-08-01','Hội thảo AI','2026-08-28 22:45:14'),(2,'Thiết bị IoT đo độ mặn tự động','Mô hình nghiên cứu chuyển giao công nghệ cho nông nghiệp.','assets/images/gallery/gallery2.jpg','assets/images/gallery/gallery2.jpg','Nghiên cứu','2026-05-15','Thiết bị IoT','2026-08-28 22:45:14');
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_hoat_dong_trang_chu`
--

DROP TABLE IF EXISTS `gallery_hoat_dong_trang_chu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gallery_hoat_dong_trang_chu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de_anh` varchar(255) DEFAULT 'ảnh hoạt động Khoa Khoa học máy tính',
  `hinh_anh_url` varchar(500) NOT NULL,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Slider ảnh hoạt động khoa trên trang chủ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_hoat_dong_trang_chu`
--

LOCK TABLES `gallery_hoat_dong_trang_chu` WRITE;
/*!40000 ALTER TABLE `gallery_hoat_dong_trang_chu` DISABLE KEYS */;
INSERT INTO `gallery_hoat_dong_trang_chu` (`id`, `tieu_de_anh`, `hinh_anh_url`, `thu_tu`) VALUES (1,'1','assets/images/uploads/upload-1786647084823-113625231.jpg',1),(2,'2','assets/images/uploads/upload-1786647099987-897374686.jpg',2),(3,'3','assets/images/uploads/upload-1786647219538-377369356.jpg',0),(4,'4','assets/images/uploads/upload-1786647229660-205946886.jpg',0),(5,'4','assets/images/uploads/upload-1786647240177-208486006.jpg',0),(6,NULL,'assets/images/uploads/upload-1786647246968-468916115.jpg',0),(7,'7','assets/images/uploads/upload-1786647290967-52373916.jpg',0),(8,'8','assets/images/uploads/upload-1786647302197-991576020.jpg',0),(9,'0','assets/images/uploads/upload-1786647324436-8814.jpg',0),(10,'10','assets/images/uploads/upload-1786647342896-361658529.jpg',0);
/*!40000 ALTER TABLE `gallery_hoat_dong_trang_chu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gioi_thieu_cta_hop_tac`
--

DROP TABLE IF EXISTS `gioi_thieu_cta_hop_tac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gioi_thieu_cta_hop_tac` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de_banner` varchar(255) NOT NULL DEFAULT 'Hợp tác cùng chúng tôi',
  `noi_dung_banner` text NOT NULL COMMENT 'Thông điệp mời hợp tác',
  `button_text` varchar(100) DEFAULT 'Liên hệ hợp tác',
  `button_link` varchar(500) DEFAULT 'mailto:tnmthu@ctu.edu.vn',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Banner CTA hợp tác trang Giới thiệu';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gioi_thieu_cta_hop_tac`
--

LOCK TABLES `gioi_thieu_cta_hop_tac` WRITE;
/*!40000 ALTER TABLE `gioi_thieu_cta_hop_tac` DISABLE KEYS */;
/*!40000 ALTER TABLE `gioi_thieu_cta_hop_tac` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gioi_thieu_highlights`
--

DROP TABLE IF EXISTS `gioi_thieu_highlights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gioi_thieu_highlights` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `icon_class` varchar(100) NOT NULL COMMENT 'FontAwesome icon class',
  `tieu_de` varchar(150) NOT NULL COMMENT 'Chương trình đào tạo, NCKH, Chuyển giao công nghệ',
  `mo_ta` varchar(255) NOT NULL,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='3 thẻ highlight trang Giới thiệu';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gioi_thieu_highlights`
--

LOCK TABLES `gioi_thieu_highlights` WRITE;
/*!40000 ALTER TABLE `gioi_thieu_highlights` DISABLE KEYS */;
INSERT INTO `gioi_thieu_highlights` (`id`, `icon_class`, `tieu_de`, `mo_ta`, `thu_tu`) VALUES (1,'graduation-cap','Chương trình đạt chuẩn kiểm định','Chương trình đào tạo Kỹ sư CNTT đã hoàn tất kiểm định và hướng tới đạt chuẩn quốc tế ABET.',1),(2,'laptop-code','Cơ sở vật chất hiện đại','Hệ thống phòng lab chuyên dụng được trang bị cấu hình cao phục vụ nghiên cứu deep learning và IoT.',2);
/*!40000 ALTER TABLE `gioi_thieu_highlights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gioi_thieu_lien_he_ban_giam_khoa`
--

DROP TABLE IF EXISTS `gioi_thieu_lien_he_ban_giam_khoa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gioi_thieu_lien_he_ban_giam_khoa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nhan_vien_id` int(11) DEFAULT NULL COMMENT 'FK liên kết nhan_vien nếu có',
  `ho_ten` varchar(200) NOT NULL COMMENT 'TS. GVC. Trần Nguyễn Minh Thư...',
  `chuc_vu_phu_trach` varchar(255) NOT NULL COMMENT 'Trưởng khoa · Phụ trách chung...',
  `email` varchar(200) NOT NULL COMMENT 'Email trực tiếp',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_bangiamkhoa_nhanvien` (`nhan_vien_id`),
  CONSTRAINT `fk_bangiamkhoa_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thẻ liên hệ Ban Giám Khoa trang Giới thiệu';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gioi_thieu_lien_he_ban_giam_khoa`
--

LOCK TABLES `gioi_thieu_lien_he_ban_giam_khoa` WRITE;
/*!40000 ALTER TABLE `gioi_thieu_lien_he_ban_giam_khoa` DISABLE KEYS */;
/*!40000 ALTER TABLE `gioi_thieu_lien_he_ban_giam_khoa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gioi_thieu_tong_quan`
--

DROP TABLE IF EXISTS `gioi_thieu_tong_quan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gioi_thieu_tong_quan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `badge_text` varchar(100) NOT NULL DEFAULT 'Giới thiệu tổng quan',
  `tieu_de` varchar(255) NOT NULL DEFAULT 'Khoa KHOA HỌC MÁY TÍNH',
  `mo_ta_chi_tiet` text NOT NULL COMMENT 'Nội dung văn bản giới thiệu',
  `hinh_anh_tap_the_url` varchar(500) NOT NULL COMMENT 'URL ảnh tập thể khoa',
  `caption_anh` varchar(255) NOT NULL DEFAULT 'Khoa Khoa học máy tính - Đại học Cần Thơ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tổng quan trang Giới thiệu';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gioi_thieu_tong_quan`
--

LOCK TABLES `gioi_thieu_tong_quan` WRITE;
/*!40000 ALTER TABLE `gioi_thieu_tong_quan` DISABLE KEYS */;
INSERT INTO `gioi_thieu_tong_quan` (`id`, `badge_text`, `tieu_de`, `mo_ta_chi_tiet`, `hinh_anh_tap_the_url`, `caption_anh`) VALUES (1,'Giới thiệu tổng quan','KHOA CÔNG NGHỆ THÔNG TIN','Khoa Công nghệ thông tin – Trường Đại học Trà Vinh (TVU) là đơn vị đào tạo nguồn nhân lực trong lĩnh vực Công nghệ thông tin, chú trọng kết hợp kiến thức chuyên môn, thực hành và nghiên cứu khoa học.\n\nKhoa đào tạo sinh viên về lập trình, công nghệ phần mềm, cơ sở dữ liệu, mạng máy tính, trí tuệ nhân tạo và các công nghệ hiện đại, hướng đến đáp ứng nhu cầu nhân lực của doanh nghiệp và xã hội.\n\nBên cạnh đào tạo, Khoa đẩy mạnh nghiên cứu khoa học, đổi mới sáng tạo và hợp tác doanh nghiệp, tạo môi trường giúp sinh viên phát triển kỹ năng và sẵn sàng làm việc sau khi tốt nghiệp.','assets/images/uploads/upload-1786726258305-390676950.jpg','');
/*!40000 ALTER TABLE `gioi_thieu_tong_quan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hinh_anh_tin_tuc`
--

DROP TABLE IF EXISTS `hinh_anh_tin_tuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hinh_anh_tin_tuc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tin_tuc_id` int(11) NOT NULL COMMENT 'FK tới tin_tuc',
  `src_chinh` varchar(500) NOT NULL COMMENT 'URL ảnh hiển thị chính (800px)',
  `srcset_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Mảng JSON srcset [{url, width}]' CHECK (json_valid(`srcset_json`)),
  `width` int(11) DEFAULT 800,
  `height` int(11) DEFAULT 450,
  `alt` varchar(500) DEFAULT '',
  `sizes_attr` varchar(200) DEFAULT '(max-width: 800px) 100vw, 800px',
  `thu_tu` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `fk_hinhanh_tintuc` (`tin_tuc_id`),
  CONSTRAINT `fk_hinhanh_tintuc` FOREIGN KEY (`tin_tuc_id`) REFERENCES `tin_tuc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hình ảnh đại diện và srcset đa kích thước bài tin tức';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hinh_anh_tin_tuc`
--

LOCK TABLES `hinh_anh_tin_tuc` WRITE;
/*!40000 ALTER TABLE `hinh_anh_tin_tuc` DISABLE KEYS */;
INSERT INTO `hinh_anh_tin_tuc` (`id`, `tin_tuc_id`, `src_chinh`, `srcset_json`, `width`, `height`, `alt`, `sizes_attr`, `thu_tu`) VALUES (1,1,'assets/images/news/news1.jpg','[]',800,450,'Hội thảo AI 2026','(max-width: 800px) 100vw, 800px',1),(2,2,'assets/images/news/news2.jpg','[]',800,450,'Lễ tốt nghiệp CNTT','(max-width: 800px) 100vw, 800px',1),(3,3,'assets/images/uploads/upload-1787939583353-781136200.jpg',NULL,800,450,'','(max-width: 800px) 100vw, 800px',1),(4,4,'assets/images/uploads/upload-1787940169260-411301246.jpg',NULL,800,450,'','(max-width: 800px) 100vw, 800px',1),(5,5,'assets/images/uploads/upload-1787940109376-405378368.jpg',NULL,800,450,'','(max-width: 800px) 100vw, 800px',1),(6,6,'assets/images/uploads/upload-1787940380704-977515215.jpg',NULL,800,450,'','(max-width: 800px) 100vw, 800px',1);
/*!40000 ALTER TABLE `hinh_anh_tin_tuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoat_dong_sau_dai_hoc`
--

DROP TABLE IF EXISTS `hoat_dong_sau_dai_hoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hoat_dong_sau_dai_hoc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) DEFAULT NULL,
  `hinh_anh_url` varchar(500) NOT NULL,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  `an_hien` tinyint(1) NOT NULL DEFAULT 1,
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoat_dong_sau_dai_hoc`
--

LOCK TABLES `hoat_dong_sau_dai_hoc` WRITE;
/*!40000 ALTER TABLE `hoat_dong_sau_dai_hoc` DISABLE KEYS */;
INSERT INTO `hoat_dong_sau_dai_hoc` (`id`, `tieu_de`, `hinh_anh_url`, `thu_tu`, `an_hien`, `ngay_tao`) VALUES (1,'Lễ khai giảng khóa đào tạo Thạc sĩ CNTT khóa 2025','assets/images/gallery/gallery1.jpg',1,1,'2026-08-28 22:45:14'),(2,'Học viên cao học bảo vệ thành công luận văn tốt nghiệp','assets/images/gallery/gallery2.jpg',2,1,'2026-08-28 22:45:14');
/*!40000 ALTER TABLE `hoat_dong_sau_dai_hoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoc_phan_cong_nghe_cot_loi`
--

DROP TABLE IF EXISTS `hoc_phan_cong_nghe_cot_loi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hoc_phan_cong_nghe_cot_loi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nganh_id` int(11) NOT NULL COMMENT 'FK ngành đại học',
  `ma_hoc_phan` varchar(20) NOT NULL COMMENT 'CT294, CT316E, CT210, CT282E',
  `loai_hoc_phan` enum('bat_buoc','tu_chon') NOT NULL DEFAULT 'bat_buoc',
  `dinh_huong` varchar(50) DEFAULT NULL,
  `ten_hoc_phan` varchar(255) NOT NULL COMMENT 'Máy học ứng dụng, Xử lý ảnh...',
  `so_tin_chi` int(11) NOT NULL DEFAULT 3,
  `nang_luc_hinh_thanh` text NOT NULL COMMENT 'Năng lực công nghệ hình thành',
  PRIMARY KEY (`id`),
  KEY `fk_hocphan_nganh` (`nganh_id`),
  CONSTRAINT `fk_hocphan_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Một số học phần công nghệ cốt lõi tiêu biểu';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoc_phan_cong_nghe_cot_loi`
--

LOCK TABLES `hoc_phan_cong_nghe_cot_loi` WRITE;
/*!40000 ALTER TABLE `hoc_phan_cong_nghe_cot_loi` DISABLE KEYS */;
INSERT INTO `hoc_phan_cong_nghe_cot_loi` (`id`, `nganh_id`, `ma_hoc_phan`, `loai_hoc_phan`, `dinh_huong`, `ten_hoc_phan`, `so_tin_chi`, `nang_luc_hinh_thanh`) VALUES (1,1,'HK1-01','bat_buoc',NULL,'Hạnh phúc học',2,'Giáo dục kỹ năng mềm, tư duy hạnh phúc trong học tập và cuộc sống.'),(2,1,'HK1-02','bat_buoc',NULL,'Anh văn không chuyên 1',3,'Nền tảng tiếng Anh giao tiếp và đọc hiểu cơ bản.'),(3,1,'HK1-03','bat_buoc',NULL,'Vi tích phân A1',3,'Giải tích toán học cơ sở phục vụ chuyên ngành CNTT.'),(4,1,'HK1-04','bat_buoc',NULL,'Nhập môn CNTT',2,'Tổng quan về ngành Công nghệ thông tin và định hướng nghề nghiệp.'),(5,1,'HK1-05','bat_buoc',NULL,'Pháp luật đại cương',2,'Kiến thức pháp luật cơ bản áp dụng trong đời sống và công việc.'),(6,1,'HK1-06','bat_buoc',NULL,'Đại số tuyến tính',2,'Đại số tuyến tính ứng dụng trong xử lý dữ liệu và đồ họa máy tính.'),(7,1,'HK1-07','bat_buoc',NULL,'Kỹ thuật lập trình',4,'Lập trình cơ bản, thuật toán và cấu trúc chương trình bằng ngôn ngữ C/C++.'),(8,1,'HK2-01','bat_buoc',NULL,'Triết học Mác – Lênin',3,'Nền tảng triết học Mác-Lênin trong đời sống và tư duy khoa học.'),(9,1,'HK2-02','bat_buoc',NULL,'Anh văn không chuyên 2',4,'Tiếng Anh giao tiếp nâng cao và đọc tài liệu kỹ thuật.'),(10,1,'HK2-03','bat_buoc',NULL,'Vi tích phân A2',2,'Giải tích nâng cao gồm tích phân bội và phương trình vi phân.'),(11,1,'HK2-04','bat_buoc',NULL,'Phương pháp NCKH',2,'Phương pháp luận nghiên cứu khoa học và kỹ năng viết báo cáo.'),(12,1,'HK2-05','bat_buoc',NULL,'Thiết kế web',3,'Thiết kế giao diện website bằng HTML, CSS, JavaScript cơ bản.'),(13,1,'HK2-06','bat_buoc',NULL,'Cấu trúc dữ liệu và giải thuật',4,'Cấu trúc dữ liệu, các giải thuật tìm kiếm, sắp xếp và đệ quy.'),(14,1,'HK3-01','bat_buoc',NULL,'Kinh tế chính trị Mác – Lênin',2,'Lý luận kinh tế chính trị trong nền kinh tế thị trường.'),(15,1,'HK3-02','bat_buoc',NULL,'Anh văn không chuyên 3',3,'Tiếng Anh chuyên ngành kỹ thuật và luyện thi TOEIC.'),(16,1,'HK3-03','bat_buoc',NULL,'Kiến trúc máy tính',3,'Cấu trúc phần cứng máy tính và nguyên lý hoạt động của CPU, bộ nhớ.'),(17,1,'HK3-04','bat_buoc',NULL,'Cơ sở dữ liệu',3,'Thiết kế và quản trị CSDL quan hệ bằng SQL và ERD.'),(18,1,'HK3-05','bat_buoc',NULL,'Mạng máy tính',3,'Nguyên lý mạng máy tính, giao thức TCP/IP và mô hình OSI.'),(19,1,'HK3-06','bat_buoc',NULL,'Xác suất thống kê',2,'Xác suất và thống kê ứng dụng trong phân tích dữ liệu và AI.'),(20,1,'HK3-07','bat_buoc',NULL,'Lập trình hướng đối tượng',3,'OOP với Java/C#, kế thừa, đa hình và thiết kế Design Pattern.'),(21,1,'HK3-08','bat_buoc',NULL,'Toán rời rạc',2,'Logic toán, đồ thị và lý thuyết tập hợp ứng dụng trong CNTT.'),(22,1,'HK4-01','bat_buoc',NULL,'Chủ nghĩa xã hội khoa học',2,'Lý luận CNXH khoa học trong bối cảnh Việt Nam hiện đại.'),(23,1,'HK4-02','bat_buoc',NULL,'Anh văn không chuyên 4',3,'Tiếng Anh nâng cao, luyện thi TOEIC và viết học thuật.'),(24,1,'HK4-03','bat_buoc',NULL,'Lý thuyết đồ thị',3,'Lý thuyết đồ thị, thuật toán đường đi ngắn nhất và ứng dụng trong mạng.'),(25,1,'HK4-04','bat_buoc',NULL,'Phân tích và thiết kế HTTT',3,'Phân tích yêu cầu và thiết kế hệ thống thông tin với UML.'),(26,1,'HK4-05','bat_buoc',NULL,'Điện toán đám mây',3,'Kiến trúc Cloud Computing, dịch vụ AWS/Azure và ảo hóa máy chủ.'),(27,1,'HK4-06','bat_buoc',NULL,'Thực tập đồ án CSN',3,'Thực hành phát triển đồ án cơ sở ngành theo nhóm kỹ thuật.'),(28,1,'HK5-01','bat_buoc',NULL,'Tư tưởng Hồ Chí Minh',2,'Tư tưởng, đạo đức và phong cách Hồ Chí Minh.'),(29,1,'HK5-02','bat_buoc',NULL,'Anh văn chuyên ngành CNTT',2,'Đọc hiểu tài liệu CNTT bằng tiếng Anh và kỹ năng thuyết trình.'),(30,1,'HK5-03','bat_buoc',NULL,'Hệ điều hành',3,'Quản lý tiến trình, bộ nhớ, hệ thống tập tin trong Linux và Windows.'),(31,1,'HK5-04','bat_buoc',NULL,'Thống kê và Phân tích dữ liệu',3,'Kỹ thuật phân tích dữ liệu với Python, Pandas và trực quan hóa dữ liệu.'),(32,1,'HK5-05','bat_buoc',NULL,'Công nghệ phần mềm',3,'Quy trình phát triển phần mềm Agile/Scrum, kiểm thử và triển khai CI/CD.'),(33,1,'HK6-01','bat_buoc',NULL,'Lịch sử Đảng Cộng sản Việt Nam',2,'Lịch sử hình thành và phát triển của Đảng Cộng sản Việt Nam.'),(34,1,'HK6-02','bat_buoc',NULL,'Trí tuệ nhân tạo',3,'Nền tảng AI: tìm kiếm, suy luận, học máy và xử lý ngôn ngữ tự nhiên.'),(35,1,'HK6-03','bat_buoc',NULL,'Phát triển ứng dụng đơn trang',3,'Xây dựng SPA với ReactJS/VueJS, REST API và quản lý trạng thái.'),(36,1,'HK6-04','bat_buoc',NULL,'Phát triển ứng dụng web mã nguồn mở',3,'Phát triển web với CMS mã nguồn mở (WordPress, Laravel) và tùy biến nâng cao.'),(37,1,'HK6-05','bat_buoc',NULL,'Thực tập đồ án CN',3,'Thực hành dự án thực tế chuyên ngành theo nhóm dưới hướng dẫn của doanh nghiệp.'),(38,1,'HK7-01','bat_buoc',NULL,'Máy học',3,'Học máy giám sát và không giám sát, mạng nơ-ron và ứng dụng thực tế.'),(39,1,'HK7-02','bat_buoc',NULL,'Hệ quản trị cơ sở dữ liệu',3,'Tối ưu hóa CSDL, thủ tục lưu trữ, trigger và quản trị MySQL/PostgreSQL.'),(40,1,'HK7-03','bat_buoc',NULL,'Khai phá dữ liệu',3,'Kỹ thuật khai phá dữ liệu lớn, phân cụm và luật kết hợp với Python/Spark.'),(41,1,'HK7-04','bat_buoc',NULL,'An toàn và bảo mật thông tin',3,'Mật mã học, bảo mật mạng, phòng chống tấn công và đánh giá lỗ hổng bảo mật.'),(42,1,'HK7-05','bat_buoc',NULL,'Quản trị dự án CNTT',3,'Lập kế hoạch, quản lý rủi ro và điều phối dự án phần mềm theo chuẩn PMI/Agile.'),(43,1,'HK8-01','bat_buoc',NULL,'Thực tập cuối khóa',4,'Thực tập tại doanh nghiệp, ứng dụng kiến thức chuyên ngành vào thực tiễn.'),(44,1,'HK8-02','bat_buoc',NULL,'Đồ án tốt nghiệp',7,'Nghiên cứu và phát triển sản phẩm/đề tài tốt nghiệp dưới hướng dẫn khoa học.'),(45,1,'HK8-03','bat_buoc',NULL,'Hệ thống thông tin quản lý',3,'Phát triển HTTT quản lý doanh nghiệp và tích hợp hệ thống ERP.'),(46,1,'HK8-04','bat_buoc',NULL,'Kinh doanh thông minh',4,'Business Intelligence, kho dữ liệu, BI Dashboard và phân tích kinh doanh.'),(47,1,'HK2-TC01','tu_chon',NULL,'Logic học đại cương',2,''),(48,1,'HK2-TC02','tu_chon',NULL,'Nguyên lý kế toán',2,''),(49,1,'HK2-TC03','tu_chon',NULL,'Tâm lý đại cương',2,''),(50,1,'HK2-TC04','tu_chon',NULL,'Quản lý doanh nghiệp',2,''),(51,1,'HK2-TC05','tu_chon',NULL,'Xã hội học đại cương',2,''),(52,1,'HK2-TC06','tu_chon',NULL,'Cơ sở văn hóa Việt Nam',2,''),(53,1,'HK4-TC01','tu_chon',NULL,'Lý thuyết xếp hàng',2,''),(54,1,'HK4-TC02','tu_chon',NULL,'Quy hoạch tuyến tính',2,''),(55,1,'HK4-TC03','tu_chon',NULL,'Cơ sở đại cương',2,''),(56,1,'HK4-TC04','tu_chon',NULL,'Chuyên đề đặc biệt',2,''),(57,1,'HK5-TC01','tu_chon',NULL,'Thương mại điện tử',3,''),(58,1,'HK5-TC02','tu_chon',NULL,'Đồ họa ứng dụng',3,''),(59,1,'HK5-TC03','tu_chon',NULL,'Chuyên đề Linux',3,''),(60,1,'HK6-KTPM01','tu_chon','KTPM','Tương tác người máy',3,''),(61,1,'HK6-KTPM02','tu_chon','KTPM','Phát triển ứng dụng đa nền dịch vụ',3,''),(62,1,'HK6-KTPM03','tu_chon','KTPM','Phân tích và thiết kế hướng đối tượng',3,''),(63,1,'HK6-KTPM04','tu_chon','KTPM','Lập trình Web API với .NET Core',3,''),(64,1,'HK6-MTT01','tu_chon','Mạng & TT','Định tuyến và chuyển mạch',3,''),(65,1,'HK6-MTT02','tu_chon','Mạng & TT','Thiết kế và vận hành mạng',3,''),(66,1,'HK6-MTT03','tu_chon','Mạng & TT','Lập trình mạng',3,''),(67,1,'HK7-KTPM01','tu_chon','KTPM','Phát triển ứng dụng di động',3,''),(68,1,'HK7-KTPM02','tu_chon','KTPM','Công nghệ .NET',3,''),(69,1,'HK7-KTPM03','tu_chon','KTPM','Kiểm thử và đảm bảo chất lượng phần mềm',3,''),(70,1,'HK7-KTPM04','tu_chon','KTPM','Thị giác máy tính',3,''),(71,1,'HK7-MTT01','tu_chon','Mạng & TT','Quản lý và giám sát mạng',3,''),(72,1,'HK7-MTT02','tu_chon','Mạng & TT','Quản trị mạng',3,''),(73,1,'HK7-MTT03','tu_chon','Mạng & TT','Phát triển ứng dụng IoT',3,'');
/*!40000 ALTER TABLE `hoc_phan_cong_nghe_cot_loi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `huong_nghien_cuu`
--

DROP TABLE IF EXISTS `huong_nghien_cuu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `huong_nghien_cuu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten` varchar(200) NOT NULL COMMENT 'Khai phá dữ liệu & AI / Đồ họa & Thị giác máy tính',
  `mo_ta` text NOT NULL COMMENT 'Nội dung chi tiết hướng NC',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='2 hướng nghiên cứu chính của khoa';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `huong_nghien_cuu`
--

LOCK TABLES `huong_nghien_cuu` WRITE;
/*!40000 ALTER TABLE `huong_nghien_cuu` DISABLE KEYS */;
INSERT INTO `huong_nghien_cuu` (`id`, `ten`, `mo_ta`, `thu_tu`) VALUES (1,'Khai phá dữ liệu và Trí tuệ nhân tạo','Nghiên cứu các phương pháp thu thập, xử lý, phân tích và khai phá dữ liệu nhằm phát hiện các mẫu, xu hướng và tri thức hữu ích. Tập trung ứng dụng các kỹ thuật Trí tuệ nhân tạo và học máy như phân loại, dự đoán, phân cụm, hệ thống gợi ý, xử lý ngôn ngữ tự nhiên và học sâu để giải quyết các bài toán thực tế trong giáo dục, quản lý và doanh nghiệp.',0),(2,'Công nghệ phần mềm và Phát triển hệ thống','Nghiên cứu các phương pháp phân tích, thiết kế, phát triển và kiểm thử phần mềm; tập trung vào kiến trúc phần mềm, phát triển ứng dụng web, ứng dụng di động, API, hệ thống phân tán và các giải pháp nâng cao chất lượng, hiệu năng và khả năng bảo trì phần mềm.',0),(3,'An toàn thông tin và An ninh mạng','Nghiên cứu các phương pháp bảo vệ hệ thống thông tin, dữ liệu và ứng dụng trước các nguy cơ an ninh mạng. Tập trung vào xác thực, phân quyền, mã hóa, bảo mật ứng dụng web, phát hiện và phòng chống tấn công mạng.',0),(4,'Internet vạn vật và Điện toán thông minh','Nghiên cứu các công nghệ IoT, điện toán đám mây, điện toán biên và hệ thống thông minh. Tập trung xây dựng các hệ thống kết nối thiết bị, thu thập và xử lý dữ liệu thời gian thực, hướng đến các ứng dụng trong đô thị thông minh, nông nghiệp, công nghiệp và đời sống.',0);
/*!40000 ALTER TABLE `huong_nghien_cuu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `infographic_items`
--

DROP TABLE IF EXISTS `infographic_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `infographic_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_infographic` varchar(200) NOT NULL COMMENT 'Infographic A4 - 1 đến 4',
  `file_anh_url` varchar(500) NOT NULL COMMENT 'URL ảnh preview',
  `file_pdf_url` varchar(500) DEFAULT NULL COMMENT 'Link tải PDF A4',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Các file Infographic A4 trang chủ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `infographic_items`
--

LOCK TABLES `infographic_items` WRITE;
/*!40000 ALTER TABLE `infographic_items` DISABLE KEYS */;
INSERT INTO `infographic_items` (`id`, `ten_infographic`, `file_anh_url`, `file_pdf_url`, `thu_tu`) VALUES (1,'Đại học Công nghệ Thông tin','assets/images/uploads/upload-1786644590077-949473324.png','#',1),(2,'Đại học Trí tuệ nhân tạo','assets/images/uploads/upload-1786644625272-944934151.png','#',2),(3,'Thạc sĩ Công nghệ Thông tin','assets/images/uploads/upload-1786644666736-868570073.png','#',3),(4,'Thạc sĩ Trí tuệ nhân tạo','assets/images/uploads/upload-1786644695982-867561334.png','#',4);
/*!40000 ALTER TABLE `infographic_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_hinh_thanh`
--

DROP TABLE IF EXISTS `lich_su_hinh_thanh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lich_su_hinh_thanh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nam` varchar(10) NOT NULL COMMENT 'Năm mốc lịch sử (2009, 2014, 2022...)',
  `ngay_cu_the` date DEFAULT NULL COMMENT 'Ngày sự kiện nếu có',
  `so_quyet_dinh` varchar(50) DEFAULT NULL COMMENT 'Số Quyết định (2082/QĐ-ĐHCT)',
  `noi_dung` text NOT NULL COMMENT 'Nội dung mốc lịch sử',
  `thu_tu` int(11) NOT NULL DEFAULT 0 COMMENT 'Thứ tự dòng thời gian',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='8 mốc lịch sử hình thành khoa';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_hinh_thanh`
--

LOCK TABLES `lich_su_hinh_thanh` WRITE;
/*!40000 ALTER TABLE `lich_su_hinh_thanh` DISABLE KEYS */;
INSERT INTO `lich_su_hinh_thanh` (`id`, `nam`, `ngay_cu_the`, `so_quyet_dinh`, `noi_dung`, `thu_tu`) VALUES (1,'2009','2009-08-15','124/QĐ-ĐHTV','Thành lập Bộ môn Công nghệ thông tin trực thuộc Khoa Kỹ thuật và Công nghệ.',1),(2,'2022','2022-11-20','892/QĐ-ĐHTV','Nâng cấp và chính thức thành lập Khoa Công nghệ thông tin (Trường Kỹ thuật và Công nghệ, ĐHTV).',2);
/*!40000 ALTER TABLE `lich_su_hinh_thanh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lien_he_don_vi`
--

DROP TABLE IF EXISTS `lien_he_don_vi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lien_he_don_vi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_don_vi` varchar(200) NOT NULL DEFAULT 'Khoa Khoa học máy tính',
  `truong_don_vi` varchar(200) NOT NULL DEFAULT 'Trường Công nghệ thông tin và Truyền thông',
  `khu` varchar(50) NOT NULL DEFAULT 'Khu II',
  `dai_hoc` varchar(100) NOT NULL DEFAULT 'Đại học Cần Thơ',
  `dia_chi_duong` varchar(200) NOT NULL DEFAULT 'Đường 3/2',
  `phuong` varchar(100) NOT NULL DEFAULT 'Phường Ninh Kiều',
  `thanh_pho` varchar(100) NOT NULL DEFAULT 'Thành phố Cần Thơ',
  `facebook_url` varchar(500) DEFAULT 'https://www.facebook.com/khmt.dhct',
  `copyright_text` varchar(200) NOT NULL DEFAULT '© 2026 Khoa Khoa học máy tính',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông tin liên hệ địa chỉ footer dùng chung';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lien_he_don_vi`
--

LOCK TABLES `lien_he_don_vi` WRITE;
/*!40000 ALTER TABLE `lien_he_don_vi` DISABLE KEYS */;
/*!40000 ALTER TABLE `lien_he_don_vi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lien_he_nghien_cuu`
--

DROP TABLE IF EXISTS `lien_he_nghien_cuu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lien_he_nghien_cuu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_daidien` varchar(200) NOT NULL COMMENT 'TS. GVC. Mã Trường Thành / Khoa KHMT',
  `chuc_vu_nhiem_vu` varchar(500) NOT NULL COMMENT 'Phụ trách NCKH - Trưởng PTN CVIP...',
  `email` varchar(200) NOT NULL COMMENT 'Email tiếp nhận liên hệ',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='2 đầu mối liên hệ nghiên cứu khoa học';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lien_he_nghien_cuu`
--

LOCK TABLES `lien_he_nghien_cuu` WRITE;
/*!40000 ALTER TABLE `lien_he_nghien_cuu` DISABLE KEYS */;
INSERT INTO `lien_he_nghien_cuu` (`id`, `ten_daidien`, `chuc_vu_nhiem_vu`, `email`, `thu_tu`) VALUES (1,'TS. Nguyễn Nhứt Lam','Trưởng khoa, Trưởng nhóm Nghiên cứu Công nghệ thông tin','lamnn@tvu.edu.vn',1);
/*!40000 ALTER TABLE `lien_he_nghien_cuu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhan_vien` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID cán bộ nhân viên',
  `nhom_id` int(11) NOT NULL COMMENT 'FK nhóm nhân sự',
  `ho_ten` varchar(200) NOT NULL COMMENT 'Họ và tên đầy đủ',
  `hoc_ham` varchar(50) DEFAULT NULL COMMENT 'Học hàm (Giáo sư, Phó giáo sư)',
  `hoc_vi` varchar(50) NOT NULL COMMENT 'Học vị (Tiến sĩ, Thạc sĩ, Kỹ sư, NCS)',
  `ngach_vien_chuc` varchar(100) DEFAULT NULL COMMENT 'Ngạch viên chức (Giảng viên cao cấp, GVC...)',
  `don_vi_cong_tac` varchar(300) DEFAULT NULL COMMENT 'Đơn vị công tác chính',
  `chuc_vu` varchar(200) NOT NULL COMMENT 'Chức vụ hiển thị trên card',
  `email` varchar(200) DEFAULT NULL COMMENT 'Email công vụ (@ctu.edu.vn)',
  `slug_ca_nhan` varchar(100) NOT NULL COMMENT 'URL slug trang cá nhân (/tnmthu, /pxhien...)',
  `anh_ca_nhan_url` varchar(500) NOT NULL COMMENT 'URL ảnh đại diện cá nhân',
  `anh_format` enum('jpg','webp','png','jpeg') NOT NULL DEFAULT 'webp' COMMENT 'Định dạng file ảnh',
  `aria_label_anh` varchar(200) DEFAULT NULL COMMENT 'Aria label cho accessibility',
  `thu_tu_trong_nhom` int(11) NOT NULL DEFAULT 0 COMMENT 'Thứ tự vị trí trong nhóm',
  `an_hien` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1: Hiện, 0: Ẩn',
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `an_hien_email` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1: Hiện, 0: Ẩn',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_ca_nhan` (`slug_ca_nhan`),
  KEY `fk_nhanvien_nhom` (`nhom_id`),
  CONSTRAINT `fk_nhanvien_nhom` FOREIGN KEY (`nhom_id`) REFERENCES `nhom_nhan_su` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách Cán bộ, Giảng viên và Người lao động';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien`
--

LOCK TABLES `nhan_vien` WRITE;
/*!40000 ALTER TABLE `nhan_vien` DISABLE KEYS */;
INSERT INTO `nhan_vien` (`id`, `nhom_id`, `ho_ten`, `hoc_ham`, `hoc_vi`, `ngach_vien_chuc`, `don_vi_cong_tac`, `chuc_vu`, `email`, `slug_ca_nhan`, `anh_ca_nhan_url`, `anh_format`, `aria_label_anh`, `thu_tu_trong_nhom`, `an_hien`, `ngay_tao`, `ngay_cap_nhat`, `an_hien_email`) VALUES (4,1,'TS. Nguyễn Nhứt Lam',NULL,'Tiến sĩ','Giảng viên',NULL,'Trưởng khoa','lamnn@tvu.edu.vn','ts-nguyen-nhut-lam-6840','assets/images/lecturers/default.jpg','webp',NULL,1,1,'2026-08-15 13:42:35','2026-08-19 01:11:08',1),(7,1,'TS. Thạch Kọng Saoane',NULL,'Tiến sĩ','Giảng viên',NULL,'Phó trưởng khoa','canbo@tvu.edu.vn','ts-thach-kong-saoane-9492','assets/images/lecturers/default.jpg','webp',NULL,2,1,'2026-08-15 13:57:58','2026-08-19 01:11:31',1),(10,2,'Dương Ngọc Vân Khanh',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','vankhanh@tvu.edu.vn','vankhanh','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:18','2026-08-19 00:34:18',1),(11,2,'Đoàn Phước Miền',NULL,'Tiến sĩ','Giảng viên',NULL,'Giảng viên','phuocmien@tvu.edu.vn','doan-phuoc-mien-5068','assets/images/default-avatar.webp','webp',NULL,0,1,'2026-08-19 00:34:18','2026-08-19 01:15:36',1),(12,2,'Hà Thị Thúy Vi',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','hattvi201084@tvu.edu.vn','hattvi201084','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:18','2026-08-19 00:34:18',1),(13,2,'Huỳnh Văn Thanh',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','hvthanh@tvu.edu.vn','hvthanh','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:19','2026-08-19 00:34:19',1),(14,2,'Khấu Văn Nhựt',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','nhutkhau@tvu.edu.vn','nhutkhau','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:19','2026-08-19 00:34:19',1),(15,2,'Lê Minh Tự',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','lmtu@tvu.edu.vn','lmtu','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:19','2026-08-19 00:34:19',1),(16,1,'Lê Phong Dũ',NULL,'Thạc sĩ','Phó trưởng khoa','Khoa Công nghệ thông tin','Phó trưởng khoa','lpdu@tvu.edu.vn','le-phong-du-3783','assets/images/default-avatar.webp','webp',NULL,4,1,'2026-08-19 00:34:20','2026-08-29 00:34:29',1),(17,2,'Ngô Thanh Huy',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','huyngocntt@tvu.edu.vn','huyngocntt','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:20','2026-08-19 00:34:20',1),(18,1,'Nguyễn Bá Nhiệm',NULL,'Thạc sĩ','Phó trưởng khoa','Khoa Công nghệ thông tin','Phó trưởng khoa','nhiemnb@tvu.edu.vn','nguyen-ba-nhiem-881','assets/images/default-avatar.webp','webp',NULL,5,1,'2026-08-19 00:34:20','2026-08-29 00:34:22',1),(19,2,'Nguyễn Hoàng Duy Thiện',NULL,'Thạc sĩ','Giảng viên',NULL,'Giảng viên','thiennhd@tvu.edu.vn','nguyen-hoang-duy-thien-9805','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:21','2026-08-19 15:58:27',1),(20,2,'Nguyễn Khắc Quốc',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','nkquoc@tvu.edu.vn','nkquoc','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:21','2026-08-19 00:34:21',1),(21,2,'Nguyễn Mộng Hiền',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','hientvu@tvu.edu.vn','hientvu','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:21','2026-08-19 00:34:21',1),(22,2,'Nguyễn Ngọc Đan Thanh',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','ngocdanthanhdt@tvu.edu.vn','ngocdanthanhdt','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:22','2026-08-19 00:34:22',1),(23,2,'Nguyễn Thừa Phát Tài',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','phattai@tvu.edu.vn','phattai','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:22','2026-08-19 00:34:22',1),(24,1,'Nguyễn Trần Diễm Hạnh',NULL,'Tiến sĩ','Phó trưởng khoa','Khoa Công nghệ thông tin','Phó trưởng khoa','diemhanh_tvu@tvu.edu.vn','nguyen-tran-diem-hanh-7735','assets/images/default-avatar.webp','webp',NULL,3,1,'2026-08-19 00:34:23','2026-08-29 00:34:16',1),(25,2,'Phạm Minh Đương',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','duongminh@tvu.edu.vn','duongminh','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:23','2026-08-19 00:34:23',1),(26,2,'Phạm Thị Trúc Mai',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','pttmai@tvu.edu.vn','pttmai','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:23','2026-08-19 00:34:23',1),(27,2,'Phan Thị Phương Nam',NULL,'Thạc sĩ','Giảng viên',NULL,'Giảng viên','ptpnam@tvu.edu.vn','phan-thi-phuong-nam-60','assets/images/default-avatar.webp','webp',NULL,0,1,'2026-08-19 00:34:24','2026-08-19 01:03:11',1),(29,2,'Trầm Hoàng Nam',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','tramhoangnam@tvu.edu.vn','tramhoangnam','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:24','2026-08-19 00:34:24',1),(30,2,'Trần Văn Nam',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','namtv@tvu.edu.vn','namtv','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:25','2026-08-19 00:34:25',1),(31,2,'Trịnh Quốc Việt',NULL,'Thạc sĩ',NULL,NULL,'Giảng viên','tqviettv@tvu.edu.vn','tqviettv','assets/images/default-avatar.webp','webp',NULL,99,1,'2026-08-19 00:34:25','2026-08-19 00:34:25',1),(32,2,'Võ Thành C',NULL,'Thạc sĩ','Giảng viên',NULL,'Giảng viên','vothanhc@tvu.edu.vn','vo-thanh-c-9113','assets/images/uploads/upload-1787131122966-120426867.jpg','webp',NULL,99,1,'2026-08-19 00:34:25','2026-08-19 16:18:42',1),(34,3,'PGS. TS. Nguyễn Thái Sơn','Phó Giáo sư','Tiến sĩ','Giảng viên','Khoa Công nghệ thông tin - TVU','Giảng viên thỉnh giảng',NULL,'nguyen-thai-son','assets/images/default-avatar.webp','webp',NULL,1,1,'2026-08-29 00:38:05','2026-08-29 00:38:05',1),(35,3,'TS. Nguyễn Bảo Ân',NULL,'Tiến sĩ','Giảng viên','Khoa Công nghệ thông tin - TVU','Giảng viên thỉnh giảng',NULL,'nguyen-bao-an','assets/images/default-avatar.webp','webp',NULL,2,1,'2026-08-29 00:38:05','2026-08-29 00:38:05',1),(36,3,'ThS. Nghi Vĩnh Khanh',NULL,'Thạc sĩ','Giảng viên','Khoa Công nghệ thông tin - TVU','Giảng viên thỉnh giảng',NULL,'nghi-vinh-khanh','assets/images/default-avatar.webp','webp',NULL,3,1,'2026-08-29 00:38:05','2026-08-29 00:38:05',1),(37,3,'ThS. Lê Văn Phol',NULL,'Thạc sĩ','Giảng viên','Khoa Công nghệ thông tin - TVU','Giảng viên thỉnh giảng',NULL,'le-van-phol','assets/images/default-avatar.webp','webp',NULL,4,1,'2026-08-29 00:38:05','2026-08-29 00:38:05',1),(38,3,'ThS. Nhan Minh Phúc',NULL,'Thạc sĩ','Giảng viên','Khoa Công nghệ thông tin - TVU','Giảng viên thỉnh giảng',NULL,'nhan-minh-phuc','assets/images/default-avatar.webp','webp',NULL,5,1,'2026-08-29 00:38:05','2026-08-29 00:38:05',1),(39,3,'ThS. Nguyễn Văn Vũ Linh',NULL,'Thạc sĩ','Giảng viên','Khoa Công nghệ thông tin - TVU','Giảng viên thỉnh giảng',NULL,'nguyen-van-vu-linh','assets/images/default-avatar.webp','webp',NULL,6,1,'2026-08-29 00:38:05','2026-08-29 00:38:05',1),(40,3,'ThS. Tạ Thanh Hải',NULL,'Thạc sĩ','Giảng viên','Khoa Công nghệ thông tin - TVU','Giảng viên thỉnh giảng',NULL,'ta-thanh-hai','assets/images/default-avatar.webp','webp',NULL,7,1,'2026-08-29 00:38:05','2026-08-29 00:38:05',1),(41,3,'ThS. Trần Ngọc Chiến',NULL,'Thạc sĩ','Giảng viên','Khoa Công nghệ thông tin - TVU','Giảng viên thỉnh giảng',NULL,'tran-ngoc-chien','assets/images/default-avatar.webp','webp',NULL,8,1,'2026-08-29 00:38:05','2026-08-29 00:38:05',1);
/*!40000 ALTER TABLE `nhan_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien_bai_bao_khoa_hoc`
--

DROP TABLE IF EXISTS `nhan_vien_bai_bao_khoa_hoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhan_vien_bai_bao_khoa_hoc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nhan_vien_id` int(11) NOT NULL COMMENT 'FK giảng viên',
  `loai_xuat_ban` enum('tieng_anh','tieng_viet') NOT NULL DEFAULT 'tieng_viet' COMMENT 'Loại xuất bản',
  `stt` int(11) NOT NULL DEFAULT 1 COMMENT 'STT bài báo',
  `danh_sach_tac_gia` text NOT NULL COMMENT 'Danh sách tác giả',
  `nam_xuat_ban` year(4) NOT NULL COMMENT 'Năm xuất bản',
  `ten_bai_bao` varchar(500) NOT NULL COMMENT 'Tiêu đề bài báo',
  `ten_tap_chi_hoi_nghi` varchar(500) NOT NULL COMMENT 'Tên tạp chí hoặc hội nghị',
  `so_tap_chi_trang` varchar(100) DEFAULT NULL COMMENT 'Số tập, số trang (VD: 59. 93-101)',
  `trang_thai_xuat_ban` varchar(100) DEFAULT '(Đã xuất bản)' COMMENT 'Trạng thái',
  PRIMARY KEY (`id`),
  KEY `fk_baibao_nhanvien` (`nhan_vien_id`),
  CONSTRAINT `fk_baibao_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục bài báo khoa học của từng giảng viên';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien_bai_bao_khoa_hoc`
--

LOCK TABLES `nhan_vien_bai_bao_khoa_hoc` WRITE;
/*!40000 ALTER TABLE `nhan_vien_bai_bao_khoa_hoc` DISABLE KEYS */;
/*!40000 ALTER TABLE `nhan_vien_bai_bao_khoa_hoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien_de_tai_nckh`
--

DROP TABLE IF EXISTS `nhan_vien_de_tai_nckh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhan_vien_de_tai_nckh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nhan_vien_id` int(11) NOT NULL COMMENT 'FK giảng viên',
  `stt` int(11) NOT NULL DEFAULT 1 COMMENT 'STT hiển thị',
  `ten_de_tai` varchar(500) NOT NULL COMMENT 'Tên đề tài / lĩnh vực áp dụng',
  `nam_hoan_thanh` year(4) NOT NULL COMMENT 'Năm hoàn thành',
  `cap_de_tai` varchar(100) NOT NULL COMMENT 'Đề tài cấp (Tỉnh, bộ, ngành, cơ sở)',
  `trach_nhiem_tham_gia` varchar(100) NOT NULL COMMENT 'Chủ nhiệm, Thư ký, Thành viên...',
  PRIMARY KEY (`id`),
  KEY `fk_detai_nhanvien` (`nhan_vien_id`),
  CONSTRAINT `fk_detai_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đề tài NCKH các cấp của từng giảng viên';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien_de_tai_nckh`
--

LOCK TABLES `nhan_vien_de_tai_nckh` WRITE;
/*!40000 ALTER TABLE `nhan_vien_de_tai_nckh` DISABLE KEYS */;
/*!40000 ALTER TABLE `nhan_vien_de_tai_nckh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien_du_an`
--

DROP TABLE IF EXISTS `nhan_vien_du_an`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhan_vien_du_an` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nhan_vien_id` int(11) NOT NULL COMMENT 'FK giảng viên',
  `ten_du_an` varchar(500) NOT NULL COMMENT 'Tên dự án',
  `nam_thuc_hien` varchar(50) DEFAULT NULL COMMENT 'Năm thực hiện',
  `vai_tro` varchar(200) DEFAULT NULL COMMENT 'Vai trò trong dự án',
  `mo_ta` text DEFAULT NULL COMMENT 'Mô tả chi tiết dự án',
  PRIMARY KEY (`id`),
  KEY `fk_duan_nhanvien` (`nhan_vien_id`),
  CONSTRAINT `fk_duan_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Dự án ứng dụng/chuyển giao của giảng viên';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien_du_an`
--

LOCK TABLES `nhan_vien_du_an` WRITE;
/*!40000 ALTER TABLE `nhan_vien_du_an` DISABLE KEYS */;
/*!40000 ALTER TABLE `nhan_vien_du_an` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien_huong_dan_nckh`
--

DROP TABLE IF EXISTS `nhan_vien_huong_dan_nckh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhan_vien_huong_dan_nckh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nhan_vien_id` int(11) NOT NULL COMMENT 'FK giảng viên',
  `loai_hoc_vien` enum('ncs','hoc_vien_cao_hoc','sinh_vien_nckh') NOT NULL COMMENT 'Phân loại bậc học',
  `ten_hoc_vien` varchar(200) NOT NULL COMMENT 'Tên NCS / Học viên / Sinh viên',
  `ten_de_tai_huong_dan` varchar(500) NOT NULL COMMENT 'Tên đề tài luận văn/luận án',
  `nam_bao_ve` year(4) DEFAULT NULL COMMENT 'Năm bảo vệ thành công',
  PRIMARY KEY (`id`),
  KEY `fk_huongdan_nhanvien` (`nhan_vien_id`),
  CONSTRAINT `fk_huongdan_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách hướng dẫn NCKH các bậc học của giảng viên';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien_huong_dan_nckh`
--

LOCK TABLES `nhan_vien_huong_dan_nckh` WRITE;
/*!40000 ALTER TABLE `nhan_vien_huong_dan_nckh` DISABLE KEYS */;
/*!40000 ALTER TABLE `nhan_vien_huong_dan_nckh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien_sach_giao_trinh`
--

DROP TABLE IF EXISTS `nhan_vien_sach_giao_trinh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhan_vien_sach_giao_trinh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nhan_vien_id` int(11) NOT NULL COMMENT 'FK giảng viên',
  `ten_sach_giao_trinh` varchar(500) NOT NULL COMMENT 'Tên sách hoặc giáo trình',
  `nha_xuat_ban` varchar(250) DEFAULT NULL COMMENT 'Nhà xuất bản',
  `nam_xuat_ban` year(4) DEFAULT NULL COMMENT 'Năm xuất bản',
  `vai_tro` varchar(100) DEFAULT NULL COMMENT 'Chủ biên, Tác giả tham gia...',
  PRIMARY KEY (`id`),
  KEY `fk_sach_nhanvien` (`nhan_vien_id`),
  CONSTRAINT `fk_sach_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sách và giáo trình giảng dạy của giảng viên';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien_sach_giao_trinh`
--

LOCK TABLES `nhan_vien_sach_giao_trinh` WRITE;
/*!40000 ALTER TABLE `nhan_vien_sach_giao_trinh` DISABLE KEYS */;
/*!40000 ALTER TABLE `nhan_vien_sach_giao_trinh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhat_ky_hoat_dong`
--

DROP TABLE IF EXISTS `nhat_ky_hoat_dong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhat_ky_hoat_dong` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_type` enum('admin','lecturer') NOT NULL,
  `hanh_dong` varchar(100) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `doi_tuong` varchar(100) DEFAULT NULL,
  `doi_tuong_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhat_ky_hoat_dong`
--

LOCK TABLES `nhat_ky_hoat_dong` WRITE;
/*!40000 ALTER TABLE `nhat_ky_hoat_dong` DISABLE KEYS */;
INSERT INTO `nhat_ky_hoat_dong` (`id`, `user_id`, `user_type`, `hanh_dong`, `mo_ta`, `doi_tuong`, `doi_tuong_id`, `ip_address`, `user_agent`, `ngay_tao`) VALUES (1,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-19 00:50:40'),(2,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-19 00:51:28'),(3,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-19 00:53:07'),(4,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-19 00:53:49'),(5,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-19 00:55:16'),(6,2,'admin','logout','Admin đăng xuất','admin',2,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 01:00:33'),(7,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-19 01:00:41'),(8,2,'admin','logout','Admin đăng xuất','admin',2,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 01:00:43'),(9,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-19 01:00:50'),(10,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 01:18:04'),(11,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 01:18:09'),(12,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 01:21:57'),(13,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 01:22:46'),(14,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 01:23:35'),(15,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 01:25:38'),(16,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 01:31:55'),(17,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 01:32:04'),(18,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-19 14:26:12'),(19,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 15:27:22'),(20,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 15:32:31'),(21,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 15:37:45'),(22,24,'lecturer','logout','Giảng viên đăng xuất','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 15:59:37'),(23,25,'lecturer','login','Giảng viên nguyenhuynhkithuat84tv@gmail.com đăng nhập thành công','tai_khoan_nhan_vien',25,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 16:01:00'),(24,25,'lecturer','logout','Giảng viên đăng xuất','tai_khoan_nhan_vien',25,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 16:01:51'),(25,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 16:01:56'),(26,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::ffff:127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 16:07:09'),(27,24,'lecturer','logout','Giảng viên đăng xuất','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 16:18:54'),(28,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 16:28:03'),(29,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-19 16:41:09'),(30,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-19 16:42:19'),(31,24,'lecturer','login','Giảng viên vothanhc@tvu.edu.vn đăng nhập thành công','tai_khoan_nhan_vien',24,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-19 22:47:23'),(32,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-21 13:32:53'),(33,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-21 15:17:10'),(34,2,'admin','logout','Admin đăng xuất','admin',2,'58.186.65.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-21 15:19:01'),(35,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-21 15:19:08'),(36,2,'admin','logout','Admin đăng xuất','admin',2,'58.186.65.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-21 15:24:02'),(37,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-21 15:24:10'),(38,2,'admin','logout','Admin đăng xuất','admin',2,'58.186.65.5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','2026-08-21 15:26:59'),(39,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-21 15:27:06'),(40,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-21 15:31:37'),(41,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-21 15:32:52'),(42,2,'admin','login','Admin khoacntttvu@gmail.com đăng nhập thành công qua Google OAuth','admin',2,NULL,NULL,'2026-08-29 00:31:23');
/*!40000 ALTER TABLE `nhat_ky_hoat_dong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhom_nhan_su`
--

DROP TABLE IF EXISTS `nhom_nhan_su`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhom_nhan_su` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID nhóm nhân sự',
  `ten_nhom` varchar(100) NOT NULL COMMENT 'Tên nhóm (LÃNH ĐẠO KHOA, GIẢNG VIÊN & TRỢ GIẢNG)',
  `slug_nhom` varchar(50) NOT NULL COMMENT 'Slug nhóm',
  `thu_tu` int(11) NOT NULL DEFAULT 0 COMMENT 'Thứ tự hiển thị',
  `background_color` varchar(50) DEFAULT '#f8fafc' COMMENT 'Mã màu nền CSS',
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_nhom` (`slug_nhom`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phân nhóm nhân sự khoa';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhom_nhan_su`
--

LOCK TABLES `nhom_nhan_su` WRITE;
/*!40000 ALTER TABLE `nhom_nhan_su` DISABLE KEYS */;
INSERT INTO `nhom_nhan_su` (`id`, `ten_nhom`, `slug_nhom`, `thu_tu`, `background_color`, `ngay_tao`) VALUES (1,'LÃNH ĐẠO KHOA','lanh-dao-khoa',0,'#ffffff','2026-08-14 23:36:32'),(2,'GIẢNG VIÊN VÀ TRỢ GIẢNG','giang-vien-va-tro-giang',2,'#ffffff','2026-08-14 23:36:32'),(3,'GIẢNG VIÊN THỈNH GIẢNG','giang-vien-thinh-giang',3,'#ffffff','2026-08-29 00:38:05');
/*!40000 ALTER TABLE `nhom_nhan_su` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phong_thi_nghiem`
--

DROP TABLE IF EXISTS `phong_thi_nghiem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phong_thi_nghiem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten` varchar(300) NOT NULL COMMENT 'Phòng thí nghiệm Thị giác máy tính và Xử lý ảnh (CVIP)...',
  `ten_viet_tat` varchar(50) DEFAULT NULL COMMENT 'CVIP',
  `truong_phong_id` int(11) DEFAULT NULL COMMENT 'FK tới nhan_vien (Mã Trường Thành)',
  `truong_phong_ten` varchar(200) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `hinh_anh_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ptn_truongphong` (`truong_phong_id`),
  CONSTRAINT `fk_ptn_truongphong` FOREIGN KEY (`truong_phong_id`) REFERENCES `nhan_vien` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách các phòng thí nghiệm trực thuộc khoa';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phong_thi_nghiem`
--

LOCK TABLES `phong_thi_nghiem` WRITE;
/*!40000 ALTER TABLE `phong_thi_nghiem` DISABLE KEYS */;
/*!40000 ALTER TABLE `phong_thi_nghiem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phuong_thuc_tuyen_sinh`
--

DROP TABLE IF EXISTS `phuong_thuc_tuyen_sinh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phuong_thuc_tuyen_sinh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nganh_id` int(11) NOT NULL COMMENT 'FK ngành đại học',
  `ten_phuong_thuc` varchar(255) NOT NULL COMMENT 'Xét THPT, Xét V-SAT, Xét học bạ',
  `danh_sach_to_hop` varchar(255) NOT NULL COMMENT 'A00, A01, X06, X26',
  PRIMARY KEY (`id`),
  KEY `fk_tuyensinh_nganh` (`nganh_id`),
  CONSTRAINT `fk_tuyensinh_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phương thức và tổ hợp môn xét tuyển đại học';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phuong_thuc_tuyen_sinh`
--

LOCK TABLES `phuong_thuc_tuyen_sinh` WRITE;
/*!40000 ALTER TABLE `phuong_thuc_tuyen_sinh` DISABLE KEYS */;
INSERT INTO `phuong_thuc_tuyen_sinh` (`id`, `nganh_id`, `ten_phuong_thuc`, `danh_sach_to_hop`) VALUES (1,1,'Xét kết quả thi tốt nghiệp THPT','A00 – Toán, Vật lý, Hóa học A01 – Toán, Vật lý, Tiếng Anh D01 – Ngữ văn, Toán, Tiếng Anh D07 – Toán, Hóa học, Tiếng Anh X06 – Toán, Vật lý, Tin học X26 – Toán, Tin học, Tiếng Anh X27 – Toán, Công nghệ (Công nghiệp), Tiếng Anh'),(2,1,'Xét kết quả học tập THPT (Học bạ)','A00 A01 D01 D07 X06 X26 X27');
/*!40000 ALTER TABLE `phuong_thuc_tuyen_sinh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES ('xrRNSNbybjz5brWLypVwG28si-JVk9Ps',1788031061,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-08-29T17:31:23.527Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":false},\"passport\":{\"user\":2},\"adminUser\":{\"id\":2,\"email\":\"khoacntttvu@gmail.com\",\"hoTen\":\"KHOA CNTT\",\"avatarUrl\":\"https://lh3.googleusercontent.com/a/ACg8ocIPNhEK2z68XZ-HzbuiTvjWVJZnzMERhYY3CjCVghdPZekd3w=s96-c\",\"quyenHan\":\"SUPER_ADMIN\",\"trangThai\":1}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sinh_vien_tieu_bieu`
--

DROP TABLE IF EXISTS `sinh_vien_tieu_bieu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sinh_vien_tieu_bieu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_doi_ca_nhan` varchar(200) NOT NULL COMMENT 'Đội CTU-LinguTechies, Đội CAAS, Thái Phú An...',
  `nganh_hoc` varchar(200) NOT NULL COMMENT 'Ngành Khoa học máy tính...',
  `thanh_tich` text NOT NULL COMMENT 'Chi tiết giải thưởng thành tích',
  `giang_vien_huong_dan` varchar(200) DEFAULT NULL COMMENT 'Tên GVHD nếu có',
  `hinh_anh_url` varchar(500) DEFAULT NULL,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  `an_hien` tinyint(1) NOT NULL DEFAULT 1,
  `chuyen_muc` varchar(100) NOT NULL DEFAULT 'Sinh viên tiêu biểu' COMMENT 'Phân loại: Sinh viên tiêu biểu, Nghiên cứu khoa học sinh viên, Dự án AI nổi bật',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sinh viên và đội nhóm thành tích tiêu biểu';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sinh_vien_tieu_bieu`
--

LOCK TABLES `sinh_vien_tieu_bieu` WRITE;
/*!40000 ALTER TABLE `sinh_vien_tieu_bieu` DISABLE KEYS */;
INSERT INTO `sinh_vien_tieu_bieu` (`id`, `ten_doi_ca_nhan`, `nganh_hoc`, `thanh_tich`, `giang_vien_huong_dan`, `hinh_anh_url`, `thu_tu`, `an_hien`, `chuyen_muc`) VALUES (6,'Lâm Tinh Tú, Nguyễn Huỳnh Kỹ Thuật, Nguyễn Thị Huyền Trân','Công nghệ Thông tin, Lớp DA22TTc','Đạt thành tích tốt trong cuộc thi thiết kế Poster \"Văn hóa đọc\". Đạt giải khuyến khích\n','','assets/images/uploads/upload-1787941302264-376421940.jpg',0,1,'Sinh viên tiêu biểu'),(7,'Nhóm Đồ án Tốt nghiệp do Thầy Phạm Minh Đương hướng dẫn','Công nghệ Thông tin khóa 22','Nhóm sinh viên đạt kết quả tốt trong học phần Đồ án Tốt nghiệp 2026','Th.S Phạm Minh Đương','assets/images/uploads/upload-1787941565186-321713287.jpg',0,1,'Sinh viên tiêu biểu'),(8,'Nguyễn Thành Hiếu','Công nghệ Thông tin, Lớp DA22TTA','Xây dựng website tham quan khuôn viên Đại học Trà Vinh','TS. Nguyễn Nhứt Lam','assets/images/uploads/upload-1787942154256-407962007.jpg',0,1,'Sinh viên tiêu biểu'),(9,'Dương Văn Hiệp','Công nghệ Thông tin, đại học CNTT khóa 2021','Đạt giải Olympic Tin học toàn quốc năm 2023','','assets/images/uploads/upload-1787942347321-759658452.jpg',0,1,'Sinh viên tiêu biểu');
/*!40000 ALTER TABLE `sinh_vien_tieu_bieu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slider_trang_chu`
--

DROP TABLE IF EXISTS `slider_trang_chu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slider_trang_chu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_slide` varchar(200) NOT NULL COMMENT 'Tên slide (CTUWebsiteSlideWeb6...)',
  `hinh_anh_url` varchar(500) NOT NULL COMMENT 'URL ảnh slider',
  `link_lien_ket` varchar(500) DEFAULT NULL COMMENT 'Link khi nhấp vào slide',
  `thu_tu` int(11) NOT NULL DEFAULT 0 COMMENT 'Thứ tự slide',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Slider banner carousel trang chủ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slider_trang_chu`
--

LOCK TABLES `slider_trang_chu` WRITE;
/*!40000 ALTER TABLE `slider_trang_chu` DISABLE KEYS */;
INSERT INTO `slider_trang_chu` (`id`, `ten_slide`, `hinh_anh_url`, `link_lien_ket`, `thu_tu`) VALUES (1,'Chào mừng đến với Khoa Công nghệ Thông tin','assets/images/uploads/upload-1786726306485-45133040.jpg','#programs-section',1),(2,'Tuyển sinh ngành Công nghệ thông tin & Trí tuệ nhân tạo','assets/images/uploads/upload-1786726296323-553195245.jpg','../dai-hoc/',2),(3,'Vận động xây dựng Trung tâm Sinh hoạt Sinh viên','assets/images/uploads/upload-1786726288745-901162225.jpg','#',3);
/*!40000 ALTER TABLE `slider_trang_chu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `su_menh_tam_nhin`
--

DROP TABLE IF EXISTS `su_menh_tam_nhin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `su_menh_tam_nhin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loai` enum('su_menh','tam_nhin') NOT NULL,
  `tieu_de` varchar(100) NOT NULL COMMENT 'Sứ mệnh / Tầm nhìn 2030',
  `noi_dung` text NOT NULL COMMENT 'Nội dung chi tiết',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Khối Sứ mệnh và Tầm nhìn 2030';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `su_menh_tam_nhin`
--

LOCK TABLES `su_menh_tam_nhin` WRITE;
/*!40000 ALTER TABLE `su_menh_tam_nhin` DISABLE KEYS */;
/*!40000 ALTER TABLE `su_menh_tam_nhin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tai_khoan_admin_google`
--

DROP TABLE IF EXISTS `tai_khoan_admin_google`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tai_khoan_admin_google` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID Quản trị viên',
  `google_id` varchar(255) NOT NULL COMMENT 'Google Subject ID (sub) từ OAuth token',
  `email` varchar(200) NOT NULL COMMENT 'Email Google dùng đăng nhập',
  `ho_ten` varchar(200) NOT NULL COMMENT 'Họ và tên hiển thị',
  `avatar_url` varchar(500) DEFAULT NULL COMMENT 'URL ảnh đại diện Google',
  `quyen_han` varchar(50) NOT NULL DEFAULT 'SUPER_ADMIN' COMMENT 'Quyền hạn (SUPER_ADMIN...)',
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1: Hoạt động, 0: Khóa',
  `lan_dang_nhap_cuoi` datetime DEFAULT NULL COMMENT 'Thời điểm đăng nhập gần nhất',
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Ngày tạo tài khoản',
  `ngay_cap_nhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `google_id` (`google_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tài khoản Admin đăng nhập qua Google OAuth';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tai_khoan_admin_google`
--

LOCK TABLES `tai_khoan_admin_google` WRITE;
/*!40000 ALTER TABLE `tai_khoan_admin_google` DISABLE KEYS */;
INSERT INTO `tai_khoan_admin_google` (`id`, `google_id`, `email`, `ho_ten`, `avatar_url`, `quyen_han`, `trang_thai`, `lan_dang_nhap_cuoi`, `ngay_tao`, `ngay_cap_nhat`) VALUES (1,'111111111111111111111','lamnn@tvu.edu.vn','TS. Nguyễn Nhứt Lam','assets/images/deans/lamnn.jpg','SUPER_ADMIN',1,NULL,'2026-08-14 23:36:32','2026-08-14 23:36:32'),(2,'107302810636799811310','khoacntttvu@gmail.com','KHOA CNTT','https://lh3.googleusercontent.com/a/ACg8ocIPNhEK2z68XZ-HzbuiTvjWVJZnzMERhYY3CjCVghdPZekd3w=s96-c','SUPER_ADMIN',1,'2026-08-29 00:31:23','2026-08-19 00:50:06','2026-08-29 00:31:23');
/*!40000 ALTER TABLE `tai_khoan_admin_google` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tai_khoan_nhan_vien`
--

DROP TABLE IF EXISTS `tai_khoan_nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tai_khoan_nhan_vien` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID tài khoản nhân viên',
  `nhan_vien_id` int(11) NOT NULL COMMENT 'FK liên kết tới bảng nhan_vien',
  `email` varchar(200) NOT NULL COMMENT 'Email đăng nhập hệ thống',
  `mat_khau_hash` varchar(255) NOT NULL COMMENT 'Mật khẩu mã hóa (Bcrypt/Argon2)',
  `nguoi_tao_admin_id` int(11) NOT NULL COMMENT 'FK ID Admin khởi tạo tài khoản này',
  `quyen_han` varchar(50) NOT NULL DEFAULT 'STAFF_EDITOR' COMMENT 'Quyền hạn (STAFF_EDITOR...)',
  `trang_thai` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1: Hoạt động, 0: Khóa',
  `phai_doi_mat_khau` tinyint(1) NOT NULL DEFAULT 1,
  `lan_dang_nhap_cuoi` datetime DEFAULT NULL COMMENT 'Thời điểm đăng nhập gần nhất',
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Ngày Admin tạo tài khoản',
  `ngay_cap_nhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nhan_vien_id` (`nhan_vien_id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_tk_nhanvien_admin` (`nguoi_tao_admin_id`),
  CONSTRAINT `fk_tk_nhanvien_admin` FOREIGN KEY (`nguoi_tao_admin_id`) REFERENCES `tai_khoan_admin_google` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_tk_nhanvien_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tài khoản Nhân viên/Giảng viên đăng nhập Email & Mật khẩu';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tai_khoan_nhan_vien`
--

LOCK TABLES `tai_khoan_nhan_vien` WRITE;
/*!40000 ALTER TABLE `tai_khoan_nhan_vien` DISABLE KEYS */;
INSERT INTO `tai_khoan_nhan_vien` (`id`, `nhan_vien_id`, `email`, `mat_khau_hash`, `nguoi_tao_admin_id`, `quyen_han`, `trang_thai`, `phai_doi_mat_khau`, `lan_dang_nhap_cuoi`, `ngay_tao`, `ngay_cap_nhat`) VALUES (1,10,'vankhanh@tvu.edu.vn','$2b$12$8rC/eBC5P26apKdtw1TlNe75wdEYcg5BhBepaO.ttP.PErrnYK71C',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:18','2026-08-19 00:34:18'),(2,11,'phuocmien@tvu.edu.vn','$2b$12$Jr2CgEbeN2ohUVn01dtU..hVCXSrOjct2c8okuYtjmp4rJToiClkW',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:18','2026-08-19 00:34:18'),(3,12,'hattvi201084@tvu.edu.vn','$2b$12$OnNW4pvBmn4vrnMyECUE/u/b/lLd2zzyGNzCgkNf3E8lf1125FRuO',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:19','2026-08-19 00:34:19'),(4,13,'hvthanh@tvu.edu.vn','$2b$12$0byu3PASoi3tShyV7/SubO5Jt7sAJP53x1l3GiqXJ92fz5N/4TLue',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:19','2026-08-19 00:34:19'),(5,14,'nhutkhau@tvu.edu.vn','$2b$12$9uISUKrpBaMFggXypQei4OVW9b0xmjcOpDGbDajRxwwx3c8We2g9e',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:19','2026-08-19 00:34:19'),(6,15,'lmtu@tvu.edu.vn','$2b$12$DQ5oGUyDGCElKvhMykRR9Oy1Qw8CvtW39sEOdbUOplCLYL7Lsdz3i',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:20','2026-08-19 00:34:20'),(7,16,'lpdu@tvu.edu.vn','$2b$12$xHA/LgIVGYHt7O0MlD7EtOfcKGBUOv5hnNsOObYvaggUnGnCZ.vJC',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:20','2026-08-19 00:34:20'),(8,17,'huyngocntt@tvu.edu.vn','$2b$12$DIdfIFNknDhdhEczesbcAef.GRYitNEz5ImzFeeFZp7rLiHDh5YSi',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:20','2026-08-19 00:34:20'),(9,18,'nhiemnb@tvu.edu.vn','$2b$12$Dv.feAbHBKbSofIFQWr51.nff/wz0FAViNSiUdNovf.yD8F9dV74u',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:21','2026-08-19 00:34:21'),(10,19,'thiennhd@tvu.edu.vn','$2b$12$s2TzN.OEgPO9dGiDj3PdG.YvKSyTaBtJt8A1OAL.AbNNjz2Ia8dw.',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:21','2026-08-19 00:34:21'),(11,20,'nkquoc@tvu.edu.vn','$2b$12$Ip0.7IiQY5YC4qH3X3XK4OuKqa5iGOLBx19tUUoGZZ5x7clSZQ3Ay',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:21','2026-08-19 00:34:21'),(12,21,'hientvu@tvu.edu.vn','$2b$12$eQAX40k98iXBBHIf.taY3uBRhyws.aj2DXlJz7koEu6Xr2DY6IkIS',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:22','2026-08-19 00:34:22'),(13,22,'ngocdanthanhdt@tvu.edu.vn','$2b$12$9wfk.nnGosiXnZVNzs5DQeT6CYgO7xdEEivMw4VUchhIg6vyyThK.',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:22','2026-08-19 00:34:22'),(14,4,'lamnn@tvu.edu.vn','$2b$12$1yymGMRw/dVRcp2kV3BEDeyD4DCkH.SAp7CDFOSijNUsjBIA6bdYy',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:22','2026-08-19 00:34:22'),(15,23,'phattai@tvu.edu.vn','$2b$12$9aJHX4gWlsmTOoNflKFPr.Xjw9KJvcH2S2ieCK/dxf9QSjlhrdCui',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:23','2026-08-19 00:34:23'),(16,24,'diemhanh_tvu@tvu.edu.vn','$2b$12$aNxASrLxvs5fNqnmbFPIW.wY90iVQQYNrkE6WqIuJCB2Q1iyxaXMG',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:23','2026-08-19 00:34:23'),(17,25,'duongminh@tvu.edu.vn','$2b$12$lkXYmcREI4/fPp2JpSABk.2YPQydPanPNIwHoqbsVLY17iTNrzRn.',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:23','2026-08-19 00:34:23'),(18,26,'pttmai@tvu.edu.vn','$2b$12$t7GoiwC5GdDvxtrqA3/Mg.0fna2uEtTEGqVSICKe5fIOVO1cbGMUa',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:24','2026-08-19 00:34:24'),(19,27,'ptpnam@tvu.edu.vn','$2b$12$PwHoldVrSWE2Dl0F7k.UPOgHftIAHddVOnpiZ/fJY/86dU505pjvi',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:24','2026-08-19 00:34:24'),(21,29,'tramhoangnam@tvu.edu.vn','$2b$12$K11vfbN1NrzCuWJu2XO.g.o8F4PeqDbVdRptxm/yTVV22WJYMYT8O',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:25','2026-08-19 00:34:25'),(22,30,'namtv@tvu.edu.vn','$2b$12$Ayb3gnnhVrxzFCWfGR/cwe3MIABnvBIMBZWwTIDMo59Ice15VY7TS',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:25','2026-08-19 00:34:25'),(23,31,'tqviettv@tvu.edu.vn','$2b$12$I1hiAG8DdTHKUnV0HTzonejsQecAmvQceHsiaamcXhxKqPiGzJ4a.',1,'STAFF_EDITOR',1,1,NULL,'2026-08-19 00:34:25','2026-08-19 00:34:25'),(24,32,'vothanhc@tvu.edu.vn','$2b$12$5jCPD/uJ0sLxpiyaJGxyKembaqbynuymxO/vTq23yNr5hP8vPbQhS',1,'STAFF_EDITOR',1,1,'2026-08-19 22:47:23','2026-08-19 00:34:25','2026-08-19 22:47:23');
/*!40000 ALTER TABLE `tai_khoan_nhan_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thong_ke_noi_bat`
--

DROP TABLE IF EXISTS `thong_ke_noi_bat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thong_ke_noi_bat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_chi_so` varchar(100) NOT NULL COMMENT 'Sinh viên, Đề tài NCKH, Bài báo...',
  `so_lieu_thong_ke` int(11) NOT NULL DEFAULT 0 COMMENT 'Số đếm thống kê',
  `don_vi` varchar(20) DEFAULT NULL COMMENT 'Đơn vị (+, %)',
  `ghi_chu_thoi_gian` varchar(150) NOT NULL DEFAULT 'Số liệu thống kê đến tháng 12/2025',
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Số liệu thống kê đếm số nổi bật trang chủ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_ke_noi_bat`
--

LOCK TABLES `thong_ke_noi_bat` WRITE;
/*!40000 ALTER TABLE `thong_ke_noi_bat` DISABLE KEYS */;
INSERT INTO `thong_ke_noi_bat` (`id`, `ten_chi_so`, `so_lieu_thong_ke`, `don_vi`, `ghi_chu_thoi_gian`, `thu_tu`) VALUES (1,'Sinh viên đang theo học',1200,'+','Tính đến tháng 12/2025',1),(2,'Giảng viên chuyên môn',45,'','Tính đến tháng 12/2025',2),(3,'Đề tài NCKH các cấp',28,'+','Tính đến tháng 12/2025',3),(4,'Tỷ lệ sinh viên có việc làm',95,'%','Khảo sát sau 1 năm tốt nghiệp',4),(5,'Sinh viên CNTT khóa 2022 tốt nghiệp',96,'%','',0);
/*!40000 ALTER TABLE `thong_ke_noi_bat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thong_ke_sau_dai_hoc_chartsy`
--

DROP TABLE IF EXISTS `thong_ke_sau_dai_hoc_chartsy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thong_ke_sau_dai_hoc_chartsy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de_bieu_do` varchar(255) NOT NULL COMMENT 'Số lượng HV & NCS qua các khóa...',
  `moc_thoi_gian_tinh` varchar(100) NOT NULL DEFAULT 'Dữ liệu tính đến tháng 7 năm 2026',
  `chart_config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Cấu hình ApexCharts JSON' CHECK (json_valid(`chart_config_json`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thống kê học viên và NCS qua các khóa (Chartsy)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_ke_sau_dai_hoc_chartsy`
--

LOCK TABLES `thong_ke_sau_dai_hoc_chartsy` WRITE;
/*!40000 ALTER TABLE `thong_ke_sau_dai_hoc_chartsy` DISABLE KEYS */;
/*!40000 ALTER TABLE `thong_ke_sau_dai_hoc_chartsy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thong_ke_sinh_vien_dai_hoc`
--

DROP TABLE IF EXISTS `thong_ke_sinh_vien_dai_hoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thong_ke_sinh_vien_dai_hoc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nganh_id` int(11) NOT NULL,
  `khoa` varchar(10) NOT NULL,
  `so_sinh_vien` int(11) NOT NULL DEFAULT 0,
  `so_tot_nghiep` int(11) NOT NULL DEFAULT 0,
  `so_dung_tien_do` int(11) NOT NULL DEFAULT 0,
  `so_tot_nghiep_som` int(11) NOT NULL DEFAULT 0,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_tksvdh_nganh` (`nganh_id`),
  CONSTRAINT `fk_tksvdh_nganh` FOREIGN KEY (`nganh_id`) REFERENCES `chuong_trinh_dao_tao_dai_hoc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_ke_sinh_vien_dai_hoc`
--

LOCK TABLES `thong_ke_sinh_vien_dai_hoc` WRITE;
/*!40000 ALTER TABLE `thong_ke_sinh_vien_dai_hoc` DISABLE KEYS */;
INSERT INTO `thong_ke_sinh_vien_dai_hoc` (`id`, `nganh_id`, `khoa`, `so_sinh_vien`, `so_tot_nghiep`, `so_dung_tien_do`, `so_tot_nghiep_som`, `thu_tu`) VALUES (39,1,'Khóa 20',200,187,200,200,0),(40,1,'Khóa 21',250,240,250,0,0);
/*!40000 ALTER TABLE `thong_ke_sinh_vien_dai_hoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thong_tin_su_kien_tieu_diem`
--

DROP TABLE IF EXISTS `thong_tin_su_kien_tieu_diem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thong_tin_su_kien_tieu_diem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ngay_su_kien` varchar(50) NOT NULL COMMENT 'Ngày sự kiện (19-07-2026...)',
  `tieu_de_su_kien` varchar(500) NOT NULL COMMENT 'Nội dung sự kiện tóm tắt',
  `link_chi_tiet` varchar(500) DEFAULT NULL,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ticker thông tin sự kiện tiêu điểm trang chủ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_tin_su_kien_tieu_diem`
--

LOCK TABLES `thong_tin_su_kien_tieu_diem` WRITE;
/*!40000 ALTER TABLE `thong_tin_su_kien_tieu_diem` DISABLE KEYS */;
INSERT INTO `thong_tin_su_kien_tieu_diem` (`id`, `ngay_su_kien`, `tieu_de_su_kien`, `link_chi_tiet`, `thu_tu`) VALUES (1,'10/10/2026 đến hết 30/09/2026','📢 CUỘC THI OLYMPIC TIN HỌC VÀ TRÍ TUỆ NHÂN TẠO – ĐẠI HỌC TRÀ VINH NĂM 2026','https://www.facebook.com/share/p/1B8KwMJ12A/',0);
/*!40000 ALTER TABLE `thong_tin_su_kien_tieu_diem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thong_tin_tuyen_sinh`
--

DROP TABLE IF EXISTS `thong_tin_tuyen_sinh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thong_tin_tuyen_sinh` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de_box` varchar(255) NOT NULL DEFAULT '? Tuyển sinh 2026',
  `noi_dung_day_du` text NOT NULL COMMENT 'Văn bản mô tả đầy đủ',
  `ma_nganh_ai` varchar(20) NOT NULL DEFAULT '7480107',
  `ma_nganh_cs` varchar(20) NOT NULL DEFAULT '7480101',
  `to_hop_xet_tuyen` varchar(255) NOT NULL COMMENT 'Các tổ hợp xét tuyển A00, A01, X06, X26',
  `diem_chuan_2025_ai` decimal(4,2) NOT NULL DEFAULT 23.04,
  `diem_chuan_2025_cs` decimal(4,2) NOT NULL DEFAULT 23.07,
  `chi_tieu_2026_ai` int(11) NOT NULL DEFAULT 200,
  `chi_tieu_2026_cs` int(11) NOT NULL DEFAULT 83,
  `lien_he_tuyen_sinh` varchar(255) NOT NULL COMMENT 'Kênh liên hệ hỗ trợ',
  `an_hien` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông tin chi tiết box Tuyển sinh 2026';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_tin_tuyen_sinh`
--

LOCK TABLES `thong_tin_tuyen_sinh` WRITE;
/*!40000 ALTER TABLE `thong_tin_tuyen_sinh` DISABLE KEYS */;
/*!40000 ALTER TABLE `thong_tin_tuyen_sinh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tin_tuc`
--

DROP TABLE IF EXISTS `tin_tuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tin_tuc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wp_post_id` int(11) DEFAULT NULL COMMENT 'ID bài viết WordPress gốc',
  `tieu_de` varchar(500) NOT NULL COMMENT 'Tiêu đề bài đăng tin tức',
  `slug` varchar(500) DEFAULT NULL COMMENT 'URL slug chi tiết',
  `ngay_dang` date NOT NULL COMMENT 'Ngày đăng bài',
  `nhan_lon` varchar(100) DEFAULT NULL COMMENT 'Label ngày lớn timeline (23/7/2026)',
  `nhan_nho` varchar(200) DEFAULT NULL COMMENT 'Label nhỏ (FJCAI 2026, Địa điểm)',
  `noi_dung_html` longtext NOT NULL COMMENT 'Nội dung chi tiết bài viết (HTML)',
  `tom_tat` text DEFAULT NULL COMMENT 'Tóm tắt ngắn bài đăng',
  `icon_svg` text DEFAULT NULL COMMENT 'Mã SVG Icon timeline',
  `huong_hien_thi` enum('left','right') NOT NULL DEFAULT 'right' COMMENT 'Vị trí trên timeline',
  `co_nhan_nho` tinyint(1) NOT NULL DEFAULT 0,
  `an_hien` tinyint(1) NOT NULL DEFAULT 1,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `redirect_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bài đăng tin tức và timeline Hoạt động khoa';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tin_tuc`
--

LOCK TABLES `tin_tuc` WRITE;
/*!40000 ALTER TABLE `tin_tuc` DISABLE KEYS */;
INSERT INTO `tin_tuc` (`id`, `wp_post_id`, `tieu_de`, `slug`, `ngay_dang`, `nhan_lon`, `nhan_nho`, `noi_dung_html`, `tom_tat`, `icon_svg`, `huong_hien_thi`, `co_nhan_nho`, `an_hien`, `thu_tu`, `ngay_tao`, `ngay_cap_nhat`, `redirect_url`) VALUES (3,NULL,'📢 CUỘC THI OLYMPIC TIN HỌC VÀ TRÍ TUỆ NHÂN TẠO – ĐẠI HỌC TRÀ VINH NĂM 2026','cuoc-thi-olympic-tin-hoc-va-tri-tue-nhan-tao-dai-hoc-tra-vinh-nam-2026-1787940013499','2026-08-25','27/08/2026','Tin tức','📢 CUỘC THI OLYMPIC TIN HỌC VÀ TRÍ TUỆ NHÂN TẠO – ĐẠI HỌC TRÀ VINH NĂM 2026\nNhằm tạo sân chơi học thuật, phát huy năng lực lập trình, tư duy sáng tạo và khả năng ứng dụng trí tuệ nhân tạo, Đại học Trà Vinh tổ chức Cuộc thi Olympic Tin học và Trí tuệ nhân tạo năm 2026 dành cho sinh viên và học sinh.\n🏆 Cuộc thi gồm 05 khối thi:\n1. Khối Lập trình Sinh viên Chuyên tin\n2. Khối Lập trình Sinh viên Không chuyên tin\n3. Khối Lập trình Học sinh THPT\n4. Khối Olympic Trí tuệ nhân tạo\n5. Khối Học tập và Nghiên cứu cùng AI\n📅 Thời gian thi: 10/10/2026\n⏰ Hạn đăng ký: đến hết ngày 30/09/2026\n📝 Cách thức đăng ký:\nKhối Lập trình Học sinh THPT: đăng ký qua email: oane@tvu.edu.vn\nCác khối còn lại: đăng ký trực tuyến bằng mã QR trên poster.\n🏅 Cơ cấu giải thưởng cho mỗi khối thi:\n🥇 01 Giải Nhất: 1.800.000 đồng\n🥈 01 Giải Nhì: 1.600.000 đồng\n🥉 01 Giải Ba: 1.200.000 đồng\n🏵️ 01 Giải Khuyến khích: 800.000 đồng\n☎️ Mọi thắc mắc liên hệ:\nTS. Thạch Kong Saoane\nmail: oane@tvu.edu.vn\n🔥 Các bạn sinh viên và học sinh yêu thích lập trình, công nghệ và AI, hãy đăng ký tham gia, thử sức và chinh phục những thử thách của Olympic năm nay!','📢 **Olympic Tin học & Trí tuệ nhân tạo TVU 2026** dành cho sinh viên và học sinh, gồm **5 khối thi về lập trình, AI và nghiên cứu cùng AI**.\n\n📅 **Thi:** 10/10/2026 | ⏰ **Đăng ký đến:** 30/09/2026\n🏆 Giải thưởng **800.000 – 1.800.000đ/giải**.\n🤖 Cơ hội thử sức, phát triển kỹ năng **lập trình & AI** tại TVU.\n',NULL,'right',0,1,0,'2026-08-29 00:53:57','2026-08-29 01:00:13','https://www.facebook.com/share/p/1B8KwMJ12A/'),(4,NULL,'GẶP GỠ, GIỚI THIỆU CHƯƠNG TRÌNH ĐÀO TẠO CÔNG NGHỆ THÔNG TIN – KHÓA 2026.','gap-go-gioi-thieu-chuong-trinh-dao-tao-cong-nghe-thong-tin-khoa-2026-1787940170229','2026-08-26','27/08/2026','Tin tức','Chiều ngày 26/8/2026, tại phòng E21.206, Khoa Công nghệ Thông tin tổ chức buổi giới thiệu Chương trình Công nghệ thông tin đại trà và Chương trình Công nghệ thông tin tích hợp tiếng Anh dành cho tân sinh viên khóa 2026.\nTham dự chương trình có TS. Võ Phước Hưng, Hiệu trưởng Trường Kỹ thuật và Công nghệ, Lãnh đạo Khoa Công nghệ Thông tin, quý thầy cô là cố vấn học tập khóa 2026 cùng các anh chị sinh viên và tân sinh viên.\nTại buổi gặp gỡ, TS. Nguyễn Nhứt Lam, Trưởng Khoa Công nghệ Thông tin đã giới thiệu tổng quan về Khoa, chương trình đào tạo, định hướng học tập, cơ hội nghề nghiệp và những kỹ năng sinh viên cần chuẩn bị trong quá trình học đại học.\nChương trình cũng trở nên gần gũi hơn qua những chia sẻ thực tế từ các anh chị sinh viên khóa trước về kinh nghiệm học tập, tham gia hoạt động, rèn luyện kỹ năng và thích nghi với môi trường đại học. Các tân sinh viên đã cùng trao đổi những băn khoăn, lo lắng trong những ngày đầu bước vào giảng đường và nhận được nhiều chia sẻ, định hướng từ quý thầy cô và các anh chị đi trước.\nBuổi gặp gỡ là cơ hội để tân sinh viên hiểu chương trình mình sẽ học, hiểu môi trường mình sẽ đồng hành và tự tin hơn khi bắt đầu hành trình đại học.\nChúc các tân sinh viên Công nghệ Thông tin khóa 2026 có một khởi đầu thật nhiều năng lượng, học tập tốt và có những trải nghiệm đáng nhớ trong những năm tháng sắp tới!','GẶP GỠ, GIỚI THIỆU CHƯƠNG TRÌNH ĐÀO TẠO CÔNG NGHỆ THÔNG TIN – KHÓA 2026.',NULL,'right',0,1,0,'2026-08-29 01:00:06','2026-08-29 01:02:50','https://www.facebook.com/share/p/19ZQZgykbM/'),(5,NULL,'🎉 KHOA CÔNG NGHỆ THÔNG TIN TỔ CHỨC THÀNH CÔNG BÁO CÁO ĐỒ ÁN TỐT NGHIỆP KHÓA 2022. ','khoa-cong-nghe-thong-tin-to-chuc-thanh-cong-bao-cao-do-an-tot-nghiep-khoa-2022-1787940126322','2026-07-09','09/07/2026','Tin tức','Các đề tài tốt nghiệp năm nay được đánh giá có tính thực tiễn cao, tập trung giải quyết các bài toán trong nhiều lĩnh vực như chuyển đổi số, trí tuệ nhân tạo (AI), phân tích dữ liệu, phát triển ứng dụng web và di động, an toàn thông tin cùng nhiều hướng nghiên cứu và công nghệ mới đang được ứng dụng rộng rãi trong thực tế.\nSau quá trình làm việc nghiêm túc và trách nhiệm, 100% sinh viên (95/95) đã hoàn thành phần báo cáo và bảo vệ đồ án thành công.\nTheo đánh giá của các Hội đồng chấm đồ án, đa số đề tài được sinh viên đầu tư công phu từ khâu khảo sát, phân tích, thiết kế đến xây dựng và triển khai hệ thống. Nhiều sản phẩm có đầy đủ chức năng, đáp ứng tốt yêu cầu thực tế, giao diện thân thiện, hiện đại, khả năng vận hành ổn định và có tiềm năng tiếp tục phát triển, ứng dụng trong doanh nghiệp và đời sống.\nKết quả đạt được không chỉ thể hiện sự nỗ lực, tinh thần học tập nghiêm túc của các bạn sinh viên mà còn khẳng định chất lượng đào tạo của Khoa Công nghệ thông tin trong việc gắn kết kiến thức chuyên môn với nhu cầu thực tiễn và xu hướng công nghệ hiện đại.\n🌟 Xin chúc mừng 95 sinh viên khóa 2022 (đợt 1) Khoa Công nghệ thông tin đã hoàn thành một dấu mốc quan trọng trên hành trình học tập. Chúc các bạn luôn tự tin, sáng tạo và gặt hái nhiều thành công trên con đường nghề nghiệp phía trước!','🎉 KHOA CÔNG NGHỆ THÔNG TIN TỔ CHỨC THÀNH CÔNG BÁO CÁO ĐỒ ÁN TỐT NGHIỆP KHÓA 2022.',NULL,'right',0,1,0,'2026-08-29 01:02:06','2026-08-29 01:02:06','https://www.facebook.com/share/p/1Moy9f1xwQ/'),(6,NULL,'Trường Kỹ thuật và Công nghệ tổng kết năm học 2025–2026, triển khai nhiệm vụ năm học 2026–2027 và định hướng đến năm 2030','truong-ky-thuat-va-cong-nghe-tong-ket-nam-hoc-20252026-trien-khai-nhiem-vu-nam-hoc-20262027-va-dinh-huong-den-nam-2030-1787940459292','2026-08-05','06/08/2026','Tin tức','TVU. Ngày 06/8/2026 tại B71.101, Trường Kỹ thuật và Công nghệ – Đại học Trà Vinh tổ chức Hội nghị tổng kết công tác đào tạo năm học 2025–2026, triển khai phương hướng, nhiệm vụ năm học 2026–2027 và định hướng mục tiêu đến năm 2030. \n\nHội nghị là dịp đánh giá toàn diện những kết quả đạt được, nhìn nhận các tồn tại, hạn chế, đồng thời xác định những nhiệm vụ trọng tâm nhằm tiếp tục nâng cao chất lượng đào tạo, nghiên cứu khoa học và phát triển Nhà trường trong giai đoạn mới.','Trường Kỹ thuật và Công nghệ tổng kết năm học 2025–2026',NULL,'right',0,1,0,'2026-08-29 01:06:45','2026-08-29 01:07:39','https://cet.tvu.edu.vn/index.php/tin-tuc-su-kien/truong-ky-thuat-va-cong-nghe-tong-ket-nam-hoc-2025-2026-trien-khai-nhiem-vu-nam-hoc-2026-2027-va-dinh-huong-den-nam-2030');
/*!40000 ALTER TABLE `tin_tuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trang_ca_nhan`
--

DROP TABLE IF EXISTS `trang_ca_nhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trang_ca_nhan` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID trang cá nhân',
  `nhan_vien_id` int(11) NOT NULL COMMENT 'FK liên kết 1-1 với nhan_vien',
  `wp_post_id` int(11) DEFAULT NULL COMMENT 'ID bài viết WordPress (nếu có)',
  `email` varchar(200) DEFAULT NULL COMMENT 'Email liên hệ',
  `ngach_vien_chuc` varchar(100) DEFAULT NULL COMMENT 'Ngạch viên chức',
  `hoc_vi` varchar(50) DEFAULT NULL COMMENT 'Trình độ chuyên môn',
  `hoc_ham` varchar(50) DEFAULT NULL COMMENT 'Học hàm',
  `don_vi_cong_tac` varchar(300) DEFAULT NULL COMMENT 'Đơn vị công tác',
  `linh_vuc_nghien_cuu` text DEFAULT NULL COMMENT 'Tóm tắt các hướng nghiên cứu',
  `google_scholar_url` varchar(500) DEFAULT NULL COMMENT 'Link Google Scholar profile',
  `google_scholar_id` varchar(100) DEFAULT NULL COMMENT 'Scholar ID dùng cho shortcode plugin',
  `orcid_url` varchar(500) DEFAULT NULL COMMENT 'Link ORCID iD',
  `orcid_id` varchar(50) DEFAULT NULL COMMENT 'Mã ORCID',
  `github_url` varchar(500) DEFAULT NULL COMMENT 'Link Github cá nhân',
  `website_ca_nhan` varchar(500) DEFAULT NULL COMMENT 'Link Website cá nhân',
  `ngay_cap_nhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nhan_vien_id` (`nhan_vien_id`),
  CONSTRAINT `fk_trangcanhan_nhanvien` FOREIGN KEY (`nhan_vien_id`) REFERENCES `nhan_vien` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông tin tổng quan trang cá nhân giảng viên';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trang_ca_nhan`
--

LOCK TABLES `trang_ca_nhan` WRITE;
/*!40000 ALTER TABLE `trang_ca_nhan` DISABLE KEYS */;
/*!40000 ALTER TABLE `trang_ca_nhan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trang_chu_chuong_trinh_noi_bat`
--

DROP TABLE IF EXISTS `trang_chu_chuong_trinh_noi_bat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trang_chu_chuong_trinh_noi_bat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `badge_text` varchar(50) NOT NULL COMMENT 'AUN-QA / Nổi bật',
  `nhan_kiem_dinh` varchar(255) NOT NULL COMMENT 'Chương trình đào tạo đạt chuẩn kiểm định AUN-QA',
  `ten_chuong_trinh` varchar(200) NOT NULL COMMENT 'Kỹ sư KHMT, Kỹ sư AI, ThS KHMT, Tiến sĩ KHMT',
  `mo_ta_ngan` text NOT NULL COMMENT 'Mô tả ngắn định hướng',
  `link_chi_tiet` varchar(500) DEFAULT NULL COMMENT 'Link chuyển đến chi tiết',
  `thu_tu` int(11) NOT NULL DEFAULT 0 COMMENT 'Vị trí hiển thị',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='4 khối chương trình đào tạo nổi bật trang chủ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trang_chu_chuong_trinh_noi_bat`
--

LOCK TABLES `trang_chu_chuong_trinh_noi_bat` WRITE;
/*!40000 ALTER TABLE `trang_chu_chuong_trinh_noi_bat` DISABLE KEYS */;
/*!40000 ALTER TABLE `trang_chu_chuong_trinh_noi_bat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trang_chu_hero`
--

DROP TABLE IF EXISTS `trang_chu_hero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trang_chu_hero` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slogan_vi` varchar(255) NOT NULL COMMENT 'Slogan tiếng Việt',
  `slogan_en` varchar(255) NOT NULL COMMENT 'Slogan tiếng Anh',
  `hinh_anh_banner_url` varchar(500) DEFAULT NULL COMMENT 'URL ảnh banner hero',
  `ngay_cap_nhat` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Slogan và banner Hero trang chủ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trang_chu_hero`
--

LOCK TABLES `trang_chu_hero` WRITE;
/*!40000 ALTER TABLE `trang_chu_hero` DISABLE KEYS */;
/*!40000 ALTER TABLE `trang_chu_hero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trang_nckh_header`
--

DROP TABLE IF EXISTS `trang_nckh_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trang_nckh_header` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de_trang` varchar(255) NOT NULL DEFAULT 'Nghiên cứu khoa học',
  `mo_ta_trang` text NOT NULL COMMENT 'Mô tả tổng quan hướng nghiên cứu',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Header trang Nghiên cứu khoa học';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trang_nckh_header`
--

LOCK TABLES `trang_nckh_header` WRITE;
/*!40000 ALTER TABLE `trang_nckh_header` DISABLE KEYS */;
/*!40000 ALTER TABLE `trang_nckh_header` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tuyen_sinh_sau_dai_hoc_thong_bao`
--

DROP TABLE IF EXISTS `tuyen_sinh_sau_dai_hoc_thong_bao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tuyen_sinh_sau_dai_hoc_thong_bao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de_thong_bao` varchar(500) NOT NULL COMMENT 'Thông báo tuyển sinh Tiến sĩ, Thạc sĩ...',
  `link_chi_tiet` varchar(500) DEFAULT NULL,
  `thu_tu` int(11) NOT NULL DEFAULT 0,
  `lien_he_tu_van` varchar(255) NOT NULL DEFAULT 'Khoa Sau Đại học, Đại học Cần Thơ hoặc qua Facebook của Khoa Sau Đại học',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông báo tuyển sinh Sau Đại học 2026';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tuyen_sinh_sau_dai_hoc_thong_bao`
--

LOCK TABLES `tuyen_sinh_sau_dai_hoc_thong_bao` WRITE;
/*!40000 ALTER TABLE `tuyen_sinh_sau_dai_hoc_thong_bao` DISABLE KEYS */;
/*!40000 ALTER TABLE `tuyen_sinh_sau_dai_hoc_thong_bao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'quanly_khoacntt_tvu'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-29  2:26:44


COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
-- End of dump
