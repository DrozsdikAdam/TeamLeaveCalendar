import { query } from "../db/index.js";

class OncallRepository {
    async findApprovedLeaves() {
        const sql = `
            SELECT id, 
                   employee_name AS "employeeName", 
                   start_date AS "startDate", 
                   end_date AS "endDate", 
                   reason, 
                   status 
            FROM leave_requests 
            WHERE status = 'Approved'
        `
        const result = await query(sql);
        return result.rows;
    }
}

export default new OncallRepository()