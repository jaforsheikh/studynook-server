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
app.set("trust proxy", 1); // REQUIRED on Render: lets Express honor X-Forwarded-Proto so Secure cookies work

const allowedOrigins = [
  "http://localhost:3000",
  "https://studynook-eight.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// 1) CORS — first, with credentials and the right methods/headers.
app.use(cors({
  origin(origin, callback) {
    // No Origin = same-origin / curl; allow.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 600,
}));

// 2) better-auth handler — BEFORE express.json() / cookieParser().
//    app.use(...) with a path prefix is the simplest pattern in Express 5
//    because better-auth's handler does its own sub-routing internally.
app.use("/api/auth", toNodeHandler(auth));
// (Equivalent Express-5 wildcard if you prefer: app.all("/api/auth/*splat", toNodeHandler(auth)))

// 3) Everything else (these middlewares would otherwise break better-auth's body).
app.use(express.json());
app.use(cookieParser());

// (your application routes)
app.use("/api/rooms",     roomRoutes);
app.use("/api/bookings",  bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (_req, res) => res.send("StudyNook Server Running"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on :${port}`));