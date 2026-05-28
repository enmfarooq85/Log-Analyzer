// Libraries Imports
import fs from "fs";
import path from "path";

const FilesCleanup = (req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode !== 200 && req.uploadedFiles) {
      req.uploadedFiles.forEach((filePath) => {
        const absolutePath = path.join(process.cwd(), "src", filePath);
        if (fs.existsSync(absolutePath)) {
          fs.unlink(absolutePath, () => {});
        }
      });
    }
  });
  next();
};

export default FilesCleanup;