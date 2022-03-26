import db from "../db.js";
import urlMetadata from "url-metadata";

export async function getPosts(req, res) {
  try {
    const posts = await db.query(
      `SELECT posts.*, users.image, users.username FROM posts JOIN users ON posts."userId" = users.id ORDER BY id DESC LIMIT 20`
    );
    const postsrows = posts.rows;
    const postsTimeline = [];

    for (let i = 0; i < posts.rowCount; i++) {
      let metadata = await urlMetadata(postsrows[i].link);
      const title = metadata.title;
      const linkImage = metadata.image;
      const description = metadata.description;

      let completePost = { ...postsrows[i], title, linkImage, description };

      postsTimeline.push(completePost);

      metadata = null;
      completePost = null;
    }

    res.status(200).send(postsTimeline);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function createPost(req, res) {
  const user = res.locals.user;
  const { link, text } = req.body;

  try {
    const validateUserId = await db.query("SELECT * FROM users WHERE id=$1", [
      user.id,
    ]);
    if (validateUserId.rowCount <= 0) {
      return res.sendStatus(404);
    }

    await db.query(
      'INSERT INTO posts ("userId", link, text) VALUES ($1, $2, $3)',
      [user.id, link, text]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function deletePost(req, res) {
  const { postId } = req.params;
  const user = res.locals.user;

  const validatePostId = await db.query("SELECT * FROM posts WHERE id = $1", [
    postId,
  ]);
  if (validatePostId.rowCount <= 0) {
    return res.sendStatus(404);
  }

  const validateUserOwnsPost = validatePostId.rows[0];
  if (Object.values(validateUserOwnsPost)[1] !== user.id) {
    return res.sendStatus(403);
  }

  let query = `
    DELETE FROM
      posts
  `;

  if (postId) {
    query += "WHERE posts.id = $1";
  }

  try {
    await db.query(`${query};`, [postId]);

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
