import bcrypt from 'bcrypt';

import { db } from '../db.js';

import {v4 as uuid} from 'uuid';

export async function createUser(req, res) {
  const user = req.body;
  
  try {
    console.log(user)
    const existingUsers = await db.query(
      `SELECT * 
            FROM users 
            WHERE email=$1 AND username=$2`,
      [user.email, user.username]
    );
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await db.query(
      `
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
    const user = await db.query(
      `
        SELECT *
          FROM users
          WHERE email=$1`,
      [email]
    );

    if (
      user.rowCount !== 0 &&
      bcrypt.compareSync(password, user.rows[0].password)
    ) {
      const token = uuid();

      await db.query(
        `
          INSERT INTO 
            sessions("userId", token)
          VALUES ($1, $2)`,
        [user.rows[0].id, token]
      );

      let userInfo = { ...user.rows[0], token };

      delete userInfo.password;

      res.send(userInfo);
    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  let userId = req.params.id

  try {
    const user = await db.query(`
      SELECT *
        FROM users
        WHERE id=$1`, [userId])

    if(user.rowCount === 0) {
      res.sendStatus(404)
    }

    let userInfo = {...user.rows[0]}

    delete userInfo.password
    delete userInfo.email

    res.send(userInfo)
  } catch {
    res.sendStatus(500)
  }
}

export async function searchUsers(req, res) {
  let { name } = req.query

  try {

    const userList = await db.query(`
      SELECT id, username, image
        FROM users
        WHERE username ILIKE $1`, [`%${name}%`])

    res.send(userList.rows)
    
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}