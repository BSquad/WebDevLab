import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_IMAGE_DIR = path.join(__dirname, '../../uploads/images');

if (!fs.existsSync(BASE_IMAGE_DIR)) {
    fs.mkdirSync(BASE_IMAGE_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderMap: Record<string, string> = {
            user: 'user',
            games: 'games',
            guides: 'guides',
        };

        const subFolder = folderMap[req.body.uploadType] || '';
        const finalPath = path.join(BASE_IMAGE_DIR, subFolder);

        if (!fs.existsSync(finalPath)) {
            fs.mkdirSync(finalPath, { recursive: true });
        }

        cb(null, finalPath);
    },

    filename: (req, file, cb) => {
        const safeName = file.originalname
            .replace(/\s+/g, '_')
            .replace(/[()]/g, '');

        const uniqueName = Date.now() + '-' + safeName;

        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only image uploads are allowed'));
            return;
        }

        cb(null, true);
    },
});
