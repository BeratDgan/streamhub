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

export default router;