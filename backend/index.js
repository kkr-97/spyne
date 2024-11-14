import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyUser from "./middlewares/verifyUser.js";

import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import CarModel from "./models/CarModel.js";
import UserModel from "./models/UserModel.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

configDotenv();

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

app.post("/create-item", verifyUser, async (req, res) => {
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

app.get("/user-cars", verifyUser, async (req, res) => {
  try {
    const { userId, search, carType, company, dealer } = req.query; // Fetch userId and search keyword from query parameters

    const searchQuery = {
      userId: userId,
      $and: [
        search
          ? {
              $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { tags: { $regex: keyword, $options: "i" } },
              ],
            }
          : {},
        carType ? { carType: { $regex: carType, $options: "i" } } : {},
        company ? { company: { $regex: company, $options: "i" } } : {},
        dealer ? { dealer: { $regex: dealer, $options: "i" } } : {},
      ],
    };
    const cars = await CarModel.find(searchQuery);
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
});

app.get("/cars/:id", verifyUser, async (req, res) => {
  try {
    const car = await CarModel.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/products/:id", verifyUser, async (req, res) => {
  const { id } = req.params;

  try {
    const car = await CarModel.findById({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    await CarModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Failed to delete car" });
  }
});

app.put("/products/:id", verifyUser, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId; // Assuming userId is set from JWT middleware

  const { title, description, tags, carType, company, dealer } = req.body;

  try {
    // Find the car by ID
    const car = await CarModel.findById({
      _id: new mongoose.Types.ObjectId(id),
    });

    // Check if the car exists
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Check if the logged-in user is the owner of the car
    if (car.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this car" });
    }

    // Update the car details
    car.title = title;
    car.description = description;
    car.tags = tags;
    car.carType = carType;
    car.company = company;
    car.dealer = dealer;

    // Save the updated car
    await car.save();

    res.status(200).json({ message: "Car details updated successfully" });
  } catch (error) {
    console.error("Error updating car details:", error);
    res.status(500).json({ error: "Failed to update car details" });
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

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Car Management API",
      version: "1.0.0",
      description: "API documentation for Car Management Application",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./index.js"], // Path to your API routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: User Registered Successfully
 *       400:
 *         description: Validation error or User Already Exists
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login Successful
 *       401:
 *         description: No User Found or Invalid Password
 */

/**
 * @swagger
 * /create-item:
 *   post:
 *     summary: Create a new car item
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tesla Model 3
 *               description:
 *                 type: string
 *                 example: Electric car by Tesla
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               carType:
 *                 type: string
 *                 example: sedan
 *               company:
 *                 type: string
 *                 example: Tesla
 *               dealer:
 *                 type: string
 *                 example: Tesla Dealer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Car item created successfully
 *       500:
 *         description: Failed to create car item
 */

/**
 * @swagger
 * /user-cars:
 *   get:
 *     summary: Get list of user's car items
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of cars
 *       500:
 *         description: Search failed
 */

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Get car details by ID
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car details
 *       404:
 *         description: Car not found
 */
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update car details by ID
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Car details updated successfully
 *       403:
 *         description: Unauthorized to update this car
 *       404:
 *         description: Car not found
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete car by ID
 *     tags: [Car]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 *       500:
 *         description: Failed to delete car
 */
