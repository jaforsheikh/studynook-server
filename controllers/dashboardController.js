const Booking = require("../models/Booking");
const Room = require("../models/Room");

const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const totalRooms = await Room.countDocuments();

    const bookings = await Booking.find();

    const totalSpent = bookings.reduce((sum, booking) => {
      return sum + (booking.totalPrice || 0);
    }, 0);

    const roomRevenue = totalSpent;

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        totalRooms,
        totalSpent,
        roomRevenue,
      },
    });
  } catch (error) {
    console.log("Dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
};

module.exports = {
  getDashboardStats,
};