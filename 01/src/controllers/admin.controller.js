import Order from "../models/Order.js";
import Partner from "../models/Partner.js";
import Package from "../models/Package.js";

export const stats = async (_req, res) => {
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const todayOrders = await Order.countDocuments({ createdAt: { $gte: todayStart } });
  const revenueAgg = await Order.aggregate([
    { $match: { createdAt: { $gte: todayStart } } },
    { $group: { _id: null, sum: { $sum: "$price" } } }
  ]);
  const revenue = revenueAgg[0]?.sum || 0;
  const activePartners = await Partner.countDocuments({ status: "active" });
  const customers = await Order.distinct("customer_name");

  res.json({
    total_orders_today: todayOrders,
    total_revenue_today: revenue,
    active_partners: activePartners,
    total_customers: customers.length
  });
};

export const adminPackages = async (_req, res) => {
  res.json(await Package.find().sort({ createdAt: -1 }));
};
export const adminOrders = async (_req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }));
};
export const adminPartners = async (_req, res) => {
  res.json(await Partner.find().sort({ createdAt: -1 }));
};
