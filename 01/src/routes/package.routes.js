import { Router } from "express";
import { listPackages, createPackage } from "../controllers/package.controller.js";
const router = Router();

router.get("/", listPackages);
router.post("/", createPackage); // (Admin add)

export default router;
