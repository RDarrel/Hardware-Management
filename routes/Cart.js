const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    changeVariant,
    suppliers,
  } = require("../controllers/Cart"),
  { validate } = require("../middleware/jwt");

router
  .get("/", validate, browse)
  .get("/suppliers", validate, suppliers)
  .post("/save", validate, save)
  .put("/changeVariant", validate, changeVariant)
  .put("/update", validate, update)
  .delete("/destroy", validate, destroy);

module.exports = router;
