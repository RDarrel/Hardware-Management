const router = require("express").Router(),
  { browse } = require("../controllers/Notifications"),
  { validate } = require("../middleware/jwt");

router.get("/", validate, browse);

module.exports = router;
