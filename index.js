// index.js
var app = require('./server'); // import the app from server.js

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api", (req, res) => {
  res.json({unix: Date.now(), utc: Date()});
})

app.get("/api/:date", (req, res) => {
  let date = req.params.date;
  if (/\d{5,}/.test(date)) {
    date = +date;
  }
  let dateObj = new Date(date);
  if (dateObj.toString() === "Invalid Date") {
    res.json({error: "Invalid Date"});
  } else {
    res.json({unix: dateObj.valueOf(), utc: dateObj.toUTCString()});
  }
})