const mongoose = require("mongoose");
const stadiums = require("../models/stadiums");
const Stadium = require("../models/stadiums");
const cities = require("../database/cities");

mongoose.connect("mongodb://localhost:27017/stadiums", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.then(() => {
  console.log("Database connecetd!!");
});
db.catch((err) => {
  console.log("Oh No error!!");
  console.log(err);
});

const stadDB = async () => {
  await Stadium.deleteMany({});
  for (var i = 0; i < 10; i++) {
    const random10 = Math.floor(Math.random() * 10);
    const stad = new stadiums({
      title: `${cities[random10].title}`,
      description: `${cities[random10].description}`,
      capacity: `${cities[random10].capacity}`,
      location: `${cities[random10].city}, ${cities[random10].country}`,
    });
    await stad.save();
  }
};

stadDB();
