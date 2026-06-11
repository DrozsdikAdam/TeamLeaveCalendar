import leaveService from "../services/leave.service.js";

class LeaveController {
    async getAllLeaves(req, res) {
        try {
            const leaves = await leaveService.getAllLeaves();
            res.json(leaves);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getLeaveById(req, res) {
        try {
            const leave = await leaveService.getLeaveById(req.params.id);
            if (!leave) {
                return res.status(404).json({ error: "Szabadság nem található." });
            }
            res.json(leave);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createLeave(req, res) {
        try {
            const leave = await leaveService.createLeave(req.body);
            res.status(201).json(leave);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateLeave(req, res) {
        try {
            const leave = await leaveService.updateLeave(req.params.id, req.body);
            res.json(leave);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async deleteLeave(req, res) {
        try {
            const leave = await leaveService.deleteLeave(req.params.id);
            res.json(leave);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async rejectLeave(req, res) {
        try {
            const leave = await leaveService.rejectLeave(req.params.id, req.body.comment);
            res.json(leave);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async approveLeave(req, res) {
        try {
            const leave = await leaveService.approveLeave(req.params.id, req.body.comment);
            res.json(leave);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
export default new LeaveController();