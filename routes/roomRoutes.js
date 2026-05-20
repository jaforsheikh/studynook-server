import express from "express";

import {
  addRoom,
  getAllRooms,
  getSingleRoom,
} from "../controllers/roomController.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

/*
GET ALL ROOMS
*/

router.get("/", getAllRooms);

/*
GET SINGLE ROOM
*/

router.get("/:id", getSingleRoom);

/*
ADD ROOM
*/

router.post("/", verifyToken, addRoom);

export default router;