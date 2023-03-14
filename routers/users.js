const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const url = require("url");
require("dotenv").config();

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(":");

const config = {
  user: auth[0],
  host: params.hostname,
  database: process.env.DATABASE_NAME,
  password: auth[1],
  port: 5432,
};

const pool = new Pool(config);

router
  .route("/api/users")
  .get((req, res, next) => {
    pool
      .query("SELECT * FROM users;")
      .then(({ rows }) => res.json(rows))
      .catch((e) => res.sendStatus(500));
  })
  .post((req, res, next) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const age = req.body.age;
    pool
      .query(
        "INSERT INTO users(first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *;",
        [first_name, last_name, age]
      )
      .then(({ rows }) => res.status(201).json(rows))
      .catch((e) => res.sendStatus(404));
  });
router
  .route("/api/users/:id")
  .get((req, res, next) => {
    const id = req.params.id;
    pool
      .query("SELECT * FROM users WHERE id=$1;", [id])
      .then(({ rows }) => res.json(rows))
      .catch((e) => res.sendStatus(404));
  })
  .put((req, res, next) => {
    const id = req.params.id;
    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    const age = req.query.age;
    pool
      .query(
        "UPDATE users SET first_name=$1, last_name=$2, age=$3 WHERE id=$4 RETURNING *;",
        [first_name, last_name, age, id]
      )
      .then(({ rows }) => res.status(201).json(rows))
      .catch((e) => res.sendStatus(404));
  })
  .delete((req, res, next) => {
    const id = req.params.id;
    pool
      .query("DELETE FROM users WHERE id=$1;", [id])
      .then(({ rows }) => res.status(201).json("User Deleted"))
      .catch((e) => res.sendStatus(404));
  });

module.exports = router;
