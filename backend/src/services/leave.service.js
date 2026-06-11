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

        let warningMessage = "";
        const overlappingWithOthers = await leaveRepository.findOverlappingWithOthers(
            leave.employee_name,
            leave.start_date,
            leave.end_date
        );

        if (overlappingWithOthers.length > 0) {
            warningMessage = "Ez a kérés átfedésben van más csapattagok kéréseivel!";
        }

        const created_leave = await leaveRepository.createLeave({
            employee_name: leave.employee_name,
            start_date: leave.start_date,
            end_date: leave.end_date,
            reason: leave.reason
        });

        return {
            ...created_leave,
            warning: warningMessage
        };
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
        this.existAndStatusCheck(leave);

        this.validateLeave(update_data);

        let warningMessage = "";
        const overlappingWithOthers = await leaveRepository.findOverlappingWithOthers(
            update_data.employee_name,
            update_data.start_date,
            update_data.end_date
        );

        if (overlappingWithOthers.length > 0) {
            warningMessage = "Ez a kérés átfedésben van más csapattagok kéréseivel!";
        }

        const updated_leave = await leaveRepository.updateLeave(id, {
            employee_name: update_data.employee_name,
            start_date: update_data.start_date,
            end_date: update_data.end_date,
            reason: update_data.reason
        });

        return {
            ...updated_leave,
            warning: warningMessage
        };
    }

    async rejectLeave(id) {
        const leave = await this.getLeaveById(id);
        this.existAndStatusCheck(leave);
        return leaveRepository.rejectLeave(id);
    }

    async approveLeave(id) {
        const leave = await this.getLeaveById(id);
        this.existAndStatusCheck(leave);
        return leaveRepository.approveLeave(id);
    }

    async findOverlapping(employee_name, start_date, end_date) {
        return leaveRepository.findOverlapping(employee_name, start_date, end_date);
    }

    existAndStatusCheck(leave) {
        if (!leave) {
            throw new Error("Szabadság nem található.");
        }
        if (leave.status !== "Pending") {
            throw new Error("A kérést már feldolgozták.");
        }
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