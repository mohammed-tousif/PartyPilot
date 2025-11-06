import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    rating: { type: Number, default: 4.7 },
    total_deliveries: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "offline"], default: "active" },
    current_location: String,
    earnings_today: { type: Number, default: 0 },
    active_order: { type: String, default: null } // ORDxxx
  },
  { timestamps: true }
);

export default mongoose.model("Partner", PartnerSchema);
