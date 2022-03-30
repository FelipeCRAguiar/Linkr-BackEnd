import db from "../db.js";
import urlMetadata from "url-metadata";
import { handleHashtag } from "./hashtagController.js";

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


      const likesA = await db.query(`SELECT likes.*, users.username FROM likes JOIN users ON likes."userId" = users.id WHERE "postId" = $1`, [postsrows[i].id]);
      const likes = likesA.rows

      const commentsA = await db.query(`SELECT comments.*, users.username, users.image FROM comments JOIN users ON comments."userId" = users.id WHERE "postId" = $1`, [postsrows[i].id]);
      const comments = commentsA.rows
  
      let completePost = { ...postsrows[i], title, linkImage, description, likes, comments};

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



export async function likePost(req, res) {

  const x = req.params

  try {
    await db.query(`INSERT INTO likes ("userId", "postId") VALUES ($1, $2)`, [x.userId, x.postId])
    

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function unlikePost(req, res) {


  const x = req.params

  try {
    await db.query(`DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2`, [x.userId, x.postId])
    

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

    handleHashtag(text);

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

export async function editPost(req, res) {
  const { postId } = req.params;
  const { text } = req.body;
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
    UPDATE 
      posts
    SET
      "text" = $1
  `;

  if (postId) {
    query += "WHERE posts.id = $2";
  }

  try {
    await db.query(`${query};`, [text, postId]);

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getPostByUser(req, res) {
  const userId = req.params.id;

  try {
    const posts = await db.query(
      `SELECT posts.*, users.image, users.username FROM posts JOIN users ON posts."userId" = users.id WHERE posts."userId"=$1 ORDER BY id DESC LIMIT 20`,
      [userId]
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
