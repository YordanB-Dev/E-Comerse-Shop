import type { QueryResult } from "pg";
import db from "../db.js";

interface User {
    id: number,
    email: string,
    password: string,
    username: string;
    role: "user" | "admin"
}

const createUser = async (
    email: string,
    password: string,
    username: string
): Promise<User> => {
    const result: QueryResult<User> = await db.query<User> (
        `INSERT INTO users (email, password, username)
        VALUES ($1, $2, $3)
        RETURNING id, email, password, username`,
        [email, password, username]
    );

    return result.rows[0]!;
};


const findUserByEmail = async (email: string): Promise<User> => {
    const result: QueryResult<User> = await db.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    return result.rows[0]!;
};


export default {
    createUser,
    findUserByEmail
};
