const Entity = require("../models/Users"),
  generateToken = require("../config/generateToken"),
  bcrypt = require("bcryptjs"),
  fs = require("fs");

exports.login = (req, res) => {
  const { email, password } = req.query;

  Entity.findOne({ email })
    .select("-createdAt -updatedAt -__v")
    .then(async (item) => {
      if (!item)
        return res.status(404).json({
          error: "User Not Found",
          message: "The provided Credentials does not exist.",
        });

      if (item.wasBanned)
        return res.status(400).json({
          error:
            "Your account has been suspended by an admin due to a violation of our terms of service. Please contact support for further details and assistance.",
          message: item.banned.for,
        });

      if (!(await item.matchPassword(password)))
        return res.status(400).json({
          error: "Invalid Credentials",
          message: "The provided Credentials does not match.",
        });

      const user = { ...item._doc };
      delete user.password;

      res.json({
        success: "Login Success",
        payload: {
          token: generateToken({ _id: item._id, role: item.role }),
          user,
        },
      });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

exports.changePassword = async (req, res) => {
  const { newPassword = "", _id, oldPassword } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashNewPassword = await bcrypt.hash(newPassword, salt);
  const entity = await Entity.findOne({ _id });
  const isMatch = await bcrypt.compare(oldPassword, entity.password);

  if (!isMatch) {
    res.json({
      error: "Incorrect Password",
      message: "Your provided old password is incorrect.",
    });
  } else {
    Entity.findByIdAndUpdate(_id, { password: hashNewPassword }, { new: true })
      .then((item) => {
        if (item) {
          res.json({
            message: "",
            success: "Password Change Successfully",
            payload: item,
          });
        } else {
          res.status(404).json({
            error: "ID Not Found",
            message: "The provided ID does not exist.",
          });
        }
      })
      .catch((error) =>
        res.status(400).json({ error: handleDuplicate(error) })
      );
  }
};

exports.provideAuth = (req, res) =>
  res.json({
    success: "Validatation Success",
    payload: res.locals.caller,
  });

exports.upload = (req, res) => {
  const { path, base64, name } = req.body;
  const url = `./assets/${path}`;
  if (!fs.existsSync(url)) {
    fs.mkdirSync(url, { recursive: true });
  }
  try {
    fs.writeFileSync(`${url}/${name}`, base64, "base64");
    return res.json({ message: "File Uploaded Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
