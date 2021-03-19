const express = require("express");
const router = express.Router();

//to upload mutliple files to cloudinary database
const multer = require("multer");

//requiring the storage created in cloudinary
const { storage } = require("../cloudinary");
//we r specifying the destination of the files as the storage we created in cloudinary
const upload = multer({ storage });

const CatchAsync = require("../utils/CatchAsync");
const Stadium = require("../models/stadiums");
const { StadiumSchema } = require("../schemas.js");
const { isLoggedin, isAuthor, validateStadium } = require("../middlewares");
const stadiums = require("../controllers/stadiumscontrol");

router.get("/", CatchAsync(stadiums.index));

router.post(
  "/",
  isLoggedin,
  upload.array("image"),
  validateStadium,
  CatchAsync(stadiums.createStadium)
);

router.get("/new", isLoggedin, CatchAsync(stadiums.renderNewForm));

router.get("/:id", CatchAsync(stadiums.showStadium));

router.get(
  "/:id/edit",
  isLoggedin,
  isAuthor,
  CatchAsync(stadiums.renderEditForm)
);

router.put(
  "/:id",
  isLoggedin,
  isAuthor,
  upload.array("image"),
  validateStadium,
  CatchAsync(stadiums.updateStadium)
);

router.delete("/:id", isLoggedin, isAuthor, CatchAsync(stadiums.deleteStadium));

module.exports = router;
