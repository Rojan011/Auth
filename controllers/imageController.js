const Image = require("../models/Image");
const cloudinary = require("../config/cloudinary");
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: totalPages,
        totalImages: totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

//Finally when all is said and done and we want to delete the image

const deletImageController = async (req, res) => {
  try {
    //Steps to delete the image

    //1. First we need to find the id of the image that we need to delete
    const getCurrentIdOfImageToBeDeleted = req.params.id;

    //2. Then we also need to find out the userId who is trying to delete the image to ensure that he is authorized to do so or else he is denied of deleting the image
    const userId = req.userInfo.userId;

    //3. Now we need to find the image in db->cloudinary
    const image = await Image.findById(getCurrentIdOfImageToBeDeleted);
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image not found",
      });
    }

    //4.Then we need to check if the image that is being deleted has been uploaded by the same user who has uploaded it
    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this image",
      });
    }

    //5. Then finally you can delete the image->Firstly from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    //6. Once deleted from cloudinary you can move on to deleting it from mongodb
    await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

    res.status(200).json({
      success: true,
      message: "Image deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something Went Wrong",
    });
  }
};
module.exports = {
  uploadImageController,
  fetchImageController,
  deletImageController,
};
