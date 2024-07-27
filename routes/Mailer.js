const router = require("express").Router(),
  { sendLink, sendCode, receipt } = require("../controllers/Mailer");

router
  .post("/link", sendLink)
  .post("/code", sendCode)
  .post("/receipt", receipt);

module.exports = router;
