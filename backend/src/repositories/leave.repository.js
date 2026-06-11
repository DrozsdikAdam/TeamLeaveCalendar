import { query } from "../db/index.js";

class LeaveRepository {
    async getAllLeaves() {
        const sql = `
            SELECT id, 
                   employee_name AS "employeeName", 
                   start_date AS "startDate", 
                   end_date AS "endDate", 
                   reason, 
                   status 
            FROM leave_requests
        `
        const result = await query(sql)
        return result.rows;
    }
    async getLeaveById(id) {
        const sql = `
            SELECT id, 
                   employee_name AS "employeeName", 
                   start_date AS "startDate", 
                   end_date AS "endDate", 
                   reason, 
                   status 
            FROM leave_requests 
            WHERE id = $1
        `
        const result = await query(sql, [id])
        return result.rows[0];
    }
    async findOverlapping(employeeName, startDate, endDate, excludeId = null) {
        const params = [employeeName, startDate, endDate];
        let sql = `
            SELECT id, 
                   employee_name AS "employeeName", 
                   start_date AS "startDate", 
                   end_date AS "endDate", 
                   reason, 
                   status 
            FROM leave_requests 
            WHERE employee_name = $1 
            AND status IN ('Pending', 'Approved')
            AND (start_date <= $3 AND end_date >= $2)
        `;
        if (excludeId !== null) {
            sql += ` AND id != $4`;
            params.push(excludeId);
        }
        const result = await query(sql, params);
        return result.rows;
    }
    async findOverlappingWithOthers(employeeName, startDate, endDate, excludeId = null) {
        const params = [employeeName, startDate, endDate];
        let sql = `
            SELECT id, 
                   employee_name AS "employeeName", 
                   start_date AS "startDate", 
                   end_date AS "endDate", 
                   reason, 
                   status 
            FROM leave_requests 
            WHERE employee_name != $1 
            AND status IN ('Approved', 'Pending')
            AND (start_date <= $3 AND end_date >= $2)
        `;
        if (excludeId !== null) {
            sql += ` AND id != $4`;
            params.push(excludeId);
        }
        const result = await query(sql, params);
        return result.rows;
    }
    async createLeave(leave) {
        const sql = `
            INSERT INTO leave_requests (employee_name, start_date, end_date, reason) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, 
                      employee_name AS "employeeName", 
                      start_date AS "startDate", 
                      end_date AS "endDate", 
                      reason, 
                      status
        `;
        const result = await query(sql, [leave.employeeName, leave.startDate, leave.endDate, leave.reason]);
        return result.rows[0];
    }
    async rejectLeave(id) {
        const sql = `
            UPDATE leave_requests 
            SET status = 'Rejected' 
            WHERE id = $1 
            RETURNING id, 
                      employee_name AS "employeeName", 
                      start_date AS "startDate", 
                      end_date AS "endDate", 
                      reason, 
                      status
        `;
        const result = await query(sql, [id]);
        return result.rows[0];
    }
    async approveLeave(id) {
        const sql = `
            UPDATE leave_requests 
            SET status = 'Approved' 
            WHERE id = $1 
            RETURNING id, 
                      employee_name AS "employeeName", 
                      start_date AS "startDate", 
                      end_date AS "endDate", 
                      reason, 
                      status
        `;
        const result = await query(sql, [id]);
        return result.rows[0];
    }
    async updateLeave(id, updateData) {
        const sql = `
            UPDATE leave_requests
            SET employee_name = $1,
                start_date = $2,
                end_date = $3,
                reason = $4
            WHERE id = $5 
            RETURNING id, 
                      employee_name AS "employeeName", 
                      start_date AS "startDate", 
                      end_date AS "endDate", 
                      reason, 
                      status
        `;
        const result = await query(sql, [updateData.employeeName, updateData.startDate, updateData.endDate, updateData.reason, id]);
        return result.rows[0];
    }
    async deleteLeave(id) {
        const sql = `DELETE FROM leave_requests WHERE id = $1`;
        await query(sql, [id]);
        return "Sikeresen törölve"
    }
}

export default new LeaveRepository();