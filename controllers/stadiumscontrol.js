const Stadium = require("../models/stadiums");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const stadiums = await Stadium.find({});
  res.render("stadiums/index", { stadiums });
};

module.exports.renderNewForm = (req, res) => {
  res.render("stadiums/new");
};

module.exports.createStadium = async (req, res, next) => {
  const stadium = new Stadium(req.body.stadium);
  stadium.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  stadium.author = req.user._id;
  await stadium.save();
  // console.log(stadium);
  req.flash("success", "successfully created a new stadium!!");
  return res.redirect(`/stadiums/${stadium.id}`);
};

module.exports.showStadium = async (req, res) => {
  const stadium = await Stadium.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!stadium) {
    req.flash("error", "Not Found!!");
    return res.redirect("/stadiums");
  }
  res.render("stadiums/show", { stadium });
};

module.exports.renderEditForm = async (req, res) => {
  const stadium = await Stadium.findById(req.params.id);
  if (!stadium) {
    req.flash("error", "Not Found!!");
    return res.redirect("/stadiums");
  }
  res.render("stadiums/edit", { stadium });
};

module.exports.updateStadium = async (req, res) => {
  const { id } = req.params;
  const stadium = await Stadium.findByIdAndUpdate(id, {
    ...req.body.stadium,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  stadium.images.push(...imgs);
  await stadium.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await stadium.updateOne({
      $pull: {
        images: { filename: { $in: req.body.deleteImages } },
      }
    });
  }
  req.flash("success", "successfully updated the stadium!!");
  res.redirect(`/stadiums/${stadium._id}`);
};

module.exports.deleteStadium = async (req, res) => {
  const { id } = req.params;
  await Stadium.findByIdAndDelete(id);
  req.flash("success", "successfully deleted the stadium!!");
  res.redirect("/stadiums");
};
