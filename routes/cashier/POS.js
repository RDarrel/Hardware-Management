const router = require("express").Router(),
  {
    pos,
    find_transaction,
    returnProducts,
    refund,
  } = require("../../controllers/cashier/POS"),
  { validate } = require("../../middleware/jwt");

router
  .post("/save", validate, pos)
  .post("/return", validate, returnProducts)
  .post("/refund", validate, refund)
  .get("/find_transaction", validate, find_transaction);

module.exports = router;
