import express from "express";
import { getAllUsers, removeUser } from "../controllers/admin.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { isAdmin } from "../middleware/adminmiddleware.js";

const router = express.Router();

// 🧾 Get all users (for admin dashboard)
router.get("/users", protectRoute, isAdmin, getAllUsers);

// 🗑️ Delete a user
router.delete("/user/:userId", protectRoute, isAdmin, removeUser);

export default router;
