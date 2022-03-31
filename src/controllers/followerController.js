import db from "../db.js";

export async function follow(req, res) {
  const follow = req.body

  try {
    await db.query('INSERT INTO "followedUsers" ("followerId", "followedId") VALUES ($1, $2)', [follow.followerId, follow.followedId])
    
    res.sendStatus(200)

  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function unfollow(req, res) {
  const follow = req.body

  try {
    await db.query('DELETE FROM "followedUsers" WHERE "followerId"=$1 AND "followedId"=$2', [follow.followerId, follow.followedId])

    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}