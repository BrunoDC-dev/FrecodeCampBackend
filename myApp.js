require('dotenv').config();
//import body parser
let bodyParser = require('body-parser');
let express = require('express');
const req = require('express/lib/request');
let app = express();
bodyParser.urlencoded({extended: false});

console.log("Hello World");
//ip logger
app.use(function(req, res, next) {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
})
app.use("/public", express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
})

app.get("/json", function(req, res) {
    let message = "Hello json";
    if (process.env.MESSAGE_STYLE === "uppercase") {
        message = message.toUpperCase();
    }
    res.json({"message": message});
})

app.get("/now", function(req, res, next) {
    req.time = new Date().toString();
    next();
}
, function(req, res) {
    res.json({"time": req.time});
}
)

app.get("/:word/echo", function(req, res) {
    res.json({"echo": req.params.word});
}
)

app.get("/name", function(req, res) {
    let firstName = req.query.first;
    let lastName = req.query.last;
    res.json({"name": firstName + " " + lastName});
}
)

app.post("/name", function(req, res) {
    let firstName = req.body.first;
    let lastName = req.body.last;
    res.json({"name": firstName + " " + lastName});
}
)






























 module.exports = app;
