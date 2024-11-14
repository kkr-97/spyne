import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

import CarModel from "./models/CarModel.js";
import UserModel from "./models/UserModel.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.post(
  "/register",
  [
    check("email", "Please Enter Valid Email").isEmail(),
    check("username", "Please enter username").not().isEmpty(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors[0].msg });
    }

    try {
      const { email, username, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User Already Exist!!" });
      }

      const salt = await bcryptjs.genSalt(7);
      const hashedPass = await bcryptjs.hash(password, salt);

      const newUser = new UserModel({
        email: email,
        username: username,
        password: hashedPass,
      });

      const token = jwt.sign({ ...newUser }, process.env.SECRET_KEY);

      await newUser.save();
      console.log("Registered & Login Successful!");
      res.status(200).json({
        message: "User Registered Successfully",
        token,
        username: username,
        id: newUser._id,
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: e });
    }
  }
);

app.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors[0].msg });
    }

    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "No User Found!!" });
      }
      const isValidPass = await bcryptjs.compare(password, user.password);
      if (!isValidPass) {
        return res.status(401).json({ message: "Invalid Password!" });
      }
      const token = jwt.sign({ ...user }, process.env.SECRET_KEY, {
        expiresIn: 360000,
      });
      console.log("Login Successful!");
      res.status(200).json({
        username: user.username,
        id: user._id,
        message: "Login Successful",
        token,
      });
    } catch (e) {
      console.error("Login Error: ", e);
      res.status(500).json({ message: e });
    }
  }
);

app.post("/create-item", async (req, res) => {
  try {
    const {
      title,
      description,
      tags,
      carType,
      company,
      dealer,
      images,
      userId,
    } = req.body;

    const newCar = new CarModel({
      title,
      description,
      tags,
      company,
      carType,
      dealer,
      userId,
      images: images,
    });

    await newCar.save();

    res.status(201).json({ message: "Car item created successfully", newCar });
  } catch (error) {
    console.error("Error creating car item:", error);
    res.status(500).json({ error: "Failed to create car item" });
  }
});

app.get("/user-cars", async (req, res) => {
  try {
    const { userId, search } = req.query; // Fetch userId and search keyword from query parameters
    const regex = new RegExp(search, "i"); // Create a case-insensitive regex for searching

    // Search cars by title, description, or tags
    const cars = await CarModel.find({
      userId: userId,
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $elemMatch: { $regex: regex } } },
      ],
    });

    res.status(200).json(cars); // Return the cars matching the search
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log("Error while connecting to DB:", err));
};

app.listen(port, () => {
  connectDB();
  console.log(`Server Started Running on ${port} port`);
});

configDotenv();
