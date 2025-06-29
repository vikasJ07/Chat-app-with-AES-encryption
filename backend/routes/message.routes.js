import express from "express";
import {
  sendMessage,
  getMessages,
  updateMessageStatus,
  addReaction,
  editMessage,
  deleteMessage,
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.put("/:messageId/status", protectRoute, updateMessageStatus);
router.post("/:messageId/reaction", protectRoute, addReaction);
router.put("/:messageId/edit", protectRoute, editMessage);
router.delete("/:messageId", protectRoute, deleteMessage);

export default router;
