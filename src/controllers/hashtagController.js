import db from "../db.js";

export async function handleHashtag(post) {
    const tags = post.split(" ").filter((item) => item[0] === "#");
    try{
        tags.map((tag) => db.query(`
        INSERT INTO 
            tags(name) 
            VALUES ($1)
        `, [tag]));
        return 201

    }catch (error) {
        console.log(error);
        return 500;
      }
};

export async function getTags(req, res){
    try{
        const tags = await db.query(`
            SELECT id, name, COUNT(name) AS posicao FROM tags GROUP BY name ORDER BY posicao DESC
        `)
        

        res.status(200).send(tags.rows);
    }catch(error) {
        console.log(error);
        return res.sendStatus(500);
      }
}