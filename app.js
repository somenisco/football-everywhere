const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Stadium = require("./models/stadiums");

mongoose.connect("mongodb://localhost:27017/stadiums", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.then(()=> {
  console.log("Database connecetd!!");
});
db.catch(err=> {
  console.log("Oh No error!!");
  console.log(err);
})


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join("__dirname", "../views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/addstadium", async (req, res) => {
  const stad = new Stadium({
    title: "Old Trafford",
    description: "Theatre of Dreams",
    location: "Manchester, UK",
  });
  await stad.save(); // saving a new stadium
  res.send(stad);
});

app.listen(3000, () => {
  console.log("server 3000 connected");
});
