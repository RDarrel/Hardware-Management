const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const Cart = require("../models/Cart");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  port: process.env.EMAIL_PORT,
  host: process.env.EMAIL_HOST,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let readHTMLFile = (path, cb) => {
  fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
    if (err) {
      throw err;
    } else {
      cb(null, html);
    }
  });
};

exports.sendLink = (req, res) => {
  readHTMLFile("./mails/link.html", (err, html) => {
    let template = handlebars.compile(html);
    let replacements = {
      link: req.body.link,
      message: req.body.message,
      appName: process.env.APP_NAME,
    };
    let htmlToSend = template(replacements);
    let msg = {
      from: `${process.env.APP_NAME} Team <${process.env.EMAIL_USER}>`,
      to: req.body.to,
      subject: req.body.subject,
      html: htmlToSend,
      attachments: [
        {
          filename: "default.png",
          path: "./assets/default.png",
          cid: "aplogo",
        },
      ],
    };
    transporter
      .sendMail(msg)
      .then(() => {
        return res.json({ message: "Email sent successfully." });
      })
      .catch((err) => () => {
        return res.json({ message: err });
      });
  });
};

exports.sendCode = (req, res) => {
  readHTMLFile("./mails/code.html", (err, html) => {
    let template = handlebars.compile(html);
    let replacements = {
      code: req.body.code,
      message: req.body.message,
      username: req.body.username,
      appName: process.env.APP_NAME,
    };
    let htmlToSend = template(replacements);
    let msg = {
      from: `${process.env.APP_NAME} Team <${process.env.EMAIL_USER}>`,
      to: req.body.to,
      subject: req.body.subject,
      html: htmlToSend,
      attachments: [
        {
          filename: "default.png",
          path: "./assets/default.png",
          cid: "aplogo",
        },
      ],
    };
    transporter
      .sendMail(msg)
      .then(() => {
        return res.json({ message: "Email sent successfully." });
      })
      .catch((err) => () => {
        return res.json({ message: err });
      });
  });
};

const handleRemoveCart = async (products) => {
  try {
    const idsToDelete = products.map(({ _id }) => _id).filter(Boolean);

    await Cart.deleteMany({ _id: { $in: idsToDelete } });
  } catch (error) {
    console.log("Error in remove cart", error.message);
  }
};
const handleFormattedTotal = (total) => {
  if (total % 1 !== 0) {
    const arrTotal = String(total).split(".");
    const decimalLength = arrTotal[1].length;
    return `${total.toLocaleString()}${decimalLength === 1 ? "0" : ""}`;
  } else {
    return `${total.toLocaleString()}.00`;
  }
};
exports.receipt = (req, res) => {
  const { products, total, date = "", to = "" } = req.body;
  handleRemoveCart(products);
  readHTMLFile("./mails/receipt.html", (err, html) => {
    let template = handlebars.compile(html);

    let replacements = {
      appName: process.env.APP_NAME,
      products,
      total: handleFormattedTotal(total),
      date,
    };
    let htmlToSend = template(replacements);
    let msg = {
      from: `${process.env.APP_NAME}  <${process.env.EMAIL_USER}>`,
      to,
      subject: "Quotation",
      html: htmlToSend,
      attachments: [
        {
          filename: "logo.png",
          path: "./assets/logo.jpg",
          cid: "aplogo",
        },
      ],
    };
    transporter
      .sendMail(msg)
      .then(() => {
        return res.json({
          message: "Receipt sent successfully.",
          payload: products,
        });
      })
      .catch(() => {
        return res.status(500).json({ message: "Failed to send receipt." });
      });
  });
};
