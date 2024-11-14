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

const port = 3001 || process.env.PORT;

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
