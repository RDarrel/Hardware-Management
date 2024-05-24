const router = require("express").Router(),
  { login, provideAuth, upload } = require("../controllers/Auth"),
  { validate } = require("../middleware/jwt");

router
  .get("/login", login)
  //   .get("/changePassword", provideToken)
  .get("/validateRefresh", validate, provideAuth)
  .post("/upload", validate, upload);

module.exports = router;
