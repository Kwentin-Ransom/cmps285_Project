//Needs to be in all files
const express = require("express");
const router = express.Router();

//Recieves HTTP GET requests at http://localhost:3000/api/orders_page/get
//For populating Order Table
router.get("/getAssets", async (req, res) => {
  const assets = req.app.get("db").db("itventory").collection("Assets");

  let documents = await assets.find({}).toArray();

  res.json(documents);
});

//Recieves HTTP GET requests at http://localhost:3000/api/orders_page/getClientOrders
//For populating Client Order Table
router.get("/getClientOrders", async (req, res) => {
  const clientOrders = req.app
    .get("db")
    .db("itventory")
    .collection("Client Orders");
  const indivAssets = req.app
    .get("db")
    .db("itventory")
    .collection("Individual Assets");

  let documents = await clientOrders.find({}).toArray();

  //Pull all Asset ID's for said client
  let indivAssetsData = await indivAssets.find({}).toArray();
  //For each client order
  documents.forEach((document) => {
    //pull the asset tags of what items are associated with said client
    let assetTagsForClient = [];
    indivAssetsData.forEach((item) => {
      if (
        document.clientName === item.allocated.client &&
        document.item === item.item
      ) {
        assetTagsForClient.push(item.asset);
      }
    });
    //Add those assets to the order they are associated with
    Object.assign(document, { assets: assetTagsForClient });
  });

  res.json(documents);
});

//Recieves HTTP GET requests at http://localhost:3000/api/orders_page/getOrderNumber
//For filling the order number text box
router.get("/getOrderNumber", async (req, res) => {
  const clientOrders = req.app
    .get("db")
    .db("itventory")
    .collection("Client Orders");

  let documents = await clientOrders
    .find({}, { projection: { _id: 0, orderNumber: 1 } })
    .sort({
      orderNumber: -1,
    })
    .toArray();

  res.json(documents);
});

//Recieves HTTP GET requests at http://localhost:3000/api/orders_page/getClientNames
//For filling the order number text box
router.get("/getClientNames", async (req, res) => {
  const clients = req.app.get("db").db("itventory").collection("Clients");

  let documents = await clients
    .find({}, { projection: { client: 1 } })
    .toArray();

  res.json(documents);
});

//Recieves HTTP POST requests at http://localhost:3000/api/orders_page/post
//For inserting a client order
router.post("/post", async (req, res) => {
  const clientOrders = req.app
    .get("db")
    .db("itventory")
    .collection("Client Orders");
  const indivAssets = req.app
    .get("db")
    .db("itventory")
    .collection("Individual Assets");

  //Insert an order
  let response = clientOrders.insertOne({
    item: req.body.item,
    allocated: req.body.allocated,
    clientName: req.body.clientName,
    orderNumber: req.body.orderNumber,
    notes: req.body.notes,
    technician: req.body.technician,
    poNumber: req.body.poNumber,
  });

  //While numAllocated > 0, set allocated: the client that the item
  //is allocated to in Individual Assets
  let numAllocated = Number(req.body.allocated);
  while (numAllocated > 0) {
    response = await indivAssets.updateOne(
      {
        item: req.body.item,
        allocated: false,
      },
      {
        $set: {
          allocated: {
            client: req.body.clientName,
          },
        },
      }
    );
    numAllocated--;
  }

  res.json(response);
});

//Recieves HTTP POST requests at http://localhost:3000/api/orders_page/update
//For removing stock from an asset when an item is allocated
router.post("/update", async (req, res) => {
  //Establish a database connection
  const assets = req.app.get("db").db("itventory").collection("Assets");

  let document = await assets.find({ item: req.body.item }).toArray();
  let newValue = document[0].stock - req.body.allocated;
  let result = await assets.updateOne(
    { item: req.body.item },
    { $set: { stock: newValue.toString() } }
  );

  res.json(result);
});

module.exports = router;
