const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    approved,
  } = require("../../controllers/stockman/Purchase"),
  { validate } = require("../../middleware/jwt");

router
  .get("/", validate, browse)
  .post("/save", validate, save)
  .put("/update", validate, update)
  .put("/approved", validate, approved)
  .delete("/destroy", validate, destroy);

module.exports = router;
