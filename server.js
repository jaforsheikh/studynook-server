import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import bookingsRoutes from "./routes/bookings.routes.js";

import client from "./services/mongodb.js";
import { auth } from "./auth.js";

import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", toNodeHandler(auth));

app.use(express.json());
app.use(cookieParser());

const database = client.db("studynookDB");

export const roomsCollection = database.collection("rooms");
export const bookingsCollection = database.collection("bookings");

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("StudyNook Server Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});