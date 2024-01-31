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

app.get("/api/:date?", (req, res) => {
  let date = req.params.date;

  // If no date is provided, use the current date
  if (!date) {
    date = new Date();
  } else {
    // Check if date is a unix timestamp
    if (/\d{5,}/.test(date)) {
      date = parseInt(date);
    }
    date = new Date(date);
  }

  // Check if date is valid
  if (date.toUTCString() === "Invalid Date") {
    res.json({error: "Invalid Date"});
  } else {
    res.json({unix: date.getTime(), utc: date.toUTCString()});
  }
});