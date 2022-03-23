import bcrypt from 'bcrypt';
import { db } from '../db.js';

export async function createUser(req, res) {
  const user = req.body;
  
  try {
    const existingUsers = await db.query(
        `SELECT * 
            FROM users 
            WHERE email=$1 AND username=$2`, [user.email, user.username])
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await db.query(`
      INSERT INTO 
        users(email, password, username, picture) 
      VALUES ($1, $2, $3, $4)
    `, [user.email, passwordHash, user.username, user.picture])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}