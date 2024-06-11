const router = require("express").Router(),
  { pos } = require("../../controllers/cashier/POS"),
  { validate } = require("../../middleware/jwt");

router.post("/save", validate, pos);

module.exports = router;
