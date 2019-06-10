const spicedPg = require("spiced-pg");
const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/socialnetwork`;
const db = spicedPg(dbUrl);

// ############################### database queries ############################### //

module.exports.addUser = function addUser(first, last, email, password) {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id;

         `,
        [first, last, email, password]
    );
};

module.exports.getUser = function(email) {
    return db.query(
        `SELECT first, last, email, password, id
        FROM users
        WHERE email=$1;`,
        [email]
    );
};

module.exports.userInfo = function(id) {
    return db.query(
        `SELECT * FROM users
        WHERE id=$1;`,
        [id]
    );
};

module.exports.pushImg = function pushImg(id, avatar) {
    return db.query(`UPDATE users SET avatar = $2 WHERE id = $1;`, [
        id,
        avatar
    ]);
};

module.exports.updateBio = function updateBio(bio, id) {
    return db.query(
        `UPDATE users SET bio=$1 WHERE id=$2
        RETURNING bio`,
        [bio, id]
    );
};

module.exports.findUsers = function findUsers(id, name) {
    return db.query(
        `SELECT id, first, last, avatar FROM users
            WHERE first ILIKE $2
            OR last ILIKE $2
            AND id !=$1
            ORDER BY id
            DESC LIMIT 30`,
        [id, `%${name}%`]
    );
};

module.exports.lastUsers = function lastUsers(userId) {
    return db.query(
        `SELECT id, first, last, avatar FROM users
        WHERE id!=$1
        ORDER BY id DESC
        LIMIT 3`,
        [userId]
    );
};
