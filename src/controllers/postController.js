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
