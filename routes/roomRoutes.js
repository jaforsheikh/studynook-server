import express from "express";

import {
  addRoom,
  deleteRoom,
  getAllRooms,
  getLatestRooms,
  getMyListings,
  getSingleRoom,
  updateRoom,
} from "../controllers/roomController.js";

const router = express.Router();

/*
GET LATEST ROOMS
*/
router.get("/latest", getLatestRooms);

/*
GET MY LISTINGS
*/
router.get("/my-listings/:email", getMyListings);

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
router.post("/", addRoom);

/*
UPDATE ROOM
*/
router.patch("/:id", updateRoom);

/*
DELETE ROOM
*/
router.delete("/:id", deleteRoom);

export default router;