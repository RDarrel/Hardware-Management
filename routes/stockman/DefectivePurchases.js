const router = require("express").Router(),
  { browse } = require("../../controllers/stockman/DefectivePurchases"),
  { validate } = require("../../middleware/jwt");

router.get("/", validate, browse);

module.exports = router;
