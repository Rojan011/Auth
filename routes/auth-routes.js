const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/auth-controller");

//We also extract authmiddleware inorder to ensure the privacy whilst changing the password
const authMiddleware = require("../middleware/auth-middleware");

//all routes are related to authentication & authorization
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authMiddleware,changePassword);

module.exports = router;
