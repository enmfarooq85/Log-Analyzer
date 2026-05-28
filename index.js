import express, { Router } from "express";
import fs from "fs";
import path from "path";
import Multer from "./multer.js";
import FilesCleanup from "./file-cleanup.middleware.js";

// creating express app:
const app = express();

const router = Router();

// creating /server api to test that either server is running or not:
router.post(
  "/uploadFiles",
  Multer.array("textFiles"),
  FilesCleanup,
  (req, res) => {
    try {
      const uploadDir = path.join(process.cwd(), "uploads");

      // console.log("All Files...", req?.files);
      // console.log("File Encoding Type...", req?.files[1]?.filename);
      // console.log("All Files Counts...",req?.files?.length);

      // looping overeach file
      for (let i = 0; i < req?.files?.length; i++) {
        // file path
        let fileName = req?.files[i].filename;
        // combining folder with file name to read the files correctly
        let fullFilePath = path.join("uploads", fileName);

        let data = fs.readFileSync(fullFilePath, "utf-8");
        console.log(data);
      }

      // 
      if (fs.existsSync(uploadDir)) {
        fs.rmdirSync(uploadDir, { recursive: true });
      }

      return res.send({
        status: 200,
        message: "File processing has been done successfully.",
      });
    } catch (error) {
      res.send({
        status: 500,
        message:
          "An error has been occured while processing the log file. Please try again.",
      });
    }
  },
);

// setting a global prefix to write /api/ before each api endpoint except thost endpoints that are written with app object like on line number 28:
app.use("/api/", router);

app.get("/", (req, res) => {
  try {
    return res.send({
      status: 200,
      message: "Server is running perfectly.",
    });
  } catch (error) {
    res.send({
      status: 500,
      message: "Something went wrong.",
    });
  }
});

// assiging PORT:
const PORT = process.env?.PORT || 5000;

// creating express server
app.listen(PORT, () => {
  console.log(`Server is running on PORT:- http://localhost:${PORT}`);
});
