const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const CatchAsync = require("../utils/CatchAsync");

const User = require("../models/user");
const users = require("../controllers/userscontrol");

router.get("/register", (users.renderRegister));

router.post(
  "/register",
  CatchAsync(users.register));

router.get("/login", (users.renderLogin));

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (users.login));

router.get("/logout", (users.logout));

module.exports = router;
