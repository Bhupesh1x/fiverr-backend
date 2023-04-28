import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createCategories,
  deleteCategories,
  getCategories,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", verifyToken, getCategories);
router.post("/", verifyToken, createCategories);
router.delete("/:id", verifyToken, deleteCategories);

export default router;
