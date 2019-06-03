const express = require("express");
const db = require("./utils/db");
const bc = require("./utils/bc");
const compression = require("compression");
const app = express();
// const s3 = require("./s3");

app.use(compression());
app.use(express.static("public"));
app.use(express.json());

// ############################### body parser + cookies ############################# //

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

// ################################ + vulnerabilities ################################ //

const csurf = require("csurf");

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// ################################################################################## //

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

// ################################# GET AND POST ################################# //

app.get("*", function(req, res) {
    if (!req.session.userId && req.url != "/welcome") {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", function(req, res) {
    console.log(req.body);
    bc.hashPassword(req.body.password)
        .then(hashedPw => {
            db.addUser(req.body.first, req.body.last, req.body.email, hashedPw)
                .then(results => {
                    req.session.userId = results.rows[0].id;
                    res.json({ success: true });
                })
                .catch(err => {
                    console.log("error in POST registration", err);
                    res.json({ error: "" });
                });
        })
        .catch(err => {
            console.log("error in bc.hashPassword POST registration", err);
        });
});
app.listen(8080, function() {
    console.log("I'm listening");
});
