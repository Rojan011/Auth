const multer = require("multer");
const path = require("path");

//setting up our multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    //path.extname() is a Node.js function from the path module.
    // It extracts the file extension (e.g., .jpg, .png, .pdf) from file.originalname.
    // file.originalname is the original name of the file that was uploaded (provided by the user).
    cb(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//file filter function

const checkFileFilter = function (req, file, cb) {
  //     How MIME Types Work
  // When a file is uploaded, downloaded, or sent over the internet, its MIME type helps systems understand:

  // What kind of content it is.
  // How it should be displayed, interpreted, or processed.
  // For example:

  // When you upload an image, its MIME type might be image/jpeg.
  // A PDF file will have the MIME type application/pdf.
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image !Please upload only images"));
  }
};

//now finally creating the multer middleware

module.exports = multer({
  storage: storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB size limit
  },
});
