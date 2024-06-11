const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    status,
  } = require("../../controllers/administrator/report/TransactionsReport"),
  { validate } = require("../../middleware/jwt");

router
  .get("/", validate, browse)
  .post("/save", validate, save)
  .put("/update", validate, update)
  .put("/status", validate, status)
  .delete("/destroy", validate, destroy);

module.exports = router;
