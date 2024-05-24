const router = require("express").Router(),
  { browse, find, update, save, destroy } = require("../controllers/Events"),
  { validate } = require("../middleware/jwt");

router
  .get("/", validate, browse)
  .get("/find", validate, find)
  .put("/update", validate, update)
  .post("/save", validate, save)
  .delete("/destroy", validate, destroy);

module.exports = router;
