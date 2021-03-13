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
    // const random10 = Math.floor(Math.random() * 10);
    // console.log(cities[i].title);
    const stad = new stadiums({
      title: `${cities[i].title}`,
      image: `${cities[i].image}`,
      description: `${cities[i].description}`,
      capacity: `${cities[i].capacity}`,
      location: `${cities[i].city}, ${cities[i].country}`,
    });
    await stad.save();
  }
};

stadDB();
