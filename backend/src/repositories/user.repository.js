import { query } from "../db/index.js";

class UserRepository {
    async findAll() {
        const sql = "SELECT * FROM users";
        const result = await query(sql);
        return result.rows;
    }
}

export default new UserRepository();