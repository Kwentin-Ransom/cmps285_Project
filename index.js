//Required imports
const express = require("express");
const app = express();
const path = require("path");

//Establishes a variable "client" with the database connection info
//Login information is in Secret.js, which is in the .gitignore so it must be locally created on each machine
let MongoClient = require("mongodb").MongoClient;
let getSecret = require("./Secret");
let client = new MongoClient(getSecret("uri"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Allows the app to read JSON data
app.use(express.json());

//Login Routing
app.use("/api/login_page",require("./routes/Login Page/Login_Main"));

//Routes to each page's respective backend file, does not need .js for the file
app.use("/api/clients_page", require("./routes/Clients Page/Clients_Main"));
app.use("/api/home_page", require("./routes/Home Page/Home_Main"));
app.use(
  "/api/assets_page",
  require("./routes/Assets Page/Assets_Main")
);
app.use("/api/orders_page", require("./routes/Orders Page/Orders_Main"));

//All are needed to prevent crashing on page refresh, this is also what serves the frontend to the browser
app.set("views", path.join(__dirname, "views"));
app.use(express.static("./client/build"));
app.get("*", (req, res) => {
  //our GET route needs to point to the index.html in our build
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

//Sets the port of the app to whatever the host is using, or 3000 for local development
app.set("port", process.env.PORT || 3000);

//Connect to database and start the app
client.connect((err, database) => {
  if (err) {
    console.log(err);
  }

  //Allows for database operation in other files without starting a whole new connection every time
  app.set("db", database);

  app.listen(app.get("port"), () => {
    console.log("Express server listening on port " + app.get("port"));
  });
});

module.exports = app;