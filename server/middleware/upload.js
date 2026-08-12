import multer from 'multer';
import path from 'path';
import fs from 'fs';

const createDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/images/';
    createDirIfNotExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Storage for files (pdf/doc)
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/files/';
    createDirIfNotExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

// Filter for docs
const docFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Not a valid document file! Please upload a PDF or DOC.'), false);
  }
};

export const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter });
export const uploadFile = multer({ storage: fileStorage, fileFilter: docFilter });
