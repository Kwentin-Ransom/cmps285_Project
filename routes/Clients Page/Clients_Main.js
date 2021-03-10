//Needs to be in all files
const express = require("express");
const router = express.Router();

//Recieves HTTP GET requests at http://localhost:3000/api/clients_page/clientInfo
//Used to get all client data
router.get("/clientInfo", async (req, res) => {
  const clients = req.app.get("db").db("itventory").collection("Clients");

  let documents = await clients.find({}).toArray();
  res.json(documents);
});

//Recieves HTTP POST requests at http://localhost:3000/api/clients_page/postInfo
//Used to post client info
router.post("/postInfo", async (req, res) => {
  const clients = req.app.get("db").db("itventory").collection("Clients");

  let response = await clients.insertOne({
    client: req.body.client,
    phoneNumber: req.body.phoneNumber,
    city: req.body.city,
    state: req.body.state,
    address: req.body.address,
    email: req.body.email,
  });
  res.json(response);
});

//Recieves HTTP POST requests at http://localhost:3000/api/clients_page/updateInfo
//Used to update client info
router.post("/updateInfo", async (req, res) => {
  const clients = req.app.get("db").db("itventory").collection("Clients");

  let response = await clients.updateOne(
    {
      client: req.body.client,
    },
    {
      $set: {
        [req.body.infoToUpdate]: req.body.valueToUpdateWith,
      },
    }
  );

  res.json(response);
});

//DO NOT EVER FORGET THIS LINE
//OTHERWISE YOU WILL GET ERROR MESSAGES ABOUT MISSING MIDDLEWARE
module.exports = router;
