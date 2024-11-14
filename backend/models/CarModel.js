import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String],
    carType: { type: String },
    company: { type: String },
    dealer: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const CarModel = new mongoose.model("CarDetail", carSchema);

export default CarModel;