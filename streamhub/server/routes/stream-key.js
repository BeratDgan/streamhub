import { Router } from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get('/stream-key', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // req.user.id verifyToken middleware’den gelmeli
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ streamKey: user.streamKey });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;

