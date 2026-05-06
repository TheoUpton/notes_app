import pool from "./db";

export async function listTasks(user_id, parent_id = null){
    const query = "SELECT * FROM notes WHERE user_id = $1 AND parent_id " + (parent_id ? "= $2" : "IS NULL");
    const params = parent_id ? [user_id, parent_id] : [user_id];
    const result = await pool.query(query, params);
    return result.rows;
}