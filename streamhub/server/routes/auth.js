import { Router } from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = Router();



router.post("/auth/register", async function (req, res) {
  try {
    const { username, email, password , isStreamer } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const cryptoStreamKey = crypto.randomBytes(16).toString('hex');

    const user = new User({ username, email, password:hashedPassword,isStreamer,streamKey:cryptoStreamKey });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}); 



router.post("/auth/login", async function (req,res) {
    try{

    const { email, password } = req.body;

    // find user with email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect Password" });
    }

    //  creates JWT token 
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      isStreamer: user.isStreamer
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

     // just returns token and user info
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isStreamer: user.isStreamer
      }
    });
  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
