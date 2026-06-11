import leaveRepository from "../repositories/leave.repository.js";

class LeaveService {
    async getAllLeaves() {
        return leaveRepository.getAllLeaves();
    }

    async getLeaveById(id) {
        return leaveRepository.getLeaveById(id);
    }

    async createLeave(leave) {
        this.validateLeave(leave);

        const overlapping_leaves = await this.findOverlapping(
            leave.employee_name,
            leave.start_date,
            leave.end_date
        );

        if (overlapping_leaves.length > 0) {
            throw new Error("Van már overlapping időszakod!");
        }

        return leaveRepository.createLeave({
            employee_name: leave.employee_name,
            start_date: leave.start_date,
            end_date: leave.end_date,
            reason: leave.reason
        });
    }

    async deleteLeave(id) {
        const leave = await this.getLeaveById(id);
        if (!leave) {
            throw new Error("Szabadság nem található.");
        }
        return leaveRepository.deleteLeave(id);
    }

    async updateLeave(id, update_data) {
        const leave = await this.getLeaveById(id);
        if (!leave) {
            throw new Error("Szabadság nem található.");
        }
        if (leave.status !== "Pending") {
            throw new Error("A kérést már feldolgozták.");
        }

        this.validateLeave(update_data);

        return leaveRepository.updateLeave(id, {
            employee_name: update_data.employee_name,
            start_date: update_data.start_date,
            end_date: update_data.end_date,
            reason: update_data.reason
        });
    }

    async rejectLeave(id) {
        const leave = await this.getLeaveById(id);
        if (!leave) {
            throw new Error("Szabadság nem található.");
        }
        if (leave.status !== "Pending") {
            throw new Error("A kérést már feldolgozták.");
        }
        return leaveRepository.rejectLeave(id);
    }

    async approveLeave(id) {
        const leave = await this.getLeaveById(id);
        if (!leave) {
            throw new Error("Szabadság nem található.");
        }
        if (leave.status !== "Pending") {
            throw new Error("A kérést már feldolgozták.");
        }
        return leaveRepository.approveLeave(id);
    }

    async findOverlapping(employee_name, start_date, end_date) {
        return leaveRepository.findOverlapping(employee_name, start_date, end_date);
    }

    validateLeave(leave) {
        if (!leave) {
            throw new Error("Szabadság adatok nem találhatók.");
        }

        if (!leave.employee_name) {
            throw new Error("Hiányzik a csapattag neve");
        }
        if (!leave.start_date) {
            throw new Error("Hiányzik a kezdő dátum");
        }
        if (!leave.end_date) {
            throw new Error("Hiányzik a befejező dátum");
        }
        if (!leave.reason) {
            throw new Error("Hiányzik az ok");
        }
        if (new Date(leave.start_date) > new Date(leave.end_date)) {
            throw new Error("A kezdő dátumnak kisebbnek vagy egyenlőnek kell lennie a befejező dátumnál.");
        }
    }
}

export default new LeaveService();