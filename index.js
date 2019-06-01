const express = require("express");
const compression = require("compression");
const app = express();

// const s3 = require("./s3");
// const db = require("./utils/db");
// const bc = require("./utils/bc");

app.use(compression());
app.use(express.static("public"));

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

// const csurf = require("csurf");
//
// app.use(csurf());
//
// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken();
//     res.setHeader("x-frame-options", "DENY");
//     next();
// });

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

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
