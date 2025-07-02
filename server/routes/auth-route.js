import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
} from "../controllers/auth-controller.js";

const router = express.Router(); // Create a mini Express app (router) to handle routes separately

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);

router.post("/login", login);

router.post("/logout", logout);

export default router;
