import express from "express";
import { ObjectId } from "mongodb";
import { bookingsCollection, roomsCollection } from "../server.js";

const router = express.Router();

/*
CREATE BOOKING + CONFLICT CHECK
*/
router.post("/", async (req, res) => {
  try {
    const {
      roomId,
      roomName,
      bookingDate,
      slots,
      totalPrice,
      userEmail,
      userName,
    } = req.body;

    if (!roomId || !bookingDate || !slots?.length || !userEmail) {
      return res.status(400).send({
        success: false,
        message: "Missing required booking data",
      });
    }

    const conflict = await bookingsCollection.findOne({
      roomId,
      bookingDate,
      status: "confirmed",
      slots: { $in: slots },
    });

    if (conflict) {
      return res.status(409).send({
        success: false,
        message: "This room already has a booking for selected slot.",
      });
    }

    const booking = {
      roomId,
      roomName,
      bookingDate,
      slots,
      totalPrice,
      userEmail,
      userName,
      status: "confirmed",
      createdAt: new Date(),
    };

    const result = await bookingsCollection.insertOne(booking);

    if (ObjectId.isValid(roomId)) {
      await roomsCollection.updateOne(
        { _id: new ObjectId(roomId) },
        { $inc: { bookingCount: 1 } }
      );
    }

    res.status(201).send({
      success: true,
      message: "Booking confirmed successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Booking failed",
    });
  }
});

/*
GET MY BOOKINGS
*/
router.get("/my-bookings/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const bookings = await bookingsCollection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    res.send({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
});

/*
CANCEL BOOKING
*/
router.patch("/:id/cancel", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      }
    );

    res.send({
      success: true,
      message: "Booking cancelled successfully",
      result,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to cancel booking",
    });
  }
});

export default router;