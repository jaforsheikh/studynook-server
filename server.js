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

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://studynook-eight.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", toNodeHandler(auth));

export const roomsCollection = db.collection("rooms");
export const bookingsCollection = db.collection("bookings");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await client.connect();
  await client.db("admin").command({ ping: 1 });

  isConnected = true;

  console.log("MongoDB Connected Successfully");
}

connectDB().catch((error) => {
  console.log(error);
});

app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("StudyNook Server Running");
});

export default app;

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}