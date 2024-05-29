const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    variation_update,
  } = require("../../controllers/administrator/Products"),
  { validate } = require("../../middleware/jwt");

router
  .get("/", validate, browse)
  .post("/save", validate, save)
  .put("/update", validate, update)
  .put("/variation", validate, variation_update)
  .delete("/destroy", validate, destroy);

module.exports = router;
