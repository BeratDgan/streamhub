import User from "../models/User.js";
import bcrypt from "bcrypt";
import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Only reach that who get logged in users
router.get("/profile", verifyToken, (req, res) => {
  //in req.user there are user informations coming from token
  res.json({
    message: "access to profile information successful",
    user: req.user
  });
});

router.post("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete-account", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;