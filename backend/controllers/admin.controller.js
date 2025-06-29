import User from "../models/user.model.js";

// GET all users (except password and admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE user by ID
export const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent admin from being deleted
    if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot delete admin user" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in removeUser: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
