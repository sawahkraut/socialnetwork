const express = require("express");
const db = require("./utils/db");
const bc = require("./utils/bc");
const compression = require("compression");
const app = express();
const s3 = require("./s3");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
// (server, { origins: "localhost:8080" saratu.heroku.app:* });

app.use(compression());
app.use(express.static("public"));
app.use(express.json());

// ########################### body parser + cookies ######################## //

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// ############################ + vulnerabilities ########################### //

const csurf = require("csurf");

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// ########################################################################## //

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// ############################ upload img setup ############################ //

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

// ########################################################################## //
// ############################### GET ROUTES ############################### //

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/user", function(req, res) {
    db.userInfo(req.session.userId)
        .then(results => {
            // console.log("feathers typing", results);
            const avatar = results.rows[0].avatar || "/img/pig.jpg";
            res.json({
                id: req.session.userId,
                first: results.rows[0].first,
                last: results.rows[0].last,
                bio: results.rows[0].bio,
                avatar: avatar
            });
        })
        .catch(err => {
            console.log("err", err);
        });
});

app.get("/otherprofile/:id", function(req, res) {
    // console.log("made it to other profile");
    let id = req.params.id;
    // console.log("req.params.id:", req.params.id);
    if (id == req.session.userId) {
        res.json({ success: false });
    } else {
        db.userInfo(id)
            .then(results => {
                res.json(results.rows[0]);
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.get("/findusers", async (req, res) => {
    // because of params; { name:name } in findusers.js
    let name = req.query.name;
    if (!name || name == "") {
        try {
            const lastUsers = await db.lastUsers(req.session.userId);
            res.json({ users: lastUsers.rows });
        } catch (e) {
            console.log(e);
        }
    } else {
        try {
            const userArr = await db.findUsers(req.session.userId, name);
            res.json({ users: userArr.rows });
        } catch (e) {
            console.log(e);
        }
    }
});

app.get("/logoutUser", function(req, res) {
    req.session = null;
    res.redirect("/welcome");
});

// ############################ Friend Requests ############################# //

// defines user relationship
app.get("/friends/:id", async (req, res) => {
    const friends = await db.getFriends(req.params.id, req.session.userId);
    if (!friends.rows[0]) {
        // console.log(" send friend request");
        res.json({
            friends: false,
            friendsButton: "Send Friend Request"
        });
    } else if (friends.rows[0].accepted == true) {
        // console.log("end friend ship");
        res.json({
            friends: true,
            friendsButton: "End Friendship"
        });
    } else if (
        friends.rows[0].accepted == false &&
        friends.rows[0].sender_id == req.session.userId
    ) {
        // console.log("cancel friend ship");

        res.json({
            friends: "cancel",
            friendsButton: "Cancel Friend Request"
        });
    } else if (
        friends.rows[0].accepted == false &&
        friends.rows[0].receiver_id == req.session.userId
    ) {
        // console.log("accept friend request");
        res.json({
            friends: "pending",
            friendsButton: "Accept Friend Request "
        });
    }
});

// sets a relationship status of users
app.post("/friends", async (req, res) => {
    // console.log("req.body", req.body);
    if (req.body.friends == false) {
        await db.startFriendship(req.body.callId, req.session.userId);
        res.json({
            friends: "cancel",
            friendsButton: "Cancel Friend Request"
        });
    } else if (
        req.body.friends == true ||
        req.body.friends == "cancel" ||
        req.body.friends == "reject"
    ) {
        await db.deleteFriend(req.body.callId, req.session.userId);
        res.json({
            success: true,
            friends: false,
            friendsButton: "Send Friend Request"
        });
    } else if (req.body.friends == "pending") {
        await db.updateFriend(req.body.callId, req.session.userId);
        res.json({
            success: true,
            friends: true,
            friendsButton: "End Friendship"
        });
    }
});

// ############################## POST ROUTES ############################### //

app.post("/register", function(req, res) {
    bc.hashPassword(req.body.password)
        .then(hashedPw => {
            db.addUser(req.body.first, req.body.last, req.body.email, hashedPw)
                .then(results => {
                    req.session.userId = results.rows[0].id;
                    res.json({ success: true });
                })
                .catch(err => {
                    res.json({ error: "Oh snap! You got an error!", err });
                });
        })
        .catch(err => {
            // console.log("error in bc.hashPassword POST registration", err);
            res.json({ error: "invalid credentials", err });
        });
});

app.post("/login", function(req, res) {
    db.getUser(req.body.email).then(userLogin => {
        const hashedPw = userLogin.rows[0].password;
        bc.checkPassword(req.body.password, hashedPw)
            .then(results => {
                // console.log(results, userLogin.rows[0]);
                if (results) {
                    req.session.userId = userLogin.rows[0].id;
                    res.json({ success: true });
                } else {
                    throw new Error();
                }
            })
            .catch(err => {
                console.log(err);
                res.json({
                    error: "You have entered an invalid email or password"
                });
            });
    });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    s3.deleteImage(req.body.imgUrl);
    console.log("DELTED IMG URL", req.body.imgUrl);
    const link =
        `https://s3.amazonaws.com/salt-sawahkraut/` + req.file.filename;
    db.pushImg(req.session.userId, link)
        .then(() => res.json(link))
        .catch(err => {
            console.log(err);
            res.json({ error: "Upload failed. Please try again" });
        });
});

// ################################ edit bio ################################ //

app.post("/editbio", function(req, res) {
    if (req.body.bio) {
        let bio = req.body.bio;
        let id = req.session.userId;
        db.updateBio(bio, id)
            .then(results => {
                res.json(results.rows[0].bio);
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        res.json({
            success: false
        });
    }
});

// ######################### get friends list ############################### //

app.get("/get-friends-list", async (req, res) => {
    const friendList = await db.getFriendsList(req.session.userId);
    // console.log("friendList.rows", friendList.rows);
    res.json({ friends: friendList.rows });
});

// ######################### delete account ############################### //

app.post("/delete-account", async (req, res) => {
    // console.log("/delete-account", req.body.imgUrl);
    try {
        // console.log("DELETE ACCOUNT USER_ID", req.session.userId);
        s3.deleteImage(req.body.imgUrl);
        await db.deleteAccount(req.session.userId);
        req.session = null;
        res.json({
            success: true
        });
    } catch (err) {
        console.log("delete-account error", err);
    }
});

// ########################################################################## //

app.get("*", function(req, res) {
    if (!req.session.userId && req.url != "/welcome") {
        res.redirect("/welcome");
    } else if (req.session.userId && req.url == "/welcome") {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening");
});

// ######################## SOCKET IO ######################## //

// socket - object that represents a server connection

io.on("connection", socket => {
    console.log(`Socket with id ${socket.id} just connected`);
    socket.on("disconnect", () => {
        console.log(`Socket with id ${socket.id} just disconnected`);
    });
    db.getMessages()
        .then(results => {
            // console.log("chat results", results.rows);
            socket.emit("chatMessages", results.rows.reverse());
        })
        .catch(err => console.log(err));

    socket.on("chatMessage", async msg => {
        console.log(msg);
        try {
            const newChat = await db.newChat(
                socket.request.session.userId,
                msg
            );
            const newChatInfo = await db.newChatInfo(newChat.rows[0].id);
            // console.log("new chat info", newChatInfo.rows[0]);
            io.sockets.emit("chatMessage", newChatInfo.rows[0]);
        } catch (e) {
            console.log(e);
        }
    });
});
