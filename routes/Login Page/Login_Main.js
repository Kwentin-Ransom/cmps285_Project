const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

//Recieves HTTP POST requests at http://localhost:3000/api/login_page/signup
//Used for adding users to the database
router.post("/signup", async (req, res) => {
  //Assume that the password is already hashed when sent
  const users = req.app.get("db").db("itventory").collection("Users");

  //Once hased, post the user information to the database
  let response = await users.insertOne({
    username: req.body.username,
    password: req.body.password,
  });
  res.json(response);
  //on the front-end file, if the response is 200, consider the user logged in
});

//Recieves HTTP POST requests at http://localhost:3000/api/login_page/login
//Used for logging users in
router.post("/login", async (req, res) => {
  const users = req.app.get("db").db("itventory").collection("Users");
  let username = req.body.username;

  //Get user information from db
  let user = await users.findOne({ username: username });

  res.json(user);
});

module.exports = router;
