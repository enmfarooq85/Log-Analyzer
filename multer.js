import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFileId = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${file.fieldname}-${uniqueFileId}-${file.originalname}`;
    req.uploadedFiles = req.uploadedFiles || [];
    req.uploadedFiles.push(path.join("uploads", filename));
    cb(null, filename);
  },
});

const Multer = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (req.files && req.files > 0) {
      return cb(new Error("Please upload the valid plain text files."), false);
    }
    const allowedMimeTypes = ["text/plain"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid file type. Please upload plain txt means (.txt) supported extension file.",
        ),
        false,
      );
    }
    cb(null, true);
  },
});

export default Multer;
