const mongoose = require("mongoose"),
  { red, green } = require("colorette");

const connectToDB = () =>
  mongoose
    .connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(green("[MongoDB] connection established successfully."));
      return true;
    })
    .catch(err => {
      console.log(red("[MongoDB] connection failed."));
      throw new Error(err);
    });

module.exports = connectToDB;
