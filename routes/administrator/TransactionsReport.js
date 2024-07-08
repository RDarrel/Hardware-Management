const router = require("express").Router(),
  {
    browse,
    save,
    update,
    destroy,
    return_refund,
    status,
  } = require("../../controllers/administrator/report/TransactionsReport"),
  { validate } = require("../../middleware/jwt");

router
  .get("/", validate, browse)
  .get("/return_refund", validate, return_refund)
  .post("/save", validate, save)
  .put("/update", validate, update)
  .put("/status", validate, status)
  .delete("/destroy", validate, destroy);

module.exports = router;
