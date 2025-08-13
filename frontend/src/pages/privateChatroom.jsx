import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
const API_BASE = "http://localhost:5000";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to server with ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, { type: "text", data: msg }]);
    });

    socket.on("photo", (imageUrl) => {
      setMessages((prev) => [...prev, { type: "image", data: imageUrl }]);
    });

    socket.on("video", (videoUrl) => {
      setMessages((prev) => [...prev, { type: "video", data: videoUrl }]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      socket.off("photo");
      socket.off("video");
    };
  }, []);

  const sendMessage = () => {
    if (text.trim()) {
      socket.emit("message", text);
      setMessages((prev) => [...prev, { type: "text", data: text }]);
      setText("");
    }
  };

  const uploadToS3 = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error("❌ Error uploading to S3:", err);
      alert("Upload failed. Please try again.");
      return null;
    }
  };

  const sendImage = async () => {
    if (imageFile) {
      setUploadingImage(true);
      const url = await uploadToS3(imageFile);
      if (url) {
        socket.emit("photo", url);
        setMessages((prev) => [...prev, { type: "image", data: url }]);
      }
      setImageFile(null);
      setUploadingImage(false);
    }
  };

  const sendVideo = async () => {
    if (videoFile) {
      setUploadingVideo(true);
      const url = await uploadToS3(videoFile);
      if (url) {
        socket.emit("video", url);
        setMessages((prev) => [...prev, { type: "video", data: url }]);
      }
      setVideoFile(null);
      setUploadingVideo(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: 600, margin: "auto" }}>
      {/* Chat Messages */}
      <div
        style={{
          border: "1px solid #ccc",
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
          padding: "10px",
          backgroundColor: "#f9f9f9",
          borderRadius: 8,
        }}
      >
        {messages.map((msg, idx) => {
          if (msg.type === "text")
            return (
              <p key={idx} style={{ padding: "6px 8px", background: "#e1ffc7", borderRadius: 5, marginBottom: 4 }}>
                {msg.data}
              </p>
            );
          if (msg.type === "image")
            return (
              <img
                key={idx}
                src={msg.data}
                alt="sent"
                style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 10 }}
              />
            );
          if (msg.type === "video")
            return (
              <video
                key={idx}
                src={msg.data}
                controls
                style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 10 }}
              />
            );
          return null;
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Text Input */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        style={{ padding: "10px", width: "70%", borderRadius: 5, border: "1px solid #ccc" }}
      />
      <button
        onClick={sendMessage}
        style={{ padding: "10px 15px", marginLeft: 8, borderRadius: 5, cursor: "pointer" }}
        disabled={!text.trim()}
      >
        Send
      </button>

      {/* Image Upload */}
      <div style={{ marginTop: "15px" }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          disabled={uploadingImage}
        />
        <button onClick={sendImage} disabled={!imageFile || uploadingImage} style={{ marginLeft: 8 }}>
          {uploadingImage ? "Uploading..." : "Send Image"}
        </button>
      </div>

      {/* Video Upload */}
      <div style={{ marginTop: "15px" }}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          disabled={uploadingVideo}
        />
        <button onClick={sendVideo} disabled={!videoFile || uploadingVideo} style={{ marginLeft: 8 }}>
          {uploadingVideo ? "Uploading..." : "Send Video"}
        </button>
      </div>
    </div>
  );
}








