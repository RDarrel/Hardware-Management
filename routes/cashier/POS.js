const router = require("express").Router(),
  { save } = require("../../controllers/cashier/POS"),
  { validate } = require("../../middleware/jwt");

router.post("/save", validate, save);

module.exports = router;
