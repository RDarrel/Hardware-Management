const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    status,
    expiredProducts,
  } = require("../../controllers/stockman/Stocks"),
  { validate } = require("../../middleware/jwt");

router
  .get("/", browse)
  .post("/save", validate, save)
  .get("/expiredProducts", validate, expiredProducts)
  .put("/update", validate, update)
  .put("/status", validate, status)
  .delete("/destroy", validate, destroy);

module.exports = router;
