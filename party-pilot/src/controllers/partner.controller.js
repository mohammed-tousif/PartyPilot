import Partner from "../models/Partner.js";
import Order from "../models/Order.js";

export const listPartners = async (_req, res) => {
  const partners = await Partner.find().sort({ createdAt: -1 });
  res.json(partners);
};

export const partnerActiveDelivery = async (req, res) => {
  const { partner_id } = req.params;
  const partner = await Partner.findById(partner_id);
  if (!partner) return res.status(404).json({ message: "Partner not found" });

  const order = await Order.findOne({ partner_id: partner._id, status: { $in: ["accepted", "in_transit"] } })
    .sort({ createdAt: -1 });
  res.json({ partner, active_order: order || null });
};
