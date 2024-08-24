const router = require("express").Router(),
  { browse, destroy, save, update } = require("../controllers/Quotations"),
  { validate } = require("../middleware/jwt");

router
  .get("/", validate, browse)
  .delete("/destroy", validate, destroy)
  .post("/save", validate, save)
  .put("/update", validate, update);

module.exports = router;
