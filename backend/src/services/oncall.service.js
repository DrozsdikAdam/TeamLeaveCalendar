import oncallRepository from "../repositories/oncall.repository.js";

class OncallService {
    getWeekNumber(date) {
        const currentDate = new Date(date);
        const jan1 = new Date(currentDate.getFullYear(), 0, 1);
        const daysDiff = Math.floor((currentDate - jan1) / (1000 * 60 * 60 * 24));
        return Math.ceil((daysDiff + 1) / 7);
    }

    getEmployeeForTheWeek(weekNumber) {
        const rotation = ['Alice', 'Bob', 'Charlie', 'Diana'];
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

        const today = new Date();
        const mondayOfCurrentWeek = this.getMonday(today);
        const numberOfWeeksForward = 5;

        const schedule = [];

        for (let i = 0; i < numberOfWeeksForward; i++) {
            const week_start = new Date(mondayOfCurrentWeek);
            week_start.setDate(mondayOfCurrentWeek.getDate() + i * 7);

            const week_end = new Date(week_start);
            week_end.setDate(week_start.getDate() + 6);
            week_end.setHours(23, 59, 59, 999);

            const targetWeek = this.getWeekNumber(week_start);
            const employee = this.getEmployeeForTheWeek(targetWeek);

            const hasConflict = leaves.some(leave => {
                if (leave.employee_name !== employee) return false;

                const leave_start = new Date(leave.start_date);
                const leave_end = new Date(leave.end_date);

                return leave_start <= week_end && leave_end >= week_start;
            });

            schedule.push({
                week: targetWeek,
                employee: employee,
                hasConflict: hasConflict
            });
        }
        return schedule;
    }
}

export default new OncallService();