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
