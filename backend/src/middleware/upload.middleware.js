/**
 * src/middleware/upload.middleware.js
 * Multer file upload configuration middleware.
 * Saves uploaded images to the frontend's assets/images/uploads/ folder
 * so they are immediately accessible by the web browser without any build step.
 */
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from '../config/index.js';
import { AppError } from '../common/errors/AppError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target the frontend's public assets directory
const UPLOAD_DIR = path.join(__dirname, '../../../frontend/assets/images/uploads');

// Ensure the upload directory exists (create recursively if needed)
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Disk storage engine — generates unique filenames to avoid collisions
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(_req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

// Accept only image MIME types
const fileFilter = (_req, file, cb) => {
  if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Chỉ chấp nhận file ảnh (jpeg, png, webp, gif)!', 400), false);
  }
};

// Configured Multer instance
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxSizeBytes }
}).single('image');

// Wrap multer in a promise so controllers can use async/await
export function handleUpload(req, res) {
  return new Promise((resolve, reject) => {
    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        reject(new AppError(`Lỗi upload: ${err.message}`, 400));
      } else if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
