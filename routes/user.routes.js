import express from "express";
import {
  register,
  login,
  logout,
  getUser,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user/:id", getUser);

export default router;
