import express from "express";
import { getSocketTutorial } from "../controllers/socketController.js";

const router = express.Router();

router.get("/", getSocketTutorial);

export default router;
