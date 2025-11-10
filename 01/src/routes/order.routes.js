import { Router } from "express";
import Order from "../models/Order.js";
import {
  listOrdersForCustomer,
  listAllOrders,
  placeOrder,
  partnerAvailableOrders,
  partnerAcceptOrder,
  partnerDeclineOrder
} from "../controllers/order.controller.js";

const router = Router();

router.get("/", listOrdersForCustomer);     // ?customer_name=Priya%20Sharma
router.get("/all", listAllOrders);          // admin table
router.post("/", placeOrder);

// Partner-facing actions
router.get("/available/partner", partnerAvailableOrders);
router.post("/:id/accept", partnerAcceptOrder);   // body: { partner_id }
router.post("/:id/decline", partnerDeclineOrder);

export default router;

router.post("/:id/status", async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if(!order) return res.status(404).json({message:"Order not found"});
  order.status = status;
  await order.save();
  res.json(order);
});
