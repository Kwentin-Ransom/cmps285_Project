//Needs to be in all files
const express = require("express");
const router = express.Router();

//Recieves HTTP GET requests at http://localhost:3000/api/home_page/getBarChartData
router.get("/getBarChartData", async (req, res) => {
  const client_orders = req.app
    .get("db")
    .db("itventory")
    .collection("Client Orders");

  let documents = await client_orders.find({}).toArray();

  res.json(documents);
});

//Recieves HTTP GET requests at http://localhost:3000/api/home_page/getTableData
router.get("/getTableData", async (req, res) => {
  //Establishes a connection to the "Assets" collection
  let assets = req.app.get("db").db("itventory").collection("Assets");

  let documents = await assets.find({}).toArray();
  
  res.json(documents);
});

module.exports = router;