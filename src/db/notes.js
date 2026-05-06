import pool from "./db";

export async function listTasks(user_id, parent_id = null){
    const query = "SELECT * FROM notes WHERE user_id = $1 AND parent_id " + (parent_id ? "= $2" : "IS NULL");
    const params = parent_id ? [user_id, parent_id] : [user_id];
    const result = await pool.query(query, params);
    return result.rows;
}
async function hasTask(user_id, task_id){
    const result = await pool.query(
        "SELECT id FROM notes WHERE id = $1 AND user_id = $2", 
        [task_id, user_id]
    );
    return result.rows[0]?.id;
}
export async function createTask(content, user_id, parent_id = null){
    if(parent_id && !await hasTask(user_id, parent_id)) return {ok: false, code: "not_found"};
    const query = "INSERT INTO notes (user_id, parent_id, content) VALUES ($1, $2, $3) RETURNING id";
    const params = [user_id, parent_id, content];
    const id = await pool.query(query, params);
    return {ok: true, id};
}