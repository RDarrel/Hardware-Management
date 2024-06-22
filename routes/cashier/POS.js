const router = require("express").Router(),
  { pos, find_transaction } = require("../../controllers/cashier/POS"),
  { validate } = require("../../middleware/jwt");

router
  .post("/save", validate, pos)
  .get("/find_transaction", validate, find_transaction);

module.exports = router;
