// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const dns = require('dns');
const urlParser = require('url');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  exercises: [{
    description: String,
    duration: Number,
    date: Date
  }]
});

const User = mongoose.model('User', userSchema);

app.post('/api/users', (req, res) => {
  const newUser = new User({ username: req.body.username });
  newUser.save((err, savedUser) => {
    if (err) return console.error(err);
    res.json(savedUser);
  });
});

app.post('/api/users/:_id/exercises', (req, res) => {
  User.findById(req.params._id, (err, foundUser) => {
    if (err) return console.error(err);
    foundUser.exercises.push({
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date ? new Date(req.body.date) : new Date()
    });
    foundUser.save((err, updatedUser) => {
      if (err) return console.error(err);
      res.json(updatedUser);
    });
  });
});

app.get('/api/users/:_id/logs', (req, res) => {
  User.findById(req.params._id, (err, foundUser) => {
    if (err) return console.error(err);
    res.json(foundUser.exercises);
  });
});
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
app.get("/api/whoami", (req, res) => {
  res.json({ipaddress: req.ip, language: req.headers["accept-language"], software: req.headers["user-agent"]});
})
let urlDatabase = {};
let id = 0;

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;
  const urlObject = urlParser.parse(originalUrl);

  // Check if the URL is in the correct format
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    res.json({ error: 'invalid url' });
    return;
  }

  // Check if the hostname exists
  dns.lookup(urlObject.hostname, (err) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      const shortUrl = id++;
      urlDatabase[shortUrl] = originalUrl;
      res.json({ original_url: originalUrl, short_url: shortUrl });
    }
  });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'invalid url' });
  }
});
/*
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
*/


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
