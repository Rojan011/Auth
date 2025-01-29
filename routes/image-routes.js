const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const isAdminUser = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {
  uploadImageController,
  fetchImageController,
  deletImageController
} = require("../controllers/imageController");

const router = express.Router();
//upload the image
router.post(
  "/upload",
  authMiddleware,
  isAdminUser,
  uploadMiddleware.single("image"),
  uploadImageController
);

//to get the images
router.get("/get", authMiddleware, fetchImageController);

//to delete the image
router.delete("/:id",authMiddleware,isAdminUser,deletImageController)

module.exports = router;
