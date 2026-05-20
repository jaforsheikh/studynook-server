import { ObjectId } from "mongodb";
import { bookingsCollection, roomsCollection } from "../server.js";

/*
CREATE BOOKING WITH CONFLICT DETECTION
*/
export const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      roomTitle,
      roomImage,
      location,
      date,
      startTime,
      endTime,
      selectedSlots,
      totalPrice,
    } = req.body;

    if (!roomId || !date || !selectedSlots || selectedSlots.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Room, date, and time slots are required",
      });
    }

    const room = await roomsCollection.findOne({
      _id: new ObjectId(roomId),
    });

    if (!room) {
      return res.status(404).send({
        success: false,
        message: "Room not found",
      });
    }

    const conflict = await bookingsCollection.findOne({
      roomId,
      date,
      status: { $ne: "cancelled" },
      selectedSlots: { $in: selectedSlots },
    });

    if (conflict) {
      return res.status(409).send({
        success: false,
        message: "One or more selected slots are already booked",
      });
    }

    const bookingData = {
      roomId,
      roomTitle: roomTitle || room.title || room.name,
      roomImage: roomImage || room.image,
      location: location || room.location,
      date,
      startTime,
      endTime,
      selectedSlots,
      totalPrice,
      status: "confirmed",
      userEmail: req.user.email,
      userId: req.user.userId,
      createdAt: new Date(),
    };

    const result = await bookingsCollection.insertOne(bookingData);

    await roomsCollection.updateOne(
      { _id: new ObjectId(roomId) },
      { $inc: { bookingCount: 1 } }
    );

    res.status(201).send({
      success: true,
      message: "Booking created successfully",
      bookingId: result.insertedId,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

/*
GET MY BOOKINGS
*/
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingsCollection
      .find({ userEmail: req.user.email })
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
};

/*
CANCEL BOOKING
*/
export const cancelBooking = async (req, res) => {
  try {
    const id = req.params.id;

    const booking = await bookingsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userEmail !== req.user.email) {
      return res.status(403).send({
        success: false,
        message: "Forbidden access",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).send({
        success: false,
        message: "Booking already cancelled",
      });
    }

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      }
    );

    await roomsCollection.updateOne(
      { _id: new ObjectId(booking.roomId) },
      { $inc: { bookingCount: -1 } }
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
      error: error.message,
    });
  }
};

/*
CHECK AVAILABILITY
*/
export const checkAvailability = async (req, res) => {
  try {
    const { roomId, date, selectedSlots } = req.body;

    if (!roomId || !date || !selectedSlots || selectedSlots.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Room, date, and selected slots are required",
      });
    }

    const conflict = await bookingsCollection.findOne({
      roomId,
      date,
      status: { $ne: "cancelled" },
      selectedSlots: { $in: selectedSlots },
    });

    res.send({
      success: true,
      available: !conflict,
      message: conflict
        ? "Selected slot already booked"
        : "Selected slots are available",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to check availability",
    });
  }
};