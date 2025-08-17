import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import multer from "multer";
import s3 from "./s3.js";
import path from "path";
import crypto from "crypto";
import cors from "cors";

dotenv.config();
const app = express();

// ✅ Enable CORS for REST API
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
  },
});

// Multer in-memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload route with signed URL
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send({ error: "No file uploaded" });

    const fileExt = path.extname(file.originalname);
    const fileName = crypto.randomBytes(16).toString("hex") + fileExt;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload (private by default)
    await s3.upload(params).promise();

    // Generate signed URL (valid 1 hour)
    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Expires: 60 * 60,
    });

    console.log(`✅ Uploaded to S3 (private). Signed URL: ${signedUrl}`);

    // Tell frontend what type it is
    const mediaType = file.mimetype.startsWith("video") ? "video" : "photo";

    // Broadcast to all connected clients via socket
    io.emit(mediaType, signedUrl);

    // Respond back to uploader
    res.json({
      url: signedUrl,
      type: mediaType,
    });
  } catch (err) {
    console.error("❌ Error uploading file:", err);
    res.status(500).send({ error: "Upload failed" });
  }
});

io.on("connection", (client) => {
  console.log("✅ Client connected:", client.id);

  client.on("message", (message) => {
    console.log("📩 Received text:", message);
    io.emit("message", message); // broadcast text
  });

  client.on("disconnect", () => {
    console.log("❌ Client disconnected:", client.id);
  });
});




