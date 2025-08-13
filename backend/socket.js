import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import multer from "multer";
import s3 from "./s3.js";
import path from "path";
import crypto from "crypto";
import cors from "cors"; // ✅ Add this

dotenv.config();
const app = express();

// ✅ Enable CORS for REST API
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
  credentials: true,
}));

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

    const data = await s3.upload(params).promise();
    console.log(`✅ Uploaded to S3: ${data.Location}`);

    res.json({
      url: data.Location,
      type: file.mimetype.startsWith("video") ? "video" : "image"
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
    io.emit("message", message);
  });

  client.on("photo", (url) => {
    console.log("📩 Received photo URL:", url);
    io.emit("photo", url);
  });

  client.on("video", (url) => {
    console.log("📩 Received video URL:", url);
    io.emit("video", url);
  });

  client.on("disconnect", () => {
    console.log("❌ Client disconnected:", client.id);
  });
});


server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});


