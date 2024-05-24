const router = require("express").Router(),
  { browse } = require("../../controllers/administrator/Employees"),
  { validate } = require("../../middleware/jwt");

router.get("/", validate, browse);

module.exports = router;
