import { Router } from "express";
import { listPartners, partnerActiveDelivery } from "../controllers/partner.controller.js";
const router = Router();

router.get("/", listPartners);
router.get("/:partner_id/active", partnerActiveDelivery);

export default router;
