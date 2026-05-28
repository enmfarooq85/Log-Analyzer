import express, { Router } from "express";
import fs from "fs";
import path from "path";
import Multer from "./multer.middleware.js";
import FilesCleanup from "./file-cleanup.middleware.js";

// creating express app:
const app = express();

const router = Router();

const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

function isIP(token) {
  const ipRegex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  return ipRegex.test(token);
}

function isStatusCode(token) {
  if (token === "-") return true;
  const num = Number(token);
  return num >= 100 && num <= 599;
}

function isTimestamp(token) {
  const formats = [
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z?$/,
    /^\d{4}\/\d{2}\/\d{2}$/,
    /^\d{2}-[A-Za-z]{3}-\d{4}$/,
    /^\d{10}$/,
  ];

  return formats.some((regex) => regex.test(token));
}

function isResponseTime(token) {
  return (
    /^\d+ms$/.test(token) || /^\d+(\.\d+)?s$/.test(token) || /^\d+$/.test(token)
  );
}

function normalizeResponseTime(time) {
  if (!time) return null;

  if (time.includes("ms")) {
    return parseFloat(time.replace("ms", ""));
  }

  if (time.includes("s")) {
    return parseFloat(time.replace("s", "")) * 1000;
  }

  return parseFloat(Number(time));
}

// creating /uploadFiles:
router.post(
  "/uploadFiles",
  Multer.array("textFiles"),
  FilesCleanup,
  async (req, res) => {
    try {
      const uploadDir = path.join(process.cwd(), "uploads");

      const allParsedLogs = [];

      for (const file of req?.files) {
        const fullFilePath = path.join("uploads", file?.filename);

        const data = fs.readFileSync(fullFilePath, "utf-8");

        const fileLines = data?.split(/\r?\n/);

        for (const line of fileLines) {
          if (!line.trim()) continue;

          if (line.startsWith("at ") || line.startsWith("Error:")) {
            continue;
          }

          let result = {
            timestamp: null,
            ip: null,
            method: null,
            url: null,
            statusCode: null,
            time: null,
            raw: line,
          };

          if (line.startsWith("{") && line.endsWith("}")) {
            try {
              const parsedJson = JSON.parse(line);

              result = {
                timestamp: parsedJson.timestamp || parsedJson.time || null,

                ip: parsedJson.ip || null,

                method: parsedJson.method || null,

                url: parsedJson.url || parsedJson.path || null,

                statusCode: parsedJson.status || null,

                time: parsedJson.time || parsedJson.latency || null,

                raw: line,
              };

              allParsedLogs.push(result);

              continue;
            } catch (err) {
              continue;
            }
          }

          const tokens = line.split(/\s+/);

          for (const token of tokens) {
            if (!result.timestamp && isTimestamp(token)) {
              result.timestamp = token;
            } else if (!result.ip && isIP(token)) {
              result.ip = token;
            } else if (!result.method && httpMethods.includes(token)) {
              result.method = token;
            } else if (
              !result.url &&
              (token.startsWith("/") || token.startsWith("http"))
            ) {
              result.url = token;
            } else if (!result.statusCode && isStatusCode(token)) {
              result.statusCode = token === "-" ? null : Number(token);
            } else if (!result.time && isResponseTime(token)) {
              result.time = token;
            }
          }

          allParsedLogs.push(result);
        }
      }

      // dashborad stats
      const totalRequests = allParsedLogs.length;
      const successRequests = allParsedLogs.filter(
        (log) => log.statusCode >= 200 && log.statusCode < 300,
      ).length;
      const clientErrors = allParsedLogs.filter(
        (log) => log.statusCode >= 400 && log.statusCode < 500,
      ).length;
      const serverErrors = allParsedLogs.filter(
        (log) => log.statusCode >= 500,
      ).length;
      const uniqueIPs = [
        ...new Set(allParsedLogs.map((log) => log.ip).filter(Boolean)),
      ];
      const averageResponseTime = (
        allParsedLogs.reduce((acc, log) => {
          const time = normalizeResponseTime(String(log.time));

          return acc + (time || 0);
        }, 0) / totalRequests
      ).toFixed(2);
      const endpointMap = {};
      allParsedLogs.forEach((log) => {
        if (!log.url) return;
        endpointMap[log.url] = (endpointMap[log.url] || 0) + 1;
      });
      const topEndpoints = Object.entries(endpointMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);

        for (const file of files) {
          const filePath = path.join(uploadDir, file);
          const stats = fs.statSync(filePath);

          if (stats.isFile()) {
            fs.unlinkSync(filePath);
          }
        }
      }

      console.log({
        totalRequests,
        successRequests,
        clientErrors,
        serverErrors,
        uniqueVisitors: uniqueIPs.length,
        averageResponseTime: `${averageResponseTime}ms`,
        topEndpoints,
      });

      return res.status(200).json({
        success: true,
        analytics: {
          totalRequests,
          successRequests,
          clientErrors,
          serverErrors,
          uniqueVisitors: uniqueIPs.length,
          averageResponseTime: `${averageResponseTime}ms`,
          topEndpoints,
        },
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Failed to process log files",
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
