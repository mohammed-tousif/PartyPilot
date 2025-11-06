import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    address: String,
    role: { type: String, enum: ["customer", "admin"], default: "customer" }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
