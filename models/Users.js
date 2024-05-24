const mongoose = require("mongoose"),
  bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      fname: {
        type: String,
        trim: true,
        default: "",
      },
      mname: {
        type: String,
        trim: true,
        default: "",
      },
      lname: {
        type: String,
        trim: true,
        default: "",
      },
      suffix: {
        type: String,
        default: "",
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
        default: "",
      },
      barangay: {
        type: String,
        trim: true,
        default: "",
      },
      city: {
        type: String,
        trim: true,
        default: "",
      },
      province: {
        type: String,
        trim: true,
        default: "",
      },
      region: {
        type: String,
        trim: true,
        default: "",
      },
    },
    dob: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "CASHIER",
    },
    mobile: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isMale: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: "",
    },
    wasBanned: {
      type: Boolean,
      default: false,
    },
    banned: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      at: {
        type: String,
      },
      for: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
