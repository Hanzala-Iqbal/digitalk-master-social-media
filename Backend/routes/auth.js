import express from "express";
import {
  login,
  register,
  registerGet,
  loginGet,
  registeruser,
  verifyOTP,
  resendOTPVerificationCode,
  sendOTPVerificationEmail,
  getENV,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/register", registerGet);
router.get("/login", loginGet);
router.get("/redirect", sendOTPVerificationEmail);
router.post("/registeruser", registeruser);
router.post("/verifyOTP", verifyOTP);
router.post("/resendOTPVerificationCode/:email", resendOTPVerificationCode);
router.get("/config", getENV);

export default router;
