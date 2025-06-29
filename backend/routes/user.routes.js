import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  getUsersForSidebar,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.post("/:id/request", protectRoute, sendFriendRequest);
router.post("/:id/accept", protectRoute, acceptFriendRequest);
router.post("/:id/reject", protectRoute, rejectFriendRequest);
router.get("/requests/all", protectRoute, getFriendRequests);

export default router;
