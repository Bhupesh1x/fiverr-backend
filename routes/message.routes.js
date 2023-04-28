import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createMessage,
  getMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", verifyToken, getMessages);
router.post("/", verifyToken, createMessage);

export default router;
