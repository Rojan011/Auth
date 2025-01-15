const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const router = express.Router();
router.get("/welcome", authMiddleware, (req, res) => {
  //This req.userInfo is the one that we extracted from auth-middlware
  const { username, userId, role } = req.userInfo;

  res.json({
    message: "welcome to the home page",
    user: {
      _id: userId,
      username,
      role,
    },
  });
});

module.exports = router;
