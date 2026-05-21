import express from "express";

import {
  createBooking,
  getMyBookings,
  cancelBooking,
  checkAvailability,
} from "../controllers/bookingController.js";

const router = express.Router();

/*
CREATE BOOKING
POST /api/bookings
*/
router.post("/", createBooking);

/*
GET MY BOOKINGS BY EMAIL
GET /api/bookings/my-bookings/:email
*/
router.get("/my-bookings/:email", getMyBookings);

/*
CANCEL BOOKING
PATCH /api/bookings/:id/cancel
*/
router.patch("/:id/cancel", cancelBooking);

/*
CHECK AVAILABILITY
POST /api/bookings/check-availability
*/
router.post("/check-availability", checkAvailability);

export default router;