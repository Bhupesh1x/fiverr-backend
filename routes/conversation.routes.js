import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  getConversations,
  getConversation,
  createConversation,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.get("/", verifyToken, getConversations);
router.get("/single/:id", verifyToken, getConversation);
router.post("/", verifyToken, createConversation);

export default router;
