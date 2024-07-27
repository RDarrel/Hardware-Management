const router = require("express").Router(),
  { sendLink, sendCode, receipt } = require("../controllers/Mailer");

router
  .post("/link", sendLink)
  .post("/code", sendCode)
  .post("/generateReceipt", receipt);

module.exports = router;
