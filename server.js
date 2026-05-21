import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";

import client, { db } from "./services/mongodb.js";
import { auth } from "./auth.js";

import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookings.routes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://studynook-eight.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// 1) CORS first
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// 2) better-auth handler BEFORE express.json()
app.use("/api/auth", toNodeHandler(auth));

// 3) Other middleware AFTER better-auth
app.use(express.json());
app.use(cookieParser());

export const roomsCollection = db.collection("rooms");
export const bookingsCollection = db.collection("bookings");

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
  }
}

connectDB();

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("StudyNook Server Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});