import db from "../db.js";

export async function validateToken(req, res, next) {

    const authorization = req.header("authorization");
    const token = authorization?.replace('Bearer ', '');

    if (!token){
        return res.sendStatus(401);
    }

    try {

        const session = await db.query(`
            SELECT *
                FROM sessions
                WHERE token=$1`, [token])

        if (session.rowCount === 0) {
            return res.sendStatus(401);
        }

        const user = await db.query(`
            SELECT *
                FROM users
                WHERE id=$1`, [session.rows[0].userId])

        if (user.rowCount === 0) {
            return res.sendStatus(401);
        }

        delete user.rows[0].password

        res.locals.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}