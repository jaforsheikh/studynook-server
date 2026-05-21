import { ObjectId } from "mongodb";
import { roomsCollection } from "../server.js";

/*
GET ALL ROOMS WITH SEARCH/FILTER
*/
export const getAllRooms = async (req, res) => {
  try {
    const {
      search = "",
      location = "",
      minPrice = "0",
      maxPrice = "999999",
      capacity = "",
      amenities = "",
    } = req.query;

    const query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    query.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };

    if (capacity) {
      query.capacity = {
        $gte: Number(capacity),
      };
    }

    if (amenities) {
      query.amenities = {
        $in: amenities.split(","),
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

    let query;

    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { slug: id };
    }

    const room = await roomsCollection.findOne(query);

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

    const roomName = roomData.name || roomData.title;

    if (!roomName) {
      return res.status(400).send({
        success: false,
        message: "Room name is required",
      });
    }

    const slug = roomName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const newRoom = {
      name: roomName,
      title: roomName,
      slug,
      image: roomData.image || roomData.imageUrl || "",
      location: roomData.location || "",
      floor: roomData.floor || "",
      capacity: Number(roomData.capacity) || 1,
      price: Number(roomData.price) || 0,
      description: roomData.description || "",
      amenities: Array.isArray(roomData.amenities) ? roomData.amenities : [],
      availableToday: true,
      rating: Number(roomData.rating) || 4.8,
      bookingCount: 0,
      owner: roomData.owner || {
        name: roomData.ownerName || "",
        email: roomData.ownerEmail || "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await roomsCollection.insertOne(newRoom);

    res.status(201).send({
      success: true,
      message: "Room added successfully",
      insertedId: result.insertedId,
      room: newRoom,
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
    const roomData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid room id",
      });
    }

    const existingRoom = await roomsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingRoom) {
      return res.status(404).send({
        success: false,
        message: "Room not found",
      });
    }

    const updatedRoom = {
      name: roomData.name,
      image: roomData.image,
      location: roomData.location,
      floor: roomData.floor,
      capacity: Number(roomData.capacity),
      price: Number(roomData.price),
      description: roomData.description,
      amenities: roomData.amenities || [],
      updatedAt: new Date(),
    };

    const result = await roomsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedRoom }
    );

    res.send({
      success: true,
      message: "Room updated successfully",
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

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid room id",
      });
    }

    const result = await roomsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send({
      success: true,
      message: "Room deleted successfully",
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
GET MY LISTINGS
*/
export const getMyListings = async (req, res) => {
  try {
    const email = req.params.email;

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
      message: "Failed to fetch my listings",
    });
  }
};