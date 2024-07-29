const router = require("express").Router(),
  {
    login,
    provideAuth,
    upload,
    changePassword,
  } = require("../controllers/Auth"),
  { validate } = require("../middleware/jwt");

router
  .get("/login", login)
  //   .get("/changePassword", provideToken)
  .get("/validateRefresh", validate, provideAuth)
  .post("/upload", validate, upload)
  .post("/changePassword", validate, changePassword);

module.exports = router;
