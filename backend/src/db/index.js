import pkg from "pg"

const { Pool } = pkg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://user_admin:secret_password@postgres_db:5432/leave_calendar",
    user: 'user_admin',
    host: 'postgres_db',
    database: 'leave_calendar',
    password: 'secret_password',
    port: 5432,
})

export const query = (text, params) => pool.query(text, params)