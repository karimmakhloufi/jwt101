const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const users = new Map();

const jwtKey = "my_secret_key";

users.set("admin", {
  hash: bcrypt.hashSync("thisisthepass", 10),
  role: "admin",
});

app.use("/admin", (req, res, next) => {
  try {
    const payload = jwt.verify(req.headers.bearer, jwtKey);
    if (payload.role === "admin") {
      next();
    } else {
      throw Error("catch this please");
    }
  } catch (err) {
    res.status(400).send("bad token");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  if (users.has(req.body.username)) {
    res.status(400).send("username already in use");
  } else {
    const hash = bcrypt.hashSync(req.body.password, 10);
    users.set(req.body.username, {
      hash: hash,
      role: "user",
    });
    res.send(hash);
  }
});

app.post("/login", (req, res) => {
  if (users.has(req.body.username)) {
    if (
      bcrypt.compareSync(req.body.password, users.get(req.body.username).hash)
    ) {
      const token = jwt.sign(
        {
          username: req.body.username,
          role: users.get(req.body.username).role,
        },
        jwtKey,
        {
          algorithm: "HS256",
        }
      );
      res.send({ jwt: token });
    } else {
      res.status(400).send("login error");
    }
  } else {
    res.status(400).send("login error");
  }
});

app.get("/admin/adminpanel", (req, res) => {
  res.send("hello admin");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
