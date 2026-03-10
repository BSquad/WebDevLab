import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_IMAGE_DIR = path.join(__dirname, '../../uploads/images');

if (!fs.existsSync(BASE_IMAGE_DIR)) {
    fs.mkdirSync(BASE_IMAGE_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Map the 'uploadType' from the frontend to your folder names
        const folderMap: Record<string, string> = {
            user: 'user',
            game: 'games',
            guide: 'guides',
        };

        const subFolder = folderMap[req.body.uploadType] || '';
        const finalPath = path.join(BASE_IMAGE_DIR, subFolder);

        if (!fs.existsSync(finalPath)) {
            fs.mkdirSync(finalPath, { recursive: true });
        }

        cb(null, finalPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;

        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            //TODO: auch pdfs?
            cb(new Error('Only images allowed'));
        } else {
            cb(null, true);
        }
    },
});
