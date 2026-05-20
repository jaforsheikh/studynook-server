import express from "express";
import { bookingsCollection, roomsCollection } from "../server.js";

const router = express.Router();

/*
GET DASHBOARD STATS BY USER EMAIL
Example:
GET /api/dashboard/stats/user@gmail.com
*/

router.get("/stats/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const totalListings = await roomsCollection.countDocuments({
      "owner.email": email,
    });

    const totalBookings = await bookingsCollection.countDocuments({
      userEmail: email,
    });

    const confirmedBookings = await bookingsCollection
      .find({
        userEmail: email,
        status: "confirmed",
      })
      .toArray();

    const totalSpent = confirmedBookings.reduce((sum, booking) => {
      return sum + Number(booking.totalPrice || 0);
    }, 0);

    const myRooms = await roomsCollection
      .find({
        "owner.email": email,
      })
      .toArray();

    const roomIds = myRooms.map((room) => room._id.toString());

    const bookingsForMyRooms = await bookingsCollection
      .find({
        roomId: { $in: roomIds },
        status: "confirmed",
      })
      .toArray();

    const totalRevenue = bookingsForMyRooms.reduce((sum, booking) => {
      return sum + Number(booking.totalPrice || 0);
    }, 0);

    res.send({
      success: true,
      stats: {
        totalListings,
        totalBookings,
        totalSpent,
        totalRevenue,
      },
    });
  } catch (error) {
    console.log("Dashboard stats error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
});

export default router;