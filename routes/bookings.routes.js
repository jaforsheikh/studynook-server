import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const bookingData = req.body;

    console.log("NEW BOOKING:", bookingData);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: bookingData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
});

export default router;