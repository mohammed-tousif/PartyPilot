import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true },
    phone: String,
    address: String,
    package: String,       // denormalized for quick read
    package_id: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    date: String,          // "YYYY-MM-DD"
    time_slot: String,     // "6:00 PM - 7:00 PM"
    status: {
      type: String,
      enum: ["confirmed", "accepted", "in_transit", "completed", "cancelled"],
      default: "confirmed"
    },
    price: Number,
    partner_assigned: String, // name
    partner_id: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
    special_instructions: String
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
