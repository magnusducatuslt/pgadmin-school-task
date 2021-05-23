const path = require("path");
const jwt = require("jsonwebtoken");
const db = require(path.resolve(process.cwd(), "./db"));
const { DataTypes } = require("sequelize");
const User = require(path.resolve(process.cwd(), "./models/user"))(
  db,
  DataTypes
);

module.exports = function (req, res, next) {
  console.log("middleware");
  if (req.method == "OPTIONS") {
    next(); // allowing options as a method for request
  } else {
    const sessionToken = req.headers.authorization;
    console.log(sessionToken);
    if (!sessionToken)
      return res
        .status(403)
        .send({ auth: false, message: "No token provided." });
    else {
      jwt.verify(sessionToken, "lets_play_sum_games_man", (err, decoded) => {
        if (decoded) {
          User.findOne({ where: { id: decoded.id } }).then(
            (user) => {
              req.user = user;
              console.log(`user: ${user}`);
              next();
            },
            function () {
              res.status(401).send({ error: "not authorized" });
            }
          );
        } else {
          res.status(400).send({ error: "not authorized" });
        }
      });
    }
  }
};
