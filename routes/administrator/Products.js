const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    variation_update,
    sellingProducts,
  } = require("../../controllers/administrator/productManagement/Products"),
  { validate } = require("../../middleware/jwt");

router
  .get("/", validate, browse)
  .get("/sellingProducts", sellingProducts)
  .post("/save", validate, save)
  .put("/update", validate, update)
  .put("/variation", validate, variation_update)
  .delete("/destroy", validate, destroy);

module.exports = router;
