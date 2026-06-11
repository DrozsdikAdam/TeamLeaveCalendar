import oncallService from "../services/oncall.service.js";

class OncallController {
    async getSchedule(req, res) {
        try {
            const schedule = await oncallService.getUpcomingSchedule();
            return res.json(schedule);
        } catch (error) {
            console.log("Hiba a heti beosztás lekérése során: ", error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new OncallController();