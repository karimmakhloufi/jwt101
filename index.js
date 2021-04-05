const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const e = require("express");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const users = new Map();
users.set("admin", {
  hash: bcrypt.hashSync("thisisthepass", 10),
  role: "admin",
});

app.get("/", (req, res) => {
  console.log("hello world req");
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  console.log(req.body);
  if (users.has(req.body.username)) {
    res.status(400).send("username already in use");
  } else {
    const hash = bcrypt.hashSync(req.body.password, 10);
    users.set(req.body.username, {
      hash: hash,
      role: "user",
    });
    console.log(users);
    res.send(hash);
  }
});

app.post("/login", (req, res) => {
  console.log(req.body);
  if (users.has(req.body.username)) {
    if (
      bcrypt.compareSync(req.body.password, users.get(req.body.username).hash)
    ) {
      res.send("oui");
    } else {
      res.status(400).send("login error");
    }
  } else {
    res.status(400).send("login error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
