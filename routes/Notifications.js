const router = require("express").Router(),
  { browse, destroy } = require("../controllers/Notifications"),
  { validate } = require("../middleware/jwt");

router.get("/", validate, browse).delete("/destroy", destroy, validate);

module.exports = router;
