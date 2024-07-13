const router = require("express").Router(),
  { browse } = require("../../controllers/administrator/Dashboard"),
  { validate } = require("../../middleware/jwt");

router.get("/", validate, browse);

module.exports = router;
