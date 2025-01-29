import express from "express";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route - only accessible with a valid Firebase Auth token
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome to your profile!", user: req.user });
});

export default router;
