import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["Birthday", "Anniversary", "Surprise"], required: true },
    price: { type: Number, required: true },
    image: String,
    description: String,
    items: [String],
    setup_time: String,
    rating: { type: Number, default: 4.5 }
  },
  { timestamps: true }
);

export default mongoose.model("Package", PackageSchema);
