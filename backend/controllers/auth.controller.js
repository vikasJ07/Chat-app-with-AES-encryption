import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

// ========== SIGNUP ==========
export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender, adminCode } = req.body;

    // Input validation
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Check if admin code is provided and correct
    const isAdmin = adminCode === "ADMIN123"; // You can change this code to something more secure

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      role: isAdmin ? "admin" : "user",
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    await newUser.save();

    // Generate token
    generateTokenAndSetCookie(newUser._id, newUser.role, res);

    const userResponse = {
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
      role: newUser.role,
      friends: newUser.friends,
      friendRequests: newUser.friendRequests,
      sentRequests: newUser.sentRequests,
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ========== LOGIN ==========
export const login = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Check admin role if isAdmin is true
    if (isAdmin && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Not an admin user." });
    }

    // Generate token with role
    generateTokenAndSetCookie(user._id, user.role, res);

    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
      role: user.role,
      friends: user.friends,
      friendRequests: user.friendRequests,
      sentRequests: user.sentRequests,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ========== LOGOUT ==========
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const me = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.status(200).json(req.user);
};
