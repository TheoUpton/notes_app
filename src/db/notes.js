import pool from "./db";

export async function listTasks(user_id, parent_id = null){
    const query = "SELECT * FROM notes WHERE user_id = $1 AND parent_id " + (parent_id ? "= $2" : "IS NULL");
    const params = parent_id ? [user_id, parent_id] : [user_id];
    const result = await pool.query(query, params);
    return result.rows;
}
export async function hasTask(user_id, task_id){
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
export class TaskUpdater{
    #fields = [];
    #values = [];
    constructor(task_id, user_id) {
        this.task_id = task_id;
        this.user_id = user_id;
        this.#values.push(task_id, user_id);
    }

    /**
     * 
     * @param {string} content 
     * @returns 
     * @throws {Error} If called more than once on the same builder instance
     */
    setContent(content) {this.#set(content, "content", this.setContent.name);}

    /**
     * 
     * @param {string} parent_id 
     * @returns 
     * @throws {Error} If called more than once on the same builder instance
     */
    setParentId(parent_id) {this.#set(parent_id, "parent_id", this.setParentId.name);}

    /**
     * 
     * @param {Date | null} completed_at 
     * @returns 
     * @throws {Error} If called more than once on the same builder instance
     */
    setCompletedAt(completed_at) {this.#set(completed_at, "completed_at", this.setCompletedAt.name);}

    #set(object, fieldName, methodName){
        this[methodName] = () => {throw new Error(`${methodName} can only be called once`);}
        this.#values.push(object);
        this.#fields.push(`${fieldName} = $${this.#values.length}`);
    }
    /**
     * 
     * @returns {Promise<import("pg").QueryResult}
     * @throws {Error} If called before any set method has been called
     * @throws {Error} If called more than once on the same builder instance
     */
    async execute() {
        if(this.#fields.length == 0) throw new Error("No fields to update");
        this.execute = () => { throw new Error("TaskUpdater already executed"); }
        const query = `UPDATE notes SET ${this.#fields.join(", ")} WHERE id = $1 AND user_id = $2 RETURNING *`;
        const result = await pool.query(query, this.#values)
        return result.rows[0];
    }
}