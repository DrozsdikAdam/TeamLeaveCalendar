import { Router } from "express";
import leaveController from "../controllers/leave.controller.js";

const router = Router();

router.get("/", (req, res) => leaveController.getAllLeaves(req, res));
router.get("/:id", (req, res) => leaveController.getLeaveById(req, res));

router.post("/create", (req, res) => leaveController.createLeave(req, res));

router.put("/reject/:id", (req, res) => leaveController.rejectLeave(req, res));
router.put("/approve/:id", (req, res) => leaveController.approveLeave(req, res));
router.put("/update/:id", (req, res) => leaveController.updateLeave(req, res));

router.delete("/delete/:id", (req, res) => leaveController.deleteLeave(req, res));

export default router;
