import User from "../models/user.model.js";
import mongoose from "mongoose";
import { BsSend } from "react-icons/bs";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const loggedInUserRole = req.user.role;
    // If not admin, hide admin users
    const filter = {
      _id: { $ne: loggedInUserId },
      ...(loggedInUserRole !== "admin" && { role: { $ne: "admin" } }),
    };
    const filteredUsers = await User.find(filter).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.id;
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({ error: "You cannot send a request to yourself." });
    }
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ error: "User not found" });
    if (fromUser.friends.includes(toUserId)) {
      return res.status(400).json({ error: "Already friends" });
    }
    if (fromUser.sentRequests.includes(toUserId)) {
      return res.status(400).json({ error: "Request already sent" });
    }
    if (fromUser.friendRequests.includes(toUserId)) {
      return res.status(400).json({ error: "User already sent you a request" });
    }
    fromUser.sentRequests.push(toUserId);
    toUser.friendRequests.push(fromUserId);
    await fromUser.save();
    await toUser.save();
    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const fromUserId = req.params.id;
    const user = await User.findById(userId);
    const fromUser = await User.findById(fromUserId);
    if (!fromUser) return res.status(404).json({ error: "User not found" });
    if (!user.friendRequests.includes(fromUserId)) {
      return res.status(400).json({ error: "No such friend request" });
    }
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== fromUserId);
    user.friends.push(fromUserId);
    fromUser.sentRequests = fromUser.sentRequests.filter(id => id.toString() !== userId.toString());
    fromUser.friends.push(userId);
    await user.save();
    await fromUser.save();
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reject a friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const fromUserId = req.params.id;
    const user = await User.findById(userId);
    const fromUser = await User.findById(fromUserId);
    if (!fromUser) return res.status(404).json({ error: "User not found" });
    if (!user.friendRequests.includes(fromUserId)) {
      return res.status(400).json({ error: "No such friend request" });
    }
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== fromUserId);
    fromUser.sentRequests = fromUser.sentRequests.filter(id => id.toString() !== userId.toString());
    await user.save();
    await fromUser.save();
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get pending requests (sent and received)
export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friendRequests", "_id fullName username profilePic")
      .populate("sentRequests", "_id fullName username profilePic");
    res.status(200).json({
      received: user.friendRequests,
      sent: user.sentRequests,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
