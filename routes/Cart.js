const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    changeVariant,
    suppliers,
    buy,
  } = require("../controllers/Cart"),
  { pos } = require("../controllers/cashier/POS"),
  { validate } = require("../middleware/jwt");

router
  .get("/", validate, browse)
  .get("/suppliers", validate, suppliers)
  .post("/save", validate, save)
  .post("/pos", validate, pos)
  .post("/buy", validate, buy)
  .put("/changeVariant", validate, changeVariant)
  .put("/update", validate, update)
  .delete("/destroy", validate, destroy);

module.exports = router;
