import { ObjectId } from "mongodb";
import { roomsCollection } from "../server.js";

/*
GET ALL ROOMS
*/

export const getAllRooms = async (req, res) => {
  try {
    const search = req.query.search || "";
    const amenities = req.query.amenities?.split(",") || [];
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || 100000;

    let query = {
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    };

    /*
    SEARCH FILTER
    */

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    /*
    AMENITIES FILTER
    */

    if (amenities.length > 0) {
      query.amenities = {
        $in: amenities,
      };
    }

    const rooms = await roomsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.send({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

/*
GET LATEST ROOMS
*/

export const getLatestRooms = async (req, res) => {
  try {
    const rooms = await roomsCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    res.send({
      success: true,
      rooms,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch latest rooms",
    });
  }
};

/*
GET SINGLE ROOM
*/

export const getSingleRoom = async (req, res) => {
  try {
    const id = req.params.id;

    const room = await roomsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!room) {
      return res.status(404).send({
        success: false,
        message: "Room not found",
      });
    }

    res.send({
      success: true,
      room,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch room",
    });
  }
};

/*
ADD ROOM
*/

export const addRoom = async (req, res) => {
  try {
    const roomData = req.body;

    roomData.createdAt = new Date();

    roomData.bookingCount = 0;

    roomData.owner = req.user;

    const result = await roomsCollection.insertOne(roomData);

    res.send({
      success: true,
      message: "Room Added Successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to add room",
    });
  }
};

/*
UPDATE ROOM
*/

export const updateRoom = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedData = req.body;

    const existingRoom = await roomsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingRoom) {
      return res.status(404).send({
        success: false,
        message: "Room not found",
      });
    }

    /*
    OWNER CHECK
    */

    if (existingRoom?.owner?.email !== req.user.email) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const updatedDoc = {
      $set: {
        ...updatedData,
        updatedAt: new Date(),
      },
    };

    const result = await roomsCollection.updateOne(
      { _id: new ObjectId(id) },
      updatedDoc
    );

    res.send({
      success: true,
      message: "Room Updated Successfully",
      result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to update room",
    });
  }
};

/*
DELETE ROOM
*/

export const deleteRoom = async (req, res) => {
  try {
    const id = req.params.id;

    const existingRoom = await roomsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingRoom) {
      return res.status(404).send({
        success: false,
        message: "Room not found",
      });
    }

    /*
    OWNER CHECK
    */

    if (existingRoom?.owner?.email !== req.user.email) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const result = await roomsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send({
      success: true,
      message: "Room Deleted Successfully",
      result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to delete room",
    });
  }
};

/*
MY LISTINGS
*/

export const getMyListings = async (req, res) => {
  try {
    const email = req.user.email;

    const rooms = await roomsCollection
      .find({
        "owner.email": email,
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.send({
      success: true,
      rooms,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch listings",
    });
  }
};