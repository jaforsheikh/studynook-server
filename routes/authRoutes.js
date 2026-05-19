import express from "express";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

/*
LOGIN JWT
*/

router.post("/jwt", async (req, res) => {
  try {
    const user = req.body;

    const token = generateToken(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .send({
        success: true,
        message: "Login Successful",
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "JWT Failed",
    });
  }
});

/*
LOGOUT
*/

router.post("/logout", async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .send({
        success: true,
        message: "Logout Successful",
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Logout Failed",
    });
  }
});

export default router;