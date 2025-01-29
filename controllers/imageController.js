const Image = require("../models/Image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");
const uploadImageController = async (req, res) => {
  try {
    //first of all we see if the file is present or is it missing and we are just running around
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "The file is required.Please upload an image",
      });
    }
    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    //now we need to store the image url and publicid in the database along with the uploading user
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });
    await newlyUploadedImage.save();
    //delete file from local storage
    //fs.unlinkSync: This is a synchronous method from Node.js' built-in fs (file system) module. It is used to delete a file from the filesystem.
    fs.unlinkSync(req.file.path);
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};

//Now creating fetching image controller
const fetchImageController = async (req, res) => {
  try {
    const images = await Image.find({});
    if (images) {
      res.status(200).json({
        success: true,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};
module.exports = { uploadImageController, fetchImageController };
