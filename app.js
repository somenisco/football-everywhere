const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Stadium = require("./models/stadiums");
const { urlencoded } = require("express");

mongoose.connect("mongodb://localhost:27017/stadiums", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify:false
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
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/stadiums", async (req, res) => {
  const stadiums = await Stadium.find({});
  res.render("stadiums/index", {stadiums});
});

app.get("/stadiums/new", async (req, res) => {
  res.render("stadiums/new");
});

app.get("/stadiums/:id", async (req, res) => {
  const stadium = await Stadium.findById(req.params.id);
  // console.log(req.params.id);
  res.render("stadiums/show", { stadium });
});

app.post("/stadiums", async (req, res) => {
  const stadium = new Stadium(req.body.stadium);
  await stadium.save();
  res.redirect(`/stadiums/${stadium.id}`);
  // console.log(stadium.id);
});

app.get("/stadiums/:id/edit", async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    // console.log(req.params.id);
    res.render("stadiums/edit", { stadium });
});


app.put("/stadiums/:id", async (req, res) => {
  const { id } = req.params;
  const stadium = await Stadium.findByIdAndUpdate(id, { ...req.body.stadium });
  res.redirect(`/stadiums/${stadium._id}`);
});

app.delete("/stadiums/:id", async (req, res) => {
  const { id } = req.params;
  await Stadium.findByIdAndDelete(id);
  res.redirect("/stadiums");
});

// app.get("/addstadium", async (req, res) => {
//   const stad = new Stadium({
//     title: "Old Trafford",
//     description: "Theatre of Dreams",
//     location: "Manchester, UK",
//   });
//   await stad.save(); // saving a new stadium
//   res.send(stad);
// });



app.listen(3000, () => {
  console.log("server 3000 connected");
});
