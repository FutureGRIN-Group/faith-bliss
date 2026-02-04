// src/server.ts

import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket/socket";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import matchRoutes from "./routes/matchRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messageRoutes from "./routes/messagesRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import photoRoutes from "./routes/photoRoutes";
import storyRoutes from "./routes/storyRoutes";

// Custom Firebase authentication middleware
import { protect } from "./middleware/authMiddleware";

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS & Socket.IO
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter((origin): origin is string => !!origin);

// Create HTTP server
const httpServer = http.createServer(app);

// SOCKET.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
initializeSocketIO(io);

// 🔑 Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn("⚠️  MONGO_URI not defined in .env. Skipping DB connection.");
      return;
    }
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    console.warn("⚠️  Server running in 'No Database' mode. API calls requiring DB will fail.");
    // Removed process.exit(1) to allow server to start without DB
  }
};

// Health Route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "Server Running",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    service: "Faithbliss Backend",
  });
});

// 🎯 Main Routes
app.use("/api/auth", authRoutes); // Public auth routes
app.use("/api/users", protect, userRoutes); // Protected user routes
app.use("/api/users/photos", protect, photoRoutes); // Protected photo routes
app.use("/api/matches", protect, matchRoutes);
app.use("/api/conversations", protect, conversationRoutes);
app.use("/api/messages", protect, messageRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/stories", protect, storyRoutes);

// 404 Handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized Error Handler
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer Error:", err.message);
      return res.status(400).json({
        message: `File upload error: ${err.message}`,
        code: err.code,
      });
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message || "Internal server error",
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
  }
);

// Start server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`⚡ Server running on port ${PORT} (HTTP + WebSocket)`);
  });
});
