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
            DESC LIMIT 20`,
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

// ######################### Friend Requests ##################################

module.exports.getFriends = function getFriends(callId, userId) {
    return db.query(
        `SELECT * FROM friendships
        WHERE receiver_id=$1 AND sender_id=$2
        OR sender_id=$1 AND receiver_id=$2
        `,
        [callId, userId]
    );
};

module.exports.startFriendship = function startFriendship(callId, userId) {
    // console.log("startFriendship query :", callId, userId);
    return db.query(
        `INSERT INTO friendships
        (receiver_id, sender_id) VALUES ($1, $2)
        `,
        [callId, userId]
    );
};

module.exports.updateFriend = function updateFriend(callId, userId) {
    return db.query(
        `UPDATE friendships SET accepted = true
        WHERE receiver_id=$2 AND sender_id=$1
        `,
        [callId, userId]
    );
};

module.exports.deleteFriend = function deleteFriend(callId, userId) {
    return db.query(
        `DELETE FROM friendships
        WHERE receiver_id=$1 AND sender_id=$2
        OR sender_id=$1 AND receiver_id=$2
        `,
        [callId, userId]
    );
};

module.exports.getFriendsList = function getFriendsList(userId) {
    return db.query(
        `
    SELECT users.id, first, last, avatar, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
`,
        [userId]
    );
};

// ################################# CHAT ##################################

module.exports.getMessages = function getMessages() {
    return db.query(
        ` SELECT chat.id AS msg_id, message, users.id AS user_id, first, last, avatar, chat.created_at
          FROM chat
          JOIN users
          ON sender_id = users.id
        ORDER BY msg_id DESC LIMIT 10
        `
    );
};

module.exports.newChat = function newChat(senderId, msg) {
    return db.query(
        `INSERT INTO chat (sender_id, message)
         VALUES($1, $2)
         RETURNING id`,
        [senderId, msg]
    );
};

module.exports.newChatInfo = function newChatInfo(chatId) {
    return db.query(
        `SELECT chat.id AS msg_id, message, users.id AS user_id,
        first, last, avatar, chat.created_at
        FROM chat
        JOIN users
        ON sender_id = users.id
        WHERE chat.id = $1`,
        [chatId]
    );
};
