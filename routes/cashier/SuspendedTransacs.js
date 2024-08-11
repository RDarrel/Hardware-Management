const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    quotations,
  } = require("../../controllers/cashier/SuspendedTransacs"),
  { validate } = require("../../middleware/jwt");

router
  .get("/", validate, browse)
  .get("/quotations", validate, quotations)
  .post("/save", validate, save)
  .put("/update", validate, update)
  .delete("/destroy", validate, destroy);

module.exports = router;
