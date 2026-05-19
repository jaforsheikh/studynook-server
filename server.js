import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

/*
MIDDLEWARE
*/
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/*
ROUTES
*/
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("StudyNook Server Running");
});

/*
SERVER
*/
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});