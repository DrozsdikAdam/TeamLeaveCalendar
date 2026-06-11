import { query } from "../db/index.js";

class OncallRepository {
    async findApprovedLeaves() {
        const sql = `SELECT * FROM leave_requests WHERE status = 'Approved'`
        const result = await query(sql);
        return result.rows;
    }
}

export default new OncallRepository()