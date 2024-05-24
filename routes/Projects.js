const router = require("express").Router(),
  { browse, find, update, save } = require("../controllers/Projects"),
  { validate } = require("../middleware/jwt");

router
  .get("/", validate, browse)
  .get("/find", validate, find)
  .put("/update", validate, update)
  .post("/save", validate, save);

module.exports = router;
