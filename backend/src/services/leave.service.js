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

        const overlappingLeaves = await this.findOverlapping(
            leave.employeeName,
            leave.startDate,
            leave.endDate
        );

        if (overlappingLeaves.length > 0) {
            throw new Error("Van már overlapping időszakod!");
        }

        let warningMessage = "";
        const overlappingWithOthers = await leaveRepository.findOverlappingWithOthers(
            leave.employeeName,
            leave.startDate,
            leave.endDate
        );

        if (overlappingWithOthers.length > 0) {
            warningMessage = "Ez a kérés átfedésben van más csapattagok kéréseivel!";
        }

        const createdLeave = await leaveRepository.createLeave({
            employeeName: leave.employeeName,
            startDate: leave.startDate,
            endDate: leave.endDate,
            reason: leave.reason
        });

        return {
            ...createdLeave,
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

    async updateLeave(id, updateData) {
        const leave = await this.getLeaveById(id);
        this.existAndStatusCheck(leave);

        this.validateLeave(updateData);

        const overlappingLeaves = await this.findOverlapping(
            updateData.employeeName,
            updateData.startDate,
            updateData.endDate,
            id
        );

        if (overlappingLeaves.length > 0) {
            throw new Error("Van már overlapping időszakod!");
        }

        let warningMessage = "";
        const overlappingWithOthers = await leaveRepository.findOverlappingWithOthers(
            updateData.employeeName,
            updateData.startDate,
            updateData.endDate,
            id
        );

        if (overlappingWithOthers.length > 0) {
            warningMessage = "Ez a kérés átfedésben van más csapattagok kéréseivel!";
        }

        const updatedLeave = await leaveRepository.updateLeave(id, {
            employeeName: updateData.employeeName,
            startDate: updateData.startDate,
            endDate: updateData.endDate,
            reason: updateData.reason
        });

        return {
            ...updatedLeave,
            warning: warningMessage
        };
    }

    async rejectLeave(id, comment) {
        const leave = await this.getLeaveById(id);
        this.existAndStatusCheck(leave);
        return leaveRepository.rejectLeave(id, comment);
    }

    async approveLeave(id, comment) {
        const leave = await this.getLeaveById(id);
        this.existAndStatusCheck(leave);
        return leaveRepository.approveLeave(id, comment);
    }

    async findOverlapping(employeeName, startDate, endDate, excludeId = null) {
        return leaveRepository.findOverlapping(employeeName, startDate, endDate, excludeId);
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
        if (!leave.employeeName) {
            throw new Error("Hiányzik a csapattag neve");
        }
        if (!leave.startDate) {
            throw new Error("Hiányzik a kezdő dátum");
        }
        if (!leave.endDate) {
            throw new Error("Hiányzik a befejező dátum");
        }
        if (!leave.reason) {
            throw new Error("Hiányzik az ok");
        }
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Érvénytelen dátum formátum.");
        }
        const startYear = start.getFullYear();
        const endYear = end.getFullYear();
        if (startYear < 2000 || startYear > 2100 || endYear < 2000 || endYear > 2100) {
            throw new Error("A dátum évének 2000 és 2100 között kell lennie.");
        }
        if (start > end) {
            throw new Error("A kezdő dátumnak kisebbnek vagy egyenlőnek kell lennie a befejező dátumnál.");
        }
    }
}

export default new LeaveService();