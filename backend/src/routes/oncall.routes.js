import { Router } from "express";
import oncallController from "../controllers/oncall.controller.js";

const router = Router();

router.get("/upcoming-weeks", (req, res) => oncallController.getSchedule(req, res))

export default router