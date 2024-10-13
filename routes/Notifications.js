const router = require("express").Router(),
  { browse, destroy, update } = require("../controllers/Notifications"),
  { validate } = require("../middleware/jwt");

router
  .get("/", validate, browse)
  .delete("/destroy", validate, destroy)
  .put("/update", validate, update);

module.exports = router;
