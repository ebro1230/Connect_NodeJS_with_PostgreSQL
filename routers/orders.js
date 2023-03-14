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
  .route("/api/orders")
  .get((req, res, next) => {
    pool
      .query("SELECT * FROM orders;")
      .then(({ rows }) => res.json(rows))
      .catch((e) => res.sendStatus(500));
  })
  .post((req, res, next) => {
    const price = req.body.price;
    const date = new Date();
    const user_id = req.body.user_id;
    pool
      .query(
        "INSERT INTO orders(price, date, user_id) VALUES ($1, $2, $3) RETURNING *;",
        [price, date, user_id]
      )
      .then(({ rows }) => res.status(201).json(rows))
      .catch((e) => res.sendStatus(404));
  });
router
  .route("/api/orders/:id")
  .get((req, res, next) => {
    const id = req.params.id;
    pool
      .query("SELECT * FROM orders WHERE id=$1;", [id])
      .then(({ rows }) => res.json(rows))
      .catch((e) => res.sendStatus(404));
  })
  .put((req, res, next) => {
    const id = req.params.id;
    const price = req.query.price;
    const date = new Date();
    const user_id = req.query.user_id;
    pool
      .query(
        "UPDATE orders SET price=$1, date=$2, user_id=$3 WHERE id=$4 RETURNING *;",
        [price, date, user_id, id]
      )
      .then(({ rows }) => res.status(201).json(rows))
      .catch((e) => res.sendStatus(404));
  })
  .delete((req, res, next) => {
    const id = req.params.id;
    pool
      .query("DELETE FROM orders WHERE id=$1;", [id])
      .then(({ rows }) => res.status(201).json("Order Deleted"))
      .catch((e) => res.sendStatus(404));
  });

module.exports = router;
