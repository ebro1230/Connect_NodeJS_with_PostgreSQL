const express = require("express");
const app = express();
const PORT = 3000;
const users = require("./routers/users");
const orders = require("./routers/orders");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(users);
app.use(orders);

app.listen(PORT, () => {
  console.log(`Hello.  Listening on port ${PORT}`);
});
