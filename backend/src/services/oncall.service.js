import oncallRepository from "../repositories/oncall.repository.js";
import userRepository from "../repositories/user.repository.js";

class OncallService {
    getWeekNumber(date) {
        const currentDate = new Date(date);
        const jan1 = new Date(currentDate.getFullYear(), 0, 1);
        const daysDiff = Math.floor((currentDate - jan1) / (1000 * 60 * 60 * 24));
        return Math.ceil((daysDiff + 1) / 7);
    }

    getEmployeeForTheWeek(weekNumber, rotation) {
        if (!rotation || rotation.length === 0) {
            return "Nincs beosztott";
        }
        const index = (weekNumber - 1) % rotation.length;
        return rotation[index >= 0 ? index : 0];
    }

    getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday;
    }

    async getUpcomingSchedule() {
        const leaves = await oncallRepository.findApprovedLeaves();
        const users = await userRepository.findAll();
        const rotation = users.sort((a, b) => a.id - b.id).map(u => u.name);

        const today = new Date();
        const mondayOfCurrentWeek = this.getMonday(today);
        const numberOfWeeksForward = 5;

        const schedule = [];

        for (let i = 0; i < numberOfWeeksForward; i++) {
            const weekStart = new Date(mondayOfCurrentWeek);
            weekStart.setDate(mondayOfCurrentWeek.getDate() + i * 7);

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);

            const targetWeek = this.getWeekNumber(weekStart);
            const employee = this.getEmployeeForTheWeek(targetWeek, rotation);

            const conflictingLeaves = leaves.filter(leave => {
                if (leave.employeeName !== employee) return false;

                const leaveStart = new Date(leave.startDate);
                const leaveEnd = new Date(leave.endDate);

                return leaveStart <= weekEnd && leaveEnd >= weekStart;
            });

            schedule.push({
                week: targetWeek,
                employee: employee,
                hasConflict: conflictingLeaves.length > 0,
                conflicts: conflictingLeaves.map(leave => ({
                    startDate: leave.startDate,
                    endDate: leave.endDate,
                    reason: leave.reason
                }))
            });
        }
        return schedule;
    }
}

export default new OncallService();