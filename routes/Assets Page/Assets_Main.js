//Needs to be in all files
const express = require("express");
const router = express.Router();

//Recieves HTTP POST requests at http://localhost:3000/api/assets_page/post
router.post("/post", async (req, res) => {
  const assets = req.app.get("db").db("itventory").collection("Assets");

  //insert items into DB
  let response = await assets.insertOne({
    item: req.body.item,
    modelNumber: req.body.modelNumber,
    manufacturer: req.body.manufacturer,
    stock: req.body.stock,
    allocated: "0",
  });

  res.json(response);
});

//Recieves HTTP GET requests at http://localhost:3000/api/assets_page/get
router.get("/get", async (req, res) => {
  const assets = req.app.get("db").db("itventory").collection("Assets");

  let documents = await assets.find({}).toArray();

  res.json(documents);
});

//Recieves HTTP POST requests at http://localhost:3000/api/assets_page/update
router.post("/update", async (req, res) => {
  const assets = req.app.get("db").db("itventory").collection("Assets");
  const test = req.app.get("db").db("itventory").collection("test");
  const indivAssets = req.app.get("db").db("itventory").collection("Individual Assets");

  //Update stock count
  let response = await assets.updateOne(
    { item: req.body.item },
    {
      $set: {
        [req.body.infoToUpdate]: req.body.valueToUpdateWith,
      },
    }
  );

  //Pull last used asset tag and add 1 to prevent duplicates
  let lastAssetTag = await test.find({}).toArray();
  lastAssetTag = lastAssetTag[0].lastAsset + 1;

  //While req.body.valueToUpdateWith > 0, insert an item into the Individual Assets collection with a unique asset tag
  //Subtract the current stock from the new to prevent more from being added than you already have
  let loopVar = Number(req.body.valueToUpdateWith) - Number(req.body.oldValue);
  while(loopVar > 0){
    response = await indivAssets.insertOne({
      item: req.body.item,
      asset: lastAssetTag,
      allocated: false,
    });
    //Increment the asset tag since it was used
    lastAssetTag++;
    loopVar--;
  }

  //Post the current state of lastAssetTag
  response = await test.updateOne({},{
    $set: {
      lastAsset: lastAssetTag,
    }
  });

  res.json(response);
});

//Recieves HTTP POST requests at http://localhost:3000/api/assets_page/delete
router.post("/delete", async (req, res) => {
  const assets = req.app.get("db").db("itventory").collection("Assets");

  let response = await assets.deleteOne({ item: req.body.item });
  res.json(response);
});

//DO NOT EVER FORGET THIS LINE
//OTHERWISE YOU WILL GET ERROR MESSAGES ABOUT MISSING MIDDLEWARE
module.exports = router;