import path from "path";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";
import connectDB from "./src/config/db.js";

import packageRoutes from "./src/routes/package.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import partnerRoutes from "./src/routes/partner.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/packages", packageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/admin", adminRoutes);

// Static frontend
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (_, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Party-Pilot running on http://localhost:${PORT}`)
);
