import express from "express";
import verifyToken from "../middleware/verifyToken.js";

import {
  createBooking,
  getMyBookings,
  cancelBooking,
  checkAvailability,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/my-bookings", verifyToken, getMyBookings);
router.patch("/:id/cancel", verifyToken, cancelBooking);
router.post("/check-availability", checkAvailability);

export default router;