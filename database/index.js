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
      author: "6050bbb3d1c7b83db428f134",
      title: `${cities[i].title}`,
      images: [
        {
          url:
            "https://res.cloudinary.com/fancy/image/upload/v1615999753/Stadiums/dohaaumn5u7u8wmkxf0g.jpg",
          filename: "Stadiums/dohaaumn5u7u8wmkxf0g",
        },
        {
          url:
            "https://res.cloudinary.com/fancy/image/upload/v1615999761/Stadiums/utwxv5yrxr0o06bvc4vo.jpg",
          filename: "Stadiums/utwxv5yrxr0o06bvc4vo",
        },
      ],
      description: `${cities[i].description}`,
      capacity: `${cities[i].capacity}`,
      location: `${cities[i].city}, ${cities[i].country}`,
    });
    await stad.save();
  }
};

stadDB();
