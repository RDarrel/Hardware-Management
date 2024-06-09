const router = require("express").Router(),
  { browse, save } = require("../../controllers/administrator/Employees"),
  { validate } = require("../../middleware/jwt");

router.get("/", validate, browse).post("/save", validate, save);

module.exports = router;
