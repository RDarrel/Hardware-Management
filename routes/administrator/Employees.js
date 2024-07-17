const router = require("express").Router(),
  {
    browse,
    save,
    update,
  } = require("../../controllers/administrator/Employees"),
  { validate } = require("../../middleware/jwt");

router
  .get("/", validate, browse)
  .post("/save", validate, save)
  .put("/update", validate, update);

module.exports = router;
