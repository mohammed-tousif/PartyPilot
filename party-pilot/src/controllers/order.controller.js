import Order from "../models/Order.js";
import Package from "../models/Package.js";
import Partner from "../models/Partner.js";

export const listOrdersForCustomer = async (req, res) => {
  const name = req.query.customer_name;
  const q = name ? { customer_name: name } : {};
  const orders = await Order.find(q).sort({ createdAt: -1 });
  res.json(orders);
};

export const listAllOrders = async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

export const placeOrder = async (req, res) => {
  const { customer_name, phone, address, package_id, date, time_slot, special_instructions } = req.body;
  const pkg = await Package.findById(package_id);
  if (!pkg) return res.status(404).json({ message: "Package not found" });

  const newOrder = await Order.create({
    customer_name,
    phone,
    address,
    package_id: pkg._id,
    package: pkg.name,
    date,
    time_slot,
    price: pkg.price,
    special_instructions,
    status: "confirmed"
  });

  res.status(201).json(newOrder);
};

export const partnerAvailableOrders = async (_req, res) => {
  const orders = await Order.find({ status: "confirmed", partner_id: null }).sort({ createdAt: -1 });
  res.json(orders);
};

export const partnerAcceptOrder = async (req, res) => {
  const { id } = req.params; // order id (Mongo _id)
  const { partner_id } = req.body;

  const partner = await Partner.findById(partner_id);
  if (!partner) return res.status(404).json({ message: "Partner not found" });

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.partner_id) return res.status(400).json({ message: "Already assigned" });

  order.partner_id = partner._id;
  order.partner_assigned = partner.name;
  order.status = "accepted";
  await order.save();

  partner.active_order = order.id;
  await partner.save();

  res.json(order);
};

export const partnerDeclineOrder = async (req, res) => {
  // for demo: simply respond OK, no state change required
  res.json({ ok: true });
};
