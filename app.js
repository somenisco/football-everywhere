if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


// require("dotenv").config();
// console.log(process.env.CLOUDINARY_SECRET);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const helmet = require("helmet");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// const CatchAsync = require("./utils/CatchAsync");
const ExpressError = require("./utils/ExpressError");
// const Stadium = require("./models/stadiums");
// const Review = require("./models/review");
// const { StadiumSchema, reviewSchema } = require("./schemas.js");
const { urlencoded } = require("express");
const { error } = require("console");
const stadiumsRoutes = require("./routes/stadium");
const reviewsRoutes = require("./routes/reviews");
const UserRoutes = require("./routes/users");

//for common security issues
const mongoSanitize = require("express-mongo-sanitize");


const MongoDBStore = require("connect-mongo")(session);

//database mongoatlas
const db_url = process.env.DB_URL || "mongodb://localhost:27017/stadiums";

//mongodb://localhost:27017/stadiums

mongoose.connect(db_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

const db = mongoose.connection;

db.then(() => {
  console.log("Database connecetd!!");
});
db.catch((err) => {
  console.log("Oh No error!!");
  console.log(err);
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join("__dirname", "../views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);


const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = new MongoDBStore({
  url: db_url,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionconfig = {
  store,
  //name the session so that it will  not be accesible to others
  name: "usersession",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionconfig));
app.use(flash());

//for security
app.use(helmet());

//allowed urls
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
//This is the array that needs added to
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
  "https://ka-f.fontawesome.com/releases/v5.15.2/css/",
];

const fontSrcUrls = [
  "https://ka-f.fontawesome.com/releases/v5.15.2/webfonts/",
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/fancy/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  if (!["/login", "/"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", UserRoutes);
app.use("/stadiums", stadiumsRoutes);
app.use("/stadiums/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!!";
  res.status(statusCode).render("error1", { err });
});

app.listen(3000, () => {
  console.log("server 3000 connected");
});
