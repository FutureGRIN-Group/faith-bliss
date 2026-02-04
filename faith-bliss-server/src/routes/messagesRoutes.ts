import express from "express";
import { createMessage } from "../controllers/messagesController";

const router = express.Router();

router.route("/").post(createMessage);

export default router;
