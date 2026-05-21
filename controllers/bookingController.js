import { ObjectId } from "mongodb";
import { db } from "../services/mongodb.js";

const bookingsCollection = db.collection("bookings");
const roomsCollection = db.collection("rooms");

/*
CREATE BOOKING WITH CONFLICT DETECTION
*/
export const createBooking = async (req, res) => {
  try {
    const bookingBody = req.body;

    const roomId = bookingBody.roomId;
    const bookingDate = bookingBody.bookingDate || bookingBody.date;
    const slots = bookingBody.slots || bookingBody.selectedSlots || [];
    const userEmail = bookingBody.userEmail;
    const userName = bookingBody.userName || "";

    if (!roomId || !bookingDate || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Room, date, and time slots are required",
      });
    }

    if (!userEmail) {
      return res.status(400).send({
        success: false,
        message: "User email is required",
      });
    }

    let roomQuery;

    if (ObjectId.isValid(roomId)) {
      roomQuery = { _id: new ObjectId(roomId) };
    } else {
      roomQuery = { slug: roomId };
    }

    const room = await roomsCollection.findOne(roomQuery);

    if (!room) {
      return res.status(404).send({
        success: false,
        message: "Room not found",
      });
    }

    const conflict = await bookingsCollection.findOne({
      roomId: String(room._id),
      bookingDate,
      status: { $ne: "cancelled" },
      slots: { $in: slots },
    });

    if (conflict) {
      return res.status(409).send({
        success: false,
        message: "One or more selected slots are already booked",
      });
    }

    const bookingData = {
      roomId: String(room._id),
      roomName:
        bookingBody.roomName ||
        bookingBody.roomTitle ||
        room.name ||
        room.title ||
        "Study Room",
      roomImage: bookingBody.roomImage || room.image || "",
      location: bookingBody.location || room.location || "",
      bookingDate,
      slots,
      totalPrice: Number(bookingBody.totalPrice) || 0,
      status: "confirmed",
      userEmail,
      userName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await bookingsCollection.insertOne(bookingData);

    await roomsCollection.updateOne(
      { _id: room._id },
      { $inc: { bookingCount: 1 } }
    );

    res.status(201).send({
      success: true,
      message: "Booking created successfully",
      bookingId: result.insertedId,
      booking: {
        _id: result.insertedId,
        ...bookingData,
      },
    });
  } catch (error) {
    console.log("Create booking error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

/*
GET MY BOOKINGS BY EMAIL
*/
export const getMyBookings = async (req, res) => {
  try {
    const email = req.params.email || req.query.email;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    const bookings = await bookingsCollection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    res.send({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log("Get my bookings error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

/*
CANCEL BOOKING
*/
export const cancelBooking = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid booking id",
      });
    }

    const booking = await bookingsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
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
          updatedAt: new Date(),
        },
      }
    );

    if (ObjectId.isValid(booking.roomId)) {
      await roomsCollection.updateOne(
        { _id: new ObjectId(booking.roomId) },
        { $inc: { bookingCount: -1 } }
      );
    }

    res.send({
      success: true,
      message: "Booking cancelled successfully",
      result,
    });
  } catch (error) {
    console.log("Cancel booking error:", error);

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
    const roomId = req.body.roomId;
    const bookingDate = req.body.bookingDate || req.body.date;
    const slots = req.body.slots || req.body.selectedSlots || [];

    if (!roomId || !bookingDate || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Room, date, and selected slots are required",
      });
    }

    let finalRoomId = roomId;

    if (ObjectId.isValid(roomId)) {
      finalRoomId = roomId;
    }

    const conflict = await bookingsCollection.findOne({
      roomId: String(finalRoomId),
      bookingDate,
      status: { $ne: "cancelled" },
      slots: { $in: slots },
    });

    res.send({
      success: true,
      available: !conflict,
      message: conflict
        ? "Selected slot already booked"
        : "Selected slots are available",
    });
  } catch (error) {
    console.log("Check availability error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to check availability",
      error: error.message,
    });
  }
};