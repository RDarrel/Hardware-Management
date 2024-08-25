const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    status,
    expiredProducts,
    removeExpired,
  } = require("../../controllers/stockman/Stocks"),
  { validate } = require("../../middleware/jwt");

router
  .get("/", browse)
  .post("/save", validate, save)
  .post("/removeExpired", validate, removeExpired)
  .get("/expiredProducts", validate, expiredProducts)
  .put("/update", validate, update)
  .put("/status", validate, status)
  .delete("/destroy", validate, destroy);

module.exports = router;
