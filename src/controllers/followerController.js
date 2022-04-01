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

export async function getFollow(req, res) {
  const followerId = req.params.userId
  const followedId = req.params.id

  try {
    const following =  await db.query('SELECT * FROM "followedUsers" WHERE "followerId"=$1 AND "followedId"=$2', [followerId, followedId])

    if(following.rowCount === 0) {
      res.send(false)
    } else {
      res.send(true)
    }
    
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}