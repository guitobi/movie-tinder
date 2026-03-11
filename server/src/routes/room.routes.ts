import express from "express";
import { roomCreate } from "../controllers/roomCreate.controller";

const router = express.Router();

router.post("/create", roomCreate);

export default router;
