const express = require("express");
const db = require("./utils/db");
const bc = require("./utils/bc");
const compression = require("compression");
const app = express();
const s3 = require("./s3");

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
app.use(
    cookieSession({
        secret: `I won't say`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

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
            const avatar = results.rows[0].avatar || "/img/panda3.svg";
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
    console.log("made it to other profile");
    let id = req.params.id;
    console.log("req.params.id:", req.params.id);
    if (id == req.session.userId) {
        res.json({ success: false });
    } else {
        db.userInfo(id)
            .then(results => {
                res.json(results.rows[0]);
            })
            .catch(err => {
                console.log("other profile GET err", err);
            });
    }
});

// app.get("/users", function(req, res, next) {});
// ################################# logout ################################# //

app.get("/logout", function(req, res) {
    req.session.userId = null;
    res.redirect("/");
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
                console.log("editbio post err", err);
            });
    } else {
        res.json({
            success: false
        });
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

app.listen(8080, function() {
    console.log("I'm listening");
});
