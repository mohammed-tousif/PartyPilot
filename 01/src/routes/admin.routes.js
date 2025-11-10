import { Router } from "express";
import { stats, adminOrders, adminPackages, adminPartners } from "../controllers/admin.controller.js";
const router = Router();

router.get("/stats", stats);
router.get("/orders", adminOrders);
router.get("/packages", adminPackages);
router.get("/partners", adminPartners);

export default router;
