import bcrypt from 'bcrypt';
import {v4 as uuid} from 'uuid';
import db from '../db.js';

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
        users(username, email, password, image) 
      VALUES ($1, $2, $3, $4)
    `, [user.username, user.email, passwordHash, user.image])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}


export async function signIn(req, res) {

    let { email, password } = req.body;
    
    try {
  
      const user = await db.query(`
        SELECT *
          FROM users
          WHERE email=$1`, [email])
  
      if (user.rowCount !== 0 && bcrypt.compareSync(password, user.password)) {
        const token = uuid();
  
        await db.query(`
          INSERT INTO 
            sessions("userId", token)
          VALUES ($1, $2)`, [user.rows[0], token])
  
        let userInfo = { ...user.rows[0], token }
  
        delete userInfo.password
  
        res.send(userInfo);
      } else {
        res.sendStatus(401)
      }
    } catch {
      res.sendStatus(500)
    }
};