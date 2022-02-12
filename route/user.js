const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check_auth");
const userDBO = require('../dbo/userDBO')
// get users
router.get("/", checkAuth, userDBO.get);
// get user
router.get("/:userId", checkAuth, userDBO.detailGet);
// signup
router.post("/signup", userDBO.signup);
// login
router.post("/login", userDBO.login);
// update user
router.post("/update/:userId", checkAuth, userDBO.update);
// delete users
router.post('/delete', checkAuth, userDBO.delete)
// delete user
router.post('/delete/:userId', checkAuth, userDBO.detailDelete)
module.exports = router;
