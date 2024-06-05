const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    status,
  } = require("../../controllers/stockman/Stocks"),
  { validate } = require("../../middleware/jwt");

router
  .get("/", browse)
  .post("/save", validate, save)
  .put("/update", validate, update)
  .put("/status", validate, status)
  .delete("/destroy", validate, destroy);

module.exports = router;
